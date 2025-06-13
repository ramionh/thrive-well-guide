
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestResetData {
  userId: string;
  userEmail: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { userId, userEmail }: RequestResetData = await req.json();

    console.log('Processing reset request for user:', userId, userEmail);

    // Save the reset request to the database
    const { data: resetRequest, error: dbError } = await supabaseClient
      .from('application_reset_requests')
      .insert({
        user_id: userId,
        user_email: userEmail,
        status: 'pending'
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw new Error('Failed to save reset request');
    }

    console.log('Reset request saved:', resetRequest);

    // Send email notification using Resend
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    const emailResponse = await resend.emails.send({
      from: 'Gen X Shred <noreply@genxshred.com>',
      to: ['info@genxshred.com'],
      subject: 'Application Reset Request',
      html: `
        <h2>Application Reset Request</h2>
        <p>A user has requested to reset their application data.</p>
        <br>
        <p><strong>User Details:</strong></p>
        <ul>
          <li><strong>User ID:</strong> ${userId}</li>
          <li><strong>Email:</strong> ${userEmail}</li>
          <li><strong>Request Date:</strong> ${new Date().toLocaleDateString()}</li>
          <li><strong>Request Time:</strong> ${new Date().toLocaleTimeString()}</li>
          <li><strong>Request ID:</strong> ${resetRequest.id}</li>
        </ul>
        <br>
        <p>Please review this request and take appropriate action.</p>
        <p>You can update the request status in the admin panel.</p>
      `,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      requestId: resetRequest.id,
      message: 'Reset request submitted successfully' 
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in request-app-reset function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process reset request',
        success: false 
      }),
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json', 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
