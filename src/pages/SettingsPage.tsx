
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useUser();
  
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [privacyMode, setPrivacyMode] = React.useState(false);
  const [isSubmittingReset, setIsSubmittingReset] = React.useState(false);
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };
  
  const handleResetApp = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to request an app reset.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingReset(true);
    
    try {
      console.log('Submitting reset request for user:', user.id, user.email);
      
      const { data, error } = await supabase.functions.invoke('request-app-reset', {
        body: {
          userId: user.id,
          userEmail: user.email
        }
      });

      if (error) {
        console.error('Reset request error:', error);
        throw error;
      }

      console.log('Reset request response:', data);

      toast({
        title: "Request Submitted",
        description: "A request to reset your application has been made. You will be contacted soon.",
      });

    } catch (error: any) {
      console.error('Error submitting reset request:', error);
      toast({
        title: "Error",
        description: "Failed to submit reset request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingReset(false);
    }
  };
  
  return (
    <div className="container mx-auto max-w-4xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Configure how you want to be notified</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications" className="flex flex-col gap-1">
                <span>Enable Notifications</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Receive reminders and progress updates
                </span>
              </Label>
              <Switch 
                id="notifications" 
                checked={notificationsEnabled} 
                onCheckedChange={setNotificationsEnabled} 
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Control your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="privacyMode" className="flex flex-col gap-1">
                <span>Enhanced Privacy Mode</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Hide personal data from the dashboard
                </span>
              </Label>
              <Switch 
                id="privacyMode" 
                checked={privacyMode} 
                onCheckedChange={setPrivacyMode} 
              />
            </div>
            
            <div className="pt-4">
              <Button 
                variant="destructive" 
                onClick={handleResetApp}
                disabled={isSubmittingReset}
              >
                {isSubmittingReset ? "Submitting Request..." : "Reset Application Data"}
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This will submit a request to reset your app data. You will be contacted to confirm this action.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            className="bg-thrive-blue hover:bg-thrive-blue/90"
            onClick={handleSaveSettings}
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
