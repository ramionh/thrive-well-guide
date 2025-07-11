
import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import AvatarUploader from "@/components/profile/AvatarUploader";
import ProfileForm from "@/components/profile/ProfileForm";
import GoalsList from "@/components/profile/GoalsList";
import MotivationsList from "@/components/profile/MotivationsList";
import { queryClient } from "@/lib/queryClient";

const ProfilePage: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url || null);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    dateOfBirth: '',
    gender: user?.gender || '',
    heightFeet: 0,
    heightInches: 0,
    weightLbs: 0,
    preferredName: '',
    phoneNumber: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;

          setProfileData({
            firstName: data.first_name || '',
            lastName: data.last_name || '',
            email: data.email || '',
            dateOfBirth: data.date_of_birth || '',
            gender: data.gender || '',
            heightFeet: data.height_feet || 0,
            heightInches: data.height_inches || 0,
            weightLbs: data.weight_lbs || 0,
            preferredName: data.preferred_name || '',
            phoneNumber: data.phone_number || ''
          });
        } catch (error) {
          console.error("Error fetching profile data:", error);
        }
      }
    };

    fetchProfileData();
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear any local storage or cached session data
      localStorage.clear();
      sessionStorage.clear();
      
      // Clear any query cache if using React Query
      queryClient.clear();
      
      // Redirect to the home page
      navigate("/");
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAvatarUpdate = (url: string) => {
    setAvatarUrl(url);
  };
  
  if (!user) {
    return null;
  }

  const displayName = profileData.preferredName || profileData.firstName || user.name || "User";
  
  return (
    <div className="container mx-auto max-w-4xl animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <Button 
          variant="destructive" 
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          {isLoading ? "Logging out..." : "Logout"}
        </Button>
      </div>
      
      <Tabs defaultValue="info">
        <TabsList className="mb-6">
          <TabsTrigger value="info">Personal Info</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="motivations">Motivations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <AvatarUploader
                  userId={user.id}
                  currentAvatarUrl={avatarUrl}
                  userName={displayName}
                  onAvatarUpdate={handleAvatarUpdate}
                />
                <div>
                  <CardTitle>{displayName}</CardTitle>
                  <CardDescription>{user.email || "No email provided"}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <ProfileForm
              profileData={profileData}
              setProfileData={setProfileData}
              userId={user.id}
              avatarUrl={avatarUrl}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="goals">
          <GoalsList goals={user.goals || []} />
        </TabsContent>
        
        <TabsContent value="motivations">
          <MotivationsList motivationalResponses={user.motivationalResponses || {}} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
