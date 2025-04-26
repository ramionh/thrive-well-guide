
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // Handle session check only once on component mount
  useEffect(() => {
    console.log("AuthPage - Initial check for session");
    
    // Initial session check - only done once
    const checkInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        console.log("AuthPage - Initial session check:", data.session?.user?.id ? "Session exists" : "No session");
        
        if (data.session?.user) {
          console.log("AuthPage - Session found, will navigate soon");
          // We'll let the user context handle the navigation based on onboarding status
        }
        
        // Mark auth check as complete regardless of result
        setAuthCheckComplete(true);
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthCheckComplete(true);
      }
    };
    
    checkInitialSession();
  }, []);

  // Handle redirection based on user context
  useEffect(() => {
    // Only proceed if we've completed the initial auth check
    if (!authCheckComplete) return;

    if (!isLoading) {
      console.log("AuthPage - User context loaded, user:", user?.id);
      
      if (user) {
        console.log("AuthPage - User found in context. Onboarding completed:", user.onboardingCompleted);
        if (user.onboardingCompleted) {
          console.log("AuthPage - Redirecting to dashboard");
          navigate('/dashboard');
        } else {
          console.log("AuthPage - Redirecting to onboarding");
          navigate('/onboarding');
        }
      } else {
        console.log("AuthPage - No user in context, staying on auth page");
      }
    }
  }, [user, isLoading, navigate, authCheckComplete]);

  // Show loading state while checking authentication
  if (isLoading || !authCheckComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p>{isLoading ? "Loading user data..." : "Checking authentication..."}</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the auth page
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">40+Ripped</CardTitle>
          <CardDescription className="text-center">
            Login or create an account to start your fitness journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onValueChange={(value: 'login' | 'register') => setActiveTab(value)}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loading={loading}
              />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm 
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <GoogleSignInButton />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
