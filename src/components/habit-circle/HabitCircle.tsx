import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertCircle, Target, Lightbulb } from 'lucide-react';
import { Habit } from '@/types/habit';

interface HabitSystemProps {
  habit: Habit;
}

const HabitSystem: React.FC<HabitSystemProps> = ({ habit }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          {habit.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{habit.description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Principle 1: Think Holistically */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <h4 className="font-semibold text-sm">Potential Obstacles & Barriers</h4>
          </div>
          <div className="space-y-2 text-sm">
            <p>• Lack of time in busy schedule</p>
            <p>• Low energy levels after work</p>
            <p>• Unexpected disruptions and commitments</p>
            <p>• Loss of motivation during challenging periods</p>
            <p>• Environmental factors not supporting the habit</p>
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

        {/* Action Plan */}
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Your System Implementation</h4>
          <div className="space-y-2 text-sm">
            <p>1. <strong>Week 1-2:</strong> Establish minimum viable routine</p>
            <p>2. <strong>Week 3-4:</strong> Add backup plans for common obstacles</p>
            <p>3. <strong>Week 5-6:</strong> Optimize environment and triggers</p>
            <p>4. <strong>Week 7+:</strong> Scale up and integrate advanced strategies</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const HabitCircle: React.FC = () => {
  const { user } = useUser();

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
        {focusedHabitsData.map((habit) => (
          <HabitSystem key={habit.id} habit={habit} />
        ))}
      </div>
    </div>
  );
};

export default HabitCircle;