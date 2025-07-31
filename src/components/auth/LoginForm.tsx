
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ResetPasswordDialog from './ResetPasswordDialog';

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
}

const LoginForm = ({ email, setEmail, password, setPassword, loading: parentLoading }: LoginFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const navigate = useNavigate();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("LoginForm - Attempting sign in with email/password");
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log("LoginForm - Sign in successful", data);
      toast({
        title: "Success!",
        description: "Successfully signed in to your account.",
      });
      
      // Check if user has completed onboarding
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', data.user?.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
      } else {
        console.log("Profile data:", profileData);
        // Directly navigate based on onboarding status
        if (profileData?.onboarding_completed) {
          console.log("Navigating to dashboard");
          navigate('/dashboard');
        } else {
          console.log("Navigating to onboarding");
          navigate('/onboarding');
        }
      }
    } catch (error: any) {
      console.error("LoginForm - Sign in error:", error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleEmailSignIn} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-thrive-blue"
          disabled={loading || parentLoading}
        >
          <Mail className="mr-2 h-4 w-4" />
          {loading ? "Signing in..." : "Sign In with Email"}
        </Button>
        
      </form>
      
      <ResetPasswordDialog 
        open={showResetDialog} 
        onOpenChange={setShowResetDialog} 
      />
    </>
  );
};

export default LoginForm;
