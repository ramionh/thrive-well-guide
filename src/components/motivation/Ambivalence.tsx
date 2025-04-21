
import React from "react";

interface AmbivalenceProps {
  onComplete?: () => void;
}

const Ambivalence: React.FC<AmbivalenceProps> = ({ onComplete }) => {
  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <p>
          Now that you're thinking about your goal and potential obstacles, you may
          have noticed that some (or maybe all) of those hindrances are your own
          thoughts and actions. The greatest barrier to change is often that we can't
          seem to get out of our own way.
        </p>
        
        <p className="mt-4">
          People suffering from weight-related health issues know their eating habits and inactivity contribute
          to the problem, but many of us still find it difficult to change. Here are some
          important questions to consider:
        </p>

        <div className="mt-4 pl-4 border-l-4 border-purple-300">
          <p className="font-medium text-purple-800">
            How big is the gap or disparity between your current actions and your
            ultimate goal?
          </p>
        </div>
        
        <h3 className="mt-6 text-xl font-semibold">Screen 2</h3>
        
        <p>
          You may be feeling a bit overwhelmed or even hopeless. These negative
          emotions do not inspire change. If simply being miserable led to successful
          change, nobody would need a book about motivation. But being
          uncomfortable is a step in the right direction. Dwelling on what we're doing
          wrong, however, won't get us to the finish line.
        </p>
        
        <h3 className="mt-6 text-xl font-semibold">Screen 3</h3>
        
        <p>
          <span className="font-medium">What are my concerns?</span>
        </p>
        
        <p>
          You might have a general idea that you need to change one aspect of
          your fitness but are unsure what the change should be. You
          don't have to address all the following topics, as we have plenty of
          time to narrow things down later. Pick one or two core habits to focus on.
        </p>
      </div>
    </div>
  );
};

export default Ambivalence;
