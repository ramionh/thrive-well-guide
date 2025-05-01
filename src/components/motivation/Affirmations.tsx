
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAffirmationsForm } from "@/hooks/useAffirmationsForm";
import AffirmationForm from "./affirmations/AffirmationForm";
import LoadingState from "./shared/LoadingState";

interface AffirmationsProps {
  onComplete: () => void;
}

const Affirmations: React.FC<AffirmationsProps> = ({ onComplete }) => {
  const { 
    affirmations, 
    isLoading, 
    isSaving, 
    updateAffirmation, 
    saveAffirmations 
  } = useAffirmationsForm(onComplete);

  // Add more detailed debugging
  useEffect(() => {
    console.log("Affirmations component - current affirmations:", affirmations);
    // Display each affirmation separately for easier debugging
    affirmations.forEach((aff, index) => {
      console.log(`Affirmation ${index}:`, JSON.stringify(aff));
    });
  }, [affirmations]);

  return (
    <Card className="bg-white shadow-lg border border-purple-200">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <AffirmationForm
            affirmations={affirmations}
            isSaving={isSaving}
            updateAffirmation={updateAffirmation}
            saveAffirmations={saveAffirmations}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default Affirmations;
