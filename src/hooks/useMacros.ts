import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

interface MacrosData {
  id: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  assigned_date: string;
  weight_lbs?: number;
  goal_type?: string;
  activity_level?: string;
}

export const useMacros = () => {
  const [currentMacros, setCurrentMacros] = useState<MacrosData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();

  const fetchCurrentMacros = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('client_macros')
        .select('*')
        .eq('user_id', user.id)
        .order('assigned_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setCurrentMacros(data);
    } catch (error) {
      console.error('Error fetching macros:', error);
      toast.error('Failed to load macros');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMacros = (weight: number, goal: string = 'maintain', activityLevel: string = 'moderate') => {
    let bmr = weight * 10; // Simplified BMR calculation
    
    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    const tdee = bmr * (activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.55);
    
    let calories = Math.round(tdee);
    
    // Adjust based on goal
    switch (goal) {
      case 'lose':
        calories -= 500; // 500 calorie deficit
        break;
      case 'gain':
        calories += 300; // 300 calorie surplus
        break;
      default:
        // maintain weight
        break;
    }

    // Calculate macros (40/30/30 split for protein/carbs/fat)
    const protein = Math.round((calories * 0.4) / 4);
    const carbs = Math.round((calories * 0.3) / 4);
    const fat = Math.round((calories * 0.3) / 9);

    return {
      calories,
      protein,
      carbs,
      fat
    };
  };

  const assignNewMacros = async (weight: number, goal: string = 'maintain', activityLevel: string = 'moderate') => {
    if (!user?.id) return;

    try {
      const macros = calculateMacros(weight, goal, activityLevel);
      
      const { error } = await supabase
        .from('client_macros')
        .insert({
          user_id: user.id,
          calories: macros.calories,
          protein: macros.protein,
          carbs: macros.carbs,
          fat: macros.fat,
          weight_lbs: weight,
          goal_type: goal,
          activity_level: activityLevel
        });

      if (error) throw error;
      
      toast.success('New macros assigned!');
      await fetchCurrentMacros();
    } catch (error) {
      console.error('Error assigning macros:', error);
      toast.error('Failed to assign macros');
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchCurrentMacros();
    }
  }, [user?.id]);

  return {
    currentMacros,
    isLoading,
    fetchCurrentMacros,
    assignNewMacros,
    calculateMacros
  };
};