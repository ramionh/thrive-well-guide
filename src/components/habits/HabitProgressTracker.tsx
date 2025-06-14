
import React from "react";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Lock } from "lucide-react";

interface HabitProgressStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'locked' | 'available';
  progress?: number;
}

interface HabitProgressTrackerProps {
  steps: HabitProgressStep[];
  currentStepId: string;
}

const HabitProgressTracker: React.FC<HabitProgressTrackerProps> = ({ steps, currentStepId }) => {
  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);
  const overallProgress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="bg-white border rounded-lg p-6 mb-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">Your Habit Journey Progress</h3>
          <span className="text-sm text-muted-foreground">
            Step {currentStepIndex + 1} of {steps.length}
          </span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              step.id === currentStepId 
                ? 'bg-blue-50 border border-blue-200' 
                : step.status === 'completed' 
                ? 'bg-green-50' 
                : 'bg-gray-50'
            }`}
          >
            <div className="flex-shrink-0">
              {step.status === 'completed' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : step.status === 'current' ? (
                <Clock className="h-5 w-5 text-blue-600" />
              ) : step.status === 'locked' ? (
                <Lock className="h-5 w-5 text-gray-400" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
              )}
            </div>
            <div className="flex-1">
              <h4 className={`font-medium ${
                step.status === 'locked' ? 'text-gray-500' : 'text-gray-900'
              }`}>
                {step.title}
              </h4>
              <p className={`text-sm ${
                step.status === 'locked' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {step.description}
              </p>
              {step.progress !== undefined && step.status === 'current' && (
                <Progress value={step.progress} className="mt-2 h-1" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitProgressTracker;
