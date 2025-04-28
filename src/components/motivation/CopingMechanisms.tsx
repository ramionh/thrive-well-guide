
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCopingMechanisms } from "@/hooks/useCopingMechanisms";
import LoadingState from "./shared/LoadingState";

interface CopingMechanismsProps {
  onComplete?: () => void;
}

const CopingMechanisms: React.FC<CopingMechanismsProps> = ({ onComplete }) => {
  const {
    formData,
    isLoading,
    isSubmitting,
    handleCurrentTechniqueChange,
    handleNewTechniqueChange,
    handleExplanationChange,
    handleSubmit,
  } = useCopingMechanisms(onComplete);

  if (isLoading) {
    return <LoadingState message="Loading your coping mechanisms..." />;
  }

  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <p>
          Now that you have identified your stressors and assessed them, it's time to figure out 
          the best ways for you to cope with those you rated 4 or 5.
        </p>
        
        <p>
          We can generally divide coping mechanisms into two broad categories: problem-focused coping 
          strategies and emotion-focused coping strategies.
        </p>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-purple-800">Problem-focused coping strategies</h3>
          <p>
            Steps we take to reduce or remove the problem that is causing stress, resulting in direct 
            reduction of the stress. This includes:
          </p>
          <ol className="list-decimal ml-6">
            <li><strong>Taking action.</strong> Identifying realistic solutions or actions you can take to address the problem.</li>
            <li><strong>Asking for help.</strong> Identifying sources of social support that can assist you in solving your problem.</li>
            <li><strong>Managing your time.</strong> Assessing the time requirements of your demands, then prioritizing.</li>
          </ol>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-purple-800">Emotion-focused coping strategies</h3>
          <p>
            Strategies that focus on reducing the negative thoughts and feelings that arise from the problem 
            or stressful event. Emotion-focused coping strategies are especially useful when you cannot eliminate 
            or change the problem or stressor. This includes:
          </p>
          <ol className="list-decimal ml-6">
            <li><strong>Keeping yourself busy.</strong> If you stay busy, you may be less likely to focus on the problem or stressor.</li>
            <li><strong>Meditating and praying.</strong> Turning inward through meditation or prayer can provide a respite from focusing on the stressor or problem, and the calming effects can last a while.</li>
            <li><strong>Writing it down.</strong> Journaling provides an opportunity to explore the stressor and devise a plan for dealing with it.</li>
            <li><strong>Reassessing the problem.</strong> It can be useful to ask yourself if you're seeing the problem clearly to determine whether the stressor is as bad as it seems.</li>
            <li><strong>Talking it out.</strong> Talking to a close friend, a partner, a personal trainer, or a therapist can provide an opportunity to let out your feelings about the stressor, which may ease those feelings.</li>
          </ol>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-purple-800">
              Current Techniques
            </h3>
            <p className="mb-4">
              Identify two techniques you currently use to cope with stressors or problems. 
              Briefly explain how successful these techniques are in helping you manage stress.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="currentTechnique1" className="block text-sm font-medium text-purple-700 mb-1">
                  Technique 1
                </label>
                <Textarea
                  id="currentTechnique1"
                  value={formData.currentTechniques[0]}
                  onChange={(e) => handleCurrentTechniqueChange(0, e.target.value)}
                  placeholder="Describe a technique you currently use..."
                  className="min-h-[80px] border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              
              <div>
                <label htmlFor="currentTechnique2" className="block text-sm font-medium text-purple-700 mb-1">
                  Technique 2
                </label>
                <Textarea
                  id="currentTechnique2"
                  value={formData.currentTechniques[1]}
                  onChange={(e) => handleCurrentTechniqueChange(1, e.target.value)}
                  placeholder="Describe another technique you currently use..."
                  className="min-h-[80px] border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-purple-800">
              New Techniques
            </h3>
            <p className="mb-4">
              Identify two techniques you do not currently use to cope with stressors but are willing to try. 
              Briefly explain why you chose these new techniques.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="newTechnique1" className="block text-sm font-medium text-purple-700 mb-1">
                  New Technique 1
                </label>
                <Textarea
                  id="newTechnique1"
                  value={formData.newTechniques[0]}
                  onChange={(e) => handleNewTechniqueChange(0, e.target.value)}
                  placeholder="Describe a new technique you would like to try..."
                  className="min-h-[80px] border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              
              <div>
                <label htmlFor="newTechnique2" className="block text-sm font-medium text-purple-700 mb-1">
                  New Technique 2
                </label>
                <Textarea
                  id="newTechnique2"
                  value={formData.newTechniques[1]}
                  onChange={(e) => handleNewTechniqueChange(1, e.target.value)}
                  placeholder="Describe another new technique you would like to try..."
                  className="min-h-[80px] border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3 text-purple-800">
              Impact on Your Goal
            </h3>
            <p className="mb-4">
              Explain how using stress management techniques will help you achieve your goal.
            </p>
            
            <div>
              <Textarea
                id="explanation"
                value={formData.explanation}
                onChange={(e) => handleExplanationChange(e.target.value)}
                placeholder="Describe how managing stress will help you achieve your fitness goals..."
                className="min-h-[120px] border-purple-200 focus:border-purple-400 focus:ring-purple-400"
              />
              
              <div className="mt-3 text-sm italic text-purple-600">
                Example: "If I cope with stress better, it will be easier for me to take time to exercise, and I'll be less likely to skip workouts because of stress."
              </div>
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

export default CopingMechanisms;
