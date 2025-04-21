
import React from 'react';
import { Card } from '@/components/ui/card';

const ObstaclesIntro = () => {
  return (
    <Card className="p-6 bg-purple-50 border-purple-200">
      <h2 className="text-2xl font-bold text-purple-800 mb-4">INTERNAL OBSTACLES (THE VOICE IN YOUR HEAD)</h2>
      <div className="prose max-w-none">
        <p className="mb-4 text-purple-900">
          Internal obstacles are thoughts, beliefs, fears, and other barriers that can keep you from reaching, 
          or sometimes even attempting to reach, your goals. People often describe this as "the voice in your head" 
          that comes up with reasons, rationalizations, or excuses to self-sabotage or avoid taking action.
        </p>
        <p className="mb-4 text-purple-900">
          For many people, if you tried and failed to change in the past, you may now have strong feelings of 
          apprehension or fear about trying again. These emotions may lead you to question your self-worth and 
          can lead to strong negative self-talk.
        </p>
        <div className="space-y-2 mb-4 text-purple-800">
          <p>→ "I'd like to get fit, but I've failed so many times before. I'm just not athletic."</p>
          <p>→ "I don't have it in me to work out that hard."</p>
          <p>→ "I can always start my fitness routine next month."</p>
          <p>→ "I don't think I can deal with the lifestyle changes this will cause me and my family."</p>
          <p>→ "I have too much going on to focus on getting in shape right now."</p>
        </div>
      </div>
    </Card>
  );
};

export default ObstaclesIntro;
