
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingState from "./shared/LoadingState";
import ExampleSection from "./social-cultural/ExampleSection";
import SocialCulturalForm from "./social-cultural/SocialCulturalForm";
import { useSocialCulturalResources } from "./social-cultural/useSocialCulturalResources";

interface SocialCulturalResourcesProps {
  onComplete: () => void;
}

const SocialCulturalResources: React.FC<SocialCulturalResourcesProps> = ({ onComplete }) => {
  const { formData, isLoading, isSubmitting, updateForm, handleSubmit } = useSocialCulturalResources(onComplete);

  return (
    <Card className="bg-white shadow-md">
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-xl font-semibold text-purple-800">Social and Cultural Resources</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <p className="mb-6 text-gray-700">
          A culture is a group of people who have a shared set of values, beliefs, and traditions. You might think of 
          ethnicity or race as the foundation of a culture, but you may be a member of many other cultural groups. 
          These include communities based around religion, gender, sexual orientation, or geography, as well as social 
          groups that embrace the same arts and philosophy, such as fitness enthusiasts or the running community.
        </p>
        
        <p className="mb-6 text-gray-700">
          For this exercise, focus on one culture you're a member of. For each aspect of culture listed, 
          describe the belief or custom and how it might support your goal.
        </p>

        <ExampleSection />

        {isLoading ? (
          <LoadingState />
        ) : (
          <SocialCulturalForm
            formData={formData}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            updateForm={updateForm}
            handleSubmit={handleSubmit}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SocialCulturalResources;
