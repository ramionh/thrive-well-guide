
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const AmbivalenceCarousel = () => {
  return (
    <Card className="bg-white shadow-lg border-2 border-purple-200">
      <CardContent className="p-6 md:p-8">
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">Understanding Your Ambivalence</h2>
          <p className="mb-4 text-purple-700">
            Ambivalence is a normal part of change. It's that feeling of uncertainty, 
            of being "in two minds" about something. When it comes to health and fitness goals, 
            you might simultaneously want to change and not want to change.
          </p>

          <p className="mb-4 text-purple-700">
            This internal conflict is completely natural. You might want the benefits of being 
            healthier and more fit, but also feel reluctant about the effort required or 
            uncertain about your ability to succeed.
          </p>

          <p className="mb-4 text-purple-700">
            Understanding and working through your ambivalence is a crucial step in making 
            lasting changes. Let's explore both sides of your feelings about making this change.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AmbivalenceCarousel;
