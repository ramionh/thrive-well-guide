
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useBodyTypeSelection = (user: any, fetchUserBodyType: () => void) => {
  const [selectedBodyType, setSelectedBodyType] = useState<string | null>(null);
  const [weight, setWeight] = useState<number | ''>('');
  const [bodyfat, setBodyfat] = useState<number | ''>('');
  const [height, setHeight] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const handleBodyTypeSelect = (bodyTypeId: string) => {
    setSelectedBodyType(bodyTypeId);
  };

  const handleSaveBodyType = async () => {
    console.log('=== SAVE BUTTON CLICKED ===');
    console.log('selectedBodyType:', selectedBodyType);
    console.log('weight:', weight);
    console.log('height:', height);
    console.log('bodyfat:', bodyfat);
    console.log('user:', user);
    if (!selectedBodyType || !user) {
      toast.error('Please select a body type');
      return;
    }

    if (!weight || weight < 50 || weight > 1000) {
      toast.error('Please enter a valid weight between 50 and 1000 lbs');
      return;
    }

    if (!height) {
      toast.error('Please select your height');
      return;
    }

    if (bodyfat !== '' && (bodyfat < 1 || bodyfat > 100)) {
      toast.error('Body fat percentage must be between 1% and 100%');
      return;
    }

    setIsSaving(true);

    try {
      const startDate = new Date().toISOString().split('T')[0];
      
      console.log('=== ATTEMPTING TO SAVE TO DATABASE ===');
      // Save user body type
      const insertData = {
        user_id: user.id,
        body_type_id: selectedBodyType,
        selected_date: startDate,
        weight_lbs: weight,
        bodyfat_percentage: bodyfat || null,
        height_inches: height
      };
      console.log('Insert data:', insertData);
      
      const { data, error: bodyTypeError } = await supabase
        .from('user_body_types')
        .insert(insertData)
        .select();

      console.log('Database response:', { data, error: bodyTypeError });

      if (bodyTypeError) {
        console.error('Error saving body type:', bodyTypeError);
        toast.error('Failed to save body type: ' + bodyTypeError.message);
        return;
      }
      
      console.log('=== BODY TYPE SAVED SUCCESSFULLY ===');
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
    height,
    setHeight,
    isSaving,
    handleBodyTypeSelect,
    handleSaveBodyType
  };
};
