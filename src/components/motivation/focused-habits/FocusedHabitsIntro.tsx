
import React from 'react';
import { Card } from '@/components/ui/card';

const FocusedHabitsIntro = () => (
  <Card className="p-6 bg-purple-50 border-purple-200">
    <h2 className="text-2xl font-bold text-purple-800 mb-4">Focusing</h2>
    <div className="prose max-w-none">
      <p className="mb-4 text-purple-900">
        Now that you're thinking about your goal and potential obstacles, you may
        have noticed that some (or maybe all) of those hindrances are your own
        thoughts and actions. The greatest barrier to change is often that we can't
        seem to get out of our own way.
      </p>
      <p className="mb-4 text-purple-900">
        People suffering from weight-related health issues know their eating habits and inactivity contribute
        to the problem, but many of us still find it difficult to change.
      </p>
      <p className="mb-6 font-semibold text-purple-700">
        How big is the gap or disparity between your current actions and your
        ultimate goal?
      </p>
      <p className="mb-4 text-purple-900">
        You may be feeling a bit overwhelmed or even hopeless. These negative
        emotions do not inspire change. If simply being miserable led to successful
        change, nobody would need a book about motivation. But being
        uncomfortable is a step in the right direction.
      </p>
      <p className="text-purple-900">
        Dwelling on what we're doing wrong, however, won't get us to the finish line.
      </p>
    </div>
  </Card>
);

export default FocusedHabitsIntro;
