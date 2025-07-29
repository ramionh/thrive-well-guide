import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useBodyTypes } from "@/hooks/useBodyTypes";
import { supabase } from "@/integrations/supabase/client";
import { BodyType } from "@/types/bodyType";

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
  const [selectedBodyType, setSelectedBodyType] = useState<string | null>(null);
  const { bodyTypes, bodyTypeImages, isLoading: isLoadingBodyTypes } = useBodyTypes();
  const [genderSpecificImages, setGenderSpecificImages] = useState<Record<string, string>>({});
  
  // Load gender-specific images when gender changes
  useEffect(() => {
    const loadGenderSpecificImages = async () => {
      if (!bodyTypes.length || !gender) return;
      
      const imageMap: Record<string, string> = {};
      
      for (const bodyType of bodyTypes) {
        let imageName = '';
        
        if (gender === 'female') {
          imageName = `woman_${bodyType.name.toLowerCase()}.png`;
        } else {
          imageName = `${bodyType.name}.png`;
        }
        
        const { data } = supabase.storage
          .from('body-types')
          .getPublicUrl(imageName);
          
        imageMap[bodyType.id] = data.publicUrl;
      }
      
      setGenderSpecificImages(imageMap);
    };
    
    loadGenderSpecificImages();
  }, [gender, bodyTypes]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Saving your information",
      description: "Please wait while we set up your profile...",
    });
    
    if (!firstName || !lastName || !email || !dob || !feet || !weightLbs || !gender || !selectedBodyType) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields including your body type to continue.",
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
      const { error: bodyTypeError } = await supabase
        .from('user_body_types')
        .insert({
          user_id: user?.id,
          body_type_id: selectedBodyType,
          selected_date: new Date().toISOString().split('T')[0],
          weight_lbs: Number(weightLbs)
        });

      if (bodyTypeError) throw bodyTypeError;

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
      
      toast({
        title: "Profile saved",
        description: "Moving to the next step...",
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
        <Label>Gender Assigned at Birth</Label>
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

      <div className="space-y-2">
        <Label>Current Body Type</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoadingBodyTypes ? (
            <div>Loading body types...</div>
          ) : (
            bodyTypes
              .sort((a, b) => {
                const order = ['Ripped', 'Elite', 'Fit', 'Average', 'Overweight', 'Obese'];
                const aIndex = order.indexOf(a.name);
                const bIndex = order.indexOf(b.name);
                return aIndex - bIndex;
              })
              .map((bodyType) => (
              <div
                key={bodyType.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedBodyType === bodyType.id
                    ? 'border-primary ring-2 ring-primary'
                    : 'hover:border-primary'
                }`}
                onClick={() => setSelectedBodyType(bodyType.id)}
              >
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-32 h-32 rounded-lg overflow-hidden">
                    <img
                      src={genderSpecificImages[bodyType.id] || bodyTypeImages[bodyType.id] || '/placeholder.svg'}
                      alt={bodyType.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold">{bodyType.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Body Fat: {bodyType.bodyfat_range}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-thrive-blue hover:bg-thrive-blue/90">
        Start Your GenXShred Journey
      </Button>
    </form>
  );
};

export default UserInfoStep;
