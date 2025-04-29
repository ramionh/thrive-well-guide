
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAffirmationsForm } from "@/hooks/useAffirmationsForm";
import AffirmationForm from "./affirmations/AffirmationForm";
import LoadingState from "./shared/LoadingState";

interface AffirmationsProps {
  onComplete: () => void;
}

const Affirmations: React.FC<AffirmationsProps> = ({ onComplete }) => {
  const { affirmations, isLoading, isSaving, updateAffirmation, saveAffirmations } = useAffirmationsForm(onComplete);

  return (
    <Card>
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
