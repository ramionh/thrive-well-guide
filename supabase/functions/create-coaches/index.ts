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
    console.log("Starting coach creation and client assignment process");

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Define the 3 coaches with realistic fitness trainer profiles
    const coaches = [
      {
        email: "sarah.mitchell@genxshred.com",
        password: "CoachSarah2024!",
        full_name: "Sarah Mitchell",
        phone: "(555) 123-4567",
        bio: "Certified Personal Trainer with over 8 years of experience specializing in strength training and body transformation for adults 35+. NASM-CPT certified with additional certifications in Corrective Exercise and Senior Fitness. Former competitive powerlifter who understands the unique challenges of building muscle and losing fat after 40. I believe in sustainable, science-based approaches that fit into busy lifestyles. My clients typically see significant strength gains and body composition improvements within 12-16 weeks. Passionate about helping Gen X adults reclaim their fitness and feel stronger than they did in their 20s."
      },
      {
        email: "mike.rodriguez@genxshred.com", 
        password: "CoachMike2024!",
        full_name: "Mike Rodriguez",
        phone: "(555) 234-5678",
        bio: "Veteran fitness coach with 12+ years helping busy professionals achieve their best physique. ACE-CPT and Precision Nutrition Level 2 certified. Specializes in time-efficient workouts and flexible nutrition strategies for people with demanding careers. Former military fitness instructor who brings discipline and accountability to every coaching relationship. Expert in body recomposition, metabolic conditioning, and stress management through exercise. My approach focuses on building habits that last, not quick fixes. Successfully guided over 200 clients through complete body transformations while maintaining their work-life balance."
      },
      {
        email: "jennifer.thompson@genxshred.com",
        password: "CoachJen2024!", 
        full_name: "Jennifer Thompson",
        phone: "(555) 345-6789",
        bio: "Holistic health and fitness coach with 10 years of experience in body transformation and hormonal health optimization. ACSM-CPT certified with specialized training in menopause fitness and hormonal balance. Former registered nurse who transitioned to fitness coaching to help people prevent disease through lifestyle changes. Expert in designing workout programs that work with, not against, hormonal fluctuations common in 40+ adults. Combines strength training, mobility work, and stress management techniques. Known for her compassionate, evidence-based approach that addresses the whole person, not just the physical aspects of fitness."
      }
    ];

    console.log("Creating coach accounts...");

    const createdCoaches = [];

    for (const coach of coaches) {
      try {
        // Create the coach user account
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: coach.email,
          password: coach.password,
          email_confirm: true,
        });

        if (createError) {
          console.error(`Error creating user ${coach.email}:`, createError);
          continue;
        }

        console.log(`Created user account for ${coach.full_name}`);

        // Assign coach role
        await supabaseAdmin
          .from('user_roles')
          .delete()
          .eq('user_id', newUser.user.id);

        await supabaseAdmin
          .from('user_roles')
          .insert({
            user_id: newUser.user.id,
            role: 'coach'
          });

        console.log(`Assigned coach role to ${coach.full_name}`);

        // Create/update profile
        await supabaseAdmin
          .from('profiles')
          .upsert({
            id: newUser.user.id,
            full_name: coach.full_name,
            email: coach.email,
            phone: coach.phone,
            bio: coach.bio,
            is_active: true
          });

        console.log(`Created profile for ${coach.full_name}`);

        createdCoaches.push({
          id: newUser.user.id,
          name: coach.full_name,
          email: coach.email
        });

      } catch (error) {
        console.error(`Failed to create coach ${coach.full_name}:`, error);
      }
    }

    if (createdCoaches.length === 0) {
      throw new Error("No coaches were created successfully");
    }

    console.log(`Successfully created ${createdCoaches.length} coaches`);

    // Get all existing clients (users with client role who don't have assigned coaches)
    const { data: clientRoles, error: clientRolesError } = await supabaseAdmin
      .from('user_roles')
      .select('user_id')
      .eq('role', 'client');

    if (clientRolesError) {
      throw new Error(`Error fetching client roles: ${clientRolesError.message}`);
    }

    const clientIds = clientRoles?.map(cr => cr.user_id) || [];

    if (clientIds.length === 0) {
      console.log("No clients found to assign to coaches");
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Created ${createdCoaches.length} coaches, but no clients found to assign`,
          coaches: createdCoaches
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
          status: 200,
        }
      );
    }

    console.log(`Found ${clientIds.length} clients to assign`);

    // Get client profiles
    const { data: clients, error: clientsError } = await supabaseAdmin
      .from('profiles')
      .select('id, full_name, assigned_coach_id')
      .in('id', clientIds);

    if (clientsError) {
      throw new Error(`Error fetching client profiles: ${clientsError.message}`);
    }

    // Randomly assign clients to coaches
    const assignments = [];
    let assignmentCount = 0;

    for (const client of clients || []) {
      // Skip if client already has a coach assigned
      if (client.assigned_coach_id) {
        console.log(`Client ${client.full_name} already has a coach assigned`);
        continue;
      }

      // Randomly select a coach
      const randomCoach = createdCoaches[Math.floor(Math.random() * createdCoaches.length)];
      
      // Update client's assigned coach
      const { error: assignError } = await supabaseAdmin
        .from('profiles')
        .update({ assigned_coach_id: randomCoach.id })
        .eq('id', client.id);

      if (assignError) {
        console.error(`Error assigning coach to client ${client.full_name}:`, assignError);
      } else {
        assignments.push({
          client: client.full_name || client.id,
          coach: randomCoach.name
        });
        assignmentCount++;
        console.log(`Assigned ${client.full_name || client.id} to coach ${randomCoach.name}`);
      }
    }

    console.log(`Successfully assigned ${assignmentCount} clients to coaches`);

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Successfully created ${createdCoaches.length} coaches and assigned ${assignmentCount} clients`,
        coaches: createdCoaches,
        assignments: assignments
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error("Error in create-coaches function:", error);
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