
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormProps {
  userId: string;
  initialName: string;
  initialEmail: string;
  avatarUrl: string | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  userId,
  initialName,
  initialEmail,
  avatarUrl,
  isLoading,
  setIsLoading,
}) => {
  const [name, setName] = useState(initialName || "");
  const [email, setEmail] = useState(initialEmail || "");
  const { toast } = useToast();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verify we have an active session before proceeding
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      if (!sessionData.session) {
        throw new Error("No active session found. Please log in again.");
      }
      
      // Make sure the user ID is the authenticated user's ID
      if (userId !== sessionData.session.user.id) {
        throw new Error("Authorization error: User ID mismatch");
      }
      
      // Update the profile using the authenticated user's ID
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: avatarUrl,
          full_name: name,
          email: email 
        })
        .eq('id', sessionData.session.user.id);
      
      if (updateError) {
        throw updateError;
      }
      
      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Update Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CardContent>
      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        
        <Button 
          type="submit" 
          className="bg-thrive-blue"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </CardContent>
  );
};

export default ProfileForm;
