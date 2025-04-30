
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import { ScaleIcon } from "lucide-react";
import LoadingState from "./shared/LoadingState";

interface RealisticChangeProps {
  onComplete: () => void;
}

const RealisticChange: React.FC<RealisticChangeProps> = ({ onComplete }) => {
  const initialState = {
    realisticChange: ""
  };

  const {
    formData,
    isLoading,
    isSaving,
    updateForm,
    submitForm
  } = useMotivationForm({
    tableName: "motivation_realistic_change",
    initialState,
    onSuccess: onComplete,
    transformData: (data) => {
      return {
        realistic_change: data.realisticChange
      };
    },
    parseData: (data) => {
      console.log("Raw data from Realistic Change:", data);
      return {
        realisticChange: data.realistic_change || ""
      };
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="px-0">
        <div className="flex items-center gap-3 mb-4">
          <ScaleIcon className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-purple-800">Realistic Change</h2>
        </div>

        <div className="space-y-4">
          <p className="text-lg text-purple-800">
            You've explored the ideal, your dream goal. Given all your strengths, resources, values,
            and coping skills, is the change you're envisioning realistic? If not, what is realistic?
            In other words, how would you revise the goal so it feels attainable?
          </p>
          <p className="text-md text-purple-600 italic">
            "I was hoping to lose 30 pounds in 2 months, but that's not very realistic or healthy. After
            researching healthy weight loss, I'll focus on losing 10-12 pounds in 2 months instead, which
            is a more sustainable pace."
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div>
            <label htmlFor="realistic-change" className="block text-sm font-medium text-purple-700 mb-2">
              Realistic change assessment
            </label>
            <Textarea
              id="realistic-change"
              rows={4}
              value={formData.realisticChange}
              onChange={(e) => updateForm("realisticChange", e.target.value)}
              className="w-full rounded-md border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
              placeholder="Describe a realistic version of your goal..."
              disabled={isSaving}
            />
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSaving ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RealisticChange;
