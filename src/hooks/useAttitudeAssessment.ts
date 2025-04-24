
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

export const useAttitudeAssessment = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [selectedAttitude, setSelectedAttitude] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>('');

  // Add effect to fetch saved attitude data when component loads
  useEffect(() => {
    const fetchSavedAttitude = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('motivation_attitude')
        .select('attitude_rating, explanation')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })  // Get the most recent entry
        .limit(1)  // Only get one record
        .maybeSingle();  // Use maybeSingle to prevent errors if no record exists
      
      if (error) {
        console.error('Error fetching attitude data:', error);
        return;
      }
      
      if (data) {
        console.log('Fetched attitude data:', data);
        setSelectedAttitude(data.attitude_rating);
        setExplanation(data.explanation || '');
      }
    };
    
    fetchSavedAttitude();
  }, [user]);

  const saveAttitudeMutation = useMutation({
    mutationFn: async (data: { attitude_rating: string; explanation: string }) => {
      if (!user) return;

      // Delete any existing attitude records for this user before inserting a new one
      const { error: deleteError } = await supabase
        .from('motivation_attitude')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Error deleting existing attitude record:', deleteError);
        throw deleteError;
      }

      // Insert the new attitude record
      const { error: insertError } = await supabase
        .from('motivation_attitude')
        .insert({
          user_id: user.id,
          attitude_rating: data.attitude_rating,
          explanation: data.explanation,
        });

      if (insertError) throw insertError;

      // Update motivation steps progress
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
    selectedAttitude,
    setSelectedAttitude,
    explanation,
    setExplanation,
    saveAttitudeMutation
  };
};
