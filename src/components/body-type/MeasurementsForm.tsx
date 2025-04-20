
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MeasurementsFormProps {
  weight: number | '';
  setWeight: (value: number | '') => void;
  bodyfat: number | '';
  setBodyfat: (value: number | '') => void;
}

const MeasurementsForm = ({ weight, setWeight, bodyfat, setBodyfat }: MeasurementsFormProps) => {
  return (
    <div className="mt-8 space-y-4 max-w-md mx-auto">
      <div className="space-y-2">
        <Label htmlFor="weight">Current Weight (lbs) *</Label>
        <Input
          id="weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
          placeholder="Enter your weight in pounds"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="bodyfat">
          Estimated Body Fat % (optional)
        </Label>
        <Input
          id="bodyfat"
          type="number"
          value={bodyfat}
          onChange={(e) => setBodyfat(e.target.value ? Number(e.target.value) : '')}
          placeholder="Enter your estimated body fat percentage"
          min="1"
          max="100"
          step="0.1"
        />
      </div>
    </div>
  );
};

export default MeasurementsForm;
