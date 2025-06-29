
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
    gender: string;
    preferredName: string;
    phoneNumber: string;
  };
  setProfileData: React.Dispatch<React.SetStateAction<{
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    heightFeet: number;
    heightInches: number;
    weightLbs: number;
    gender: string;
    preferredName: string;
    phoneNumber: string;
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

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length >= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    } else if (phoneNumber.length >= 3) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return phoneNumber;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setProfileData(prev => ({ ...prev, phoneNumber: formatted }));
  };

  const validatePhoneNumber = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10;
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number if provided
    if (profileData.phoneNumber && !validatePhoneNumber(profileData.phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: avatarUrl,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          full_name: `${profileData.firstName} ${profileData.lastName}`,
          preferred_name: profileData.preferredName,
          phone_number: profileData.phoneNumber,
          email: profileData.email,
          date_of_birth: profileData.dateOfBirth,
          gender: profileData.gender,
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
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              value={profileData.lastName} 
              onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="preferredName">What should we call you?</Label>
          <Input 
            id="preferredName" 
            value={profileData.preferredName} 
            onChange={(e) => setProfileData(prev => ({ ...prev, preferredName: e.target.value }))}
            placeholder="How would you like to be addressed?"
          />
          <p className="text-sm text-gray-500">This is how we'll address you in the app (optional)</p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={profileData.email} 
            onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input 
            id="phoneNumber" 
            type="tel"
            value={profileData.phoneNumber} 
            onChange={handlePhoneChange}
            placeholder="(555) 123-4567"
            maxLength={14}
          />
          <p className="text-sm text-gray-500">10-digit US phone number (optional)</p>
        </div>

        <div className="space-y-2">
          <Label>Gender</Label>
          <RadioGroup 
            value={profileData.gender} 
            onValueChange={(value) => setProfileData(prev => ({ ...prev, gender: value }))} 
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="other" id="other" />
              <Label htmlFor="other">Other</Label>
            </div>
          </RadioGroup>
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
                min="3"
                max="8"
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
                min="0"
                max="11"
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
            min="50"
            max="500"
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
