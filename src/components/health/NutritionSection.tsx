
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { StoplightControl } from "@/components/ui/stoplight-control";
import { Pizza, Beef } from "lucide-react";

interface NutritionSectionProps {
  register: any;
  nutritionAdherence: "red" | "yellow" | "green";
  onAdherenceChange: (value: "red" | "yellow" | "green") => void;
}

const NutritionSection: React.FC<NutritionSectionProps> = ({
  register,
  nutritionAdherence,
  onAdherenceChange,
}) => {
  return (
    <div>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Pizza className="h-5 w-5 text-thrive-orange" />
          <Label>Calories</Label>
        </div>
        <Input
          type="number"
          {...register("calories")}
          className="w-full"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Beef className="h-5 w-5 text-thrive-orange" />
          <Label>Protein (g)</Label>
        </div>
        <Input
          type="number"
          {...register("protein")}
          className="w-full"
        />
      </div>

      <StoplightControl
        value={nutritionAdherence}
        onValueChange={onAdherenceChange}
        label="Nutrition Goal Adherence"
      />
    </div>
  );
};

export default NutritionSection;
