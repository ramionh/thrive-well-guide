
import React from 'react';
import { useFixMotivationSteps } from '@/hooks/motivation/useFixMotivationSteps';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const FixMotivationSteps: React.FC = () => {
  const { fixAllProblematicSteps, isFixing } = useFixMotivationSteps();

  return (
    <Card className="shadow-lg border border-amber-200">
      <CardHeader className="bg-amber-50">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-amber-500" />
          <CardTitle className="text-amber-800">Motivation Steps Fix Utility</CardTitle>
        </div>
        <CardDescription className="text-amber-700">
          Use this utility to fix completion status for motivation steps that are not being properly marked as completed
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="text-gray-700 space-y-2">
          <p>This utility will check and fix the following problematic steps:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Defining Importance</li>
            <li>Taking Another Step Toward Change</li>
            <li>Values Conflict</li>
            <li>Identifying Your Type of Stress</li>
            <li>Coping Mechanisms</li>
          </ul>
        </div>
        
        <div className="flex justify-center pt-2">
          <Button 
            onClick={fixAllProblematicSteps}
            disabled={isFixing}
            className="bg-amber-600 hover:bg-amber-700 text-white"
            size="lg"
          >
            {isFixing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
                Fixing Steps...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Fix All Problematic Steps
              </span>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FixMotivationSteps;
