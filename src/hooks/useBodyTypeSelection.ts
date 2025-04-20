
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBodyTypeSelection = (user: any, fetchUserBodyType: () => void) => {
  const [selectedBodyType, setSelectedBodyType] = useState<string | null>(null);
  const [weight, setWeight] = useState<number | ''>('');
  const [bodyfat, setBodyfat] = useState<number | ''>('');
  const [isSaving, setIsSaving] = useState(false);

  const handleBodyTypeSelect = (bodyTypeId: string) => {
    setSelectedBodyType(bodyTypeId);
  };

  const handleSaveBodyType = async () => {
    if (!selectedBodyType || !user) {
      toast.error('Please select a body type');
      return;
    }

    if (!weight || weight < 50 || weight > 1000) {
      toast.error('Please enter a valid weight between 50 and 1000 lbs');
      return;
    }

    if (bodyfat !== '' && (bodyfat < 1 || bodyfat > 100)) {
      toast.error('Body fat percentage must be between 1% and 100%');
      return;
    }

    setIsSaving(true);

    try {
      const startDate = new Date().toISOString().split('T')[0];
      
      // Save user body type
      const { error: bodyTypeError } = await supabase
        .from('user_body_types')
        .insert({
          user_id: user.id,
          body_type_id: selectedBodyType,
          selected_date: startDate,
          weight_lbs: weight,
          bodyfat_percentage: bodyfat || null
        })
        .select();

      if (bodyTypeError) {
        console.error('Error saving body type:', bodyTypeError);
        toast.error('Failed to save body type: ' + bodyTypeError.message);
        return;
      }

      // Get the goal body type ID using our new function
      const { data: goalBodyTypeId, error: functionError } = await supabase
        .rpc('get_next_better_body_type', { current_body_type_id: selectedBodyType });

      if (functionError) {
        console.error('Error getting next body type:', functionError);
        toast.error('Failed to set goal: ' + functionError.message);
        return;
      }

      // Create the goal
      const { error: goalError } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          current_body_type_id: selectedBodyType,
          goal_body_type_id: goalBodyTypeId,
          started_date: startDate,
        });

      if (goalError) {
        console.error('Error creating goal:', goalError);
        toast.error('Failed to create goal: ' + goalError.message);
        return;
      }

      toast.success('Body type and goal saved successfully!');
      fetchUserBodyType(); // Refresh the data after saving
    } catch (error: any) {
      console.error('Error in save operation:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    selectedBodyType,
    setSelectedBodyType,
    weight,
    setWeight,
    bodyfat,
    setBodyfat,
    isSaving,
    handleBodyTypeSelect,
    handleSaveBodyType
  };
};
