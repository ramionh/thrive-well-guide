
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";

interface WhereAreYouNowFormValues {
  progressSummary: string;
  readinessRating: number;
}

interface WhereAreYouNowProps {
  onComplete: () => void;
}

const WhereAreYouNow: React.FC<WhereAreYouNowProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<WhereAreYouNowFormValues>({
    defaultValues: {
      progressSummary: "",
      readinessRating: 5 // Default value in the middle
    }
  });

  // Fetch existing data if available
  useEffect(() => {
    const fetchExistingData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("motivation_where_are_you_now")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          form.reset({
            progressSummary: data.progress_summary || "",
            readinessRating: data.readiness_rating || 5
          });
        }
      } catch (error) {
        console.error("Error fetching where are you now data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingData();
  }, [user, form]);

  const onSubmit = async (values: WhereAreYouNowFormValues) => {
    if (!user) return;

    try {
      setIsLoading(true);

      const { data: existingData } = await supabase
        .from("motivation_where_are_you_now")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      let error;

      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from("motivation_where_are_you_now")
          .update({
            progress_summary: values.progressSummary,
            readiness_rating: values.readinessRating,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingData.id);

        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from("motivation_where_are_you_now")
          .insert({
            user_id: user.id,
            progress_summary: values.progressSummary,
            readiness_rating: values.readinessRating
          });

        error = insertError;
      }

      if (error) throw error;

      toast({
        title: "Progress saved",
        description: "Your readiness assessment has been saved"
      });

      onComplete();
    } catch (error) {
      console.error("Error saving where are you now data:", error);
      toast({
        title: "Error",
        description: "Failed to save your data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-700">
        In previous sections, you used scales to determine confidence and importance. 
        Let's use the same system to look at readiness. First, write a summary of your 
        current progress toward your fitness goal. Include why you want to change and 
        your barriers to change at this point.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="progressSummary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-purple-800 font-semibold">
                  Summary of current progress:
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your current progress, motivations, and barriers..."
                    className="min-h-[150px] border-purple-200 focus:border-purple-500"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="readinessRating"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-purple-800 font-semibold">
                  Readiness scale (1-10):
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value.toString()}
                    value={field.value.toString()}
                    className="flex flex-wrap gap-2 md:gap-4"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                      <div key={value} className="flex flex-col items-center">
                        <RadioGroupItem
                          value={value.toString()}
                          id={`readiness-${value}`}
                          className="border-purple-500"
                        />
                        <Label 
                          htmlFor={`readiness-${value}`}
                          className="mt-1 text-xs text-purple-700"
                        >
                          {value}
                        </Label>
                        {value === 1 && (
                          <span className="text-xs text-center mt-1">Not ready<br />at all</span>
                        )}
                        {value === 5 && (
                          <span className="text-xs text-center mt-1">Somewhat<br />ready</span>
                        )}
                        {value === 10 && (
                          <span className="text-xs text-center mt-1">Completely<br />ready</span>
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              </FormItem>
            )}
          />

          <Button 
            type="submit"
            className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default WhereAreYouNow;
