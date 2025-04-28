
import React from "react";

/**
 * Component that displays the explanation text about different types of stress
 */
const StressTypeExplanation: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-purple-800 mb-4">
        Identifying Your Type of Stress
      </h2>
      <p className="text-gray-600 mb-4">
        We generally dislike stress because it makes us feel anxious, sad, or tense. 
        In extreme situations it overwhelms our ability to meet the demands of everyday life. 
        This is called distress, and it stems from difficult life events that challenge our 
        ability to adapt or cope, like the loss of a job or death of a loved one.
      </p>
      <p className="text-gray-600 mb-4">
        But there is another kind of stress. Eustress is a type of stressor that arises 
        when we experience something positive. It's what you might experience after being 
        promoted at work. While it feels awesome to be recognized for your efforts, the 
        new job may come with additional responsibilities that make you anxious. You might 
        also feel eustress while preparing to attend a fitness competition: while you're 
        excited about meeting new people and showing your progress, you're also nervous 
        and intimidated.
      </p>
    </div>
  );
};

export default StressTypeExplanation;
