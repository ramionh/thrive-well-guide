import React, { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useClarifyingValues } from '@/hooks/useClarifyingValues';
import { Loader2 } from 'lucide-react';

interface ClarifyingValuesProps {
  onComplete: () => void;
}

const ClarifyingValues: React.FC<ClarifyingValuesProps> = ({ onComplete }) => {
  const {
    selectedValue1,
    setSelectedValue1,
    selectedValue2,
    setSelectedValue2,
    reasonsAlignment,
    setReasonsAlignment,
    goalValueAlignment,
    setGoalValueAlignment,
    saveClarifyingValuesMutation,
    exploringValues = [],
    pros = []
  } = useClarifyingValues(onComplete);

  useEffect(() => {
    console.log("Exploring Values in component:", exploringValues);
    console.log("Pros in component:", pros);
  }, [exploringValues, pros]);

  const isLoading = false;

  const handleComplete = () => {
    saveClarifyingValuesMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <Card className="p-6 bg-purple-50 border-2 border-purple-200">
              <h3 className="text-2xl font-bold mb-4 text-purple-800">Select Your Core Values</h3>
              <p className="mb-4 text-foreground/80">
                Take a look at your value list from 'Exploring Values'. Choose your top two values.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-purple-800 text-sm font-medium mb-2">Value 1</label>
                  <select 
                    value={selectedValue1}
                    onChange={(e) => setSelectedValue1(e.target.value)}
                    className="w-full p-2 border rounded-md bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  >
                    <option value="">Select a value</option>
                    {Array.isArray(exploringValues) && exploringValues.map((value: string) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-purple-800 text-sm font-medium mb-2">Value 2</label>
                  <select 
                    value={selectedValue2}
                    onChange={(e) => setSelectedValue2(e.target.value)}
                    className="w-full p-2 border rounded-md bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                  >
                    <option value="">Select a value</option>
                    {Array.isArray(exploringValues) && exploringValues.map((value: string) => (
                      <option key={value} value={value}>{value}</option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          </CarouselItem>

          <CarouselItem>
            <Card className="p-6 bg-purple-50 border-2 border-purple-200">
              <h3 className="text-2xl font-bold mb-4 text-purple-800">Align Your Values</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Your Top Reasons for Change:</h4>
                  <ul className="list-disc pl-5 mb-4">
                    {Array.isArray(pros) && pros.map((pro: { text: string }) => (
                      <li key={pro.text} className="mb-1">{pro.text}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Which reasons most closely align with these values and why?
                  </label>
                  <Textarea
                    value={reasonsAlignment}
                    onChange={(e) => setReasonsAlignment(e.target.value)}
                    className="min-h-[100px] bg-white/90"
                    placeholder="Explain how your reasons align with your chosen values..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    How will working toward your goal help you better live by these values?
                  </label>
                  <Textarea
                    value={goalValueAlignment}
                    onChange={(e) => setGoalValueAlignment(e.target.value)}
                    className="min-h-[100px] bg-white/90"
                    placeholder="Describe how your goal supports your values..."
                  />
                </div>

                <Button 
                  onClick={handleComplete}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!selectedValue1 || !selectedValue2 || !reasonsAlignment || !goalValueAlignment}
                >
                  Complete Step
                </Button>
              </div>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="text-purple-600" />
        <CarouselNext className="text-purple-600" />
      </Carousel>
    </div>
  );
};

export default ClarifyingValues;
