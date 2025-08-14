import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") ?? "");

async function sendWelcomeEmail(supabaseAdmin: ReturnType<typeof createClient>, email: string) {
  try {
    console.log("Starting welcome email generation for:", email);

    if (!Deno.env.get("RESEND_API_KEY")) {
      console.log("RESEND_API_KEY not set, cannot send welcome email");
      return;
    }

    // Generate magic link for the user
    console.log("Generating magic link for:", email);
    const { data, error } = await supabaseAdmin.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: "http://portal.genxshred.com",
        shouldCreateUser: false
      }
    });

    if (error) {
      console.error("Error generating magic link:", error);
      // Continue with welcome email even if magic link fails
    }

    console.log("Magic link generation result:", data);

    // Send welcome email via Resend with magic link
    console.log("Sending welcome email via Resend...");
    const emailResult = await resend.emails.send({
      from: "GenXShred <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to GenXShred - Your Magic Link is Ready!",
      html: `
        <h1>Welcome to GenXShred!</h1>
        <p>Your account has been created and you're ready to get started on your fitness journey.</p>
        <p>Click the magic link below to sign in instantly - no password required!</p>
        <p><a href="http://portal.genxshred.com/auth" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">🔗 Sign In with Magic Link</a></p>
        <p>This magic link will expire in 1 hour for security. If it expires, you can always request a new one on our login page.</p>
        <p>Welcome to the GenXShred community!</p>
        <p>Best regards,<br>The GenXShred Team</p>
      `,
    });
    
    console.log("Welcome email sent successfully:", emailResult);
    
    // Check if email sending failed due to domain verification
    if (emailResult.error) {
      console.error("Resend error:", emailResult.error);
      if (emailResult.error.message?.includes("verify a domain")) {
        throw new Error("Email domain not verified. Please verify your domain at resend.com/domains or send to your own verified email address.");
      }
      throw new Error(`Email sending failed: ${emailResult.error.message}`);
    }
    
    return { emailResult, magicLinkData: data };
  } catch (e) {
    console.error("Failed to send welcome email:", e);
    throw e;
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse the webhook payload
    const payload = await req.json();
    console.log("Auth webhook received:", payload);

    // Check if this is a user signup event
    if (payload.type === 'INSERT' && payload.table === 'users' && payload.schema === 'auth') {
      const user = payload.record;
      const email = user.email;
      
      if (email) {
        console.log("New user signup detected, sending welcome email to:", email);
        await sendWelcomeEmail(supabaseAdmin, email);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Webhook processed successfully" }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("Error in auth-webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 400,
      }
    );
  }
};

serve(handler);