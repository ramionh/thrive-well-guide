import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { supabase } from "@/integrations/supabase/client";

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    console.log("AuthPage - Component mounted");
    
    // Check if the user is already authenticated
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("AuthPage - Error checking session:", error);
          return;
        }
        
        if (data.session) {
          console.log("AuthPage - Session exists");
          
          // Check if user has completed onboarding
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', data.session.user.id)
            .single();
          
          if (profileError) {
            console.error("AuthPage - Error fetching profile:", profileError);
            return;
          }
          
          if (profileData.onboarding_completed) {
            console.log("AuthPage - Redirecting to dashboard");
            navigate('/dashboard');
          } else {
            console.log("AuthPage - Redirecting to onboarding");
            navigate('/onboarding');
          }
        } else {
          console.log("AuthPage - No session found, staying on auth page");
        }
      } catch (error) {
        console.error("AuthPage - Error in checkAuth:", error);
      }
    };
    
    checkAuth();
    
    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("AuthPage - Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        console.log("AuthPage - User signed in via listener");
        
        // We'll let the checkAuth function handle the redirection
        checkAuth();
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If there's an authenticated user in context, they should have been redirected already
  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p>Redirecting...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show the auth page
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/7bcf9ab6-a729-4686-8b02-57e3e77ec2b1.png" 
              alt="Gen X Shred" 
              className="h-12"
            />
          </div>
          <CardDescription>
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
