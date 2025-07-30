import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateAdminRequest {
  email: string;
  password: string;
  fullName: string;
  bootstrapPassword: string;
}

const BOOTSTRAP_PASSWORD = 'Batman0110!';

const handler = async (req: Request): Promise<Response> => {
  console.log("Bootstrap admin function called, method:", req.method);
  
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Processing bootstrap admin request");
    const { email, password, fullName, bootstrapPassword }: CreateAdminRequest = await req.json();
    console.log("Request data:", { email, fullName, hasPassword: !!password, hasBootstrapPassword: !!bootstrapPassword });

    // Verify bootstrap password
    if (bootstrapPassword !== BOOTSTRAP_PASSWORD) {
      throw new Error("Invalid bootstrap password");
    }

    console.log(`Creating admin user: ${email}`);

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser.users.find(u => u.email === email);

    if (userExists) {
      console.log("User already exists:", email);
      return new Response(
        JSON.stringify({ 
          error: "User with this email already exists",
          success: false
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 400,
        }
      );
    }

    // Create the admin user
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      throw new Error(`Failed to create user: ${createError.message}`);
    }

    console.log(`Created admin user: ${email} with ID: ${newUser.user.id}`);

    // Create profile
    await supabaseAdmin
      .from('profiles')
      .upsert({
        id: newUser.user.id,
        full_name: fullName,
        email: email,
        is_active: true
      });

    console.log("Created profile for admin user");

    // Assign admin role (remove any existing roles first)
    await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', newUser.user.id);

    await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        role: 'admin'
      });

    console.log("Assigned admin role to user");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Admin user created successfully",
        user_id: newUser.user.id,
        email: email
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("Error creating admin user:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 400,
      }
    );
  }
};

serve(handler);