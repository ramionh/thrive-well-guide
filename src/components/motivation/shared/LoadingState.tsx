
import React from "react";

const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mb-3"></div>
        <p className="text-purple-700 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingState;
