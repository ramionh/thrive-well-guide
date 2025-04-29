
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoadingState from "./shared/LoadingState";
import { Coins } from "lucide-react";

interface FinancialResourcesFormData {
  income: string;
  job_stability: string;
  workplace_benefits: string;
  flexible_schedule: string;
  job_satisfaction: string;
  financial_feelings: string;
  build_resources: string;
}

interface FinancialResourcesProps {
  onComplete?: () => void;
}

const FinancialResources: React.FC<FinancialResourcesProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FinancialResourcesFormData>({
    income: "",
    job_stability: "",
    workplace_benefits: "",
    flexible_schedule: "",
    job_satisfaction: "",
    financial_feelings: "",
    build_resources: ""
  });

  useEffect(() => {
    if (user) {
      fetchExistingData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchExistingData = async () => {
    try {
      const { data, error } = await supabase
        .from("motivation_financial_resources")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      console.log("Financial resources raw data:", data);

      if (data) {
        // Create a clean data object, handling both direct values and potential JSON parsing issues
        const cleanData: FinancialResourcesFormData = {
          income: parseField(data.income),
          job_stability: parseField(data.job_stability),
          workplace_benefits: parseField(data.workplace_benefits),
          flexible_schedule: parseField(data.flexible_schedule),
          job_satisfaction: parseField(data.job_satisfaction),
          financial_feelings: parseField(data.financial_feelings),
          build_resources: parseField(data.build_resources)
        };

        console.log("Parsed financial resources data:", cleanData);
        setFormData(cleanData);
      }
    } catch (error) {
      console.error("Error fetching financial resources data:", error);
      toast({
        title: "Error",
        description: "Failed to load your financial resources data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to parse potentially JSON-encoded string fields
  const parseField = (value: any): string => {
    if (!value) return "";
    
    // Already a string
    if (typeof value === 'string') return value;
    
    // Try to handle case where value might be a JSON object/array
    if (typeof value === 'object') {
      try {
        // If it's an object that contains a text property
        if (value.text) return value.text;
        // If it's an array and has a first element with text
        if (Array.isArray(value) && value[0]?.text) return value[0].text;
        // Last resort, stringify it
        return JSON.stringify(value);
      } catch (e) {
        return "";
      }
    }
    
    // Default fallback
    return String(value);
  };

  const handleInputChange = (field: keyof FinancialResourcesFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("motivation_financial_resources")
        .upsert({
          user_id: user.id,
          income: formData.income,
          job_stability: formData.job_stability,
          workplace_benefits: formData.workplace_benefits,
          flexible_schedule: formData.flexible_schedule,
          job_satisfaction: formData.job_satisfaction,
          financial_feelings: formData.financial_feelings,
          build_resources: formData.build_resources,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Mark step 50 as completed
      const { error: progressError } = await supabase
        .from("motivation_steps_progress")
        .upsert(
          {
            user_id: user.id,
            step_number: 50,
            step_name: "Financial and Economic Resources",
            completed: true,
            completed_at: new Date().toISOString()
          },
          { onConflict: "user_id,step_number" }
        );

      if (progressError) throw progressError;

      // Make step 51 available
      const { error: nextStepError } = await supabase
        .from("motivation_steps_progress")
        .upsert(
          {
            user_id: user.id,
            step_number: 51,
            step_name: "Social Support and Social Competence",
            completed: false,
            available: true,
            completed_at: null
          },
          { onConflict: "user_id,step_number" }
        );

      if (nextStepError) throw nextStepError;

      toast({
        title: "Success",
        description: "Your financial resources information has been saved"
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving financial resources data:", error);
      toast({
        title: "Error",
        description: "Failed to save your financial resources information",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Coins className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-semibold text-purple-800">Financial and Economic Resources</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Below are some economic resources and strengths that can help you achieve your goal. 
          Explain how each applicable item might be helpful to you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">
              Income:
            </label>
            <Textarea
              id="income"
              rows={2}
              value={formData.income}
              onChange={(e) => handleInputChange("income", e.target.value)}
              className="w-full resize-none"
            />
          </div>

          <div>
            <label htmlFor="job_stability" className="block text-sm font-medium text-gray-700 mb-1">
              Job stability:
            </label>
            <Textarea
              id="job_stability" 
              rows={2}
              value={formData.job_stability}
              onChange={(e) => handleInputChange("job_stability", e.target.value)}
              className="w-full resize-none"
            />
          </div>

          <div>
            <label htmlFor="workplace_benefits" className="block text-sm font-medium text-gray-700 mb-1">
              Workplace benefits:
            </label>
            <Textarea
              id="workplace_benefits"
              rows={2}
              value={formData.workplace_benefits}
              onChange={(e) => handleInputChange("workplace_benefits", e.target.value)}
              className="w-full resize-none"
            />
          </div>

          <div>
            <label htmlFor="flexible_schedule" className="block text-sm font-medium text-gray-700 mb-1">
              Flexible work schedule:
            </label>
            <Textarea
              id="flexible_schedule"
              rows={2}
              value={formData.flexible_schedule}
              onChange={(e) => handleInputChange("flexible_schedule", e.target.value)}
              className="w-full resize-none"
            />
          </div>

          <div>
            <label htmlFor="job_satisfaction" className="block text-sm font-medium text-gray-700 mb-1">
              Job satisfaction:
            </label>
            <Textarea
              id="job_satisfaction"
              rows={2}
              value={formData.job_satisfaction}
              onChange={(e) => handleInputChange("job_satisfaction", e.target.value)}
              className="w-full resize-none"
            />
          </div>

          <div>
            <label htmlFor="financial_feelings" className="block text-sm font-medium text-gray-700 mb-1">
              How do you feel about finances in general?
            </label>
            <Textarea
              id="financial_feelings"
              rows={2}
              value={formData.financial_feelings}
              onChange={(e) => handleInputChange("financial_feelings", e.target.value)}
              className="w-full resize-none"
            />
          </div>

          <div>
            <label htmlFor="build_resources" className="block text-sm font-medium text-gray-700 mb-1">
              What can you do to build on or add to any of these resources?
            </label>
            <Textarea
              id="build_resources"
              rows={3}
              value={formData.build_resources}
              onChange={(e) => handleInputChange("build_resources", e.target.value)}
              className="w-full resize-none"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 mt-6"
          >
            {isSubmitting ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FinancialResources;
