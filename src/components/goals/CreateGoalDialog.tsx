
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CreateGoalDialogProps {
  userId: string;
  currentBodyTypeId: string;
  onGoalCreated: () => void;
}

const CreateGoalDialog: React.FC<CreateGoalDialogProps> = ({ userId, currentBodyTypeId, onGoalCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [weight, setWeight] = useState<string>('');
  const [bodyfat, setBodyfat] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!weight || isNaN(Number(weight)) || Number(weight) < 50 || Number(weight) > 1000) {
      toast.error('Please enter a valid weight between 50 and 1000 lbs');
      return;
    }

    if (bodyfat && (isNaN(Number(bodyfat)) || Number(bodyfat) < 1 || Number(bodyfat) > 100)) {
      toast.error('Body fat percentage must be between 1% and 100%');
      return;
    }

    setIsSubmitting(true);

    try {
      // First, get the next better body type using the SQL function
      const { data: goalBodyTypeId, error: functionError } = await supabase
        .rpc('get_next_better_body_type', { current_body_type_id: currentBodyTypeId });

      if (functionError) throw functionError;

      const startDate = new Date().toISOString().split('T')[0];

      // Create the goal
      const { error: goalError } = await supabase
        .from('goals')
        .insert({
          user_id: userId,
          current_body_type_id: currentBodyTypeId,
          goal_body_type_id: goalBodyTypeId,
          started_date: startDate,
        });

      if (goalError) throw goalError;

      // Save the body measurements
      const { error: measurementsError } = await supabase
        .from('user_body_types')
        .insert({
          user_id: userId,
          body_type_id: currentBodyTypeId,
          selected_date: startDate,
          weight_lbs: Number(weight),
          bodyfat_percentage: bodyfat ? Number(bodyfat) : null
        });

      if (measurementsError) throw measurementsError;

      toast.success('Goal created successfully!');
      onGoalCreated();
      setIsOpen(false);
    } catch (error: any) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create New Goal</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Transformation Goal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Current Weight (lbs) *</Label>
            <Input
              id="weight"
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your weight in pounds"
              min="50"
              max="1000"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bodyfat">Estimated Body Fat % (optional)</Label>
            <Input
              id="bodyfat"
              type="number"
              value={bodyfat}
              onChange={(e) => setBodyfat(e.target.value)}
              placeholder="Enter your estimated body fat percentage"
              min="1"
              max="100"
              step="0.1"
            />
          </div>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !weight}
            className="w-full"
          >
            {isSubmitting ? 'Creating Goal...' : 'Create Goal'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGoalDialog;
