
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileFormProps {
  userId: string;
  profileData: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    heightFeet: number;
    heightInches: number;
    weightLbs: number;
  };
  setProfileData: React.Dispatch<React.SetStateAction<{
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    heightFeet: number;
    heightInches: number;
    weightLbs: number;
  }>>;
  avatarUrl: string | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profileData,
  setProfileData,
  userId,
  avatarUrl,
  isLoading,
  setIsLoading
}) => {
  const { toast } = useToast();

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: avatarUrl,
          full_name: `${profileData.firstName} ${profileData.lastName}`,
          email: profileData.email,
          date_of_birth: profileData.dateOfBirth,
          height_feet: profileData.heightFeet,
          height_inches: profileData.heightInches,
          weight_lbs: profileData.weightLbs,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (error) {
        throw error;
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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              value={profileData.firstName} 
              onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
              placeholder="Enter your first name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              value={profileData.lastName} 
              onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Enter your last name"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={profileData.email} 
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input 
            id="dateOfBirth" 
            type="date" 
            value={profileData.dateOfBirth} 
            onChange={(e) => setProfileData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label>Height</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="heightFeet">Feet</Label>
              <Input 
                id="heightFeet" 
                type="number" 
                value={profileData.heightFeet} 
                onChange={(e) => setProfileData(prev => ({ ...prev, heightFeet: Number(e.target.value) }))}
                placeholder="ft"
              />
            </div>
            <div>
              <Label htmlFor="heightInches">Inches</Label>
              <Input 
                id="heightInches" 
                type="number" 
                value={profileData.heightInches} 
                onChange={(e) => setProfileData(prev => ({ ...prev, heightInches: Number(e.target.value) }))}
                placeholder="in"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weightLbs">Weight (lbs)</Label>
          <Input 
            id="weightLbs" 
            type="number" 
            value={profileData.weightLbs} 
            onChange={(e) => setProfileData(prev => ({ ...prev, weightLbs: Number(e.target.value) }))}
            placeholder="Enter weight in pounds"
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
