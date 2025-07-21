
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  height: z.string().min(1, "Height is required"),
});

type FormValues = z.infer<typeof measurementsSchema>;

interface MeasurementsFormProps {
  weight: number | '';
  setWeight: (value: number | '') => void;
  bodyfat: number | '';
  setBodyfat: (value: number | '') => void;
  height: string;
  setHeight: (value: string) => void;
}

const MeasurementsForm = ({ weight, setWeight, bodyfat, setBodyfat, height, setHeight }: MeasurementsFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(measurementsSchema),
    defaultValues: {
      weight: typeof weight === 'number' ? weight : undefined,
      bodyfat: typeof bodyfat === 'number' ? bodyfat : undefined,
      height: height || '',
    },
  });

  const onValueChange = (field: 'weight' | 'bodyfat' | 'height', value: string) => {
    if (field === 'height') {
      setHeight(value);
    } else {
      const numValue = value ? Number(value) : '';
      if (field === 'weight') {
        setWeight(numValue);
      } else {
        setBodyfat(numValue);
      }
    }
  };

  // Generate height options from 4'6" to 7'0"
  const heightOptions = [];
  for (let feet = 4; feet <= 7; feet++) {
    const maxInches = feet === 7 ? 0 : 11; // Stop at 7'0"
    const minInches = feet === 4 ? 6 : 0; // Start at 4'6"
    for (let inches = minInches; inches <= maxInches; inches++) {
      const value = `${feet}'${inches}"`;
      heightOptions.push(value);
    }
  }

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
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height *</FormLabel>
              <FormControl>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    onValueChange('height', value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your height" />
                  </SelectTrigger>
                  <SelectContent>
                    {heightOptions.map((heightOption) => (
                      <SelectItem key={heightOption} value={heightOption}>
                        {heightOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
