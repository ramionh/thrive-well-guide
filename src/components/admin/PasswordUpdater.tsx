import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PasswordUpdater: React.FC = () => {
  const [email, setEmail] = useState('sumaccircle@gmail.com');
  const [password, setPassword] = useState('Batman0110!');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    setLoading(true);
    try {
      // Get the current user's session to use as authorization
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        toast.error("You must be logged in as an admin");
        return;
      }

      // Call the admin function to update the password
      const { data, error } = await supabase.functions.invoke('admin-update-user', {
        body: {
          user_id: '45636daa-9c63-47b1-851d-853c07fcf251', // sumaccircle@gmail.com user ID
          password: password
        },
        headers: {
          Authorization: `Bearer ${session.session.access_token}`
        }
      });

      if (error) {
        throw error;
      }

      toast.success(`Password updated successfully for ${email}`);
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(`Failed to update password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Update User Password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            disabled
          />
        </div>
        
        <div className="space-y-2">
          <Label>New Password</Label>
          <Input 
            type="text" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </div>
        
        <Button 
          onClick={handleUpdatePassword}
          disabled={loading || !password}
          className="w-full"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PasswordUpdater;