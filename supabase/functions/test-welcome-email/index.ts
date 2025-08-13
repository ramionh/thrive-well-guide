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

    if (!Deno.env.get("SUPABASE_URL") || !Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) {
      console.log("Supabase environment variables not set");
      throw new Error("Supabase environment variables not configured");
    }

    // Generate magic link
    console.log("Generating magic link...");
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email: to,
    });

    if (error) {
      console.error("Error generating magic link:", error);
      throw error;
    }

    console.log("Magic link data:", data);
    const actionLink = data?.properties?.action_link;
    if (!actionLink) {
      console.log("No action_link generated");
      throw new Error("Failed to generate magic link");
    }

    console.log("Sending email via Resend...");
    const emailResult = await resend.emails.send({
      from: "GenXShred <onboarding@resend.dev>",
      to: [to],
      subject: "Welcome New User - Access Your GenXShred Account",
      html: `
        <h1>Welcome New User!</h1>
        <p>Your GenXShred account has been created and you're ready to get started.</p>
        <p>Click the button below to sign in to your account and begin your fitness journey.</p>
        <p><a href="${actionLink}" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">Access Your Account</a></p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${actionLink}</p>
        <p>Welcome to the GenXShred community!</p>
      `,
    });
    
    console.log("Email sent successfully:", emailResult);
    return emailResult;
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