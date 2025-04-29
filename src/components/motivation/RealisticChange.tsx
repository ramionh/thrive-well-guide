
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface RealisticChangeProps {
  onComplete: () => void;
}

const RealisticChange: React.FC<RealisticChangeProps> = ({ onComplete }) => {
  const {
    formData,
    isLoading,
    isSaving,
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm<{
    realistic_change: string;
  }>({
    tableName: "motivation_realistic_change",
    initialState: {
      realistic_change: ""
    },
    onSuccess: onComplete
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
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

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="realistic-change" className="block text-sm font-medium text-purple-700 mb-2">
            Realistic change assessment
          </label>
          <Textarea
            id="realistic-change"
            rows={4}
            value={formData.realistic_change || ""}
            onChange={(e) => updateForm("realistic_change", e.target.value)}
            className="w-full rounded-md border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
            placeholder="Describe a realistic version of your goal..."
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSaving || !formData.realistic_change?.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSaving ? "Saving..." : "Complete Step"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RealisticChange;
