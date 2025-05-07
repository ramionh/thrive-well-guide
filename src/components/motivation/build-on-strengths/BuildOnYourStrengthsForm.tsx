
import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BuildOnYourStrengthsFormProps } from './types';

const BuildOnYourStrengthsForm: React.FC<BuildOnYourStrengthsFormProps> = ({
  strengthApplications,
  handleStrengthChange,
  handleApplicationChange,
  handleSubmit,
  isSaving
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {strengthApplications.map((application, index) => (
          <div key={index} className="p-4 bg-purple-50 rounded-lg space-y-4">
            <div>
              <Label htmlFor={`strength-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                Strength {index + 1}
              </Label>
              <Input
                id={`strength-${index}`}
                value={application.strength}
                onChange={(e) => handleStrengthChange(index, e.target.value)}
                className="border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter a strength from the previous step"
              />
            </div>

            <div>
              <Label htmlFor={`application-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                How it can help:
              </Label>
              <Textarea
                id={`application-${index}`}
                value={application.application}
                onChange={(e) => handleApplicationChange(index, e.target.value)}
                className="min-h-[80px] border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                placeholder="Explain how this strength can help you work toward your goal..."
              />
            </div>
          </div>
        ))}
      </div>

      <Button
        type="submit"
        disabled={isSaving}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        {isSaving ? "Saving..." : "Complete Step"}
      </Button>
    </form>
  );
};

export default BuildOnYourStrengthsForm;
