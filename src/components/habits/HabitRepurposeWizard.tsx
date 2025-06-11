import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, ArrowLeft, Target, Heart, XCircle, RefreshCw, Wrench, FileText, CheckCircle } from "lucide-react";
import { useCurrentGoal } from "@/hooks/useCurrentGoal";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

interface HabitRepurposeWizardProps {
  onBackToOptions: () => void;
}

const HabitRepurposeWizard: React.FC<HabitRepurposeWizardProps> = ({ onBackToOptions }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [goalText, setGoalText] = useState("");
  const [isLearningGoal, setIsLearningGoal] = useState(false);
  const [goalValuesText, setGoalValuesText] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [habitTrigger, setHabitTrigger] = useState("");
  const [habitFeeling, setHabitFeeling] = useState("");
  const [replacementHabit, setReplacementHabit] = useState("");
  const [triggerRoutine, setTriggerRoutine] = useState("");
  const [actionRoutine, setActionRoutine] = useState("");
  const [makeBadHabitHarder, setMakeBadHabitHarder] = useState("");
  const [makeGoodHabitEasier, setMakeGoodHabitEasier] = useState("");
  const [ifThenTrigger, setIfThenTrigger] = useState("");
  const [ifThenGoodHabit, setIfThenGoodHabit] = useState("");
  const [simpleTriggerPhrase, setSimpleTriggerPhrase] = useState("");
  const [simpleGoodHabitPhrase, setSimpleGoodHabitPhrase] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: goalInfo } = useCurrentGoal();
  const { user } = useUser();
  const { toast } = useToast();

  // Query to fetch user's habit repurpose data for the summary
  const { data: habitRepurposeData } = useQuery({
    queryKey: ['habitRepurposeData', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const [goalsRes, valuesRes, unwantedRes, replacementRes, environmentRes, ifThenRes, simpleIfThenRes] = await Promise.all([
        supabase.from('habit_repurpose_goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('habit_repurpose_goal_values').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('habit_repurpose_unwanted_habits').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('habit_repurpose_replacements').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('habit_repurpose_environment').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('habit_repurpose_if_then_plans').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
        supabase.from('habit_repurpose_simple_if_then').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1)
      ]);

      return {
        goal: goalsRes.data?.[0] || null,
        values: valuesRes.data?.[0] || null,
        unwantedHabit: unwantedRes.data?.[0] || null,
        replacement: replacementRes.data?.[0] || null,
        environment: environmentRes.data?.[0] || null,
        ifThen: ifThenRes.data?.[0] || null,
        simpleIfThen: simpleIfThenRes.data?.[0] || null
      };
    },
    enabled: !!user?.id && currentStep === 8
  });

  const handleGetStarted = () => {
    setCurrentStep(2);
  };

  const handleBackToStart = () => {
    setCurrentStep(1);
  };

  const handleNext = () => {
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSaveGoal = async () => {
    if (!user || !goalText.trim()) {
      toast({
        title: "Error",
        description: "Please enter a goal before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('habit_repurpose_goals')
        .insert({
          user_id: user.id,
          goal_text: goalText.trim(),
          is_learning_goal: isLearningGoal
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your goal has been saved successfully!",
      });

      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Error saving goal:', error);
      toast({
        title: "Error",
        description: "Failed to save your goal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveGoalValues = async () => {
    if (!user || !goalValuesText.trim()) {
      toast({
        title: "Error",
        description: "Please explain why your goal is important to you before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('habit_repurpose_goal_values')
        .insert({
          user_id: user.id,
          goal_values_text: goalValuesText.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your values explanation has been saved successfully!",
      });

      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Error saving goal values:', error);
      toast({
        title: "Error",
        description: "Failed to save your values explanation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveUnwantedHabit = async () => {
    if (!user || !habitDescription.trim() || !habitTrigger.trim() || !habitFeeling.trim()) {
      toast({
        title: "Error",
        description: "Please complete all fields about your unwanted habit before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('habit_repurpose_unwanted_habits')
        .insert({
          user_id: user.id,
          habit_description: habitDescription.trim(),
          habit_trigger: habitTrigger.trim(),
          habit_feeling: habitFeeling.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your unwanted habit information has been saved successfully!",
      });

      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Error saving unwanted habit:', error);
      toast({
        title: "Error",
        description: "Failed to save your unwanted habit information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveReplacementHabit = async () => {
    if (!user || !replacementHabit.trim() || !triggerRoutine.trim() || !actionRoutine.trim()) {
      toast({
        title: "Error",
        description: "Please complete all fields for your replacement habit before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('habit_repurpose_replacements')
        .insert({
          user_id: user.id,
          replacement_habit: replacementHabit.trim(),
          trigger_routine: triggerRoutine.trim(),
          action_routine: actionRoutine.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your replacement habit strategy has been saved successfully!",
      });

      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Error saving replacement habit:', error);
      toast({
        title: "Error",
        description: "Failed to save your replacement habit strategy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEnvironment = async () => {
    if (!user || !makeBadHabitHarder.trim() || !makeGoodHabitEasier.trim()) {
      toast({
        title: "Error",
        description: "Please complete both environment engineering fields before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('habit_repurpose_environment')
        .insert({
          user_id: user.id,
          make_bad_habit_harder: makeBadHabitHarder.trim(),
          make_good_habit_easier: makeGoodHabitEasier.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your environment engineering plan has been saved successfully!",
      });

      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Error saving environment plan:', error);
      toast({
        title: "Error",
        description: "Failed to save your environment engineering plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveIfThenPlan = async () => {
    if (!user || !ifThenTrigger.trim() || !ifThenGoodHabit.trim()) {
      toast({
        title: "Error",
        description: "Please complete both If-Then planning fields before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('habit_repurpose_if_then_plans')
        .insert({
          user_id: user.id,
          trigger_text: ifThenTrigger.trim(),
          good_habit_text: ifThenGoodHabit.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your If-Then plan has been saved successfully!",
      });

      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Error saving If-Then plan:', error);
      toast({
        title: "Error",
        description: "Failed to save your If-Then plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveSimpleIfThen = async () => {
    if (!user || !simpleTriggerPhrase.trim() || !simpleGoodHabitPhrase.trim()) {
      toast({
        title: "Error",
        description: "Please complete both trigger and good habit phrases before continuing.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('habit_repurpose_simple_if_then')
        .insert({
          user_id: user.id,
          trigger_phrase: simpleTriggerPhrase.trim(),
          good_habit_phrase: simpleGoodHabitPhrase.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your simple If-Then plan has been saved successfully!",
      });

      setCurrentStep(currentStep + 1);
    } catch (error) {
      console.error('Error saving simple If-Then plan:', error);
      toast({
        title: "Error",
        description: "Failed to save your simple If-Then plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStep === 1) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <Card className="text-center">
          <CardContent className="p-12 space-y-6">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <RotateCcw className="h-8 w-8 text-blue-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Welcome to Habit Repurpose
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-md mx-auto">
              Lasting change is a skill. This short guide will walk you through an evidence-based plan to understand your old habits and build new ones that stick.
            </p>
            
            <div className="pt-6">
              <Button 
                onClick={handleGetStarted}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg w-full max-w-xs"
              >
                Let's Get Started
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 2) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="text-blue-600 font-medium">Phase 1: Prepare</div>
          <div className="text-gray-500">Step 2 of 8</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '25%' }}></div>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Why is your goal important to your values?
              </h2>
              
              <p className="text-gray-600">
                Connecting your goal to your personal values increases motivation and commitment.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="value-text" className="block text-sm font-medium text-gray-700 mb-2">
                  Explain why this goal matters to you
                </label>
                <Textarea
                  id="value-text"
                  value={goalValuesText}
                  onChange={(e) => setGoalValuesText(e.target.value)}
                  placeholder="This goal is important to me because..."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-32"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <p className="font-semibold">Tip:</p>
                <p>Consider how your goal connects to your personal values like:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Health and well-being</li>
                  <li>Family relationships</li>
                  <li>Personal growth</li>
                  <li>Community contribution</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button 
                onClick={handleBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              
              <Button 
                onClick={handleSaveGoalValues}
                disabled={isSubmitting || !goalValuesText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 3) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="text-blue-600 font-medium">Phase 1: Prepare</div>
          <div className="text-gray-500">Step 3 of 8</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '37.5%' }}></div>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                What is the unwanted habit you want to change?
              </h2>
              
              <p className="text-gray-600">
                Understanding the habit you want to change is critical to creating your repurposing plan
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="habit-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe the unwanted habit in detail
                </label>
                <Textarea
                  id="habit-description"
                  value={habitDescription}
                  onChange={(e) => setHabitDescription(e.target.value)}
                  placeholder="Example: I eat junk food when I'm stressed at work"
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
                />
              </div>

              <div>
                <label htmlFor="habit-trigger" className="block text-sm font-medium text-gray-700 mb-2">
                  What triggers this habit?
                </label>
                <Textarea
                  id="habit-trigger"
                  value={habitTrigger}
                  onChange={(e) => setHabitTrigger(e.target.value)}
                  placeholder="Example: Feeling stressed about a deadline or difficult project"
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
                />
              </div>

              <div>
                <label htmlFor="habit-feeling" className="block text-sm font-medium text-gray-700 mb-2">
                  How do you feel during and after this habit?
                </label>
                <Textarea
                  id="habit-feeling"
                  value={habitFeeling}
                  onChange={(e) => setHabitFeeling(e.target.value)}
                  placeholder="Example: During: Relief and temporary comfort. After: Guilty and disappointed in myself."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <p className="font-semibold">Tip:</p>
                <p>Be as specific as possible. Understanding the exact triggers and feelings will help you develop effective replacement strategies.</p>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button 
                onClick={handleBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              
              <Button 
                onClick={handleSaveUnwantedHabit}
                disabled={isSubmitting || !habitDescription.trim() || !habitTrigger.trim() || !habitFeeling.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 4) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="text-blue-600 font-medium">Phase 1: Prepare</div>
          <div className="text-gray-500">Step 4 of 8</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <RefreshCw className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                What habit will you use to replace the unwanted one?
              </h2>
              
              <p className="text-gray-600">
                Create a specific plan for your replacement habit that uses the same trigger
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="replacement-habit" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe your replacement habit
                </label>
                <Textarea
                  id="replacement-habit"
                  value={replacementHabit}
                  onChange={(e) => setReplacementHabit(e.target.value)}
                  placeholder="Example: Take 5 deep breaths and drink a glass of water"
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
                />
              </div>

              <div>
                <label htmlFor="trigger-routine" className="block text-sm font-medium text-gray-700 mb-2">
                  When I notice this trigger...
                </label>
                <Textarea
                  id="trigger-routine"
                  value={triggerRoutine}
                  onChange={(e) => setTriggerRoutine(e.target.value)}
                  placeholder="Example: When I feel stressed about work deadlines"
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
                />
              </div>

              <div>
                <label htmlFor="action-routine" className="block text-sm font-medium text-gray-700 mb-2">
                  I will do this action instead...
                </label>
                <Textarea
                  id="action-routine"
                  value={actionRoutine}
                  onChange={(e) => setActionRoutine(e.target.value)}
                  placeholder="Example: I will stop what I'm doing, take 5 deep breaths, and drink a full glass of water while thinking about my goal"
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                <p className="font-semibold">Tip:</p>
                <p>Make your replacement habit:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Specific and easy to do</li>
                  <li>Triggered by the same cue as your old habit</li>
                  <li>Something that moves you toward your goal</li>
                  <li>Immediately rewarding in some way</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button 
                onClick={handleBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              
              <Button 
                onClick={handleSaveReplacementHabit}
                disabled={isSubmitting || !replacementHabit.trim() || !triggerRoutine.trim() || !actionRoutine.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 5) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="text-blue-600 font-medium">Phase 2: Design Your Environment</div>
          <div className="text-gray-500">Step 5 of 8</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '62.5%' }}></div>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Wrench className="h-8 w-8 text-purple-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Engineer your environment for success
              </h2>
              
              <p className="text-gray-600">
                Your environment plays a huge role in your habits. Design it to make good habits easier and bad habits harder.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="make-bad-harder" className="block text-sm font-medium text-gray-700 mb-2">
                  How will you make your bad habit harder to do?
                </label>
                <Textarea
                  id="make-bad-harder"
                  value={makeBadHabitHarder}
                  onChange={(e) => setMakeBadHabitHarder(e.target.value)}
                  placeholder="Example: I'll keep junk food out of my house and office. I'll put my phone in another room when I'm working."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-32"
                />
              </div>

              <div>
                <label htmlFor="make-good-easier" className="block text-sm font-medium text-gray-700 mb-2">
                  How will you make your good habit easier to do?
                </label>
                <Textarea
                  id="make-good-easier"
                  value={makeGoodHabitEasier}
                  onChange={(e) => setMakeGoodHabitEasier(e.target.value)}
                  placeholder="Example: I'll keep a water bottle on my desk and set reminders. I'll prepare healthy snacks in advance and keep them visible."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-32"
                />
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-800">
                <p className="font-semibold">Environment Design Principles:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><strong>Remove friction</strong> for good habits - make them obvious and easy</li>
                  <li><strong>Add friction</strong> for bad habits - make them invisible and difficult</li>
                  <li><strong>Use visual cues</strong> to remind you of your good habits</li>
                  <li><strong>Prepare in advance</strong> so good choices require less willpower</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button 
                onClick={handleBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              
              <Button 
                onClick={handleSaveEnvironment}
                disabled={isSubmitting || !makeBadHabitHarder.trim() || !makeGoodHabitEasier.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 6) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="text-blue-600 font-medium">Phase 3: Create Your Plan</div>
          <div className="text-gray-500">Step 6 of 8</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Create your "If-Then" plan
              </h2>
              
              <p className="text-gray-600">
                Plan exactly when and how you'll implement your new habit by creating specific if-then statements.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label htmlFor="if-then-trigger" className="block text-sm font-medium text-gray-700 mb-2">
                  If I notice this trigger...
                </label>
                <Textarea
                  id="if-then-trigger"
                  value={ifThenTrigger}
                  onChange={(e) => setIfThenTrigger(e.target.value)}
                  placeholder="Example: If I feel stressed about work deadlines..."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
                />
              </div>

              <div>
                <label htmlFor="if-then-good-habit" className="block text-sm font-medium text-gray-700 mb-2">
                  Then I will do this good habit...
                </label>
                <Textarea
                  id="if-then-good-habit"
                  value={ifThenGoodHabit}
                  onChange={(e) => setIfThenGoodHabit(e.target.value)}
                  placeholder="Example: Then I will take 5 deep breaths and drink a glass of water while thinking about my goal."
                  className="w-full p-3 border border-gray-300 rounded-md resize-none h-24"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                <p className="font-semibold">Why If-Then Planning Works:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><strong>Creates automatic responses</strong> - Your brain prepares for the situation</li>
                  <li><strong>Reduces decision fatigue</strong> - You've already decided what to do</li>
                  <li><strong>Increases follow-through</strong> - Research shows 2-3x higher success rates</li>
                  <li><strong>Links trigger to action</strong> - Creates a mental pathway for the new habit</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Your complete If-Then statement:</strong>
                </p>
                <div className="mt-2 p-3 bg-white rounded border border-blue-200 text-blue-900 font-medium">
                  {ifThenTrigger && ifThenGoodHabit ? (
                    <>
                      <span className="text-blue-600">If</span> {ifThenTrigger}, <span className="text-blue-600">then</span> {ifThenGoodHabit}
                    </>
                  ) : (
                    <span className="text-gray-500 italic">Complete both fields above to see your full If-Then statement</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button 
                onClick={handleBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              
              <Button 
                onClick={handleSaveIfThenPlan}
                disabled={isSubmitting || !ifThenTrigger.trim() || !ifThenGoodHabit.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 7) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="text-blue-600 font-medium">Phase 3: Simplify Your Plan</div>
          <div className="text-gray-500">Step 7 of 8</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87.5%' }}></div>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Create your simple trigger plan
              </h2>
              
              <p className="text-gray-600">
                Simplify your If-Then plan into short, memorable phrases that you can easily remember and act on.
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Health & Wellness Examples:</h3>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">If</span>
                    <span className="bg-white px-2 py-1 rounded">I feel stressed</span>
                    <span className="font-medium">then I will</span>
                    <span className="bg-white px-2 py-1 rounded">take 5 deep breaths</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">If</span>
                    <span className="bg-white px-2 py-1 rounded">I crave junk food</span>
                    <span className="font-medium">then I will</span>
                    <span className="bg-white px-2 py-1 rounded">drink water first</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">If</span>
                    <span className="bg-white px-2 py-1 rounded">I wake up</span>
                    <span className="font-medium">then I will</span>
                    <span className="bg-white px-2 py-1 rounded">do 10 pushups</span>
                  </div>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Simple If-Then Plan:</h3>
                
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="text-lg font-medium text-gray-700">If</span>
                  <Input
                    value={simpleTriggerPhrase}
                    onChange={(e) => setSimpleTriggerPhrase(e.target.value)}
                    placeholder="my trigger"
                    className="flex-1 min-w-48 text-center bg-yellow-50 border-yellow-300"
                  />
                  <span className="text-lg font-medium text-gray-700">then I will</span>
                  <Input
                    value={simpleGoodHabitPhrase}
                    onChange={(e) => setSimpleGoodHabitPhrase(e.target.value)}
                    placeholder="my good habit"
                    className="flex-1 min-w-48 text-center bg-green-50 border-green-300"
                  />
                </div>

                {simpleTriggerPhrase && simpleGoodHabitPhrase && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <p className="text-center text-lg font-medium text-gray-800">
                      <span className="text-blue-600">If</span> {simpleTriggerPhrase}, <span className="text-blue-600">then I will</span> {simpleGoodHabitPhrase}
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                <p className="font-semibold">Tips for Simple If-Then Plans:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li><strong>Keep it short</strong> - Use 2-4 words for each phrase</li>
                  <li><strong>Make it specific</strong> - Clear triggers and actions</li>
                  <li><strong>Focus on health</strong> - Choose habits that support your wellness goals</li>
                  <li><strong>Start small</strong> - Pick actions you can do consistently</li>
                </ul>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button 
                onClick={handleBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              
              <Button 
                onClick={handleSaveSimpleIfThen}
                disabled={isSubmitting || !simpleTriggerPhrase.trim() || !simpleGoodHabitPhrase.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === 8) {
    return (
      <div className="container mx-auto py-6 max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="text-green-600 font-medium">Complete</div>
          <div className="text-gray-500">Step 8 of 8</div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Your Habit Repurpose Plan
              </h2>
              
              <p className="text-gray-600">
                Review your self-contract. Revisit this plan when you need a reminder of your commitment.
              </p>
            </div>

            <div className="space-y-4 bg-gray-50 rounded-lg p-6">
              <div className="space-y-3">
                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-700">My Goal:</span>
                  <span className="text-gray-600">{habitRepurposeData?.values?.goal_values_text || "N/A"}</span>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-700">My "Why":</span>
                  <span className="text-gray-600">{habitRepurposeData?.values?.goal_values_text || "N/A"}</span>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-700">Unwanted Habit:</span>
                  <span className="text-gray-600">{habitRepurposeData?.unwantedHabit?.habit_description || "N/A"}</span>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-700">Replacement Habit:</span>
                  <span className="text-gray-600">{habitRepurposeData?.replacement?.replacement_habit || "N/A"}</span>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-700">Environmental Design:</span>
                  <span className="text-gray-600">
                    I will make my bad habit harder by "{habitRepurposeData?.environment?.make_bad_habit_harder || "..."}". 
                    I will make my good habit easier by "{habitRepurposeData?.environment?.make_good_habit_easier || "..."}".
                  </span>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-700">My "If-Then" Plan:</span>
                  <span className="text-gray-600">
                    If "{habitRepurposeData?.simpleIfThen?.trigger_phrase || "my trigger"}", then I will "{habitRepurposeData?.simpleIfThen?.good_habit_phrase || "my good habit"}".
                  </span>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="font-semibold text-gray-700">My Backup Plan:</span>
                  <span className="text-gray-600">
                    When I face the obstacle of "{habitRepurposeData?.unwantedHabit?.habit_trigger || "..."}", 
                    my backup plan is to "{habitRepurposeData?.replacement?.action_routine || "..."}".
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button 
                onClick={handleBack}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              
              <Button 
                onClick={onBackToOptions}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Start Over
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default fallback for any other steps
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          onClick={handleBack}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button 
          onClick={onBackToOptions}
          variant="outline"
          size="sm"
        >
          Back to Journey Options
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-8">
          <h1 className="text-2xl font-bold mb-4">Habit Repurpose Wizard - Step {currentStep}</h1>
          <p className="text-lg text-gray-600">
            This is where the next steps of the habit repurpose wizard will go. Coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HabitRepurposeWizard;
