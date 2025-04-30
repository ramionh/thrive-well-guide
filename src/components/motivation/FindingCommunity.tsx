
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface FindingCommunityProps {
  onComplete?: () => void;
}

interface CommunityData {
  online: string;
  local: string;
  interest: string;
  programs: string;
  other: string;
}

const FindingCommunity: React.FC<FindingCommunityProps> = ({ onComplete }) => {
  const [communities, setCommunities] = useState<CommunityData>({
    online: "",
    local: "",
    interest: "",
    programs: "",
    other: ""
  });
  const [appealing, setAppealing] = useState<string>("");
  const [steps, setSteps] = useState<string>("");

  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_finding_community",
    initialState: {
      communities: {
        online: "",
        local: "",
        interest: "",
        programs: "",
        other: ""
      },
      appealing: "",
      steps: ""
    },
    onSuccess: onComplete
  });

  useEffect(() => {
    if (formData) {
      if (formData.communities) {
        setCommunities(formData.communities);
      }
      if (formData.appealing) {
        setAppealing(formData.appealing);
      }
      if (formData.steps) {
        setSteps(formData.steps);
      }
    }
  }, [formData]);

  const handleCommunityChange = (key: keyof CommunityData, value: string) => {
    setCommunities(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm("communities", communities);
    updateForm("appealing", appealing);
    updateForm("steps", steps);
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
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Finding Community</h2>
              
              <p className="text-gray-600 mb-6">
                Groups of people with a common culture, interest, or other factor can be a crucial 
                support system when you're pursuing your fitness goals. Let's brainstorm some possible 
                communities you can explore that are relevant to your goal.
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="online" className="block text-sm font-medium text-gray-700 mb-1">
                      Online support/forums:
                    </label>
                    <Input
                      id="online"
                      value={communities.online}
                      onChange={(e) => handleCommunityChange("online", e.target.value)}
                      className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="local" className="block text-sm font-medium text-gray-700 mb-1">
                      Support groups in your area:
                    </label>
                    <Input
                      id="local"
                      value={communities.local}
                      onChange={(e) => handleCommunityChange("local", e.target.value)}
                      className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
                      Hobby or interest groups:
                    </label>
                    <Input
                      id="interest"
                      value={communities.interest}
                      onChange={(e) => handleCommunityChange("interest", e.target.value)}
                      className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="programs" className="block text-sm font-medium text-gray-700 mb-1">
                      Programs or facilities:
                    </label>
                    <Input
                      id="programs"
                      value={communities.programs}
                      onChange={(e) => handleCommunityChange("programs", e.target.value)}
                      className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="other" className="block text-sm font-medium text-gray-700 mb-1">
                      Other:
                    </label>
                    <Input
                      id="other"
                      value={communities.other}
                      onChange={(e) => handleCommunityChange("other", e.target.value)}
                      className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="appealing" className="block text-sm font-medium text-gray-700 mb-1">
                      Now that you've brainstormed some possible sources of community, which ones are most appealing?
                    </label>
                    <Textarea
                      id="appealing"
                      value={appealing}
                      onChange={(e) => setAppealing(e.target.value)}
                      rows={3}
                      className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="steps" className="block text-sm font-medium text-gray-700 mb-1">
                      What actions or steps do you need to take to connect with these sources of community?
                    </label>
                    <Textarea
                      id="steps"
                      value={steps}
                      onChange={(e) => setSteps(e.target.value)}
                      rows={3}
                      className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
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

export default FindingCommunity;
