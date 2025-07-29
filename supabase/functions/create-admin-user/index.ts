import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Creating admin user rhampton@genxshred.com");

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const email = "rhampton@genxshred.com";
    const password = "Batman0110!";

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser.users.find(u => u.email === email);

    if (userExists) {
      console.log("User already exists:", email);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: "Admin user already exists",
          user_id: userExists.id 
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 200,
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

    // The database trigger should automatically assign admin role for this email
    // But let's verify and create profile
    await supabaseAdmin
      .from('profiles')
      .upsert({
        id: newUser.user.id,
        full_name: "Ramion Hampton",
        email: email,
        is_active: true
      });

    console.log("Created profile for admin user");

    // Verify admin role was assigned by trigger
    const { data: roleCheck } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', newUser.user.id)
      .eq('role', 'admin')
      .single();

    if (!roleCheck) {
      console.log("Admin role not found, creating manually");
      // If trigger didn't work, assign admin role manually
      await supabaseAdmin
        .from('user_roles')
        .upsert({
          user_id: newUser.user.id,
          role: 'admin'
        });
    }

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