
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
      
      // Try to create a goal using our database function
      // Fix TypeScript error by using any to bypass type checking for the RPC function name
      try {
        // Use type assertion to bypass TypeScript's function name constraint
        await (supabase.rpc as any)('manually_create_body_type_goal', {
          user_id_param: user.id, 
          body_type_id_param: selectedBodyType,
          selected_date_param: startDate
        });
      } catch (goalError: any) {
        console.error('Error creating goal:', goalError);
        // We don't want to show this error to the user as the body type was saved successfully
        // and goal creation is a secondary operation
      }

      toast.success('Body type saved successfully!');
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
