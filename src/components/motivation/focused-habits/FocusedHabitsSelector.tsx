
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useFocusedHabits } from '@/hooks/useFocusedHabits';
import FocusedHabitsIntro from './FocusedHabitsIntro';
import HabitSelectionPanel from './HabitSelectionPanel';

interface FocusedHabitsSelectorProps {
  onComplete?: () => void;
}

const FocusedHabitsSelector = ({ onComplete }: FocusedHabitsSelectorProps) => {
  const {
    allHabits,
    isLoading,
    focusedHabits,
    completionMutation,
    focusHabitMutation
  } = useFocusedHabits(onComplete);

  if (isLoading) {
    return <div className="text-purple-700">Loading habits...</div>;
  }

  return (
    <div className="space-y-8">
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <FocusedHabitsIntro />
          </CarouselItem>

          <CarouselItem>
            <HabitSelectionPanel
              habits={allHabits}
              focusedHabits={focusedHabits}
              onHabitSelect={(habitId) => focusHabitMutation.mutate(habitId)}
              onComplete={() => completionMutation.mutate()}
            />
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="text-purple-600" />
        <CarouselNext className="text-purple-600" />
      </Carousel>
    </div>
  );
};

export default FocusedHabitsSelector;
