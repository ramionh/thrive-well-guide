import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, CheckCircle, Shield } from "lucide-react";
import { toast } from "sonner";

const CreateAdminUserAction = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleCreateAdminUser = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      console.log("Invoking create-admin-user function...");

      const { data, error } = await supabase.functions.invoke('create-admin-user');

      if (error) {
        throw new Error(error.message || "Failed to create admin user");
      }

      console.log("Function response:", data);

      if (data.success) {
        setResult(data);
        toast.success(data.message);
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }

    } catch (error: any) {
      console.error('Error creating admin user:', error);
      setError(error.message);
      toast.error('Failed to create admin user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Create Admin User
        </CardTitle>
        <CardDescription>
          Create the main admin user account for rhampton@genxshred.com
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">{result.message}</p>
                <div className="text-sm">
                  <p>Email: rhampton@genxshred.com</p>
                  <p>Password: Batman0110!</p>
                  <p>Role: Admin</p>
                  {result.user_id && <p>User ID: {result.user_id}</p>}
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-2">This will create:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Email: rhampton@genxshred.com</li>
              <li>• Password: Batman0110!</li>
              <li>• Role: Admin (automatically assigned)</li>
              <li>• Full access to admin dashboard</li>
            </ul>
          </div>
          
          <p className="text-sm text-muted-foreground">
            This user will have full administrative privileges to manage users, coaches, and system settings.
          </p>
        </div>

        <Button 
          onClick={handleCreateAdminUser} 
          disabled={loading}
          className="w-full"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {loading ? 'Creating Admin User...' : 'Create Admin User'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateAdminUserAction;