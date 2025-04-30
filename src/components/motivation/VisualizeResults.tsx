
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface VisualizeResultsProps {
  onComplete?: () => void;
}

const VisualizeResults: React.FC<VisualizeResultsProps> = ({ onComplete }) => {
  const [threeMonths, setThreeMonths] = useState<string>("");
  const [sixMonths, setSixMonths] = useState<string>("");
  const [oneYear, setOneYear] = useState<string>("");

  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_visualize_results",
    initialState: {
      three_months: "",
      six_months: "",
      one_year: ""
    },
    onSuccess: onComplete
  });

  useEffect(() => {
    if (formData) {
      if (formData.three_months) {
        setThreeMonths(formData.three_months);
      }
      if (formData.six_months) {
        setSixMonths(formData.six_months);
      }
      if (formData.one_year) {
        setOneYear(formData.one_year);
      }
    }
  }, [formData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm("three_months", threeMonths);
    updateForm("six_months", sixMonths);
    updateForm("one_year", oneYear);
    submitForm();
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Visualize Results</h2>
              
              <p className="text-gray-600 mb-6">
                As you look at your Action Plan and timeline, what will your change look and feel like along the way?
              </p>

              <div className="space-y-5">
                <div>
                  <label htmlFor="threeMonths" className="block text-sm font-medium text-gray-700 mb-1">
                    Imagine yourself three months from now.
                  </label>
                  <Textarea
                    id="threeMonths"
                    value={threeMonths}
                    onChange={(e) => setThreeMonths(e.target.value)}
                    rows={4}
                    className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <p className="mt-2 text-sm text-gray-500 italic">
                    "I see myself sticking with my planned workout routine of strength training three times per week and cardio twice a week. 
                    I've lost about 7-8 pounds and my endurance has increased noticeably. My clothes are starting to fit better, 
                    and I'm sleeping more soundly at night."
                  </p>
                </div>
                
                <div>
                  <label htmlFor="sixMonths" className="block text-sm font-medium text-gray-700 mb-1">
                    Imagine yourself six months from now.
                  </label>
                  <Textarea
                    id="sixMonths"
                    value={sixMonths}
                    onChange={(e) => setSixMonths(e.target.value)}
                    rows={4}
                    className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <p className="mt-2 text-sm text-gray-500 italic">
                    "I'm consistently making healthy food choices and have developed a good balance between my workout schedule and rest days. 
                    I've lost about 15 pounds total and have reached my initial weight goal. I'm feeling more energetic throughout the day 
                    and have started participating in weekend hiking groups."
                  </p>
                </div>
                
                <div>
                  <label htmlFor="oneYear" className="block text-sm font-medium text-gray-700 mb-1">
                    Imagine yourself a year from now.
                  </label>
                  <Textarea
                    id="oneYear"
                    value={oneYear}
                    onChange={(e) => setOneYear(e.target.value)}
                    rows={4}
                    className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <p className="mt-2 text-sm text-gray-500 italic">
                    "I've maintained my weight loss and have developed muscle definition I never had before. 
                    Exercise has become a natural part of my lifestyle that I genuinely enjoy rather than something I have to force myself to do. 
                    I'm starting to train for my first 10K race and have made several new friends through my fitness activities."
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSaving ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default VisualizeResults;
