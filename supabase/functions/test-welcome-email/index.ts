import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") ?? "");

async function sendWelcomeEmail(supabaseAdmin: ReturnType<typeof createClient>, to: string) {
  try {
    console.log("Starting welcome email generation for:", to);

    if (!Deno.env.get("RESEND_API_KEY")) {
      console.log("RESEND_API_KEY not set, cannot send email");
      throw new Error("RESEND_API_KEY not configured");
    }

    // Generate magic link for the user
    console.log("Generating magic link for:", to);
    const { data, error } = await supabaseAdmin.auth.signInWithOtp({
      email: to,
      options: {
        emailRedirectTo: "http://portal.genxshred.com",
        shouldCreateUser: false
      }
    });

    if (error) {
      console.error("Error generating magic link:", error);
      // If magic link generation fails, send welcome email without it
    }

    console.log("Magic link generation result:", data);

    // Send welcome email via Resend with magic link
    console.log("Sending welcome email via Resend...");
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

    // Send welcome email to the new user
    await sendWelcomeEmail(supabaseAdmin, "ramion.hampotn@genxshred.com");

    return new Response(
      JSON.stringify({ success: true, message: "Welcome email sent to ramion.hampotn@genxshred.com" }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("Error in test-welcome-email:", error);
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