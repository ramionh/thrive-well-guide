
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface GettingReadyProps {
  onComplete: () => void;
}

const GettingReady: React.FC<GettingReadyProps> = ({ onComplete }) => {
  const {
    formData,
    isLoading,
    isSaving,
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm<{
    self_persuasion: string;
  }>({
    tableName: "motivation_getting_ready",
    initialState: {
      self_persuasion: ""
    },
    onSuccess: onComplete,
    parseData: (data) => {
      return {
        self_persuasion: data?.self_persuasion || ""
      };
    }
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
    <Card className="border-none shadow-none">
      <CardContent className="px-0">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <p className="text-gray-700">
              Getting ready for change involves persuading yourself about why this change is important to you.
              Take a moment to reflect on your motivations and write a brief self-persuasion statement below.
            </p>
            
            <p className="text-md text-purple-600 italic">
              For example: "I'm ready to make this change because improving my fitness will give me more energy for activities 
              I enjoy with my family. This is important to me because quality time with loved ones brings me the most joy in life."
            </p>
            
            <div>
              <label htmlFor="self-persuasion" className="block text-sm font-medium text-purple-700 mb-2">
                Your self-persuasion statement
              </label>
              <Textarea
                id="self-persuasion"
                rows={6}
                value={formData.self_persuasion}
                onChange={(e) => updateForm("self_persuasion", e.target.value)}
                className="w-full rounded-md border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                placeholder="I'm ready to make this change because..."
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSaving || !formData.self_persuasion?.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSaving ? "Saving..." : "Complete Step"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default GettingReady;
