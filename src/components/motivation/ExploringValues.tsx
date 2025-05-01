
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useExploringValues } from '@/hooks/useExploringValues';
import { Loader2 } from 'lucide-react';

interface ExploringValuesProps {
  onComplete: () => void;
}

const VALUES_LIST = [
  'ACHIEVEMENT', 'FREEDOM', 'PROVIDING', 'CARING', 'FRIENDSHIP', 'PEACE', 
  'CHALLENGE', 'GRATITUDE', 'RESPONSIBILITY', 'COMMITMENT', 'GROWTH', 
  'SELF-ACCEPTANCE', 'CREATIVITY', 'HEALTH', 'TOLERANCE', 'DUTY', 
  'HOPE', 'TRADITION', 'EXCITEMENT', 'HUMOR', 'FAMILY', 'INTEGRITY', 
  'FITNESS', 'KNOWLEDGE', 'FORGIVENESS', 'LOVE'
];

const ExploringValues: React.FC<ExploringValuesProps> = ({ onComplete }) => {
  const {
    selectedValues,
    setSelectedValues,
    valueDescriptions,
    setValueDescriptions,
    saveExploringValuesMutation,
    isLoading
  } = useExploringValues(onComplete);

  useEffect(() => {
    console.log("Selected values in component:", selectedValues);
    console.log("Value descriptions in component:", valueDescriptions);
  }, [selectedValues, valueDescriptions]);

  const handleValueToggle = (value: string) => {
    setSelectedValues(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const handleValueDescriptionChange = (value: string, description: string) => {
    setValueDescriptions(prev => ({
      ...prev,
      [value]: description
    }));
  };

  const handleComplete = () => {
    saveExploringValuesMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
        <span className="ml-2">Loading values...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Carousel className="w-full">
        <CarouselContent>
          <CarouselItem>
            <Card className="p-6 bg-white shadow-lg border border-purple-200">
              <h3 className="text-2xl font-bold mb-4 text-purple-800">Understanding Your Values</h3>
              <p className="text-purple-700">
                Your values help guide your decisions and actions. Identifying and
                prioritizing your values will help you understand why your goal is
                important to you. Values can include honesty, family, charity, integrity,
                and faith.
              </p>
            </Card>
          </CarouselItem>

          <CarouselItem>
            <Card className="p-6 bg-white shadow-lg border border-purple-200">
              <h3 className="text-2xl font-bold mb-4 text-purple-800">Select Your Core Values</h3>
              <p className="mb-4 text-purple-700">
                Circle those values that are most important to you. You decide how to define 
                the meaning of each value.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {VALUES_LIST.map(value => (
                  <button
                    key={value}
                    onClick={() => handleValueToggle(value)}
                    className={`p-2 rounded-lg text-sm text-center transition-all duration-200 hover:scale-105 
                      ${selectedValues.includes(value) 
                        ? 'bg-purple-600 text-white shadow-lg transform scale-105' 
                        : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </Card>
          </CarouselItem>

          <CarouselItem>
            <Card className="p-6 bg-white shadow-lg border border-purple-200">
              <h3 className="text-2xl font-bold mb-4 text-purple-800">Describe Your Values</h3>
              <p className="mb-4 text-purple-700">
                From the values you selected, describe what each means to you.
              </p>
              <div className="space-y-4">
                {selectedValues.map(value => (
                  <div key={value}>
                    <label className="block text-purple-800 font-medium mb-2">{value}</label>
                    <Textarea
                      value={valueDescriptions[value] || ''}
                      onChange={(e) => handleValueDescriptionChange(value, e.target.value)}
                      placeholder={`What does ${value} mean to you? Describe its importance...`}
                      className="min-h-[100px] bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                    />
                  </div>
                ))}
              </div>
              <Button 
                onClick={handleComplete}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                disabled={selectedValues.length === 0 || 
                  selectedValues.some(value => !valueDescriptions[value])}
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

export default ExploringValues;
