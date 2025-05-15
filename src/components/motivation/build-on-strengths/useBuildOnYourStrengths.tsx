
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/context/UserContext';
import { StrengthApplication } from './types';

interface UseBuildOnYourStrengthsProps {
  onComplete?: () => void;
}

export const useBuildOnYourStrengths = ({ onComplete }: UseBuildOnYourStrengthsProps) => {
  const [applications, setApplications] = useState<StrengthApplication[]>([
    { strength: '', application: '' },
    { strength: '', application: '' },
    { strength: '', application: '' }
  ]);
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
          // Parse the data properly
          const fetchedApps: StrengthApplication[] = Array.isArray(data.strength_applications) 
            ? (data.strength_applications as any[]).map((app: any) => ({
                strength: app.strength || '',
                application: app.application || ''
              }))
            : [{ strength: '', application: '' }];
            
          // Ensure we have exactly 3 entries
          let updatedApps = [...fetchedApps];
          while (updatedApps.length < 3) {
            updatedApps.push({ strength: '', application: '' });
          }
          
          setApplications(updatedApps.slice(0, 3));
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
  
  // Update a strength application
  const updateApplication = (index: number, field: keyof StrengthApplication, value: string) => {
    const updated = [...applications];
    updated[index] = { ...updated[index], [field]: value };
    setApplications(updated);
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
      
      // Convert to JSON for Supabase
      const jsonApps = applications.map(app => ({
        strength: app.strength,
        application: app.application
      }));
      
      if (existingData && existingData.id) {
        // Update existing record
        result = await supabase
          .from('motivation_strength_applications')
          .update({
            strength_applications: jsonApps,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
      } else {
        // Insert new record
        result = await supabase
          .from('motivation_strength_applications')
          .insert({
            user_id: user.id,
            strength_applications: jsonApps,
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
    updateApplication,
    saveApplications
  };
};
