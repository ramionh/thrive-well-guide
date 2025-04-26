
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { supabase } from "@/integrations/supabase/client";

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Set up auth state listener to catch real-time auth changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        if (session?.user) {
          // This will fetch fresh user data when authentication changes
          console.log("Session detected, user should be redirected soon");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Enhanced redirection logic
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Get current session directly
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && !user) {
          console.log("Session exists but user context not updated yet");
        }
        
        if (user) {
          console.log("User authenticated in context, redirecting:", user);
          if (user.onboardingCompleted) {
            navigate('/dashboard');
          } else {
            navigate('/onboarding');
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkUser();
  }, [user, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
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
