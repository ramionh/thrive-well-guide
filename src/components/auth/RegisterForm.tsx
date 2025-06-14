
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

interface RegisterFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  loading: boolean;
}

const RegisterForm = ({ email, setEmail, password, setPassword, loading }: RegisterFormProps) => {
  const navigate = useNavigate();

  const handleRegisterRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/coaching');
  };

  return (
    <form onSubmit={handleRegisterRedirect} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
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
        <Lock className="mr-2 h-4 w-4" />
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
