
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";
import { QuestionnaireSection, QuestionnaireResponse } from "@/types/questionnaire";
import { nutritionQuestionnaire, exerciseQuestionnaire, sleepQuestionnaire } from "@/data/questionnaires";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  const handleNext = async () => {
    if (currentQuestionnaireIndex < questionnaires.length - 1) {
      setCurrentQuestionnaireIndex(prev => prev + 1);
    } else {
      // Save responses and proceed
      Object.entries(responses).forEach(([key, value]) => {
        saveMotivationalResponse(key, Array.isArray(value) ? value.join(", ") : value);
      });
      
      // Save questionnaire data to ClientOnboarding table
      await saveQuestionnaireToDatabase();
      onNext();
    }
  };

  const saveQuestionnaireToDatabase = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get profile to link the data
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!profile) return;

      // Prepare questionnaire data
      const questionnaireData: any[] = [];
      
      questionnaires.forEach(questionnaire => {
        questionnaire.questions.forEach(question => {
          const answer = responses[question.id];
          if (answer) {
            questionnaireData.push({
              profile_id: profile.id,
              questionnaire_type: questionnaire.title.toLowerCase(),
              question_id: question.id,
              question_text: question.text,
              answer: Array.isArray(answer) ? answer.join(", ") : answer
            });
          }
        });
      });

      if (questionnaireData.length > 0) {
        const { error } = await supabase
          .from('client_onboarding')
          .insert(questionnaireData);

        if (error) {
          console.error('Error saving questionnaire data:', error);
        }
      }
    } catch (error) {
      console.error('Error in saveQuestionnaireToDatabase:', error);
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
