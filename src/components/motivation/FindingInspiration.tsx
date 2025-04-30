
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";
import { LightBulb } from "lucide-react";

interface FindingInspirationProps {
  onComplete?: () => void;
}

const FindingInspiration: React.FC<FindingInspirationProps> = ({ onComplete }) => {
  const { 
    formData, 
    isLoading, 
    isSaving, 
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm({
    tableName: "motivation_finding_inspiration",
    initialState: {
      inspiration_sources: "",
      inspirational_content: ""
    },
    onSuccess: onComplete,
    parseData: (data) => {
      console.log("Raw data from finding inspiration:", data);
      return {
        inspiration_sources: typeof data.inspiration_sources === 'string' ? data.inspiration_sources : "",
        inspirational_content: typeof data.inspirational_content === 'string' ? data.inspirational_content : ""
      };
    }
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <Card className="bg-white shadow-lg border border-purple-200">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <LightBulb className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-purple-800">Finding Inspiration</h2>
            </div>
            
            <p className="text-gray-700">
              Inspiration is a means of instilling hope and optimism. Where can you find inspiration? Who inspires you?
            </p>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="inspiration_sources" className="block text-sm font-medium text-purple-700">
                  Where can you find inspiration? Who inspires you?
                </label>
                <Textarea
                  id="inspiration_sources"
                  value={formData.inspiration_sources}
                  onChange={(e) => updateForm("inspiration_sources", e.target.value)}
                  className="min-h-[100px] border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Enter your sources of inspiration..."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="inspirational_content" className="block text-sm font-medium text-purple-700">
                  What are some quotes and images that inspire you to work toward your goal? 
                  Write them here or create a vision board.
                </label>
                <Textarea
                  id="inspirational_content"
                  value={formData.inspirational_content}
                  onChange={(e) => updateForm("inspirational_content", e.target.value)}
                  className="min-h-[100px] border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Write inspirational quotes and describe images here..."
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSaving ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default FindingInspiration;
