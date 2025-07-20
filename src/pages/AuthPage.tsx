import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { useUser } from "@/context/UserContext";
import LoginForm from "@/components/auth/LoginForm";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthPage = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

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

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (signupPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setSignupLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { email: signupEmail, password: signupPassword }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to start checkout process. Please try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  // Handle tab change to show modal for register
  const handleTabChange = (value: 'login' | 'register') => {
    setActiveTab(value);
    if (value === 'register') {
      setShowSignupDialog(true);
    }
  };

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
              src="/lovable-uploads/7d7b8c91-cb21-4fdb-845f-9b7594d4a358.png" 
              alt="Gen X Shred" 
              className="h-48"
            />
          </div>
          <CardDescription>
            Login or create an account to start your fitness journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            value={activeTab} 
            onValueChange={handleTabChange}
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
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Ready to start your motivational coaching journey?
                </p>
                <Button 
                  onClick={() => setShowSignupDialog(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Get Started with Coaching
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <div className="text-sm text-gray-600">
                  Or{' '}
                  <button 
                    onClick={() => navigate('/initial-signup')}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    use your authorization code
                  </button>
                </div>
              </div>
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

      {/* Signup Dialog */}
      <Dialog open={showSignupDialog} onOpenChange={setShowSignupDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Your Account</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePurchase} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="your@email.com"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Create a password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button 
              type="submit"
              disabled={signupLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-lg shadow-lg"
            >
              {signupLoading ? "Processing..." : "Continue to Payment"}
              {!signupLoading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AuthPage;
