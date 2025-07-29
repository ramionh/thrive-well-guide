import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UpdateUserRequest {
  user_id: string;
  profile?: {
    full_name?: string;
    phone?: string;
    date_of_birth?: string;
    height_feet?: number;
    height_inches?: number;
    weight_lbs?: number;
    assigned_coach_id?: string;
    is_active?: boolean;
  };
  role?: 'client' | 'coach' | 'admin';
  password?: string;
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

    const { user_id, profile, role, password }: UpdateUserRequest = await req.json();

    // Update password if provided
    if (password) {
      const { error: passwordError } = await supabaseAdmin.auth.admin.updateUserById(
        user_id,
        { password }
      );
      if (passwordError) {
        throw passwordError;
      }
    }

    // Update role if provided
    if (role) {
      await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', user_id);

      await supabaseAdmin
        .from('user_roles')
        .insert({
          user_id: user_id,
          role: role
        });
    }

    // Update profile if provided
    if (profile) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update(profile)
        .eq('id', user_id);

      if (profileError) {
        throw profileError;
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("Error updating user:", error);
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