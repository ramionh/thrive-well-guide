import React from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { user, motivationalResponses } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = React.useState(user?.name || "");
  const [email, setEmail] = React.useState(user?.email || "");
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would save to the backend
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved successfully.",
    });
  };
  
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Logout Error",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      // Clear local storage and redirect to logout confirmation
      localStorage.clear();
      navigate("/logout");
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Logout Error",
        description: "An unexpected error occurred during logout.",
        variant: "destructive"
      });
    }
  };
  
  if (!user) {
    return <div>Loading...</div>;
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
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" alt={user.name} />
                  <AvatarFallback className="text-2xl bg-thrive-blue text-white">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                
                <Button type="submit" className="bg-thrive-blue">Save Changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Your Goals</CardTitle>
              <CardDescription>What you're working towards</CardDescription>
            </CardHeader>
            <CardContent>
              {user.goals.length > 0 ? (
                <div className="space-y-4">
                  {user.goals.map((goal) => (
                    <div key={goal.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{goal.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Target: {goal.targetValue} {goal.unit}
                          </p>
                        </div>
                        <div className="text-sm px-2 py-1 rounded-full bg-thrive-blue/10 text-thrive-blue">
                          {goal.category}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  You don't have any goals set yet. Head to the dashboard to add some!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="motivations">
          <Card>
            <CardHeader>
              <CardTitle>Your Motivations</CardTitle>
              <CardDescription>Your responses from the motivational interview</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(motivationalResponses).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(motivationalResponses).map(([category, response]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="font-medium capitalize">{category}</h3>
                      <p className="text-sm p-4 bg-muted rounded-md">
                        {response}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  You haven't completed the motivational interview yet.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
