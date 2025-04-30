
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface DealingWithSetbacksRecommitProps {
  onComplete?: () => void;
}

const COPING_SKILLS = [
  "RECOMMIT TO GOALS/RESTART",
  "CONTACT POSITIVE SUPPORTS",
  "RESET TIMETABLE",
  "TAKE ONE ACTION TODAY",
  "LAUGH WHEN YOU CAN",
  "FORGIVE YOURSELF"
];

const DealingWithSetbacksRecommit: React.FC<DealingWithSetbacksRecommitProps> = ({ onComplete }) => {
  const { 
    formData, 
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_dealing_setbacks_recommit",
    initialState: {
      selected_coping_skills: [],
      implementation_plan: ""
    },
    onSuccess: onComplete
  });

  const toggleCopingSkill = (skill: string) => {
    const currentSkills = formData.selected_coping_skills || [];
    if (currentSkills.includes(skill)) {
      updateForm(
        "selected_coping_skills", 
        currentSkills.filter((s: string) => s !== skill)
      );
    } else {
      updateForm(
        "selected_coping_skills", 
        [...currentSkills, skill]
      );
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">Dealing with Setbacks: Recommit</h2>
        
        <p className="text-gray-700 mb-6">
          Based on your particular change plan, choose two of these coping skills and write down how you will implement them to help you get back on track.
        </p>

        <form onSubmit={(e) => {
          e.preventDefault();
          submitForm();
        }}>
          <div className="space-y-6">
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-3">Select at least two coping skills:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {COPING_SKILLS.map((skill) => (
                  <div key={skill} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                    <Checkbox 
                      id={`skill-${skill}`}
                      checked={formData.selected_coping_skills?.includes(skill) || false}
                      onCheckedChange={() => toggleCopingSkill(skill)}
                    />
                    <Label htmlFor={`skill-${skill}`} className="cursor-pointer">{skill}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <Label htmlFor="implementation-plan" className="block font-medium mb-2">
                Implementation Plan
              </Label>
              <Textarea
                id="implementation-plan"
                value={formData.implementation_plan || ""}
                onChange={(e) => updateForm("implementation_plan", e.target.value)}
                className="w-full p-3 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Describe how you will implement these coping skills..."
                rows={6}
              />
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSaving || (formData.selected_coping_skills || []).length < 2 || !formData.implementation_plan}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isSaving ? "Saving..." : "Complete Step"}
              </Button>
              {(formData.selected_coping_skills || []).length < 2 && 
                <p className="text-amber-600 text-sm mt-2">Please select at least two coping skills</p>
              }
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DealingWithSetbacksRecommit;
