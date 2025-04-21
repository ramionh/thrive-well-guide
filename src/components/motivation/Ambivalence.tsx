
import React from "react";
import AmbivalenceCarousel from "./ambivalence/AmbivalenceCarousel";
import ProConList from "./ProConList";

interface AmbivalenceProps {
  onComplete?: () => void;
}

const Ambivalence: React.FC<AmbivalenceProps> = ({ onComplete }) => {
  return (
    <div className="space-y-8">
      <AmbivalenceCarousel />
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Pros & Cons Exercise</h3>
        <ProConList />
      </div>
    </div>
  );
};

export default Ambivalence;
