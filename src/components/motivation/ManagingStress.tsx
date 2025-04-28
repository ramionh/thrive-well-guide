
import React from 'react';

// This is a placeholder component that is no longer used in the motivation journey
// It's kept to maintain compatibility with existing imports
const ManagingStress: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  // This component has been removed from the active journey
  // The onComplete callback is automatically triggered by the database change
  if (onComplete) {
    setTimeout(onComplete, 0);
  }
  return null;
};

export default ManagingStress;
