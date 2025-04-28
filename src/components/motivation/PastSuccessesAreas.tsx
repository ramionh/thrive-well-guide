
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

interface PastSuccessesAreasProps {
  onComplete?: () => void;
}

interface PastSuccessesData {
  healthy_eating: string;
  physical_activity: string;
  organization: string;
  intimate_relationships: string;
  family_relationships: string;
  career: string;
  spiritual_life: string;
  money_management: string;
  friendships: string;
  other: string;
  reflection: string;
}

const PastSuccessesAreas: React.FC<PastSuccessesAreasProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState<PastSuccessesData>({
    healthy_eating: "",
    physical_activity: "",
    organization: "",
    intimate_relationships: "",
    family_relationships: "",
    career: "",
    spiritual_life: "",
    money_management: "",
    friendships: "",
    other: "",
    reflection: ""
  });

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("motivation_past_successes_areas")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setFormData({
            healthy_eating: data.healthy_eating || "",
            physical_activity: data.physical_activity || "",
            organization: data.organization || "",
            intimate_relationships: data.intimate_relationships || "",
            family_relationships: data.family_relationships || "",
            career: data.career || "",
            spiritual_life: data.spiritual_life || "",
            money_management: data.money_management || "",
            friendships: data.friendships || "",
            other: data.other || "",
            reflection: data.reflection || ""
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load your previous responses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingData();
  }, [user, toast]);

  const handleChange = (field: keyof PastSuccessesData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("motivation_past_successes_areas")
        .insert({
          user_id: user.id,
          ...formData
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your response has been saved",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving response:", error);
      toast({
        title: "Error",
        description: "Failed to save your response",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Past Successes</h2>
              <p className="text-gray-600 mb-6">
                Think of some examples of small changes you've made in the recent past. 
                Here are some prompts to help you think of different areas in which you might have 
                made efforts to do better. Fill in all that apply.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-1">
                    Healthy eating
                  </label>
                  <Input
                    value={formData.healthy_eating}
                    onChange={(e) => handleChange("healthy_eating", e.target.value)}
                    placeholder="Describe a change you made"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-1">
                    Physical activity
                  </label>
                  <Input
                    value={formData.physical_activity}
                    onChange={(e) => handleChange("physical_activity", e.target.value)}
                    placeholder="Describe a change you made"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-1">
                    Organization (at home, work, or school)
                  </label>
                  <Input
                    value={formData.organization}
                    onChange={(e) => handleChange("organization", e.target.value)}
                    placeholder="Describe a change you made"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-1">
                    Intimate relationships
                  </label>
                  <Input
                    value={formData.intimate_relationships}
                    onChange={(e) => handleChange("intimate_relationships", e.target.value)}
                    placeholder="Describe a change you made"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-1">
                    Relationship with parent(s) or children
                  </label>
                  <Input
                    value={formData.family_relationships}
                    onChange={(e) => handleChange("family_relationships", e.target.value)}
                    placeholder="Describe a change you made"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-1">
                    Career/Job
                  </label>
                  <Input
                    value={formData.career}
                    onChange={(e) => handleChange("career", e.target.value)}
                    placeholder="Describe a change you made"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-1">
                    Spiritual life
                  </label>
                  <Input
                    value={formData.spiritual_life}
                    onChange={(e) => handleChange("spiritual_life", e.target.value)}
                    placeholder="Describe a change you made"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-1">
                    Money management
                  </label>
                  <Input
                    value={formData.money_management}
                    onChange={(e) => handleChange("money_management", e.target.value)}
                    placeholder="Describe a change you made"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-1">
                    Friendships
                  </label>
                  <Input
                    value={formData.friendships}
                    onChange={(e) => handleChange("friendships", e.target.value)}
                    placeholder="Describe a change you made"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-1">
                    Other
                  </label>
                  <Input
                    value={formData.other}
                    onChange={(e) => handleChange("other", e.target.value)}
                    placeholder="Describe a change you made in another area"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-800 mb-1">
                Based on your answers, which steps can help you be more successful in pursuing your goal?
              </label>
              <Textarea
                value={formData.reflection}
                onChange={(e) => handleChange("reflection", e.target.value)}
                placeholder="Enter your reflection"
                rows={4}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default PastSuccessesAreas;
