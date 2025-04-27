import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useThinkingAssertively } from '@/hooks/useThinkingAssertively';

interface ThinkingAssertivelyProps {
  onComplete: () => void;
}

const ThinkingAssertively: React.FC<ThinkingAssertivelyProps> = ({ onComplete }) => {
  const {
    thoughtChallenge,
    setThoughtChallenge,
    boundaryNeeds,
    setBoundaryNeeds,
    boundaryRequest,
    setBoundaryRequest,
    saveThinkingAssertivelyMutation
  } = useThinkingAssertively(onComplete);

  const handleComplete = () => {
    saveThinkingAssertivelyMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <Card className="p-6 bg-purple-50 border-2 border-purple-200">
              <h3 className="text-2xl font-bold mb-4 text-purple-800">Identifying Thought Patterns</h3>
              <p className="mb-4 text-foreground/80">You identified people who may act as obstacles to your success. It's time to reposition them in your life so they are no longer obstacles to your success.</p>
              <p className="mb-4 text-foreground/80">First, explore internal thoughts that might prevent you from setting boundaries with this person:</p>
              <ul className="list-disc pl-6 mb-4 text-foreground/80">
                <li>Do I need this person's approval?</li>
                <li>Do I worry I might hurt their feelings?</li>
                <li>Do I think it would be selfish to ask for what I want?</li>
                <li>Do I believe this person will cause a scene if I set a boundary?</li>
              </ul>
            </Card>
          </CarouselItem>

          <CarouselItem>
            <Card className="p-6 bg-purple-50 border-2 border-purple-200">
              <h3 className="text-2xl font-bold mb-4 text-purple-800">Challenge Your Thoughts</h3>
              <p className="mb-4 text-foreground/80">If you answered yes to one or more of these questions, challenge that thought here:</p>
              <p className="mb-4 text-sm text-muted-foreground">Example: Do I need this person's approval? Yes. I would like this person's approval, but I could live without it.</p>
              <Textarea
                value={thoughtChallenge}
                onChange={(e) => setThoughtChallenge(e.target.value)}
                placeholder="Write your thought challenge here..."
                className="min-h-[150px] bg-white/50 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </Card>
          </CarouselItem>

          <CarouselItem>
            <Card className="p-6 bg-purple-50 border-2 border-purple-200">
              <h3 className="text-2xl font-bold mb-4 text-purple-800">Setting Boundaries</h3>
              <p className="mb-4 text-foreground/80">Setting boundaries with other people may seem intimidating, daunting, or even futile, especially if they haven't been receptive to these conversations in the past. But you deserve to work toward your goal without being derailed by others' judgments or disapproval.</p>
              
              <h4 className="font-medium mb-2 text-primary">What do you need to make clear?</h4>
              <p className="text-sm text-muted-foreground mb-4">Example: I want them not to tease me about trying to quit smoking or tell me I won't succeed. I want my co-workers to say supportive things.</p>
              <Textarea
                value={boundaryNeeds}
                onChange={(e) => setBoundaryNeeds(e.target.value)}
                placeholder="Write what you need to make clear..."
                className="min-h-[100px] mb-4 bg-white/50 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />

              <h4 className="font-medium mb-2 text-primary">Your Boundary Request</h4>
              <p className="text-sm text-muted-foreground mb-4">Focus on your own perceptions and needs, and avoid blaming. Use "I" instead of "you."</p>
              <p className="text-sm text-muted-foreground mb-4">Example: "I need to talk to you about something important. I've decided to quit smoking, and it would help if you didn't tease me about it."</p>
              <Textarea
                value={boundaryRequest}
                onChange={(e) => setBoundaryRequest(e.target.value)}
                placeholder="Write your boundary request..."
                className="min-h-[100px] mb-4 bg-white/50 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />

              <Button 
                onClick={handleComplete}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!thoughtChallenge || !boundaryNeeds || !boundaryRequest}
              >
                Complete Step
              </Button>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="text-purple-600" />
        <CarouselNext className="text-purple-600" />
      </Carousel>
    </div>
  );
};

export default ThinkingAssertively;
