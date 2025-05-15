
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import { StrengthApplication } from './types';

interface UseBuildOnYourStrengthsProps {
  onComplete?: () => void;
}

export const useBuildOnYourStrengths = ({ onComplete }: UseBuildOnYourStrengthsProps) => {
  const [applications, setApplications] = useState<StrengthApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const didInitialFetch = useRef(false);

  // Fetch strength applications data
  useEffect(() => {
    const fetchData = async () => {
      if (!user || didInitialFetch.current) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('motivation_strength_applications')
          .select('*')
          .eq('user_id', user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          throw error;
        }
        
        if (data && data.strength_applications) {
          setApplications(Array.isArray(data.strength_applications) ? data.strength_applications : []);
        } else {
          setApplications([{ strength: '', application: '' }]);
        }
      } catch (err: any) {
        console.error('Error fetching strength applications:', err);
        setError(err);
        toast({
          title: 'Error',
          description: 'Failed to load your strengths data',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
        didInitialFetch.current = true;
      }
    };
    
    fetchData();
  }, [user, toast]);
  
  // Add a new strength application
  const addApplication = () => {
    setApplications([...applications, { strength: '', application: '' }]);
  };
  
  // Update a strength application
  const updateApplication = (index: number, field: keyof StrengthApplication, value: string) => {
    const updated = [...applications];
    updated[index] = { ...updated[index], [field]: value };
    setApplications(updated);
  };
  
  // Remove a strength application
  const removeApplication = (index: number) => {
    setApplications(applications.filter((_, i) => i !== index));
  };
  
  // Save all strength applications
  const saveApplications = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to save your data',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Check if record exists
      const { data: existingData, error: findError } = await supabase
        .from('motivation_strength_applications')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (findError && findError.code !== 'PGRST116') {
        throw findError;
      }
      
      let result;
      
      if (existingData && existingData.id) {
        // Update existing record
        result = await supabase
          .from('motivation_strength_applications')
          .update({
            strength_applications: applications,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
      } else {
        // Insert new record
        result = await supabase
          .from('motivation_strength_applications')
          .insert({
            user_id: user.id,
            strength_applications: applications,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      // Update step progress
      await logStepProgress();
      
      toast({
        title: 'Success',
        description: 'Your strength applications have been saved',
      });
      
      if (onComplete) {
        onComplete();
      }
    } catch (err: any) {
      console.error('Error saving strength applications:', err);
      setError(err);
      toast({
        title: 'Error',
        description: 'Failed to save your data',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Log step progress
  const logStepProgress = async () => {
    if (!user) return;
    
    try {
      // Mark current step as completed
      await supabase
        .from('motivation_steps_progress')
        .upsert({
          user_id: user.id,
          step_number: 59,
          step_name: 'Build on Your Strengths',
          completed: true,
          available: true,
          completed_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,step_number'
        });
      
      // Make next step available
      await supabase
        .from('motivation_steps_progress')
        .upsert({
          user_id: user.id,
          step_number: 60,
          step_name: 'Envisioning Change',
          completed: false,
          available: true,
          completed_at: null
        }, {
          onConflict: 'user_id,step_number'
        });
    } catch (err) {
      console.error('Failed to log step progress:', err);
    }
  };
  
  return {
    applications,
    isLoading,
    isSaving,
    error,
    addApplication,
    updateApplication,
    removeApplication,
    saveApplications
  };
};
