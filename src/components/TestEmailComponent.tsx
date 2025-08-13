import { useEffect, useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function TestEmailComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testEmail = async () => {
    setIsLoading(true);
    console.log('Attempting to send test email...');
    
    try {
      const { data, error } = await supabase.functions.invoke('test-welcome-email');
      
      if (error) {
        console.error('Error from function:', error);
        setResult({ error: error.message });
        toast({
          title: "Error",
          description: `Failed to send email: ${error.message}`,
          variant: "destructive"
        });
      } else {
        console.log('Function response:', data);
        setResult(data);
        toast({
          title: "Success", 
          description: "Test email sent! Check forthwilliam2@gmail.com inbox and spam folder.",
        });
      }
    } catch (err: any) {
      console.error('Catch error:', err);
      setResult({ error: err.message });
      toast({
        title: "Error",
        description: `Unexpected error: ${err.message}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    testEmail();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto">
      <h3 className="text-lg font-semibold mb-4">Test Email Component</h3>
      <button 
        onClick={testEmail} 
        disabled={isLoading}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 disabled:opacity-50"
      >
        {isLoading ? 'Sending...' : 'Send Test Email'}
      </button>
      <p className="text-sm text-gray-600 mb-4">Check console and toast notifications for results.</p>
      {result && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h4 className="font-medium">Result:</h4>
          <pre className="text-xs mt-2 overflow-auto">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}