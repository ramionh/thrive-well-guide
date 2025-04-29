
import React from "react";

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
    </div>
  );
};

export default LoadingState;
