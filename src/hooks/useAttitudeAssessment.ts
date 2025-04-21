
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

export const useAttitudeAssessment = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();

  const saveAttitudeMutation = useMutation({
    mutationFn: async (data: { attitude_rating: string; explanation: string }) => {
      if (!user) return;

      // First, insert the attitude assessment
      const { error: attitudeError } = await supabase
        .from('motivation_attitude' as any)  // Using 'as any' to bypass type checking for now
        .insert({
          user_id: user.id,
          attitude_rating: data.attitude_rating,
          explanation: data.explanation,
        });

      if (attitudeError) throw attitudeError;

      // Then, mark the step as completed
      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 4,
            step_name: 'Attitude Check',
            completed: true,
            completed_at: new Date().toISOString()
          },
          { onConflict: 'user_id,step_number' }
        );

      if (progressError) throw progressError;
    },
    onSuccess: () => {
      toast({
        title: "Progress saved",
        description: "Your attitude assessment has been recorded"
      });
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      console.error('Error saving progress:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress",
        variant: "destructive"
      });
    }
  });

  return {
    saveAttitudeMutation
  };
};
