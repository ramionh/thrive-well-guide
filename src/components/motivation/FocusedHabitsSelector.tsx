import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { Habit } from '@/types/habit';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const FocusedHabitsSelector = () => {
  const { user } = useUser();
  const { toast } = useToast();

  // Fetch available habits
  const { data: allHabits, isLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('habit_number');
      
      if (error) throw error;
      
      // Randomly select 8 habits
      const habits = data as Habit[];
      const shuffled = [...habits].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 8);
    }
  });

  // Fetch current focused habits
  const { data: focusedHabits, refetch: refetchFocusedHabits } = useQuery({
    queryKey: ['focused-habits', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('focused_habits')
        .select('habit_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data?.map(item => item.habit_id) || [];
    },
    enabled: !!user
  });

  // Add completion mutation
  const completionMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;

      const { error } = await supabase
        .from('motivation_steps_progress')
        .upsert({
          user_id: user.id,
          step_number: 2,
          step_name: 'Focus Habits',
          completed: true,
          completed_at: new Date().toISOString()
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Step completed",
        description: "Your progress has been saved"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive"
      });
    }
  });

  // Mutation to add/remove focused habits
  const focusHabitMutation = useMutation({
    mutationFn: async (habitId: string) => {
      if (!user) return;

      // Check if habit is already focused
      const isCurrentlyFocused = focusedHabits?.includes(habitId);

      if (isCurrentlyFocused) {
        // Remove focused habit
        const { error } = await supabase
          .from('focused_habits')
          .delete()
          .eq('user_id', user.id)
          .eq('habit_id', habitId);
        
        if (error) throw error;
      } else {
        // Check if already have 2 focused habits
        if (focusedHabits && focusedHabits.length >= 2) {
          toast({
            title: "Limit Reached",
            description: "You can only focus on 2 habits at a time.",
            variant: "destructive"
          });
          return;
        }

        // Add focused habit
        const { error } = await supabase
          .from('focused_habits')
          .insert({
            user_id: user.id,
            habit_id: habitId
          });
        
        if (error) throw error;
      }

      // Refetch focused habits
      refetchFocusedHabits();
    },
    onSuccess: () => {
      toast({
        title: "Habits Updated",
        description: "Your focused habits have been updated."
      });
    }
  });

  const handleHabitSelect = (habitId: string) => {
    focusHabitMutation.mutate(habitId);
  };

  if (isLoading) {
    return <div>Loading habits...</div>;
  }

  return (
    <div className="space-y-8">
      <Carousel className="w-full">
        <CarouselContent>
          {/* Introduction Screen */}
          <CarouselItem>
            <Card className="p-6 bg-purple-50 border-purple-200">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">Focusing</h2>
              <div className="prose max-w-none">
                <p className="mb-4">
                  Now that you're thinking about your goal and potential obstacles, you may
                  have noticed that some (or maybe all) of those hindrances are your own
                  thoughts and actions. The greatest barrier to change is often that we can't
                  seem to get out of our own way.
                </p>
                <p className="mb-4">
                  People suffering from weight-related health issues know their eating habits and inactivity contribute
                  to the problem, but many of us still find it difficult to change. Here are some
                  important questions to consider:
                </p>
                <p className="font-semibold text-purple-700">
                  How big is the gap or disparity between your current actions and your
                  ultimate goal?
                </p>
              </div>
            </Card>
          </CarouselItem>

          {/* Emotions Screen */}
          <CarouselItem>
            <Card className="p-6 bg-purple-50 border-purple-200">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">Understanding Emotions</h2>
              <div className="prose max-w-none">
                <p className="mb-4 text-purple-900">
                  You may be feeling a bit overwhelmed or even hopeless. These negative
                  emotions do not inspire change. If simply being miserable led to successful
                  change, nobody would need a book about motivation. But being
                  uncomfortable is a step in the right direction.
                </p>
                <p className="text-purple-900">
                  Dwelling on what we're doing wrong, however, won't get us to the finish line.
                </p>
              </div>
            </Card>
          </CarouselItem>

          {/* Habit Selection Screen */}
          <CarouselItem>
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">What are my concerns?</h2>
              <div className="prose mb-6">
                <p className="mb-4">
                  You might have a general idea that you need to change one aspect of
                  your fitness but are unsure what the change should be. You
                  don't have to address all the following topics, as we have plenty of
                  time to narrow things down later.
                </p>
                <p className="font-semibold mb-6">
                  Pick one or two core habits to focus on:
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {allHabits?.map((habit) => (
                  <Card 
                    key={habit.id} 
                    className={`p-4 cursor-pointer transition-all 
                      ${focusedHabits?.includes(habit.id) 
                        ? 'border-2 border-green-500 bg-green-50' 
                        : 'hover:bg-gray-100'
                      }`}
                    onClick={() => focusHabitMutation.mutate(habit.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{habit.name}</h3>
                        <p className="text-sm text-gray-500">{habit.description}</p>
                      </div>
                      {focusedHabits?.includes(habit.id) && (
                        <CheckCircle className="text-green-500" />
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              <Button 
                onClick={() => completionMutation.mutate()}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-6"
              >
                Complete This Step
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

export default FocusedHabitsSelector;
