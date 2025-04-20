
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
      
      console.log('Saving body type for user:', user.id);
      
      // First save the user body type
      const { data: insertedData, error: bodyTypeError } = await supabase
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
        
        if (bodyTypeError.code === '42501') {
          toast.error('Permission denied. Make sure you are logged in and have the necessary permissions.');
        } else if (bodyTypeError.code === '23505') {
          toast.error('You have already selected this body type today.');
        } else {
          toast.error(`Failed to save body type: ${bodyTypeError.message}`);
        }
        return;
      }

      console.log('Body type saved successfully:', insertedData);
      
      // Try to directly check if the goal was created
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (goalsError) {
        console.error('Error checking for goal creation:', goalsError);
      } else if (goalsData && goalsData.length > 0) {
        console.log('Goal created automatically:', goalsData[0]);
      } else {
        console.warn('No goal was created automatically. The database trigger might not be working.');
        
        // Attempt to manually create a goal if the trigger failed
        const { error: manualGoalError } = await supabase.rpc('manually_create_body_type_goal', {
          user_id_param: user.id,
          body_type_id_param: selectedBodyType,
          selected_date_param: startDate
        });
        
        if (manualGoalError) {
          console.error('Error manually creating goal:', manualGoalError);
          toast.error('Could not create a goal automatically. Please try again later.');
        } else {
          console.log('Goal created manually as fallback');
        }
      }

      toast.success('Body type saved successfully');
      fetchUserBodyType();

    } catch (error) {
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
