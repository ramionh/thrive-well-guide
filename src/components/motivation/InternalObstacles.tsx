
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface InternalObstaclesProps {
  onComplete?: () => void;
}

const InternalObstacles = ({ onComplete }: InternalObstaclesProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [excuses, setExcuses] = useState<string[]>(Array(5).fill(''));
  const [isStepCompleted, setIsStepCompleted] = useState(false);

  const { data: goal } = useQuery({
    queryKey: ['current-goal', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('goals')
        .select('*, current_body_type:current_body_type_id(name), goal_body_type:goal_body_type_id(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: savedExcuses } = useQuery({
    queryKey: ['internal-obstacles', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('internal_obstacles')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  // Use the useEffect hook to update the excuses state when savedExcuses is loaded
  useEffect(() => {
    if (savedExcuses && savedExcuses.length > 0) {
      const excusesList = savedExcuses.map(e => e.excuse);
      // Fill the remaining slots with empty strings if fewer than 5 excuses
      const filledExcuses = [...excusesList, ...Array(5 - excusesList.length).fill('')].slice(0, 5);
      setExcuses(filledExcuses);
    }
  }, [savedExcuses]);

  const saveExcuseMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;

      // Delete existing excuses
      await supabase
        .from('internal_obstacles')
        .delete()
        .eq('user_id', user.id);

      // Insert new excuses
      const { error } = await supabase
        .from('internal_obstacles')
        .insert(
          excuses
            .filter(excuse => excuse.trim() !== '')
            .map(excuse => ({
              user_id: user.id,
              excuse
            }))
        );

      if (error) throw error;

      // Use upsert instead of insert for step progress to handle existing records
      const { error: progressError } = await supabase
        .from('motivation_steps_progress')
        .upsert(
          {
            user_id: user.id,
            step_number: 3,
            step_name: 'Internal Obstacles',
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
        description: "Your internal obstacles have been recorded"
      });
      setIsStepCompleted(true);
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

  const handleExcuseChange = (index: number, value: string) => {
    const newExcuses = [...excuses];
    newExcuses[index] = value;
    setExcuses(newExcuses);
  };

  return (
    <div className="space-y-8">
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <Card className="p-6 bg-purple-50 border-purple-200">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">INTERNAL OBSTACLES (THE VOICE IN YOUR HEAD)</h2>
              <div className="prose max-w-none">
                <p className="mb-4 text-purple-900">
                  Internal obstacles are thoughts, beliefs, fears, and other barriers that can keep you from reaching, 
                  or sometimes even attempting to reach, your goals. People often describe this as "the voice in your head" 
                  that comes up with reasons, rationalizations, or excuses to self-sabotage or avoid taking action.
                </p>
                <p className="mb-4 text-purple-900">
                  For many people, if you tried and failed to change in the past, you may now have strong feelings of 
                  apprehension or fear about trying again. These emotions may lead you to question your self-worth and 
                  can lead to strong negative self-talk.
                </p>
                <div className="space-y-2 mb-4 text-purple-800">
                  <p>→ "I'd like to get fit, but I've failed so many times before. I'm just not athletic."</p>
                  <p>→ "I don't have it in me to work out that hard."</p>
                  <p>→ "I can always start my fitness routine next month."</p>
                  <p>→ "I don't think I can deal with the lifestyle changes this will cause me and my family."</p>
                  <p>→ "I have too much going on to focus on getting in shape right now."</p>
                </div>
              </div>
            </Card>
          </CarouselItem>

          <CarouselItem>
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Let's take a look at the negative messages relating to your goal.</h2>
              
              {goal && (
                <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                  <p className="font-semibold">Your Goal:</p>
                  <p>Transform from {goal.current_body_type?.name || 'Current'} to {goal.goal_body_type?.name || 'Goal'}</p>
                </div>
              )}

              <p className="mb-6 text-lg">
                As you look at your goal, think of up to five reasons, rationalizations, 
                or excuses for not taking action and write them below.
              </p>

              <div className="space-y-4">
                {excuses.map((excuse, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`excuse-${index}`}>Excuse {index + 1}</Label>
                    <Input
                      id={`excuse-${index}`}
                      value={excuse}
                      onChange={(e) => handleExcuseChange(index, e.target.value)}
                      placeholder={`Enter excuse ${index + 1}`}
                    />
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => saveExcuseMutation.mutate()}
                className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isStepCompleted}
              >
                {isStepCompleted ? "Completed" : "Complete This Step"}
              </Button>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default InternalObstacles;
