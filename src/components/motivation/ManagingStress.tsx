
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import LoadingState from "./shared/LoadingState";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ManagingStressProps {
  onComplete?: () => void;
}

const ManagingStress: React.FC<ManagingStressProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reflections, setReflections] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      
      // Save the user's reflections to the database using type assertion to bypass TypeScript error
      // until the types are regenerated
      const { error } = await (supabase
        .from('stress_management_reflections' as any)
        .insert({
          user_id: user.id,
          reflections: reflections
        }) as any);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your stress management reflections have been saved",
      });
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving stress management reflections:", error);
      toast({
        title: "Error",
        description: "Failed to save your reflections",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <h2 className="text-2xl font-bold text-purple-800">Managing Stress</h2>
        
        <p>
          Stress is a normal part of life, especially when making significant changes. Learning to
          manage stress effectively is crucial for maintaining your motivation and achieving your fitness goals.
        </p>
        
        <h3 className="text-xl font-medium text-purple-700">Understanding Stress</h3>
        <p>
          Stress is your body's reaction to challenging situations. While some stress can be motivating 
          (eustress), chronic or overwhelming stress (distress) can impede your progress and impact your health.
        </p>
        
        <h3 className="text-xl font-medium text-purple-700">Common Stressors When Making Fitness Changes:</h3>
        <ul className="list-disc ml-6">
          <li>Time constraints and schedule adjustments</li>
          <li>Physical discomfort during new exercises</li>
          <li>Social pressure or comparison to others</li>
          <li>Fear of failure or not seeing results quickly enough</li>
          <li>Disruption to established routines</li>
        </ul>
        
        <h3 className="text-xl font-medium text-purple-700">Effective Stress Management Techniques:</h3>
        <ul className="list-disc ml-6">
          <li><strong>Physical activity:</strong> Regular exercise itself can reduce stress hormones</li>
          <li><strong>Mindfulness and meditation:</strong> Practices that help center your thoughts</li>
          <li><strong>Deep breathing:</strong> Quick technique to activate your parasympathetic nervous system</li>
          <li><strong>Adequate sleep:</strong> Critical for stress recovery and hormonal balance</li>
          <li><strong>Healthy nutrition:</strong> Proper fueling reduces physical stress on the body</li>
          <li><strong>Social connections:</strong> Spending time with supportive people</li>
          <li><strong>Time management:</strong> Setting realistic schedules and expectations</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-purple-800">
              Your Stress Management Reflections
            </h3>
            <p className="mb-4">
              Reflect on how stress impacts your fitness journey and which stress management
              techniques you find most effective or would like to try.
            </p>
            
            <div>
              <Textarea
                value={reflections}
                onChange={(e) => setReflections(e.target.value)}
                placeholder="Share your thoughts on managing stress during your fitness journey..."
                className="min-h-[150px] border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            className="bg-purple-600 hover:bg-purple-700"
          >
            {isSubmitting ? "Saving..." : "Complete Step"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ManagingStress;
