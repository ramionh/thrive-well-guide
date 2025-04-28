
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface FindingInspirationProps {
  onComplete?: () => void;
}

const FindingInspiration: React.FC<FindingInspirationProps> = ({ onComplete }) => {
  const { 
    formData, 
    isLoading, 
    isSubmitting, 
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm({
    tableName: "motivation_finding_inspiration",
    initialState: {
      inspiration_sources: "",
      inspirational_content: ""
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm(e, onComplete);
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Finding Inspiration</h2>
              <p className="text-gray-600 mb-6">
                Inspiration is a means of instilling hope and optimism. Where can you find inspiration? Who inspires you?
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="inspiration_sources" className="block text-sm font-medium text-gray-700">
                  Where can you find inspiration? Who inspires you?
                </label>
                <Textarea
                  id="inspiration_sources"
                  value={formData.inspiration_sources}
                  onChange={(e) => updateForm("inspiration_sources", e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Enter your sources of inspiration..."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="inspirational_content" className="block text-sm font-medium text-gray-700">
                  What are some quotes and images that inspire you to work toward your goal? 
                  Write them here or create a vision board.
                </label>
                <Textarea
                  id="inspirational_content"
                  value={formData.inspirational_content}
                  onChange={(e) => updateForm("inspirational_content", e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Write inspirational quotes and describe images here..."
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default FindingInspiration;
