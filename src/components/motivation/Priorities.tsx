
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';

interface PrioritiesFormData {
  dailyTasks: string;
  importantUrgent: string;
  importantNotUrgent: string;
  notImportantUrgent: string;
  notImportantNotUrgent: string;
}

const Priorities = ({ onComplete }: { onComplete: () => void }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<PrioritiesFormData>({
    defaultValues: {
      dailyTasks: '',
      importantUrgent: '',
      importantNotUrgent: '',
      notImportantUrgent: '',
      notImportantNotUrgent: '',
    }
  });

  useEffect(() => {
    const fetchPrioritiesData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('motivation_priorities')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        if (data) {
          form.reset({
            dailyTasks: data.daily_tasks || '',
            importantUrgent: data.important_urgent || '',
            importantNotUrgent: data.important_not_urgent || '',
            notImportantUrgent: data.not_important_urgent || '',
            notImportantNotUrgent: data.not_important_not_urgent || '',
          });
        }
      } catch (error) {
        console.error('Error fetching priorities data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load your priorities data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrioritiesData();
  }, [user, form, toast]);

  const onSubmit = async (formData: PrioritiesFormData) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('motivation_priorities')
        .upsert({
          user_id: user.id,
          daily_tasks: formData.dailyTasks,
          important_urgent: formData.importantUrgent,
          important_not_urgent: formData.importantNotUrgent,
          not_important_urgent: formData.notImportantUrgent,
          not_important_not_urgent: formData.notImportantNotUrgent,
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Your priorities have been saved',
      });
      
      onComplete();
    } catch (error) {
      console.error('Error saving priorities:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your priorities',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        What are your daily tasks and activities? Write them down no matter how trivial or how significant they seem.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="dailyTasks"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="dailyTasks" className="text-purple-800 font-medium">
                  Daily tasks and activities
                </Label>
                <FormControl>
                  <Textarea 
                    id="dailyTasks"
                    className="min-h-[120px]" 
                    placeholder="List your daily tasks and activities here..." 
                    disabled={isLoading}
                    {...field} 
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="space-y-2">
            <Label className="text-purple-800 font-medium">
              Place each task and activity in a quadrant below:
            </Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="importantUrgent"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="importantUrgent" className="font-medium bg-purple-100 p-2 w-full block text-purple-800 rounded-md">
                      IMPORTANT AND URGENT
                    </Label>
                    <FormControl>
                      <Textarea 
                        id="importantUrgent"
                        className="min-h-[100px]" 
                        placeholder="Tasks that are both important and urgent..."
                        disabled={isLoading}
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="importantNotUrgent"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="importantNotUrgent" className="font-medium bg-purple-100 p-2 w-full block text-purple-800 rounded-md">
                      IMPORTANT AND NOT URGENT
                    </Label>
                    <FormControl>
                      <Textarea 
                        id="importantNotUrgent"
                        className="min-h-[100px]" 
                        placeholder="Tasks that are important but not urgent..."
                        disabled={isLoading}
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notImportantUrgent"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="notImportantUrgent" className="font-medium bg-purple-100 p-2 w-full block text-purple-800 rounded-md">
                      NOT IMPORTANT BUT URGENT
                    </Label>
                    <FormControl>
                      <Textarea 
                        id="notImportantUrgent"
                        className="min-h-[100px]" 
                        placeholder="Tasks that are not important but urgent..."
                        disabled={isLoading}
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notImportantNotUrgent"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="notImportantNotUrgent" className="font-medium bg-purple-100 p-2 w-full block text-purple-800 rounded-md">
                      NOT IMPORTANT AND NOT URGENT
                    </Label>
                    <FormControl>
                      <Textarea 
                        id="notImportantNotUrgent"
                        className="min-h-[100px]" 
                        placeholder="Tasks that are neither important nor urgent..."
                        disabled={isLoading}
                        {...field} 
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Complete Step'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Priorities;
