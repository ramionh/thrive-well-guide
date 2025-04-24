
import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useExternalObstacles } from "@/hooks/useExternalObstacles";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ExternalObstaclesProps {
  onComplete?: () => void;
}

const ExternalObstacles: React.FC<ExternalObstaclesProps> = ({ onComplete }) => {
  const {
    obstacle,
    setObstacle,
    solutions,
    setSolutions,
    solution1,
    setSolution1,
    solution1Attitude,
    setSolution1Attitude,
    solution2,
    setSolution2,
    solution2Attitude,
    setSolution2Attitude,
    saveExternalObstaclesMutation
  } = useExternalObstacles(onComplete);

  const handleSolutionChange = (index: number, value: string) => {
    const newSolutions = [...solutions];
    newSolutions[index] = value;
    setSolutions(newSolutions);
  };

  const handleSave = () => {
    saveExternalObstaclesMutation.mutate();
  };

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <CarouselItem>
          <Card className="p-6 border-2 border-purple-300">
            <h2 className="text-2xl font-bold mb-4 text-purple-800">External Obstacles</h2>
            <div className="prose mb-6">
              <p className="text-purple-900/80 leading-relaxed">
                Although some obstacles may not be within your power to control or change, 
                you can address others through creative problem-solving. Identify one 
                external obstacle you could potentially resolve.
              </p>
              <p className="mt-4 text-sm text-gray-600">
                Example: I don't have time to exercise with my busy work schedule.
              </p>
            </div>
            <Textarea
              value={obstacle}
              onChange={(e) => setObstacle(e.target.value)}
              placeholder="Describe your external obstacle"
              className="w-full"
            />
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Brainstorm Solutions</h2>
            <div className="prose mb-6">
              <p>
                Now brainstorm potential solutions. Search for ideas on the internet 
                or ask someone who might have relevant knowledge to give you some tips.
              </p>
              <p className="mt-4 text-sm text-gray-600">
                Example: 
                → Wake up 30 minutes earlier to fit in a quick morning workout.
                → Break exercise into three 10-minute sessions throughout the day.
              </p>
            </div>
            <div className="space-y-4">
              {[0, 1].map((index) => (
                <Textarea
                  key={index}
                  value={solutions[index] || ''}
                  onChange={(e) => handleSolutionChange(index, e.target.value)}
                  placeholder={`Possible solution ${index + 1}`}
                  className="w-full"
                />
              ))}
            </div>
          </Card>
        </CarouselItem>

        <CarouselItem>
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Solution Analysis</h2>
            <div className="prose mb-6">
              <p>
                Cross out the solution that feels least appealing or least likely to work. 
                Then, assess your attitude toward each possible solution.
              </p>
            </div>
            <div className="space-y-6">
              <div>
                <Textarea
                  value={solution1}
                  onChange={(e) => setSolution1(e.target.value)}
                  placeholder="Solution #1"
                  className="w-full mb-4"
                />
                <Select 
                  value={solution1Attitude}
                  onValueChange={setSolution1Attitude}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your attitude towards this solution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="negative">Negative: I am not likely to put this solution into action</SelectItem>
                    <SelectItem value="somewhat_negative">Somewhat Negative: I might not try this solution</SelectItem>
                    <SelectItem value="neutral">Neutral: I have a lot of mixed feelings about this solution</SelectItem>
                    <SelectItem value="somewhat_positive">Somewhat Positive: I might try this solution</SelectItem>
                    <SelectItem value="positive">Positive: I would like to try this solution</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Textarea
                  value={solution2}
                  onChange={(e) => setSolution2(e.target.value)}
                  placeholder="Solution #2"
                  className="w-full mb-4"
                />
                <Select 
                  value={solution2Attitude}
                  onValueChange={setSolution2Attitude}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your attitude towards this solution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="negative">Negative: I am not likely to put this solution into action</SelectItem>
                    <SelectItem value="somewhat_negative">Somewhat Negative: I might not try this solution</SelectItem>
                    <SelectItem value="neutral">Neutral: I have a lot of mixed feelings about this solution</SelectItem>
                    <SelectItem value="somewhat_positive">Somewhat Positive: I might try this solution</SelectItem>
                    <SelectItem value="positive">Positive: I would like to try this solution</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleSave}
              disabled={saveExternalObstaclesMutation.isPending}
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
  );
};

export default ExternalObstacles;
