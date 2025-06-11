import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, Moon, Calculator, Drumstick, Dumbbell, Shield, Lightbulb } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";

interface ExistingHabitsAssessmentProps {
  onBackToOptions: () => void;
}

type Category = 'sleep' | 'calories' | 'protein' | 'training' | 'lifestyle';
type Screen = 'categories' | Category | 'result';

interface QuestionAnswers {
  q1: string;
  q2: string;
  q3?: string;
}

const ExistingHabitsAssessment = ({ onBackToOptions }: ExistingHabitsAssessmentProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentScreen, setCurrentScreen] = useState<Screen>('categories');
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [answers, setAnswers] = useState<QuestionAnswers>({ q1: '', q2: '', q3: '' });
  const [identifiedHabit, setIdentifiedHabit] = useState<string>('');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);

  const saveAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: any) => {
      if (!user) throw new Error('User not authenticated');

      // First, check if a record exists for this user and category
      const { data: existingRecord, error: selectError } = await supabase
        .from('existing_habits_assessment')
        .select('id')
        .eq('user_id', user.id)
        .eq('category', assessmentData.category)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existingRecord) {
        // Update existing record
        const { error } = await supabase
          .from('existing_habits_assessment')
          .update({
            question_1_answer: assessmentData.question_1_answer,
            question_2_answer: assessmentData.question_2_answer,
            question_3_answer: assessmentData.question_3_answer,
            identified_habit: assessmentData.identified_habit,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRecord.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('existing_habits_assessment')
          .insert({
            user_id: user.id,
            category: assessmentData.category,
            question_1_answer: assessmentData.question_1_answer,
            question_2_answer: assessmentData.question_2_answer,
            question_3_answer: assessmentData.question_3_answer,
            identified_habit: assessmentData.identified_habit
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['existing-habits-assessments', user?.id] });
      toast({
        title: "Assessment Saved",
        description: "Your habit assessment has been saved successfully!"
      });
      
      // Move to next category or show completion
      if (currentCategoryIndex < categories.length - 1) {
        setCurrentCategoryIndex(currentCategoryIndex + 1);
        setAnswers({ q1: '', q2: '', q3: '' });
        setIdentifiedHabit('');
      } else {
        setShowCompletion(true);
      }
    },
    onError: (error) => {
      console.error('Error saving assessment:', error);
      toast({
        title: "Error",
        description: "Failed to save assessment. Please try again.",
        variant: "destructive"
      });
    }
  });

  const categories = [
    {
      id: 'sleep' as Category,
      icon: Moon,
      title: 'Sleep',
      description: 'Improve your rest and recovery.'
    },
    {
      id: 'calories' as Category,
      icon: Calculator,
      title: 'Calorie Intake',
      description: 'Align your energy with your goals.'
    },
    {
      id: 'protein' as Category,
      icon: Drumstick,
      title: 'Protein Intake',
      description: 'Support muscle and satiety.'
    },
    {
      id: 'training' as Category,
      icon: Dumbbell,
      title: 'Adaptive Training',
      description: 'Ensure your workouts are effective.'
    },
    {
      id: 'lifestyle' as Category,
      icon: Shield,
      title: 'Lifestyle Guardrails',
      description: 'Manage stress and distractions.'
    }
  ];

  const handleCategorySelect = (category: Category) => {
    setCurrentCategory(category);
    setCurrentScreen(category);
    setAnswers({ q1: '', q2: '', q3: '' });
  };

  const handleAnswerChange = (question: keyof QuestionAnswers, value: string) => {
    setAnswers(prev => ({ ...prev, [question]: value }));
  };

  const identifyHabit = (category: Category, answers: QuestionAnswers) => {
    let habitText = "No specific habit identified. Try reviewing your answers and consider what feels most impactful to you.";
    
    if (category === 'sleep') {
      if (answers.q1 === 'c' || answers.q2 === 'b' || answers.q3 === 'c') {
        habitText = "Creating a more consistent pre-sleep routine, reducing screen time before bed, and setting a stricter bedtime.";
      } else if (answers.q1 === 'b' || answers.q2 === 'c' || answers.q3 === 'b') {
        habitText = "Improving bedtime consistency and ensuring your wind-down routine is truly relaxing.";
      } else {
        habitText = "Your sleep habits seem solid! Consider focusing on another area for even greater health benefits.";
      }
    } else if (category === 'calories') {
      if (answers.q2 === 'c' || answers.q1 === 'c') {
        habitText = "Increasing awareness of calorie intake by tracking or mindful portion control, especially to avoid eating past fullness.";
      } else if (answers.q3 === 'b' || answers.q3 === 'c') {
        habitText = "Developing non-food-related strategies to manage stress and boredom to reduce unplanned snacking.";
      } else {
        habitText = "Your calorie awareness is strong! Perhaps a different category holds more opportunity for improvement.";
      }
    } else if (category === 'protein') {
      if (answers.q1 === 'c' || answers.q2 === 'b') {
        habitText = "Focusing on including a protein source in every meal and distributing it more evenly throughout the day.";
      } else if (answers.q1 === 'b') {
        habitText = "Making it a goal to add a quality protein source to one more meal each day.";
      } else {
        habitText = "Your protein habits appear to be well-structured. Great job!";
      }
    } else if (category === 'training') {
      if (answers.q1 === 'c') {
        habitText = "Implementing a structured plan for progressive overload to ensure workouts continue to drive adaptation.";
      } else if (answers.q2 === 'c' || answers.q2 === 'b') {
        habitText = "Improving workout consistency by addressing the root cause of missed sessions (time, motivation, etc.).";
      } else if (answers.q1 === 'b') {
        habitText = "Transitioning from 'going by feel' to a more structured training program for more predictable progress.";
      } else {
        habitText = "Your training approach seems consistent and progressive. Keep up the great work!";
      }
    } else if (category === 'lifestyle') {
      if (answers.q1 === 'c' || answers.q1 === 'b') {
        habitText = "Developing proactive stress management techniques (like walks or meditation) instead of relying on reactive distractions like food or entertainment.";
      } else if (answers.q2 === 'c') {
        habitText = "Setting clear boundaries for non-work screen time to reclaim more time for other fulfilling activities.";
      } else {
        habitText = "Your lifestyle guardrails seem to be in a good place!";
      }
    }

    return habitText;
  };

  const handleIdentifyHabit = () => {
    if (!currentCategory) return;
    
    const habit = identifyHabit(currentCategory, answers);
    setIdentifiedHabit(habit);
    setCurrentScreen('result');
    
    // Save to database
    saveAssessmentMutation.mutate({
      category: currentCategory,
      question_1_answer: answers.q1,
      question_2_answer: answers.q2,
      question_3_answer: answers.q3,
      identified_habit: habit
    });
  };

  const isAnswersComplete = () => {
    // Categories that only have 2 questions
    if (currentCategory === 'protein' || currentCategory === 'training' || currentCategory === 'lifestyle') {
      return answers.q1 && answers.q2;
    }
    // Categories with 3 questions (sleep, calories)
    return answers.q1 && answers.q2 && answers.q3;
  };

  if (currentScreen === 'categories') {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={onBackToOptions}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Journey Options
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Habit Identifier</h1>
          <p className="text-gray-600">Choose a category to identify an area for improvement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardContent className="p-6 text-center">
                  <IconComponent className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-lg font-semibold mb-2">{category.title}</h2>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  if (currentScreen === 'result') {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <Lightbulb className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Your Potential Habit Focus</h2>
            <p className="text-gray-600 mb-4">Based on your answers, here is a potential habit you could focus on improving:</p>
            <div className="bg-blue-100 text-blue-800 font-semibold p-4 rounded-lg mb-6">
              <p>{identifiedHabit}</p>
            </div>
            <p className="text-gray-600 mb-6">You can now use a tool like the "Habit Repurpose Planner" to create a specific action plan for this habit.</p>
            <Button 
              onClick={() => setCurrentScreen('categories')}
              className="w-full"
            >
              Assess Another Habit
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Question screens
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <Button 
          onClick={() => setCurrentScreen('categories')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Categories
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto">
        {currentCategory === 'sleep' && (
          <SleepQuestions answers={answers} onAnswerChange={handleAnswerChange} />
        )}
        {currentCategory === 'calories' && (
          <CaloriesQuestions answers={answers} onAnswerChange={handleAnswerChange} />
        )}
        {currentCategory === 'protein' && (
          <ProteinQuestions answers={answers} onAnswerChange={handleAnswerChange} />
        )}
        {currentCategory === 'training' && (
          <TrainingQuestions answers={answers} onAnswerChange={handleAnswerChange} />
        )}
        {currentCategory === 'lifestyle' && (
          <LifestyleQuestions answers={answers} onAnswerChange={handleAnswerChange} />
        )}
        
        <CardContent className="p-6">
          <div className="flex justify-between">
            <Button 
              variant="secondary"
              onClick={() => setCurrentScreen('categories')}
            >
              Back
            </Button>
            <Button 
              onClick={handleIdentifyHabit}
              disabled={!isAnswersComplete() || saveAssessmentMutation.isPending}
            >
              {saveAssessmentMutation.isPending ? "Saving..." : "Identify Habit"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Question Components
interface QuestionProps {
  answers: QuestionAnswers;
  onAnswerChange: (question: keyof QuestionAnswers, value: string) => void;
}

const SleepQuestions = ({ answers, onAnswerChange }: QuestionProps) => (
  <>
    <CardHeader>
      <CardTitle className="text-2xl text-center">Sleep Habits Assessment</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6 p-6">
      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="font-semibold mb-2">1. How consistent is your bedtime on weeknights?</p>
        <div className="space-y-2">
          {[
            { value: 'a', label: 'Within 30 minutes' },
            { value: 'b', label: 'Varies by about an hour' },
            { value: 'c', label: 'Varies by more than an hour' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="q1-sleep"
                value={option.value}
                checked={answers.q1 === option.value}
                onChange={(e) => onAnswerChange('q1', e.target.value)}
                className="text-blue-600"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="font-semibold mb-2">2. What do you typically do in the 30 minutes before trying to sleep?</p>
        <div className="space-y-2">
          {[
            { value: 'a', label: 'Read a physical book or listen to calm audio' },
            { value: 'b', label: 'Watch TV, a movie, or use my phone/tablet' },
            { value: 'c', label: 'Work or do household chores' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="q2-sleep"
                value={option.value}
                checked={answers.q2 === option.value}
                onChange={(e) => onAnswerChange('q2', e.target.value)}
                className="text-blue-600"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="font-semibold mb-2">3. How many hours of sleep do you average per night?</p>
        <div className="space-y-2">
          {[
            { value: 'a', label: 'More than 7.5 hours' },
            { value: 'b', label: 'Between 6 and 7.5 hours' },
            { value: 'c', label: 'Less than 6 hours' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="q3-sleep"
                value={option.value}
                checked={answers.q3 === option.value}
                onChange={(e) => onAnswerChange('q3', e.target.value)}
                className="text-blue-600"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </CardContent>
  </>
);

const CaloriesQuestions = ({ answers, onAnswerChange }: QuestionProps) => (
  <>
    <CardHeader>
      <CardTitle className="text-2xl text-center">Calorie Intake Assessment</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6 p-6">
      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="font-semibold mb-2">1. How often do you eat until you feel "stuffed" or uncomfortably full?</p>
        <div className="space-y-2">
          {[
            { value: 'a', label: 'Rarely or never' },
            { value: 'b', label: 'A few times a month' },
            { value: 'c', label: 'A few times per week or more' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="q1-calories"
                value={option.value}
                checked={answers.q1 === option.value}
                onChange={(e) => onAnswerChange('q1', e.target.value)}
                className="text-blue-600"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="font-semibold mb-2">2. How accurately do you think you know your daily calorie intake?</p>
        <div className="space-y-2">
          {[
            { value: 'a', label: 'I track it consistently' },
            { value: 'b', label: 'I have a rough idea but don\'t track' },
            { value: 'c', label: 'I have no idea' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="q2-calories"
                value={option.value}
                checked={answers.q2 === option.value}
                onChange={(e) => onAnswerChange('q2', e.target.value)}
                className="text-blue-600"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="font-semibold mb-2">3. When are you most likely to have unplanned meals or snacks?</p>
        <div className="space-y-2">
          {[
            { value: 'a', label: 'Almost never' },
            { value: 'b', label: 'When I\'m feeling stressed or bored' },
            { value: 'c', label: 'In social settings with friends or family' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="q3-calories"
                value={option.value}
                checked={answers.q3 === option.value}
                onChange={(e) => onAnswerChange('q3', e.target.value)}
                className="text-blue-600"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </CardContent>
  </>
);

const ProteinQuestions = ({ answers, onAnswerChange }: QuestionProps) => (
  <>
    <CardHeader>
      <CardTitle className="text-2xl text-center">Protein Intake Assessment</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6 p-6">
      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="font-semibold mb-2">1. How many of your daily meals typically include a significant protein source (e.g., meat, fish, eggs, tofu)?</p>
        <div className="space-y-2">
          {[
            { value: 'a', label: 'At least 3 meals' },
            { value: 'b', label: '2 meals' },
            { value: 'c', label: '1 meal or less' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="q1-protein"
                value={option.value}
                checked={answers.q1 === option.value}
                onChange={(e) => onAnswerChange('q1', e.target.value)}
                className="text-blue-600"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="font-semibold mb-2">2. How would you describe the distribution of your protein intake?</p>
        <div className="space-y-2">
          {[
            { value: 'a', label: 'Spread fairly evenly throughout the day' },
            { value: 'b', label: 'Heavily weighted towards one meal (usually dinner)' },
            { value: 'c', label: 'It\'s completely random' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="q2-protein"
                value={option.value}
                checked={answers.q2 === option.value}
                onChange={(e) => onAnswerChange('q2', e.target.value)}
                className="text-blue-600"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </CardContent>
  </>
);

const TrainingQuestions = ({ answers, onAnswerChange }: QuestionProps) => (
  <>
    <CardHeader>
      <CardTitle className="text-2xl text-center">Adaptive Training Assessment</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6 p-6">
      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="font-semibold mb-2">1. How do you approach making your workouts more challenging over time (progressive overload)?</p>
        <div className="space-y-2">
          {[
            { value: 'a', label: 'I follow a structured program that tells me when to add weight/reps/etc.' },
            { value: 'b', label: 'I just go by how I feel on a given day.' },
            { value: 'c', label: 'I do the same workouts and rarely change the difficulty.' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="q1-training"
                value={option.value}
                checked={answers.q1 === option.value}
                onChange={(e) => onAnswerChange('q1', e.target.value)}
                className="text-blue-600"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="font-semibold mb-2">2. How often do you miss planned workouts in a typical month?</p>
        <div className="space-y-2">
          {[
            { value: 'a', label: '0-1 times' },
            { value: 'b', label: '2-4 times' },
            { value: 'c', label: '5 or more times' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="q2-training"
                value={option.value}
                checked={answers.q2 === option.value}
                onChange={(e) => onAnswerChange('q2', e.target.value)}
                className="text-blue-600"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </CardContent>
  </>
);

const LifestyleQuestions = ({ answers, onAnswerChange }: QuestionProps) => (
  <>
    <CardHeader>
      <CardTitle className="text-2xl text-center">Lifestyle Guardrails Assessment</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6 p-6">
      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="font-semibold mb-2">1. How do you typically manage high-stress situations?</p>
        <div className="space-y-2">
          {[
            { value: 'a', label: 'With a proactive strategy like exercise, meditation, or talking to someone.' },
            { value: 'b', label: 'By distracting myself with entertainment (TV, social media, etc.).' },
            { value: 'c', label: 'By using food or alcohol to unwind.' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="q1-lifestyle"
                value={option.value}
                checked={answers.q1 === option.value}
                onChange={(e) => onAnswerChange('q1', e.target.value)}
                className="text-blue-600"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border">
        <p className="font-semibold mb-2">2. On an average day, how much non-work screen time do you have?</p>
        <div className="space-y-2">
          {[
            { value: 'a', label: 'Less than 2 hours' },
            { value: 'b', label: '2-4 hours' },
            { value: 'c', label: 'More than 4 hours' }
          ].map((option) => (
            <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="q2-lifestyle"
                value={option.value}
                checked={answers.q2 === option.value}
                onChange={(e) => onAnswerChange('q2', e.target.value)}
                className="text-blue-600"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </CardContent>
  </>
);

export default ExistingHabitsAssessment;
