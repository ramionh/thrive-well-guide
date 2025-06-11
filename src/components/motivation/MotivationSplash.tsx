import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface MotivationSplashProps {
  onContinue: () => void;
}

const MotivationSplash: React.FC<MotivationSplashProps> = ({ onContinue }) => {
  const [hideNextTime, setHideNextTime] = useState(false);

  const handleContinue = () => {
    if (hideNextTime) {
      localStorage.setItem('hideMotivationSplash', 'true');
    }
    onContinue();
  };

  return (
    <Card className="bg-white shadow-lg border-2 border-purple-300">
      <CardContent className="p-6 md:p-8">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Understanding Motivation</h2>
          <p className="mb-4">
            Motivation is complex. Making a change requires you to be willing, able, and
            ready. Feeling willing is the first step. Recognizing that something should
            change shows a willingness and openness to doing things differently. Next is
            confidence in your ability to make a change. Change is hard, and you have to
            feel up to the task. Being ready requires a sense of urgency and a desire to
            prioritize. This is generally the last piece to fall into place. We often say
            someone "just isn't ready." It doesn't mean they have no motivation or are in
            denial. It just may not be important enough yet.
          </p>
          
          <h3 className="text-xl font-semibold text-purple-700 mt-6 mb-3">What, Why and Then How?</h3>
          <p className="mb-4">
            Our process isn't about coercing, convincing, or bribing you to
            change. It's about strengthening your own desires, abilities, reasons, and need
            for change. Our process helps you figure out
            what your health and fitness goals are, why you want to make the change, and, finally,
            how to make that change.
          </p>
          
          <p className="mb-4">
            Notice the how part comes last? Too often, we work on how first, rushing
            to fix a problem before we've even committed to the goal of solving it. But
            fully understanding your fitness goals and why you want to pursue it before taking
            any action will make you more likely to achieve it
          </p>
          
          <p className="mb-4">
            Trying to figure out how you're going to achieve a goal before
            you've fully committed to it often leads to a plan you won't stick with, steps
            that don't work the way you want them to, and general frustration and
            confusion. That's why it's so important to strengthen your desires, abilities,
            reasons, and needs for change before you begin pursuing a plan.
          </p>
          
          <div className="flex flex-col items-center mt-8 space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox 
                id="hide-motivation-splash"
                checked={hideNextTime}
                onCheckedChange={(checked) => setHideNextTime(checked as boolean)}
              />
              <label 
                htmlFor="hide-motivation-splash" 
                className="text-sm text-gray-600 cursor-pointer"
              >
                Hide this screen next time
              </label>
            </div>
            
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6"
              onClick={handleContinue}
            >
              Continue Your Motivation Journey
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MotivationSplash;
