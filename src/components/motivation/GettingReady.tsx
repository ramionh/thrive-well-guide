
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
              Let's play devil's advocate. Imagine you're sitting across from the part of you that isn't interested in changing your fitness habits. 
              What would you say to convince yourself that you should work on the change?
            </p>
            
            <div>
              <label htmlFor="self-persuasion" className="block text-sm font-medium text-purple-700 mb-2">
                Self-persuasion
              </label>
              <Textarea
                id="self-persuasion"
                rows={7}
                value={formData.self_persuasion}
                onChange={(e) => updateForm("self_persuasion", e.target.value)}
                className="w-full rounded-md border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
                placeholder="Write your self-persuasion arguments here..."
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
