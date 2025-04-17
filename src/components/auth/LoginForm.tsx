
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
}

const LoginForm = ({ email, setEmail, password, setPassword, loading }: LoginFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useUser();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Extract first name, defaulting to "User" if not available
      const firstName = user?.name?.split(' ')[0] || 'User';
      
      toast({
        title: `Welcome Back, ${firstName}!`,
        description: "Successfully signed in to your account.",
      });
      
      // Always redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
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
        disabled={loading}
      >
        <Mail className="mr-2 h-4 w-4" />
        Sign In with Email
      </Button>
    </form>
  );
};

export default LoginForm;

