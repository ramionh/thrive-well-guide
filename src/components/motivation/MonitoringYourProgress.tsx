
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface MonitoringYourProgressProps {
  onComplete?: () => void;
}

type RatingOption = "None of the time" | "Some of the time" | "A fair amount of the time" | "Most of the time" | "All of the time";

interface RatingsData {
  consistent: RatingOption;
  setbacks: RatingOption;
  support: RatingOption;
  community: RatingOption;
  coping: RatingOption;
}

const MonitoringYourProgress: React.FC<MonitoringYourProgressProps> = ({ onComplete }) => {
  const { 
    formData, 
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_monitoring_progress",
    initialState: {
      ratings: {
        consistent: "",
        setbacks: "",
        support: "",
        community: "",
        coping: ""
      } as RatingsData,
      working_well: "",
      compliments: ""
    },
    onSuccess: onComplete
  });

  const handleRatingChange = (key: keyof RatingsData, value: RatingOption) => {
    updateForm("ratings", {
      ...formData.ratings,
      [key]: value
    });
  };

  const ratingOptions: RatingOption[] = [
    "None of the time",
    "Some of the time",
    "A fair amount of the time",
    "Most of the time",
    "All of the time"
  ];

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">Monitoring Your Progress</h2>
        
        <div className="space-y-5">
          <p className="text-gray-700 mb-6">
            Keep a record of your progress, preferably checking in at least once a week. Rate yourself here for your efforts so far. You can make a form like this, or use it as a guide to journal your thoughts.
          </p>

          <form onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}>
            <div className="space-y-6">
              <div className="space-y-4">
                {/* Question 1 */}
                <div className="border rounded-md p-4">
                  <p className="font-medium mb-3">1. I have remained consistent in my effort.</p>
                  <RadioGroup 
                    value={formData.ratings?.consistent || ""} 
                    onValueChange={(value) => handleRatingChange("consistent", value as RatingOption)}
                    className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6"
                  >
                    {ratingOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`consistent-${option}`} />
                        <Label htmlFor={`consistent-${option}`} className="text-sm font-normal">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Question 2 */}
                <div className="border rounded-md p-4">
                  <p className="font-medium mb-3">2. I am dealing with setbacks.</p>
                  <RadioGroup 
                    value={formData.ratings?.setbacks || ""} 
                    onValueChange={(value) => handleRatingChange("setbacks", value as RatingOption)}
                    className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6"
                  >
                    {ratingOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`setbacks-${option}`} />
                        <Label htmlFor={`setbacks-${option}`} className="text-sm font-normal">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Question 3 */}
                <div className="border rounded-md p-4">
                  <p className="font-medium mb-3">3. I am accessing my support system.</p>
                  <RadioGroup 
                    value={formData.ratings?.support || ""} 
                    onValueChange={(value) => handleRatingChange("support", value as RatingOption)}
                    className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6"
                  >
                    {ratingOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`support-${option}`} />
                        <Label htmlFor={`support-${option}`} className="text-sm font-normal">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Question 4 */}
                <div className="border rounded-md p-4">
                  <p className="font-medium mb-3">4. I am developing and engaging my community.</p>
                  <RadioGroup 
                    value={formData.ratings?.community || ""} 
                    onValueChange={(value) => handleRatingChange("community", value as RatingOption)}
                    className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6"
                  >
                    {ratingOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`community-${option}`} />
                        <Label htmlFor={`community-${option}`} className="text-sm font-normal">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Question 5 */}
                <div className="border rounded-md p-4">
                  <p className="font-medium mb-3">5. I'm using my coping skills to stay on track.</p>
                  <RadioGroup 
                    value={formData.ratings?.coping || ""} 
                    onValueChange={(value) => handleRatingChange("coping", value as RatingOption)}
                    className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-6"
                  >
                    {ratingOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem value={option} id={`coping-${option}`} />
                        <Label htmlFor={`coping-${option}`} className="text-sm font-normal">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-4">
                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">
                    Reflect on your ratings and how well your plan is working. What has worked well so far?
                  </label>
                  <Textarea
                    value={formData.working_well || ""}
                    onChange={(e) => updateForm("working_well", e.target.value)}
                    className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Write about what's been effective in your plan so far..."
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label className="block text-gray-700 font-medium mb-2">
                    What compliments have you received so far from people who notice your efforts?
                  </label>
                  <Textarea
                    value={formData.compliments || ""}
                    onChange={(e) => updateForm("compliments", e.target.value)}
                    className="w-full p-2 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Describe any positive feedback you've received..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {isSaving ? "Saving..." : "Complete Step"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonitoringYourProgress;
