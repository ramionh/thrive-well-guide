
import React from 'react';
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const measurementsSchema = z.object({
  weight: z.number()
    .min(50, "Weight must be at least 50 lbs")
    .max(1000, "Weight must be less than 1000 lbs"),
  bodyfat: z.number()
    .min(1, "Body fat must be at least 1%")
    .max(100, "Body fat must be less than 100%")
    .optional()
    .nullable(),
});

type FormValues = z.infer<typeof measurementsSchema>;

interface MeasurementsFormProps {
  weight: number | '';
  setWeight: (value: number | '') => void;
  bodyfat: number | '';
  setBodyfat: (value: number | '') => void;
}

const MeasurementsForm = ({ weight, setWeight, bodyfat, setBodyfat }: MeasurementsFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(measurementsSchema),
    defaultValues: {
      weight: typeof weight === 'number' ? weight : undefined,
      bodyfat: typeof bodyfat === 'number' ? bodyfat : undefined,
    },
  });

  const onValueChange = (field: 'weight' | 'bodyfat', value: string) => {
    const numValue = value ? Number(value) : '';
    if (field === 'weight') {
      setWeight(numValue);
    } else {
      setBodyfat(numValue);
    }
  };

  return (
    <Form {...form}>
      <form className="mt-8 space-y-4 max-w-md mx-auto">
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Weight (lbs) *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter your weight in pounds"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.valueAsNumber);
                    onValueChange('weight', e.target.value);
                  }}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bodyfat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Body Fat % (optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter your estimated body fat percentage"
                  min="1"
                  max="100"
                  step="0.1"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.valueAsNumber);
                    onValueChange('bodyfat', e.target.value);
                  }}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default MeasurementsForm;
