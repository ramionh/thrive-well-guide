
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ObstaclesForm from './internal-obstacles/ObstaclesForm';
import ObstaclesIntroContent from './internal-obstacles/ObstaclesIntroContent';
import { useCurrentGoal } from '@/hooks/useCurrentGoal';
import { useInternalObstacles } from '@/hooks/useInternalObstacles';

interface InternalObstaclesProps {
  onComplete?: () => void;
}

const InternalObstacles = ({ onComplete }: InternalObstaclesProps) => {
  const { data: goal } = useCurrentGoal();
  const { 
    excuses, 
    isStepCompleted, 
    handleExcuseChange, 
    saveExcuseMutation 
  } = useInternalObstacles(onComplete);

  return (
    <div className="space-y-8">
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <ObstaclesIntroContent />
          </CarouselItem>

          <CarouselItem>
            <ObstaclesForm
              goal={goal}
              excuses={excuses}
              isStepCompleted={isStepCompleted}
              onExcuseChange={handleExcuseChange}
              onSave={() => saveExcuseMutation.mutate()}
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="text-purple-600" />
        <CarouselNext className="text-purple-600" />
      </Carousel>
    </div>
  );
};

export default InternalObstacles;
