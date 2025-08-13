import { supabase } from "@/integrations/supabase/client";

// Test function to send welcome email
export async function testWelcomeEmail() {
  try {
    const { data, error } = await supabase.functions.invoke('test-welcome-email');
    
    if (error) {
      console.error('Error sending test email:', error);
      return { success: false, error };
    }
    
    console.log('Test email sent successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Error:', err);
    return { success: false, error: err };
  }
}

// Immediately invoke the function
testWelcomeEmail().then(result => {
  console.log('Result:', result);
});