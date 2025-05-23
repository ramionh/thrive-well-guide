
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

export const useKnowledge = (onComplete?: () => void) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [knowledgeQuestions, setKnowledgeQuestions] = useState<string[]>(Array(5).fill(''));
  
  // Add effect to fetch saved questions when component loads
  useEffect(() => {
    const fetchSavedQuestions = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('motivation_knowledge')
        .select('question')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching knowledge questions:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // Fill the questions array with existing data
        const savedQuestions = data.map(item => item.question);
        // Make sure we always have 5 slots (add empty strings if needed)
        const updatedQuestions = [...savedQuestions, ...Array(5 - savedQuestions.length).fill('')].slice(0, 5);
        setKnowledgeQuestions(updatedQuestions);
      }
    };
    
    fetchSavedQuestions();
  }, [user]);

  const saveKnowledgeMutation = useMutation({
    mutationFn: async (questions: string[]) => {
      if (!user) return;

      // Delete existing knowledge questions first
      await supabase
        .from('motivation_knowledge')
        .delete()
        .eq('user_id', user.id);

      // Insert new knowledge questions
      const { error } = await supabase
        .from('motivation_knowledge')
        .insert(
          questions
            .filter(q => q.trim() !== '')
            .map(question => ({
              user_id: user.id,
              question
            }))
        );

      if (error) throw error;

      // Use upsert with explicit onConflict
      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 6,
            step_name: 'Knowledge',
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
        description: "Your knowledge questions have been recorded"
      });
      if (onComplete) {
        onComplete();
      }
    },
    onError: (error) => {
      console.error('Error saving knowledge questions:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress",
        variant: "destructive"
      });
    }
  });

  const handleQuestionsChange = (index: number, value: string) => {
    const updatedQuestions = [...knowledgeQuestions];
    updatedQuestions[index] = value;
    setKnowledgeQuestions(updatedQuestions);
  };

  return {
    knowledgeQuestions,
    handleQuestionsChange,
    saveKnowledgeMutation
  };
};
