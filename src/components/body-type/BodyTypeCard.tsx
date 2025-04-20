
import React from 'react';
import { Check } from "lucide-react";
import { BodyType } from "@/types/bodyType";

interface BodyTypeCardProps {
  bodyType: BodyType;
  imageUrl: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const BodyTypeCard = ({ bodyType, imageUrl, isSelected, onSelect }: BodyTypeCardProps) => {
  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all 
        ${isSelected 
          ? 'border-primary ring-2 ring-primary shadow-md' 
          : 'hover:border-primary hover:shadow-sm'}`}
      onClick={() => onSelect(bodyType.id)}
    >
      <div className="flex flex-col items-center space-y-3 relative">
        {isSelected && (
          <div className="absolute top-2 right-2 bg-primary rounded-full p-1 z-10">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
        <div className="w-full aspect-square overflow-hidden rounded-lg">
          <img 
            src={imageUrl || '/placeholder.svg'} 
            alt={bodyType.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
        <div className="text-center mt-2 w-full">
          <h3 className="font-semibold text-lg">{bodyType.name}</h3>
          <p className="text-sm text-muted-foreground">
            Body Fat: {bodyType.bodyfat_range}
          </p>
          <p className="text-sm text-muted-foreground">
            Population: {bodyType.population_percentage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BodyTypeCard;
