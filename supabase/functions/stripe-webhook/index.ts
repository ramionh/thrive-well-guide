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
    log("Starting GenXShred welcome email generation for:", to);

    // Generate magic link for the user
    log("Generating magic link for:", to);
    const { data, error } = await supabaseAdmin.auth.signInWithOtp({
      email: to,
      options: {
        emailRedirectTo: "http://portal.genxshred.com",
        shouldCreateUser: false
      }
    });

    if (error) {
      log("Error generating magic link:", error);
      // Continue with welcome email even if magic link fails
    }

    log("Magic link generation result:", data);

    // Send GenXShred welcome email via Resend with magic link
    log("Sending GenXShred welcome email via Resend...");
    const emailResult = await resend.emails.send({
      from: "GenXShred <onboarding@resend.dev>",
      to: [to],
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
    
    log("GenXShred welcome email sent successfully:", emailResult);
    
    // Check if email sending failed due to domain verification
    if (emailResult.error) {
      log("Resend error:", emailResult.error);
      if (emailResult.error.message?.includes("verify a domain")) {
        throw new Error("Email domain not verified. Please verify your domain at resend.com/domains or send to your own verified email address.");
      }
      throw new Error(`Email sending failed: ${emailResult.error.message}`);
    }
    
    return { emailResult, magicLinkData: data };
  } catch (e) {
    console.error("Failed to send GenXShred welcome email:", e);
    throw e;
  }
}

async function sendMagicLinkEmail(to: string) {
  // Use the new GenXShred welcome email function instead
  await sendWelcomeEmail(to);
}

async function createUserWithConfirmation(email: string, metadata: Record<string, any> = {}) {
  const randomPassword = crypto.randomUUID() + "!Aa1"; // simple strong random default

  // Create user without email confirmation to trigger Supabase confirmation email
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: metadata?.password || randomPassword,
    email_confirm: false, // This will trigger the confirmation email
    user_metadata: {
      ...metadata,
      source: metadata?.source ?? "stripe-webhook",
    },
  });

  if (error) {
    const msg = String(error.message || "");
    if (msg.toLowerCase().includes("already registered")) {
      log("User already exists", { email });
      return null;
    }
    console.error("createUser error", error);
    throw error;
  }

  log("User created with confirmation email", { user_id: data.user?.id, email });
  return data;
}

async function createOrEnsureUser(email: string | null | undefined, metadata: Record<string, any> = {}) {
  if (!email) {
    log("No email present, skipping user creation");
    return;
  }

  // Check if user already exists
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
  const userExists = existingUsers.users.some(user => user.email === email);
  
  if (userExists) {
    log("User already exists", { email });
    // Just send magic link for existing users
    await sendMagicLinkEmail(email);
    return;
  }

  // Create new user with confirmation email + send magic link
  const userData = await createUserWithConfirmation(email, metadata);
  if (userData) {
    // Send magic link email after user creation
    await sendMagicLinkEmail(email);
  }
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
