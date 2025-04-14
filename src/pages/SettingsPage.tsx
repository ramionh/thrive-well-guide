
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const SettingsPage: React.FC = () => {
  const { toast } = useToast();
  
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);
  const [privacyMode, setPrivacyMode] = React.useState(false);
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };
  
  const handleResetApp = () => {
    // In a real app, this would clear the user's data after confirmation
    localStorage.clear();
    toast({
      title: "App reset",
      description: "All app data has been cleared. Please refresh the page.",
      variant: "destructive",
    });
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
            <CardTitle>Display</CardTitle>
            <CardDescription>Customize your app experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="darkMode" className="flex flex-col gap-1">
                <span>Dark Mode</span>
                <span className="font-normal text-sm text-muted-foreground">
                  Switch between light and dark themes
                </span>
              </Label>
              <Switch 
                id="darkMode" 
                checked={darkMode} 
                onCheckedChange={setDarkMode} 
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
              >
                Reset Application Data
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This will delete all your data and reset the app to its initial state.
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
