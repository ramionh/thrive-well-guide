
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Goal } from "@/types/user";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const goalSchema = z.object({
  name: z.string().min(1, "Name is required"),
  targetValue: z.number().min(0, "Target value must be positive"),
  currentValue: z.number().min(0, "Current value must be positive"),
  unit: z.string().min(1, "Unit is required"),
  category: z.enum(["sleep", "nutrition", "exercise", "other"]),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface GoalFormProps {
  goal?: Goal;
  onSubmit: (data: GoalFormData) => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ goal, onSubmit }) => {
  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: goal || {
      name: "",
      targetValue: 0,
      currentValue: 0,
      unit: "",
      category: "other",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Goal Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter goal name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="sleep">Sleep</SelectItem>
                  <SelectItem value="nutrition">Nutrition</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Target Value</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Value</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <FormControl>
                <Input placeholder="e.g., hours, steps, kg" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">{goal ? "Update Goal" : "Create Goal"}</Button>
      </form>
    </Form>
  );
};

export default GoalForm;
