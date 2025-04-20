
import React from 'react';
import { BodyType } from "@/types/bodyType";
import BodyTypeCard from "./BodyTypeCard";

interface BodyTypeGridProps {
  bodyTypes: BodyType[];
  bodyTypeImages: Record<string, string>;
  selectedBodyType: string | null;
  onSelect: (id: string) => void;
}

const BodyTypeGrid = ({ bodyTypes, bodyTypeImages, selectedBodyType, onSelect }: BodyTypeGridProps) => {
  const getBodyTypeRows = () => {
    const rows = [];
    const itemsPerRow = 3;
    
    for (let i = 0; i < bodyTypes.length; i += itemsPerRow) {
      rows.push(bodyTypes.slice(i, i + itemsPerRow));
    }
    
    return rows;
  };

  return (
    <>
      {getBodyTypeRows().map((row, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {row.map((bodyType) => (
            <BodyTypeCard
              key={bodyType.id}
              bodyType={bodyType}
              imageUrl={bodyTypeImages[bodyType.id]}
              isSelected={selectedBodyType === bodyType.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      ))}
    </>
  );
};

export default BodyTypeGrid;
