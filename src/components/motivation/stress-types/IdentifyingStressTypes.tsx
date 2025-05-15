
import React, { FormEvent } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ActivitySquare } from 'lucide-react';
import LoadingState from '../shared/LoadingState';
import StressTypeExplanation from './StressTypeExplanation';
import StressTypeTable from './StressTypeTable';
import { useStressTypes } from '@/hooks/useStressTypes';

interface IdentifyingStressTypesProps {
  onComplete?: () => void;
}

const IdentifyingStressTypes: React.FC<IdentifyingStressTypesProps> = ({ onComplete }) => {
  const {
    stressTypes,
    isLoadingStressors,
    isSubmitting,
    handleStressorChange,
    handleTypeChange,
    handleSubmit
  } = useStressTypes({
    onComplete
  });

  if (isLoadingStressors) {
    return <LoadingState />;
  }

  return (
    <Card className="bg-white shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <ActivitySquare className="h-8 w-8 text-purple-600" />
          <h2 className="text-2xl font-semibold text-purple-800">Identifying Stress Types</h2>
        </div>
        
        <div className="mb-8 space-y-6">
          <p className="text-gray-700">
            Not all stress is bad. Understanding what type of stress you're experiencing 
            can help you respond more effectively. Review your stressors and identify 
            which type of stress they represent.
          </p>
          
          <StressTypeExplanation />
        </div>
        
        <form onSubmit={(e: FormEvent) => handleSubmit(e)} className="space-y-6">
          <StressTypeTable 
            stressTypes={stressTypes}
            onStressorChange={handleStressorChange}
            onTypeChange={handleTypeChange}
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

export default IdentifyingStressTypes;
