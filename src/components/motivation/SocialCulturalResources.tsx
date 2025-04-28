
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";

interface SocialCulturalResourcesProps {
  onComplete: () => void;
}

const SocialCulturalResources: React.FC<SocialCulturalResourcesProps> = ({ onComplete }) => {
  const initialState = {
    culturalBeliefs: "",
    culturalCustoms: "",
    religiousBeliefs: ""
  };

  const { formData, updateForm, submitForm, isLoading } = useMotivationForm({
    tableName: "motivation_social_cultural_resources",
    initialState,
    onSuccess: onComplete,
    transformData: (data) => {
      return {
        cultural_beliefs: data.culturalBeliefs,
        cultural_customs: data.culturalCustoms,
        religious_beliefs: data.religiousBeliefs
      };
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-bold text-purple-800">Social and Cultural Resources</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <p className="mb-6 text-gray-600">
          A culture is a group of people who have a shared set of values, beliefs, and traditions. You might think of 
          ethnicity or race as the foundation of a culture, but you may be a member of many other cultural groups. 
          These include communities based around religion, gender, sexual orientation, or geography, as well as social 
          groups that embrace the same arts and philosophy, such as fitness enthusiasts or the running community.
        </p>
        
        <p className="mb-6 text-gray-600">
          For this exercise, focus on one culture you're a member of. For each aspect of culture listed, 
          describe the belief or custom and how it might support your goal.
        </p>

        <div className="bg-purple-50 p-4 rounded-md mb-6">
          <p className="text-gray-700 italic">
            In this example, the goal is to exercise more regularly and build strength.
          </p>
          
          <p className="text-gray-700 italic mt-2">
            <strong>Cultural beliefs:</strong> My culture believes it's important to stay active throughout life. 
            This will help me prioritize fitness as a lifestyle, not just a temporary fix.
          </p>
          
          <p className="text-gray-700 italic mt-2">
            <strong>Cultural customs:</strong> We regularly participate in community sports and activities. 
            If I join a local fitness class, it would align with our cultural emphasis on group physical activities.
          </p>
          
          <p className="text-gray-700 italic mt-2">
            <strong>Religious beliefs:</strong> My faith teaches me that the body is a temple. 
            This can help me view exercise as a form of self-care and respect for my physical health.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="culturalBeliefs" className="text-purple-600">Cultural beliefs:</Label>
            <Textarea 
              id="culturalBeliefs"
              value={formData.culturalBeliefs}
              onChange={(e) => updateForm("culturalBeliefs", e.target.value)}
              className="mt-1"
              rows={4}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="culturalCustoms" className="text-purple-600">Cultural customs:</Label>
            <Textarea 
              id="culturalCustoms"
              value={formData.culturalCustoms}
              onChange={(e) => updateForm("culturalCustoms", e.target.value)}
              className="mt-1"
              rows={4}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="religiousBeliefs" className="text-purple-600">Religious beliefs:</Label>
            <Textarea 
              id="religiousBeliefs"
              value={formData.religiousBeliefs}
              onChange={(e) => updateForm("religiousBeliefs", e.target.value)}
              className="mt-1"
              rows={4}
              disabled={isLoading}
            />
          </div>
          
          <p className="text-gray-600 italic">
            It can be hard to see a culture from the inside. If you are struggling with this section, try asking others 
            how they might define their cultural groups and the accompanying beliefs, values, customs, and traditions. 
            This might give you some ideas to work with.
          </p>

          <Button 
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SocialCulturalResources;
