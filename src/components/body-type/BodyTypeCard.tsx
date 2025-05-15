
import React, { useEffect, useState } from 'react';
import { Check } from "lucide-react";
import { BodyType } from "@/types/bodyType";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";

interface BodyTypeCardProps {
  bodyType: BodyType;
  imageUrl: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const BodyTypeCard = ({ bodyType, imageUrl, isSelected, onSelect }: BodyTypeCardProps) => {
  const { user } = useUser();
  const [bodyfatRange, setBodyfatRange] = useState<string>(bodyType.bodyfat_range);
  
  useEffect(() => {
    const fetchGenderSpecificRange = async () => {
      if (!user?.gender) return;
      
      try {
        const { data, error } = await supabase
          .from('gender_body_type_ranges')
          .select('bodyfat_range')
          .eq('body_type_id', bodyType.id)
          .eq('gender', user.gender.toLowerCase())
          .single();
        
        if (error) {
          console.error("Error fetching gender-specific range:", error);
          return;
        }
        
        if (data) {
          setBodyfatRange(data.bodyfat_range);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
    
    fetchGenderSpecificRange();
  }, [bodyType.id, user?.gender]);

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
              console.error(`Failed to load image: ${imageUrl}`);
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
        </div>
        <div className="text-center mt-2 w-full">
          <h3 className="font-semibold text-lg">{bodyType.name}</h3>
          <p className="text-sm text-muted-foreground">
            Body Fat: {bodyfatRange}
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
