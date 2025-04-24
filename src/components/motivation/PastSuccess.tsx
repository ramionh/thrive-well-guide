
import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { usePastSuccess } from '@/hooks/usePastSuccess';

interface PastSuccessProps {
  onComplete?: () => void;
}

const PastSuccess: React.FC<PastSuccessProps> = ({ onComplete }) => {
  const { formData, setFormData, savePastSuccessMutation } = usePastSuccess(onComplete);

  const handleSave = () => {
    if (Object.values(formData).every(value => value.trim() !== '')) {
      savePastSuccessMutation.mutate();
    }
  };

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Think of one fairly big change you have already made. It doesn't have to be a recent change or the biggest change. It might be the change that was hardest to achieve.
                </label>
                <Textarea
                  value={formData.big_change}
                  onChange={(e) => setFormData(prev => ({ ...prev, big_change: e.target.value }))}
                  placeholder="Write your response here..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  What was going on in your life at the time?
                </label>
                <Textarea
                  value={formData.life_context}
                  onChange={(e) => setFormData(prev => ({ ...prev, life_context: e.target.value }))}
                  placeholder="Describe the context..."
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Did you achieve the change all at once or did you take small steps?
                </label>
                <Textarea
                  value={formData.change_approach}
                  onChange={(e) => setFormData(prev => ({ ...prev, change_approach: e.target.value }))}
                  placeholder="Describe your approach..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  What were some of the steps?
                </label>
                <Textarea
                  value={formData.change_steps}
                  onChange={(e) => setFormData(prev => ({ ...prev, change_steps: e.target.value }))}
                  placeholder="List the steps..."
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  How do you feel about the change today?
                </label>
                <Textarea
                  value={formData.current_feelings}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_feelings: e.target.value }))}
                  placeholder="Share your feelings..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  How can this past success help you achieve your new goal or goals?
                </label>
                <Textarea
                  value={formData.help_achieve_goals}
                  onChange={(e) => setFormData(prev => ({ ...prev, help_achieve_goals: e.target.value }))}
                  placeholder="Share your thoughts..."
                  className="min-h-[200px]"
                />
              </div>

              <Button
                onClick={handleSave}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={savePastSuccessMutation.isPending || Object.values(formData).some(value => !value.trim())}
              >
                Complete Step
              </Button>
            </div>
          </Card>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default PastSuccess;
