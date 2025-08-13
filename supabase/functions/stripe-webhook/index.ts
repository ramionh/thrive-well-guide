import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "npm:stripe@13.11.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") as string;
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET") as string;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") as string;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") as string | undefined;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-20.acacia",
});

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

function log(step: string, details?: unknown) {
  console.log(`[stripe-webhook] ${step}`, details ?? "");
}

async function sendWelcomeEmail(to: string) {
  if (!resend) {
    log("RESEND_API_KEY not set, skipping welcome email");
    return;
  }
  try {
    await resend.emails.send({
      from: "Lovable <onboarding@resend.dev>",
      to: [to],
      subject: "Welcome! Your account is ready",
      html: `
        <h1>Welcome!</h1>
        <p>Thanks for joining. Your account has been created successfully.</p>
        <p>You can now sign in with your email address.</p>
      `,
    });
    log("Welcome email sent", { to });
  } catch (e) {
    console.error("Failed to send welcome email", e);
  }
}

async function createOrEnsureUser(email: string | null | undefined, metadata: Record<string, any> = {}) {
  if (!email) {
    log("No email present, skipping user creation");
    return;
  }

  const randomPassword = crypto.randomUUID() + "!Aa1"; // simple strong random default

  // Try to create the user; if already exists, ignore error
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: metadata?.password || randomPassword,
    email_confirm: true,
    user_metadata: {
      ...metadata,
      source: metadata?.source ?? "stripe-webhook",
    },
  });

  if (error) {
    const msg = String(error.message || "");
    if (msg.toLowerCase().includes("already registered")) {
      log("User already exists", { email });
      return;
    }
    console.error("createUser error", error);
    throw error;
  }

  log("User created", { user_id: data.user?.id, email });
  await sendWelcomeEmail(email);
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get("stripe-signature");
    if (!signature) {
      return new Response(JSON.stringify({ error: "Missing Stripe-Signature header" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const rawBody = await req.text();
    let event: Stripe.Event;

    try {
      event = await stripe.webhooks.constructEventAsync(rawBody, signature, STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
      console.error("Signature verification failed", err);
      return new Response(JSON.stringify({ error: `Signature verification failed: ${err.message}` }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    log("Event received", { type: event.type });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        // Only proceed if paid
        // @ts-ignore payment_status exists on session
        if ((session as any).payment_status && (session as any).payment_status !== "paid") {
          log("Checkout session not paid, skipping", { id: session.id });
          break;
        }

        const email = session.customer_details?.email || (session.customer_email as string | undefined);
        const metadata = {
          ...(session.metadata || {}),
          stripe_customer_id: typeof session.customer === "string" ? session.customer : undefined,
          checkout_session_id: session.id,
          source: "stripe-checkout",
        } as Record<string, any>;

        await createOrEnsureUser(email, metadata);
        break;
      }
      case "customer.created": {
        const customer = event.data.object as Stripe.Customer;
        const email = customer.email || undefined;
        const metadata = {
          ...(customer.metadata || {}),
          stripe_customer_id: customer.id,
          source: "stripe-customer",
        } as Record<string, any>;

        await createOrEnsureUser(email, metadata);
        break;
      }
      default:
        // For unhandled event types, acknowledge without action
        log("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Unhandled error in stripe-webhook", error);
    return new Response(JSON.stringify({ error: error.message || "Unknown error" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
