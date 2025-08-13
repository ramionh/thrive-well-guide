import { useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function TestEmailComponent() {
  useEffect(() => {
    const testEmail = async () => {
      console.log('Attempting to send test email...');
      
      try {
        const { data, error } = await supabase.functions.invoke('test-welcome-email');
        
        if (error) {
          console.error('Error from function:', error);
          toast({
            title: "Error",
            description: `Failed to send email: ${error.message}`,
            variant: "destructive"
          });
        } else {
          console.log('Function response:', data);
          toast({
            title: "Success", 
            description: "Test email sent! Check forthwilliam2@gmail.com inbox and spam folder.",
          });
        }
      } catch (err: any) {
        console.error('Catch error:', err);
        toast({
          title: "Error",
          description: `Unexpected error: ${err.message}`,
          variant: "destructive"
        });
      }
    };

    testEmail();
  }, []);

  return (
    <div className="p-4">
      <h3>Test Email Component</h3>
      <p>Check console and toast notifications for results.</p>
    </div>
  );
}