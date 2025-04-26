
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
  const { user, isLoading } = useUser(); // Removed setUser as it doesn't exist in UserContextType
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [localSession, setLocalSession] = useState<boolean | null>(null);

  // Set up auth state listener to catch real-time auth changes
  useEffect(() => {
    console.log("Setting up auth listener");
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (session?.user) {
          console.log("Session detected in listener, user should be redirected soon");
          setLocalSession(true);
          
          // Force navigation after successful authentication
          if (event === 'SIGNED_IN') {
            console.log("Sign-in detected, redirecting to dashboard");
            navigate('/dashboard');
          }
        } else {
          setLocalSession(false);
        }
      }
    );

    // Initial session check
    const checkInitialSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Initial session check:", data.session?.user?.id ? "Session exists" : "No session");
      if (data.session?.user) {
        setLocalSession(true);
        navigate('/dashboard');
      } else {
        setLocalSession(false);
      }
    };
    
    checkInitialSession();

    return () => {
      console.log("Cleaning up auth listener");
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // React to user context changes
  useEffect(() => {
    if (user) {
      console.log("User context updated, user:", user.id);
      if (user.onboardingCompleted) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }
  }, [user, navigate]);

  // Show loading state while checking authentication
  if (isLoading || localSession === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  // If user is already authenticated, don't show auth page
  if (localSession === true && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p>Session detected. Loading user data...</p>
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
