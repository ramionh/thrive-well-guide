
import React from "react";

const ExampleSection: React.FC = () => {
  return (
    <div className="bg-purple-50 p-4 rounded-md mb-6">
      <p className="text-gray-700 italic">
        In this example, the goal is to exercise more regularly and build strength.
      </p>
      
      <p className="text-gray-700 italic mt-2">
        <strong>Cultural beliefs:</strong> My culture believes it's important to stay active throughout life. 
        This will help me prioritize fitness as a lifestyle, not just a temporary fix.
      </p>
      
      <p className="text-gray-700 italic mt-2">
        <strong>Cultural customs:</strong> We regularly participate in community sports and activities. 
        If I join a local fitness class, it would align with our cultural emphasis on group physical activities.
      </p>
      
      <p className="text-gray-700 italic mt-2">
        <strong>Religious beliefs:</strong> My faith teaches me that the body is a temple. 
        This can help me view exercise as a form of self-care and respect for my physical health.
      </p>
    </div>
  );
};

export default ExampleSection;
