
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

interface UserInfoStepProps {
  onNext: () => void;
}

const UserInfoStep: React.FC<UserInfoStepProps> = ({ onNext }) => {
  const { user, completeOnboarding } = useUser();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || "");
  const [lastName, setLastName] = useState(user?.name?.split(' ')[1] || "");
  const [email, setEmail] = useState(user?.email || "");
  const [gender, setGender] = useState<string>("");
  const [dob, setDob] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [weightLbs, setWeightLbs] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !email || !dob || !feet || !weightLbs || !gender) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields to continue.",
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

    const dobDate = new Date(dob);
    if (isNaN(dobDate.getTime())) {
      toast({
        title: "Invalid date",
        description: "Please enter a valid date of birth.",
        variant: "destructive"
      });
      return;
    }

    const heightFeet = Number(feet);
    const heightInches = Number(inches || 0);
    const weight = Number(weightLbs);

    if (isNaN(heightFeet) || isNaN(heightInches) || heightFeet < 0 || heightInches < 0 || heightInches >= 12) {
      toast({
        title: "Invalid height",
        description: "Please enter a valid height.",
        variant: "destructive"
      });
      return;
    }

    if (isNaN(weight) || weight <= 0) {
      toast({
        title: "Invalid weight",
        description: "Please enter a valid weight in pounds.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await completeOnboarding({
        firstName,
        lastName,
        email,
        dateOfBirth: dob,
        gender,
        heightFeet: Number(feet),
        heightInches: Number(inches || 0),
        weightLbs: Number(weightLbs)
      });
      
      onNext();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your information. Please try again.",
        variant: "destructive"
      });
    }
  };
  
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
        <Label>Gender</Label>
        <RadioGroup 
          value={gender} 
          onValueChange={setGender} 
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
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

      <div className="space-y-2">
        <Label>Height</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="feet">Feet</Label>
            <Input 
              id="feet" 
              type="number" 
              min="0"
              placeholder="ft"
              value={feet} 
              onChange={(e) => setFeet(e.target.value)} 
            />
          </div>
          <div>
            <Label htmlFor="inches">Inches</Label>
            <Input 
              id="inches" 
              type="number" 
              min="0"
              max="11"
              placeholder="in"
              value={inches} 
              onChange={(e) => setInches(e.target.value)} 
            />
          </div>
        </div>
      </div>
        
      <div className="space-y-2">
        <Label htmlFor="weight">Weight (lbs)</Label>
        <Input 
          id="weight" 
          type="number" 
          min="0"
          placeholder="Enter weight in pounds" 
          value={weightLbs} 
          onChange={(e) => setWeightLbs(e.target.value)} 
        />
      </div>
      
      <Button type="submit" className="w-full bg-thrive-blue hover:bg-thrive-blue/90">
        Start Your 40+Ripped Journey
      </Button>
    </form>
  );
};

export default UserInfoStep;
