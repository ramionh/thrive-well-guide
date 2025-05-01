
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users } from "lucide-react";
import LoadingState from "./shared/LoadingState";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

interface FamilyStrengthsProps {
  onComplete: () => void;
}

interface FamilyStrengthsFormData {
  familyStrengths: string;
  perceivedStrengths: string;
  familyFeelings: string;
  buildFamily: string;
}

const FamilyStrengths: React.FC<FamilyStrengthsProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const initialState: FamilyStrengthsFormData = {
    familyStrengths: "",
    perceivedStrengths: "",
    familyFeelings: "",
    buildFamily: ""
  };

  const [formData, setFormData] = useState<FamilyStrengthsFormData>(initialState);

  useEffect(() => {
    if (user) {
      fetchExistingData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchExistingData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("motivation_family_strengths")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      console.log("Raw family strengths data:", data);
      
      if (data) {
        setFormData({
          familyStrengths: data.family_strengths || "",
          perceivedStrengths: data.perceived_strengths || "",
          familyFeelings: data.family_feelings || "",
          buildFamily: data.build_family || ""
        });
      }
    } catch (err) {
      console.error("Error fetching family strengths data:", err);
      toast({
        title: "Error",
        description: "Failed to load your family strengths data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateForm = (field: keyof FamilyStrengthsFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const submitForm = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Prepare data for database
      const dataToSubmit = {
        user_id: user.id,
        family_strengths: formData.familyStrengths,
        perceived_strengths: formData.perceivedStrengths,
        family_feelings: formData.familyFeelings,
        build_family: formData.buildFamily,
        updated_at: new Date().toISOString()
      };

      // Check if record already exists
      const { data: existingData, error: queryError } = await supabase
        .from("motivation_family_strengths")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (queryError && queryError.code !== "PGRST116") throw queryError;

      let result;
      if (existingData && 'id' in existingData) {
        // Update existing record
        result = await supabase
          .from("motivation_family_strengths")
          .update(dataToSubmit)
          .eq("id", existingData.id)
          .eq("user_id", user.id);
      } else {
        // Insert new record
        const insertData = {
          ...dataToSubmit,
          created_at: new Date().toISOString()
        };
        result = await supabase
          .from("motivation_family_strengths")
          .insert(insertData);
      }

      if (result.error) throw result.error;

      // Update step progress
      const { error: progressError } = await supabase
        .from("motivation_steps_progress")
        .upsert(
          {
            user_id: user.id,
            step_number: 52,
            step_name: "Family Strengths",
            completed: true,
            completed_at: new Date().toISOString()
          },
          { onConflict: "user_id,step_number" }
        );

      if (progressError) throw progressError;
      
      // Make next step available
      const { error: nextStepError } = await supabase
        .from("motivation_steps_progress")
        .upsert(
          {
            user_id: user.id,
            step_number: 53,
            step_name: "Time Management",
            completed: false,
            available: true,
            completed_at: null
          },
          { onConflict: "user_id,step_number" }
        );

      if (nextStepError) throw nextStepError;

      toast({
        title: "Success",
        description: "Your family strengths information has been saved"
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving family strengths data:", error);
      toast({
        title: "Error",
        description: "Failed to save your family strengths information",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <div className="flex items-center gap-3 mb-1">
          <Users className="w-6 h-6 text-purple-600" />
          <CardTitle className="text-2xl font-bold text-purple-800">Family Strengths</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <p className="mb-6 text-gray-600">
          Think about your family as a resource. If you don't have a traditional family, that doesn't mean you won't be able to 
          reach your fitness goals. Define family in whatever terms work for you. What are some strengths your family has 
          that can help you achieve your goal? Consider the quality of your relationships, shared family values, common activities 
          and traditions, conflict management, and loyalty.
        </p>

        <p className="mb-6 text-gray-600 italic">
          "My family sticks by each other and doesn't keep secrets. I can count on them for help and to listen when I need an ear. 
          We get together most Sundays for dinner to reconnect. My mom and I text each other daily about our workout progress."
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="familyStrengths" className="text-purple-600">What are your family's strengths?</Label>
            <Textarea 
              id="familyStrengths"
              value={formData.familyStrengths}
              onChange={(e) => updateForm("familyStrengths", e.target.value)}
              className="mt-1"
              rows={4}
              disabled={isLoading || isSaving}
              placeholder="Describe your family's strengths..."
            />
          </div>
          
          <div>
            <Label htmlFor="perceivedStrengths" className="text-purple-600">What would your family members say your strengths are?</Label>
            <Textarea 
              id="perceivedStrengths"
              value={formData.perceivedStrengths}
              onChange={(e) => updateForm("perceivedStrengths", e.target.value)}
              className="mt-1"
              rows={4}
              disabled={isLoading || isSaving}
              placeholder="Describe how your family members see your strengths..."
            />
          </div>
          
          <div>
            <Label htmlFor="familyFeelings" className="text-purple-600">How do you feel about this area?</Label>
            <Textarea 
              id="familyFeelings"
              value={formData.familyFeelings}
              onChange={(e) => updateForm("familyFeelings", e.target.value)}
              className="mt-1"
              rows={4}
              disabled={isLoading || isSaving}
              placeholder="Share your feelings about your family support..."
            />
          </div>
          
          <div>
            <Label htmlFor="buildFamily" className="text-purple-600">What can you build on or add to any of these family supports or strengths?</Label>
            <Textarea 
              id="buildFamily"
              value={formData.buildFamily}
              onChange={(e) => updateForm("buildFamily", e.target.value)}
              className="mt-1"
              rows={4}
              disabled={isLoading || isSaving}
              placeholder="Describe ways to strengthen your family support..."
            />
          </div>

          <Button 
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading || isSaving}
          >
            {isSaving ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FamilyStrengths;
