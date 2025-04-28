
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useStressTypes } from "./useStressTypes";
import LoadingState from "../shared/LoadingState";
import StressTypeExplanation from "./StressTypeExplanation";
import StressTypeTable from "./StressTypeTable";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";

interface IdentifyingStressTypesProps {
  onComplete?: () => void;
}

const IdentifyingStressTypes: React.FC<IdentifyingStressTypesProps> = ({ onComplete }) => {
  const {
    stressTypes,
    isLoadingStressors,
    isSubmitting,
    handleStressTypeChange,
    handleSubmit,
  } = useStressTypes({ onComplete });
  
  const { user } = useUser();

  // Mark step 43 (Managing Stress) as completed when this component loads
  useEffect(() => {
    const markPreviousStepComplete = async () => {
      if (!user) return;
      
      try {
        // Check if a step 43 progress record already exists
        const { data: existingProgress } = await supabase
          .from('motivation_steps_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('step_number', 43)
          .maybeSingle();

        if (!existingProgress) {
          // If it doesn't exist, create it and mark as completed
          await supabase
            .from('motivation_steps_progress')
            .insert({
              user_id: user.id,
              step_number: 43,
              step_name: 'Managing Stress',
              completed: true,
              completed_at: new Date().toISOString()
            });
        } else if (!existingProgress.completed) {
          // If it exists but is not marked as completed, update it
          await supabase
            .from('motivation_steps_progress')
            .update({
              completed: true,
              completed_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
            .eq('step_number', 43);
        }
      } catch (error) {
        console.error("Error marking previous step as complete:", error);
      }
    };

    markPreviousStepComplete();
  }, [user]);

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoadingStressors ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <StressTypeExplanation />

            <div className="space-y-4">
              <Label className="block text-sm font-medium text-gray-700">
                For each of your identified stressors, indicate whether it is a source of distress or eustress:
              </Label>

              <StressTypeTable 
                stressTypes={stressTypes} 
                onStressTypeChange={handleStressTypeChange}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Complete Step
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default IdentifyingStressTypes;
