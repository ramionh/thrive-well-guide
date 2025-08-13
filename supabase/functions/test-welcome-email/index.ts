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

    // Send welcome email via Resend (without OTP to avoid rate limiting)
    console.log("Sending welcome email via Resend...");
    const emailResult = await resend.emails.send({
      from: "GenXShred <onboarding@resend.dev>",
      to: [to],
      subject: "Welcome to GenXShred - Your Account is Ready!",
      html: `
        <h1>Welcome to GenXShred!</h1>
        <p>Your account has been created and you're ready to get started on your fitness journey.</p>
        <p>Visit our login page to sign in to your account and begin your fitness journey.</p>
        <p><a href="http://portal.genxshred.com/auth" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">Go to Login Page</a></p>
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
    
    return { emailResult };
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

    // Send welcome email to forthwilliam2@gmail.com
    await sendWelcomeEmail(supabaseAdmin, "forthwilliam2@gmail.com");

    return new Response(
      JSON.stringify({ success: true, message: "Welcome email sent to forthwilliam2@gmail.com" }),
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