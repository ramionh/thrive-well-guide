import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Target, Lightbulb, Save, Play, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Habit } from '@/types/habit';

interface HabitSystemData {
  id: string;
  habit_id: string;
  obstacles_barriers: any; // JSON array from database
  low_friction_strategies: any;
  root_cause_solutions: any;
  current_week: number;
  implementation_plan: any;
  completed_phases: any;
  custom_notes: string | null;
  system_adjustments: any;
  is_active: boolean;
  success_metrics: any;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface HabitSystemProps {
  habit: Habit;
  systemData?: HabitSystemData;
  onSave: (data: Partial<HabitSystemData>) => void;
}

const HabitSystem: React.FC<HabitSystemProps> = ({ habit, systemData, onSave }) => {
  const [customNotes, setCustomNotes] = useState(systemData?.custom_notes || '');
  const [currentWeek, setCurrentWeek] = useState(systemData?.current_week || 1);
  
  const progress = ((currentWeek - 1) / 6) * 100;

  const handleSaveNotes = () => {
    onSave({ custom_notes: customNotes });
  };

  const handleAdvanceWeek = () => {
    const newWeek = Math.min(currentWeek + 1, 7);
    setCurrentWeek(newWeek);
    onSave({ current_week: newWeek });
  };

  const defaultObstacles = [
    'Lack of time in busy schedule',
    'Low energy levels after work',
    'Unexpected disruptions and commitments',
    'Loss of motivation during challenging periods',
    'Environmental factors not supporting the habit'
  ];

  const weeklyPlans = [
    { week: 1, title: 'Foundation Building', description: 'Establish minimum viable routine' },
    { week: 2, title: 'Consistency Focus', description: 'Build daily momentum with small wins' },
    { week: 3, title: 'Obstacle Planning', description: 'Add backup plans for common obstacles' },
    { week: 4, title: 'Environment Design', description: 'Optimize your environment and triggers' },
    { week: 5, title: 'System Integration', description: 'Connect with other habits and routines' },
    { week: 6, title: 'Scaling Up', description: 'Increase intensity and complexity' },
    { week: 7, title: 'Mastery & Maintenance', description: 'Long-term sustainability strategies' }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle>{habit.name}</CardTitle>
          </div>
          <Badge variant={systemData?.is_active ? 'default' : 'secondary'}>
            {systemData?.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{habit.description}</p>
        
        {/* Progress Section */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Implementation Progress</span>
            <span className="text-sm text-muted-foreground">Week {currentWeek} of 7</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Week Focus */}
        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Play className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-sm">Current Focus: Week {currentWeek}</h4>
          </div>
          {weeklyPlans[currentWeek - 1] && (
            <div>
              <p className="font-medium text-sm">{weeklyPlans[currentWeek - 1].title}</p>
              <p className="text-sm text-muted-foreground">{weeklyPlans[currentWeek - 1].description}</p>
            </div>
          )}
          {currentWeek < 7 && (
            <Button onClick={handleAdvanceWeek} size="sm" className="mt-3">
              <ChevronRight className="h-4 w-4 mr-1" />
              Advance to Week {currentWeek + 1}
            </Button>
          )}
        </div>

        {/* Principle 1: Think Holistically */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <h4 className="font-semibold text-sm">Potential Obstacles & Barriers</h4>
          </div>
          <div className="space-y-2 text-sm">
            {((Array.isArray(systemData?.obstacles_barriers) ? systemData.obstacles_barriers : defaultObstacles) as string[]).map((obstacle, index) => (
              <p key={index}>• {obstacle}</p>
            ))}
          </div>
        </div>

        <Separator />

        {/* Principle 2: Build for Repeatability */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <h4 className="font-semibold text-sm">Low-Friction Strategies</h4>
          </div>
          <div className="space-y-3">
            <div>
              <Badge variant="outline" className="mb-2">Best Day Plan</Badge>
              <p className="text-sm text-muted-foreground">
                When energy is high: Follow your ideal routine with full commitment
              </p>
            </div>
            <div>
              <Badge variant="outline" className="mb-2">Worst Day Plan</Badge>
              <p className="text-sm text-muted-foreground">
                When exhausted/busy: Minimum viable action (2-minute rule)
              </p>
            </div>
            <div>
              <Badge variant="outline" className="mb-2">If-Then Scenarios</Badge>
              <p className="text-sm text-muted-foreground">
                If [trigger situation] → Then [specific backup action]
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Principle 3: Peel the Band-Aid */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-blue-500" />
            <h4 className="font-semibold text-sm">Root Cause Solutions</h4>
          </div>
          <div className="space-y-3">
            <div>
              <Badge variant="secondary" className="mb-2">Temporary Fixes</Badge>
              <p className="text-sm text-muted-foreground">
                Quick wins to build momentum while addressing deeper issues
              </p>
            </div>
            <div>
              <Badge variant="secondary" className="mb-2">Long-term Changes</Badge>
              <p className="text-sm text-muted-foreground">
                Environment design, identity shifts, and system improvements
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Implementation Plan */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-3">7-Week Implementation Plan</h4>
          <div className="space-y-2">
            {weeklyPlans.map((plan, index) => (
              <div 
                key={plan.week} 
                className={`flex items-center gap-3 p-2 rounded ${
                  plan.week === currentWeek 
                    ? 'bg-primary/20 border border-primary/30' 
                    : plan.week < currentWeek 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-background border border-border'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
                  plan.week < currentWeek 
                    ? 'bg-green-500 text-white' 
                    : plan.week === currentWeek 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                }`}>
                  {plan.week < currentWeek ? '✓' : plan.week}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{plan.title}</p>
                  <p className="text-xs text-muted-foreground">{plan.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Notes Section */}
        <div>
          <h4 className="font-semibold text-sm mb-2">Your Notes & Adjustments</h4>
          <Textarea
            value={customNotes}
            onChange={(e) => setCustomNotes(e.target.value)}
            placeholder="Add your personal insights, adjustments, or observations about this habit system..."
            className="min-h-[100px]"
          />
          <Button onClick={handleSaveNotes} size="sm" className="mt-2">
            <Save className="h-4 w-4 mr-1" />
            Save Notes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const HabitCircle: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: focusedHabitsData, isLoading } = useQuery({
    queryKey: ['focused-habits-with-details', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Get focused habit IDs
      const { data: focusedData, error: focusedError } = await supabase
        .from('focused_habits')
        .select('habit_id')
        .eq('user_id', user.id);
      
      if (focusedError) throw focusedError;
      
      if (!focusedData || focusedData.length === 0) {
        return [];
      }
      
      // Get habit details
      const habitIds = focusedData.map(item => item.habit_id);
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select('*')
        .in('id', habitIds);
      
      if (habitsError) throw habitsError;
      
      return habitsData || [];
    },
    enabled: !!user
  });

  const { data: habitSystemsData } = useQuery({
    queryKey: ['habit-systems', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('habit_systems')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user
  });

  const saveSystemMutation = useMutation({
    mutationFn: async ({ habitId, data }: { habitId: string; data: Partial<HabitSystemData> }) => {
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('habit_systems')
        .upsert({
          user_id: user.id,
          habit_id: habitId,
          ...data
        }, {
          onConflict: 'user_id,habit_id'
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "System Updated",
        description: "Your habit system has been saved successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['habit-systems'] });
    },
    onError: (error) => {
      console.error('Error saving habit system:', error);
      toast({
        title: "Error",
        description: "Failed to save your habit system. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSaveSystem = (habitId: string) => (data: Partial<HabitSystemData>) => {
    saveSystemMutation.mutate({ habitId, data });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading your habit systems...</div>
      </div>
    );
  }

  if (!focusedHabitsData || focusedHabitsData.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Focused Habits Selected</h3>
            <p className="text-muted-foreground mb-4">
              You need to select your focused habits before we can create your habit-forming systems.
            </p>
            <p className="text-sm text-muted-foreground">
              Visit the Motivation section to choose your 2 focused habits.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Habit Circle</h1>
        <p className="text-muted-foreground">
          Systematic approaches to building your focused habits based on proven principles
        </p>
      </div>

      <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
        <h3 className="font-semibold mb-2">System Building Principles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium">1. Think Holistically:</span> Anticipate obstacles and plan for failures
          </div>
          <div>
            <span className="font-medium">2. Build for Repeatability:</span> Minimize friction and willpower dependence
          </div>
          <div>
            <span className="font-medium">3. Peel the Band-Aid:</span> Address root causes, not just symptoms
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {focusedHabitsData.map((habit) => {
          const systemData = habitSystemsData?.find(system => system.habit_id === habit.id);
          return (
            <HabitSystem 
              key={habit.id} 
              habit={habit} 
              systemData={systemData}
              onSave={handleSaveSystem(habit.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HabitCircle;