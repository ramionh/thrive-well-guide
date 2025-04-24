
import React from 'react';
import { Card } from '@/components/ui/card';

const AmbivalenceCarousel = () => {
  return (
    <Card className="p-6 bg-purple-50 border-purple-200">
      <h2 className="text-2xl font-bold text-purple-800 mb-4">Understanding Your Ambivalence</h2>
      <div className="prose max-w-none">
        <p className="mb-4 text-purple-900">
          Ambivalence is a normal part of change. It's that feeling of uncertainty, 
          of being "in two minds" about something. When it comes to health and fitness goals, 
          you might simultaneously want to change and not want to change.
        </p>

        <p className="mb-4 text-purple-900">
          This internal conflict is completely natural. You might want the benefits of being 
          healthier and more fit, but also feel reluctant about the effort required or 
          uncertain about your ability to succeed.
        </p>

        <p className="mb-4 text-purple-900">
          Understanding and working through your ambivalence is a crucial step in making 
          lasting changes. Let's explore both sides of your feelings about making this change.
        </p>
      </div>
    </Card>
  );
};

export default AmbivalenceCarousel;
