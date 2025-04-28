
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGrowthMindset } from "@/hooks/useGrowthMindset";
import { Brain } from "lucide-react";
import LoadingState from "./shared/LoadingState";

interface GrowthMindsetProps {
  onComplete?: () => void;
}

const GrowthMindset: React.FC<GrowthMindsetProps> = ({ onComplete }) => {
  const {
    formData,
    isLoading,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  } = useGrowthMindset(onComplete);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <p className="flex items-start">
          <Brain className="mr-2 h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
          <span>
            Psychologist Carol Dweck has found that people embrace one of two ways of thinking about themselves. 
            A person with a fixed mindset believes their gifts and talents are fixed and set. This can make it 
            difficult to change. A person with a growth mindset, however, considers possibilities for improvement 
            and gain. A growth mindset is, naturally, associated with more success in achieving fitness goals.
          </span>
        </p>
        
        <p>
          Mindset isn't something you're born with. You can develop a growth mindset by learning to see yourself 
          and your world differently. If you commit to believing you can learn, change, and grow no matter what 
          has happened in the past, you can achieve a growth mindset.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-purple-800">
              Brainstorm some ways to approach life with more of a growth mindset.
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="learning" className="block text-sm font-medium text-purple-700 mb-1">
                  I can learn ________.
                </Label>
                <Input
                  id="learning"
                  value={formData.learning}
                  onChange={(e) => handleInputChange("learning", e.target.value)}
                  placeholder="What can you learn to support your goals?"
                  className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              
              <div>
                <Label htmlFor="feedback" className="block text-sm font-medium text-purple-700 mb-1">
                  I can take constructive feedback on ________ to help me improve and be successful in achieving my goal.
                </Label>
                <Input
                  id="feedback"
                  value={formData.feedback}
                  onChange={(e) => handleInputChange("feedback", e.target.value)}
                  placeholder="What area could you be open to feedback about?"
                  className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              
              <div>
                <Label htmlFor="challenges" className="block text-sm font-medium text-purple-700 mb-1">
                  My obstacles to change are challenges I can face by ________.
                </Label>
                <Input
                  id="challenges"
                  value={formData.challenges}
                  onChange={(e) => handleInputChange("challenges", e.target.value)}
                  placeholder="How can you approach your challenges?"
                  className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              
              <div>
                <Label htmlFor="newThings" className="block text-sm font-medium text-purple-700 mb-1">
                  I'm willing to learn new things like ________.
                </Label>
                <Input
                  id="newThings"
                  value={formData.newThings}
                  onChange={(e) => handleInputChange("newThings", e.target.value)}
                  placeholder="What new things are you open to learning?"
                  className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSubmitting ? "Saving..." : "Complete Step"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GrowthMindset;
