
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle } from "lucide-react";
import LoadingState from "./shared/LoadingState";
import { SocialSupportFormData, SupportTypes, parseSocialSupportData } from "@/hooks/motivation/parseSocialSupportData";

interface SocialSupportProps {
  onComplete: () => void;
}

interface SocialSkillOption {
  id: string;
  label: string;
}

const SocialSupport: React.FC<SocialSupportProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const socialSkillOptions: SocialSkillOption[] = [
    { id: "meet_new_people", label: "MEET NEW PEOPLE" },
    { id: "comfortable_social", label: "FEEL COMFORTABLE IN NEW SOCIAL SITUATIONS" },
    { id: "maintain_connections", label: "MAINTAIN CONNECTIONS WITH A LOT OF FRIENDS" },
    { id: "make_friends", label: "MAKE FRIENDS EASILY" },
    { id: "start_conversation", label: "START A CONVERSATION WITH PEOPLE" },
    { id: "laugh_with_people", label: "LAUGH WITH PEOPLE" },
    { id: "good_friend", label: "BE A GOOD FRIEND" },
    { id: "flexible_social", label: "BE FLEXIBLE WHEN SOCIAL SITUATIONS CHANGE" },
    { id: "make_others_laugh", label: "MAKE OTHER PEOPLE LAUGH" }
  ];

  const initialState: SocialSupportFormData = {
    supportTypes: {
      financial: "",
      listeners: "",
      encouragers: "",
      valuers: "",
      talkers: ""
    },
    socialSkills: [],
    socialFeelings: "",
    buildSocial: ""
  };

  const [formData, setFormData] = useState<SocialSupportFormData>(initialState);

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
        .from("motivation_social_support")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      console.log("Raw social support data:", data);
      
      if (data) {
        const parsedData = parseSocialSupportData(data);
        setFormData(parsedData);
      }
    } catch (err) {
      console.error("Error fetching social support data:", err);
      toast({
        title: "Error",
        description: "Failed to load your social support data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSkillToggle = (skillId: string) => {
    const updatedSkills = formData.socialSkills.includes(skillId)
      ? formData.socialSkills.filter(id => id !== skillId)
      : [...formData.socialSkills, skillId];
    
    setFormData({
      ...formData,
      socialSkills: updatedSkills
    });
  };

  const handleUpdateSupportType = (key: keyof SupportTypes, value: string) => {
    setFormData({
      ...formData,
      supportTypes: {
        ...formData.supportTypes,
        [key]: value
      }
    });
  };

  const updateForm = (field: keyof Omit<SocialSupportFormData, 'supportTypes'>, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const submitForm = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Prepare data for database - convert the SupportTypes to a plain object that can be stored as JSON
      const dataToSubmit = {
        user_id: user.id,
        support_types: formData.supportTypes as any, // This works because SupportTypes is a plain object
        social_skills: formData.socialSkills,
        social_feelings: formData.socialFeelings,
        build_social: formData.buildSocial,
        updated_at: new Date().toISOString()
      };

      // Check if record already exists
      const { data: existingData, error: queryError } = await supabase
        .from("motivation_social_support")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (queryError && queryError.code !== "PGRST116") throw queryError;

      let result;
      if (existingData && 'id' in existingData) {
        // Update existing record
        result = await supabase
          .from("motivation_social_support")
          .update(dataToSubmit)
          .eq("id", existingData.id)
          .eq("user_id", user.id);
      } else {
        // Insert new record with created_at
        const insertData = {
          ...dataToSubmit,
          created_at: new Date().toISOString()
        };
        result = await supabase
          .from("motivation_social_support")
          .insert(insertData);
      }

      if (result.error) throw result.error;

      // Update step progress
      const { error: progressError } = await supabase
        .from("motivation_steps_progress")
        .upsert(
          {
            user_id: user.id,
            step_number: 51,
            step_name: "Social Support and Social Competence",
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
            step_number: 52,
            step_name: "Family Strengths",
            completed: false,
            available: true,
            completed_at: null
          },
          { onConflict: "user_id,step_number" }
        );

      if (nextStepError) throw nextStepError;

      toast({
        title: "Success",
        description: "Your social support information has been saved"
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving social support data:", error);
      toast({
        title: "Error",
        description: "Failed to save your social support information",
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
          <MessageCircle className="w-6 h-6 text-purple-600" />
          <CardTitle className="text-2xl font-bold text-purple-800">Social Support and Social Competence</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <p className="mb-6 text-gray-600">
          Let's take a look at your support system, or the people you can rely on, as well as your ability to access and accept help from others. 
          In the first part of this exercise, consider all the different ways people can be helpful, such as providing financial support, 
          being a good listener, or believing in you. You may know someone who is able to do all these things, some of these things, or just one of these things. 
          Write the names of as many people as you like for each type of support.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-purple-700">I have close friends or family members who can support me in the following ways:</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="financial" className="text-purple-600">Help financially:</Label>
                <Input 
                  id="financial"
                  value={formData.supportTypes.financial}
                  onChange={(e) => handleUpdateSupportType("financial", e.target.value)}
                  className="mt-1"
                  disabled={isSaving}
                  placeholder="Type names of friends or family who can help you financially"
                />
              </div>
              
              <div>
                <Label htmlFor="listeners" className="text-purple-600">Listen:</Label>
                <Input 
                  id="listeners"
                  value={formData.supportTypes.listeners}
                  onChange={(e) => handleUpdateSupportType("listeners", e.target.value)}
                  className="mt-1"
                  disabled={isSaving}
                  placeholder="Type names of friends or family who are good listeners"
                />
              </div>
              
              <div>
                <Label htmlFor="encouragers" className="text-purple-600">Encourage me:</Label>
                <Input 
                  id="encouragers"
                  value={formData.supportTypes.encouragers}
                  onChange={(e) => handleUpdateSupportType("encouragers", e.target.value)}
                  className="mt-1"
                  disabled={isSaving}
                  placeholder="Type names of friends or family who encourage you"
                />
              </div>
              
              <div>
                <Label htmlFor="valuers" className="text-purple-600">Value my abilities:</Label>
                <Input 
                  id="valuers"
                  value={formData.supportTypes.valuers}
                  onChange={(e) => handleUpdateSupportType("valuers", e.target.value)}
                  className="mt-1"
                  disabled={isSaving}
                  placeholder="Type names of friends or family who value your abilities"
                />
              </div>
              
              <div>
                <Label htmlFor="talkers" className="text-purple-600">Regularly talk:</Label>
                <Input 
                  id="talkers"
                  value={formData.supportTypes.talkers}
                  onChange={(e) => handleUpdateSupportType("talkers", e.target.value)}
                  className="mt-1"
                  disabled={isSaving}
                  placeholder="Type names of friends or family who you regularly talk with"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-700">Now that you've identified who can help, what skills will assist you in reaching out for assistance? Check all that apply below. I am able to:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {socialSkillOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option.id}
                    checked={formData.socialSkills.includes(option.id)}
                    onCheckedChange={() => handleSocialSkillToggle(option.id)}
                    disabled={isSaving}
                  />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="socialFeelings" className="text-purple-600">How do you feel about the social aspect of your life?</Label>
              <Textarea 
                id="socialFeelings"
                value={formData.socialFeelings}
                onChange={(e) => updateForm("socialFeelings", e.target.value)}
                className="mt-1"
                rows={4}
                disabled={isSaving}
                placeholder="Write your thoughts and feelings about your social life"
              />
            </div>
            
            <div>
              <Label htmlFor="buildSocial" className="text-purple-600">What can you build on or add to any of these social supports and strengths?</Label>
              <Textarea 
                id="buildSocial"
                value={formData.buildSocial}
                onChange={(e) => updateForm("buildSocial", e.target.value)}
                className="mt-1"
                rows={4}
                disabled={isSaving}
                placeholder="Describe ways you can strengthen or expand your social support network"
              />
            </div>
          </div>

          <Button 
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SocialSupport;
