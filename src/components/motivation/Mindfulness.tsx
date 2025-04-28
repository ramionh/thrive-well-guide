
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMindfulness } from "@/hooks/useMindfulness";
import LoadingState from "./shared/LoadingState";

interface MindfulnessProps {
  onComplete?: () => void;
}

const Mindfulness: React.FC<MindfulnessProps> = ({ onComplete }) => {
  const {
    formData,
    isLoading,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  } = useMindfulness(onComplete);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <p>
          If you're a worrier, you probably find it hard to still your thoughts. If you struggle with this, you might want to try mindfulness, 
          which is a method of calming your mind and body by being present in the moment. Mindfulness involves observing your surroundings 
          through all your senses, putting these observations into words, and staying in the moment. This practice can help calm your anxiety, 
          reduce stress, and keep you focused on your fitness goals.
        </p>
        
        <p>
          If all that sounds intimidating, don't worry—you don't have to figure out how to be mindful on your own. There are many techniques 
          to help people experience mindfulness, including meditation, which focuses attention and awareness. There are many different forms 
          of meditation, and a lot of meditation resources to help you get started, including websites and phone apps.
        </p>
        
        <p>
          Pick a five-minute meditation from any site or app. If you don't know where to start, Mindful.org has a section called 
          Meditation 101: Simple Guided Meditations, which is full of simple guided meditations.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 text-purple-800">
              After you have completed the meditation, answer these questions:
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="thoughts" className="block text-sm font-medium text-purple-700 mb-1">
                  What were you thinking about while you were listening?
                </label>
                <Textarea
                  id="thoughts"
                  value={formData.thoughts}
                  onChange={(e) => handleInputChange("thoughts", e.target.value)}
                  placeholder="Describe your thoughts during meditation..."
                  className="min-h-[80px] border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              
              <div>
                <label htmlFor="feelings" className="block text-sm font-medium text-purple-700 mb-1">
                  What were you feeling while you were listening?
                </label>
                <Textarea
                  id="feelings"
                  value={formData.feelings}
                  onChange={(e) => handleInputChange("feelings", e.target.value)}
                  placeholder="Describe your feelings during meditation..."
                  className="min-h-[80px] border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              
              <div>
                <label htmlFor="bodyReactions" className="block text-sm font-medium text-purple-700 mb-1">
                  How was your body reacting while you were listening?
                </label>
                <Textarea
                  id="bodyReactions"
                  value={formData.bodyReactions}
                  onChange={(e) => handleInputChange("bodyReactions", e.target.value)}
                  placeholder="Describe your physical sensations during meditation..."
                  className="min-h-[80px] border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              
              <div>
                <label htmlFor="afterFeelings" className="block text-sm font-medium text-purple-700 mb-1">
                  How did you feel after you meditated?
                </label>
                <Textarea
                  id="afterFeelings"
                  value={formData.afterFeelings}
                  onChange={(e) => handleInputChange("afterFeelings", e.target.value)}
                  placeholder="Describe how you felt after meditation..."
                  className="min-h-[80px] border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
              
              <div>
                <label htmlFor="goalApplication" className="block text-sm font-medium text-purple-700 mb-1">
                  How can mindfulness help you achieve your goal?
                </label>
                <Textarea
                  id="goalApplication"
                  value={formData.goalApplication}
                  onChange={(e) => handleInputChange("goalApplication", e.target.value)}
                  placeholder="Describe how mindfulness can support your fitness goals..."
                  className="min-h-[80px] border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                />
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

export default Mindfulness;
