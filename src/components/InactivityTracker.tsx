import { useInactivityTimeout } from '@/hooks/useInactivityTimeout';

export const InactivityTracker = () => {
  useInactivityTimeout();
  return null; // This component doesn't render anything
};