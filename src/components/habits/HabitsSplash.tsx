
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ListChecks } from "lucide-react";

interface HabitsSplashProps {
  onStartJourney: () => void;
}

const HabitsSplash: React.FC<HabitsSplashProps> = ({ onStartJourney }) => {
  const [hideNextTime, setHideNextTime] = useState(false);

  const handleStartJourney = () => {
    if (hideNextTime) {
      localStorage.setItem('hideHabitsSplash', 'true');
    }
    onStartJourney();
  };

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center gap-2 mb-6">
        <ListChecks className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Habits and the Intention-Behavior Gap</h1>
      </div>

      <Card className="mb-8">
        <CardContent className="p-8 space-y-6">
          <div>
            <p className="text-lg leading-relaxed text-gray-700">
              We've all experienced it: deciding to start a new workout routine, cut out processed foods, or train for a 5K, only to find ourselves skipping the gym and reaching for comfort food within weeks. If our behaviors always matched our intentions, success would be simple and automatic. Yet research shows that upwards of 40% of our intentions fail to result in lasting behavior change. This common disconnect between what we want to do and what we actually do is known as the intention-behavior gap.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Why the Gap Exists</h3>
            <p className="text-lg leading-relaxed text-gray-700">
              The size of this gap varies depending on both the desired behavior and your current fitness habits. Making small changes—like adding 10 minutes to your daily walk or switching from soda to water—is far easier than attempting dramatic shifts, such as going from a sedentary lifestyle to training for a marathon. When our behaviors don't align with our health intentions, it's often because much of what we do is driven by habit rather than conscious choice. Habits are learned behaviors that happen automatically in specific contexts, without requiring conscious thought.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Bridging the Gap is a Learnable Skill</h3>
            <p className="text-lg leading-relaxed text-gray-700">
              If you struggle to stick with your fitness goals or maintain healthy eating habits, you're not alone—this is part of the human experience. The good news is that aligning behavior with health intentions is a skill that can be developed through consistent practice. Just as building strength requires progressive training, mastering your own health behaviors takes time and effort. By understanding the intention-behavior gap and working with proven tools and strategies, you can gradually close the distance between your current fitness level and your health goals.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Checkbox 
            id="hide-splash"
            checked={hideNextTime}
            onCheckedChange={(checked) => setHideNextTime(checked as boolean)}
          />
          <label 
            htmlFor="hide-splash" 
            className="text-sm text-gray-600 cursor-pointer"
          >
            Hide this screen next time
          </label>
        </div>
        
        <Button 
          onClick={handleStartJourney}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
        >
          Start your Habit Journey
        </Button>
      </div>
    </div>
  );
};

export default HabitsSplash;
