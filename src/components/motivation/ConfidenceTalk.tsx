
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useConfidenceTalk } from "@/hooks/useConfidenceTalk";
import ConfidenceTalkEntry from "./ConfidenceTalkEntry";

interface ConfidenceTalkProps {
  onComplete?: () => void;
}

const ConfidenceTalk: React.FC<ConfidenceTalkProps> = ({ onComplete }) => {
  const {
    isLoading,
    isSubmitting,
    confidenceTalk,
    examples,
    handleEntryChange,
    handleSubmit
  } = useConfidenceTalk();

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <form onSubmit={(e) => handleSubmit(e, onComplete)} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Building Confidence—Confidence Talk</h2>
              <p className="text-gray-600 mb-6">
                Remember when you listed some of your unhelpful thoughts and created positive self-talk 
                to counteract them? Let's do that again, focusing on unhelpful thoughts around 
                your confidence to make the change.
              </p>
            </div>

            <div className="border border-purple-100 rounded-lg overflow-hidden">
              <div className="grid grid-cols-2 border-b border-purple-100 bg-purple-50">
                <div className="p-4 font-semibold text-purple-800 border-r border-purple-100">
                  UNHELPFUL (LACK OF CONFIDENCE) THOUGHTS
                </div>
                <div className="p-4 font-semibold text-purple-800">
                  (BUILDING HELPFUL CONFIDENCE) THOUGHTS
                </div>
              </div>

              {/* Example rows */}
              {examples.map((example, index) => (
                <ConfidenceTalkEntry
                  key={`example-${index}`}
                  entry={example}
                  index={index}
                  isExample={true}
                />
              ))}

              {/* User input rows */}
              {confidenceTalk.map((entry, index) => (
                <ConfidenceTalkEntry
                  key={index}
                  entry={entry}
                  index={index}
                  onChange={handleEntryChange}
                />
              ))}
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

export default ConfidenceTalk;
