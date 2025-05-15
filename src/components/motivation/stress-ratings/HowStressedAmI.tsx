
import React, { FormEvent, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStressRatings } from '@/hooks/useStressRatings';
import LoadingState from '../shared/LoadingState';
import RatingScaleDescription from './RatingScaleDescription';
import StressRatingTable from './StressRatingTable';
import { ActivitySquare } from 'lucide-react';

interface HowStressedAmIProps {
  onComplete?: () => void;
}

const HowStressedAmI: React.FC<HowStressedAmIProps> = ({ onComplete }) => {
  const didInitialFetch = useRef(false);
  const {
    stressRatings,
    isLoading,
    isSubmitting,
    handleRatingChange,
    handleExplanationChange,
    handleSubmit
  } = useStressRatings({
    onComplete
  });

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <ActivitySquare className="h-8 w-8 text-purple-600" />
          <h2 className="text-2xl font-semibold text-purple-800">How Stressed Am I?</h2>
        </div>
        
        <div className="mb-8 space-y-6">
          <p className="text-gray-700">
            An important part of managing stress is recognizing it. On a scale from 1-10, 
            how stressed do you feel in these different areas of your life?
          </p>
          
          <RatingScaleDescription />
        </div>
        
        <form onSubmit={(e: FormEvent) => handleSubmit(e)} className="space-y-6">
          <StressRatingTable 
            stressRatings={stressRatings}
            onRatingChange={handleRatingChange}
            onExplanationChange={handleExplanationChange}
          />
          
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSubmitting ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default HowStressedAmI;
