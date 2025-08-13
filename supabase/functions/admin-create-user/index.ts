import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY") ?? "");

interface CreateUserRequest {
  email: string;
  password: string;
  role: 'client' | 'coach';
  profile: {
    full_name: string;
    phone?: string;
    date_of_birth?: string;
    height_feet?: number;
    height_inches?: number;
    weight_lbs?: number;
    assigned_coach_id?: string;
  };
}

async function sendMagicLinkEmail(supabaseAdmin: ReturnType<typeof createClient>, to: string) {
  try {
    if (!to) return;

    const { data, error } = await (supabaseAdmin as any).auth.admin.generateLink({
      type: "magiclink",
      email: to,
      options: {
        // Use auth settings' redirect URL
      },
    } as any);

    if (error) throw error as any;

    const actionLink = (data as any)?.properties?.action_link as string | undefined;
    if (!actionLink) {
      console.log("admin-create-user: No action_link generated for", to);
      return;
    }

    if (!Deno.env.get("RESEND_API_KEY")) {
      console.log("admin-create-user: RESEND_API_KEY not set, skipping magic link email to", to);
      return;
    }

    await resend.emails.send({
      from: "Lovable <onboarding@resend.dev>",
      to: [to],
      subject: "Sign in to get started",
      html: `
        <h1>Welcome!</h1>
        <p>Click the button below to sign in to your account.</p>
        <p><a href="${actionLink}" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;display:inline-block">Access Account</a></p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${actionLink}</p>
      `,
    });
    console.log("admin-create-user: Magic link email sent to", to);
  } catch (e) {
    console.error("admin-create-user: Failed to send magic link email", e);
  }
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Verify the requesting user is an admin
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error("Invalid authentication");
    }

    // Check if user is admin
    const { data: userRole } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!userRole) {
      throw new Error("Insufficient permissions");
    }

    const { email, password, role, profile }: CreateUserRequest = await req.json();

    // Create the user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      // If the user already exists, still send a magic link so they can access the account
      const code = (createError as any)?.code || (createError as any)?.status;
      if (code === 'email_exists' || code === 422) {
        console.log('admin-create-user: User already exists, sending magic link', email);
        await sendMagicLinkEmail(supabaseAdmin, email);
        return new Response(
          JSON.stringify({ success: true, message: 'User already existed. Magic link sent.' }),
          { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 200 }
        );
      }
      throw createError;
    }

    // Assign role
    await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', newUser.user.id);

    await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        role: role
      });

    // Create/update profile
    // Convert "none" to null for assigned_coach_id
    const assignedCoachId = profile.assigned_coach_id === "none" || profile.assigned_coach_id === "" 
      ? null 
      : profile.assigned_coach_id;

    await supabaseAdmin
      .from('profiles')
      .upsert({
        id: newUser.user.id,
        full_name: profile.full_name,
        email: email,
        phone: profile.phone,
        date_of_birth: profile.date_of_birth,
        height_feet: profile.height_feet,
        height_inches: profile.height_inches,
        weight_lbs: profile.weight_lbs,
        assigned_coach_id: assignedCoachId,
        is_active: true
      });

    await sendMagicLinkEmail(supabaseAdmin, email);

    return new Response(
      JSON.stringify({ success: true, user: newUser.user }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("Error creating user:", error);
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