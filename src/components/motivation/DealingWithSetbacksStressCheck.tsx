
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

interface DealingWithSetbacksStressCheckProps {
  onComplete?: () => void;
}

// Stress level descriptions
const STRESS_LEVELS = [
  {
    value: "5",
    label: "5 = The stressor is on my mind all day."
  },
  {
    value: "4",
    label: "4 = The stressor is on my mind off and on throughout the day."
  },
  {
    value: "3",
    label: "3 = The stressor is on my mind, but it doesn't disrupt my normal routine."
  },
  {
    value: "2",
    label: "2 = The stressor is on my mind sometimes, and I'm somewhat confident I can cope with it."
  },
  {
    value: "1",
    label: "1 = The stressor is on my mind infrequently throughout the week, and I'm confident I can successfully cope with it."
  }
];

// Problem-focused coping mechanisms
const PROBLEM_FOCUSED = [
  "Taking action",
  "Asking for help",
  "Managing my time",
];

// Emotion-focused coping mechanisms
const EMOTION_FOCUSED = [
  "Keeping myself busy",
  "Meditating/praying",
  "Writing it down",
  "Reassessing the problem",
  "Talking it out",
];

const DealingWithSetbacksStressCheck: React.FC<DealingWithSetbacksStressCheckProps> = ({ onComplete }) => {
  const { 
    formData, 
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm,
    fetchData 
  } = useMotivationForm({
    tableName: "motivation_dealing_setbacks_stress_check",
    initialState: {
      stress_level: null,
      problem_focused: [],
      emotion_focused: [],
      problem_focused_other: "",
      emotion_focused_other: "",
      implementation: ""
    },
    onSuccess: onComplete
  });

  // Initialize state from formData or empty values
  const [problemFocusedOther, setProblemFocusedOther] = useState<string>(
    formData.problem_focused_other || ""
  );
  
  const [emotionFocusedOther, setEmotionFocusedOther] = useState<string>(
    formData.emotion_focused_other || ""
  );

  React.useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  React.useEffect(() => {
    if (formData) {
      // Update local state when formData changes
      if (formData.problem_focused_other !== undefined) {
        setProblemFocusedOther(formData.problem_focused_other);
      }
      
      if (formData.emotion_focused_other !== undefined) {
        setEmotionFocusedOther(formData.emotion_focused_other);
      }
    }
  }, [formData]);

  const toggleProblemFocused = (mechanism: string) => {
    const currentMechanisms = formData.problem_focused || [];
    if (currentMechanisms.includes(mechanism)) {
      updateForm(
        "problem_focused", 
        currentMechanisms.filter((m: string) => m !== mechanism)
      );
    } else {
      updateForm(
        "problem_focused", 
        [...currentMechanisms, mechanism]
      );
    }
  };

  const toggleEmotionFocused = (mechanism: string) => {
    const currentMechanisms = formData.emotion_focused || [];
    if (currentMechanisms.includes(mechanism)) {
      updateForm(
        "emotion_focused", 
        currentMechanisms.filter((m: string) => m !== mechanism)
      );
    } else {
      updateForm(
        "emotion_focused", 
        [...currentMechanisms, mechanism]
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update form data with current "Other" values
    updateForm("problem_focused_other", problemFocusedOther);
    updateForm("emotion_focused_other", emotionFocusedOther);
    
    // Add "Other" values to the respective arrays if they are filled
    const finalFormData = { ...formData };
    
    if (problemFocusedOther.trim()) {
      const otherEntry = `Other: ${problemFocusedOther}`;
      const currentProblemFocused = formData.problem_focused || [];
      if (!currentProblemFocused.includes(otherEntry)) {
        finalFormData.problem_focused = [...currentProblemFocused, otherEntry];
        updateForm("problem_focused", finalFormData.problem_focused);
      }
    }
    
    if (emotionFocusedOther.trim()) {
      const otherEntry = `Other: ${emotionFocusedOther}`;
      const currentEmotionFocused = formData.emotion_focused || [];
      if (!currentEmotionFocused.includes(otherEntry)) {
        finalFormData.emotion_focused = [...currentEmotionFocused, otherEntry];
        updateForm("emotion_focused", finalFormData.emotion_focused);
      }
    }
    
    submitForm();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  const isProblemFocusedSelected = (mechanism: string) => {
    return (formData.problem_focused || []).includes(mechanism);
  };

  const isEmotionFocusedSelected = (mechanism: string) => {
    return (formData.emotion_focused || []).includes(mechanism);
  };

  const isFormComplete = () => {
    return (
      formData.stress_level && 
      ((formData.problem_focused && formData.problem_focused.length > 0) || 
       (formData.emotion_focused && formData.emotion_focused.length > 0)) &&
      formData.implementation
    );
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">Dealing with Setbacks: Stress Check</h2>
        
        <p className="text-gray-700 mb-6">
          Let's face it: Stress can derail anyone. In previous exercises, you evaluated your stress levels and identified ways to cope. When you experience a setback or you feel like giving up, take a few moments to reexamine your stress level and your coping mechanisms.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-medium text-purple-800">What is your stress level now? Circle the rating that fits you most at the moment.</h3>
              
              <RadioGroup 
                value={formData.stress_level ? formData.stress_level.toString() : undefined} 
                onValueChange={(value) => updateForm("stress_level", parseInt(value))}
                className="space-y-3"
              >
                {STRESS_LEVELS.map((level) => (
                  <div key={level.value} className="flex items-start space-x-2 p-2 hover:bg-purple-50 rounded">
                    <RadioGroupItem id={`stress-level-${level.value}`} value={level.value} className="mt-1" />
                    <Label htmlFor={`stress-level-${level.value}`} className="cursor-pointer">{level.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-purple-800">What coping mechanisms can you use? Check all that apply:</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Problem-Focused Column */}
                <div className="space-y-3 p-4 border rounded-md">
                  <h4 className="font-medium text-center mb-2">PROBLEM-FOCUSED</h4>
                  {PROBLEM_FOCUSED.map((mechanism) => (
                    <div key={mechanism} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                      <Checkbox 
                        id={`problem-${mechanism}`}
                        checked={isProblemFocusedSelected(mechanism)}
                        onCheckedChange={() => toggleProblemFocused(mechanism)}
                      />
                      <Label htmlFor={`problem-${mechanism}`} className="cursor-pointer">{mechanism}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 pt-2">
                    <Label htmlFor="problem-other" className="whitespace-nowrap">Other:</Label>
                    <Input 
                      id="problem-other" 
                      value={problemFocusedOther} 
                      onChange={(e) => setProblemFocusedOther(e.target.value)} 
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Emotion-Focused Column */}
                <div className="space-y-3 p-4 border rounded-md">
                  <h4 className="font-medium text-center mb-2">EMOTION-FOCUSED</h4>
                  {EMOTION_FOCUSED.map((mechanism) => (
                    <div key={mechanism} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded">
                      <Checkbox 
                        id={`emotion-${mechanism}`}
                        checked={isEmotionFocusedSelected(mechanism)}
                        onCheckedChange={() => toggleEmotionFocused(mechanism)}
                      />
                      <Label htmlFor={`emotion-${mechanism}`} className="cursor-pointer">{mechanism}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2 pt-2">
                    <Label htmlFor="emotion-other" className="whitespace-nowrap">Other:</Label>
                    <Input 
                      id="emotion-other" 
                      value={emotionFocusedOther} 
                      onChange={(e) => setEmotionFocusedOther(e.target.value)} 
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <Label htmlFor="implementation" className="block font-medium mb-2">
                Describe how you will put these techniques into action to reduce your stress level
              </Label>
              <Textarea
                id="implementation"
                value={formData.implementation || ""}
                onChange={(e) => updateForm("implementation", e.target.value)}
                className="w-full p-3 border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Describe your implementation plan..."
                rows={4}
              />
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                disabled={isSaving || !isFormComplete()}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isSaving ? "Saving..." : "Complete Step"}
              </Button>
              {!isFormComplete() && 
                <p className="text-amber-600 text-sm mt-2">Please complete all required fields</p>
              }
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DealingWithSetbacksStressCheck;
