
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import { QuestionnaireSection, QuestionnaireResponse } from "@/types/questionnaire";
import { nutritionQuestionnaire, exerciseQuestionnaire, sleepQuestionnaire } from "@/data/questionnaires";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuestionnaireStepProps {
  onNext: () => void;
  onBack: () => void;
}

const QuestionnaireStep: React.FC<QuestionnaireStepProps> = ({ onNext, onBack }) => {
  const { saveMotivationalResponse } = useUser();
  const [currentQuestionnaireIndex, setCurrentQuestionnaireIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionnaireResponse>({});

  const questionnaires = [nutritionQuestionnaire, exerciseQuestionnaire, sleepQuestionnaire];
  const currentQuestionnaire = questionnaires[currentQuestionnaireIndex];

  const handleAnswer = (questionId: string, answer: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionnaireIndex < questionnaires.length - 1) {
      setCurrentQuestionnaireIndex(prev => prev + 1);
    } else {
      // Save responses and proceed
      Object.entries(responses).forEach(([key, value]) => {
        saveMotivationalResponse(key, Array.isArray(value) ? value.join(", ") : value);
      });
      onNext();
    }
  };

  const isComplete = currentQuestionnaire.questions.every(
    question => responses[question.id]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{currentQuestionnaire.title} Questionnaire</CardTitle>
        <CardDescription>Help us understand your current habits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentQuestionnaire.questions.map((question) => (
          <div key={question.id} className="space-y-3">
            <Label>{question.text}</Label>
            <RadioGroup
              value={responses[question.id] as string}
              onValueChange={(value) => handleAnswer(question.id, value)}
            >
              {question.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                  <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!isComplete}
        >
          {currentQuestionnaireIndex === questionnaires.length - 1 ? "Complete" : "Next Section"}
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuestionnaireStep;
