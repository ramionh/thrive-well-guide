
import React from "react";

interface LoadingStateProps {
  size?: "small" | "medium" | "large";
}

const LoadingState: React.FC<LoadingStateProps> = ({ size = "medium" }) => {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-4",
    large: "h-12 w-12 border-4"
  };

  return (
    <div className="flex justify-center py-8">
      <div 
        className={`animate-spin ${sizeClasses[size]} border-purple-500 rounded-full border-t-transparent`}
        aria-label="Loading"
      />
    </div>
  );
};

export default LoadingState;
