
import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ui/use-toast';
import LoadingState from '../shared/LoadingState';
import { Activity } from 'lucide-react';
import RatingScaleDescription from './RatingScaleDescription';
import StressRatingTable from './StressRatingTable';

interface HowStressedAmIProps {
  onComplete?: () => void;
}

interface StressRating {
  situation: string;
  rating: number;
}

const HowStressedAmI: React.FC<HowStressedAmIProps> = ({ onComplete }) => {
  const [ratings, setRatings] = useState<StressRating[]>([
    { situation: "", rating: 5 },
    { situation: "", rating: 5 },
    { situation: "", rating: 5 },
    { situation: "", rating: 5 },
    { situation: "", rating: 5 }
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();
  const didInitialFetch = useRef(false);

  useEffect(() => {
    const fetchRatings = async () => {
      if (!user || didInitialFetch.current) return;
      
      setIsLoading(true);
      didInitialFetch.current = true;
      
      try {
        const { data, error } = await supabase
          .from('motivation_stress_ratings')
          .select('stress_ratings')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data && Array.isArray(data.stress_ratings)) {
          // Convert to proper StressRating type
          const fetchedRatings: StressRating[] = (data.stress_ratings as any[]).map(rating => ({
            situation: rating.situation || "",
            rating: rating.rating || 5
          }));
          
          // Ensure we have exactly 5 entries
          let updatedRatings = [...fetchedRatings];
          while (updatedRatings.length < 5) {
            updatedRatings.push({ situation: "", rating: 5 });
          }
          
          setRatings(updatedRatings.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching stress ratings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your stress ratings. Please try again later.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRatings();
  }, [user, toast]);
  
  const handleSituationChange = (index: number, value: string) => {
    const newRatings = [...ratings];
    newRatings[index] = { 
      ...newRatings[index], 
      situation: value 
    };
    setRatings(newRatings);
  };
  
  const handleRatingChange = (index: number, value: number) => {
    const newRatings = [...ratings];
    newRatings[index] = { 
      ...newRatings[index], 
      rating: value 
    };
    setRatings(newRatings);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save ratings',
        variant: 'destructive'
      });
      return;
    }
    
    // Filter out empty situations
    const validRatings = ratings.filter(rating => rating.situation.trim() !== '');
    
    if (validRatings.length === 0) {
      toast({
        title: 'No situations entered',
        description: 'Please enter at least one stressful situation',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Check if a record already exists
      const { data: existingData, error: queryError } = await supabase
        .from('motivation_stress_ratings')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (queryError && queryError.code !== 'PGRST116') throw queryError;
      
      let result;
      
      // Convert to JSON compatible format
      const jsonRatings = validRatings.map(rating => ({
        situation: rating.situation,
        rating: rating.rating
      }));
      
      if (existingData?.id) {
        // Update existing record
        result = await supabase
          .from('motivation_stress_ratings')
          .update({
            stress_ratings: jsonRatings,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
      } else {
        // Insert new record
        result = await supabase
          .from('motivation_stress_ratings')
          .insert({
            user_id: user.id,
            stress_ratings: jsonRatings,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
      
      if (result.error) throw result.error;
      
      // Update progress
      await logStepProgress();
      
      toast({
        title: 'Success',
        description: 'Your stress ratings have been saved'
      });
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error saving stress ratings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your stress ratings',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const logStepProgress = async () => {
    if (!user) return;
    
    try {
      // Mark current step as completed
      await supabase
        .from('motivation_steps_progress')
        .upsert({
          user_id: user.id,
          step_number: 52,
          step_name: 'How Stressed Am I',
          completed: true,
          available: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,step_number'
        });
      
      // Make next step available
      await supabase
        .from('motivation_steps_progress')
        .upsert({
          user_id: user.id,
          step_number: 53,
          step_name: 'Identifying Stress Types',
          completed: false,
          available: true,
          completed_at: null
        }, {
          onConflict: 'user_id,step_number'
        });
    } catch (err) {
      console.error('Failed to log step progress:', err);
    }
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="h-8 w-8 text-purple-600" />
          <h2 className="text-2xl font-semibold text-purple-800">How Stressed Am I?</h2>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-700 mb-6">
            Rate the following situations from 1 (not stressful at all) to 10 (extremely stressful).
            You can add your own situations or use the ones provided.
          </p>
          
          <RatingScaleDescription />
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <StressRatingTable 
            ratings={ratings}
            onSituationChange={handleSituationChange}
            onRatingChange={handleRatingChange}
          />
          
          <Button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSaving ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HowStressedAmI;
