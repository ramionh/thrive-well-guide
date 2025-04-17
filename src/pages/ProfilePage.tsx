
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

const ProfilePage: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url || null);
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    dateOfBirth: '',
    heightFeet: 0,
    heightInches: 0,
    weightLbs: 0
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
            firstName: data.full_name?.split(' ')[0] || '',
            lastName: data.full_name?.split(' ')[1] || '',
            email: data.email || '',
            dateOfBirth: data.date_of_birth || '',
            heightFeet: data.height_feet || 0,
            heightInches: data.height_inches || 0,
            weightLbs: data.weight_lbs || 0
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
      await supabase.auth.signOut();
      navigate("/"); // Redirect to the default page after logout
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleAvatarUpdate = (url: string) => {
    setAvatarUrl(url);
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="container mx-auto max-w-4xl animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <Button 
          variant="destructive" 
          onClick={handleLogout}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
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
                  userName={user.name}
                  onAvatarUpdate={handleAvatarUpdate}
                />
                <div>
                  <CardTitle>{user.name || "User"}</CardTitle>
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
          <MotivationsList motivationalResponses={user.motivationalResponses} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
