
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface UserInfoStepProps {
  onNext: () => void;
}

const UserInfoStep: React.FC<UserInfoStepProps> = ({ onNext }) => {
  const { user, isLoading } = useUser();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || "");
  const [lastName, setLastName] = useState(user?.name?.split(' ')[1] || "");
  const [email, setEmail] = useState(user?.email || "");
  const [dob, setDob] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !dob || !height || !weight) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields to continue.",
        variant: "destructive"
      });
      return;
    }
    
    if (!email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // Validate date of birth
    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
      toast({
        title: "Invalid date",
        description: "Please enter a valid date of birth.",
        variant: "destructive"
      });
      return;
    }

    // Validate height and weight are numbers
    if (isNaN(Number(height)) || isNaN(Number(weight))) {
      toast({
        title: "Invalid measurements",
        description: "Height and weight must be numbers.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, we would update the user in the backend
    onNext();
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            placeholder="Enter your first name" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            placeholder="Enter your last name" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input 
          id="email" 
          type="email" 
          placeholder="Enter your email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dob">Date of Birth</Label>
        <Input 
          id="dob" 
          type="date" 
          value={dob} 
          onChange={(e) => setDob(e.target.value)} 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input 
            id="height" 
            type="number" 
            placeholder="Enter height in cm" 
            value={height} 
            onChange={(e) => setHeight(e.target.value)} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input 
            id="weight" 
            type="number" 
            placeholder="Enter weight in kg" 
            value={weight} 
            onChange={(e) => setWeight(e.target.value)} 
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-thrive-blue hover:bg-thrive-blue/90">
        Start Your 40+Ripped Journey
      </Button>
    </form>
  );
};

export default UserInfoStep;
