
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[HANDLE-PAYMENT-SUCCESS] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const { sessionId } = await req.json();
    if (!sessionId) {
      throw new Error("Session ID is required");
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Retrieve the session to get payment status and metadata
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    logStep("Retrieved session", { sessionId, status: session.payment_status });

    if (session.payment_status !== 'paid') {
      throw new Error("Payment not completed");
    }

    const email = session.metadata?.email;
    const password = session.metadata?.password;

    if (!email || !password) {
      throw new Error("Email or password not found in session metadata");
    }

    logStep("Creating user account", { email });

    // Create the user account
    const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email since they paid
    });

    if (authError) {
      logStep("Error creating user", { error: authError.message });
      throw new Error(`Failed to create user: ${authError.message}`);
    }

    logStep("User created successfully", { userId: authData.user?.id });

    // Update subscribers table with payment info and active status
    const customerId = session.customer as string;
    await supabaseClient.from("subscribers").upsert({
      email,
      user_id: authData.user?.id,
      stripe_customer_id: customerId,
      subscribed: true,
      subscription_tier: "Coaching",
      subscription_end: null, // Will be updated by check-subscription
      is_active: true, // Payment completed flag
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    logStep("Subscriber record updated", { userId: authData.user?.id, isActive: true });

    return new Response(JSON.stringify({ 
      success: true, 
      userId: authData.user?.id,
      message: "Account created successfully" 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in handle-payment-success", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
