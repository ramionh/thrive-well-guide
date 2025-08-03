import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Scale } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMacros } from "@/hooks/useMacros";

const WeeklyCheckIn: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [frontPhoto, setFrontPhoto] = useState<File | null>(null);
  const [backPhoto, setBackPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const { assignNewMacros } = useMacros();

  const estimateBodyFat = (weightLbs: number, height: number) => {
    // Simple BMI-based estimation (this is a placeholder - in reality you'd use computer vision)
    const bmi = (weightLbs * 703) / (height * height);
    
    // Basic estimation based on BMI ranges
    if (bmi < 18.5) return 8; // Underweight
    if (bmi < 25) return 15; // Normal
    if (bmi < 30) return 25; // Overweight
    return 35; // Obese
  };

  const uploadPhoto = async (file: File, photoType: 'front' | 'back'): Promise<string> => {
    if (!user) throw new Error("User not authenticated");

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${photoType}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('weekly-checkins')
      .upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('weekly-checkins')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit check-in");
      return;
    }

    if (!weight || !frontPhoto || !backPhoto) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload photos
      const [frontPhotoUrl, backPhotoUrl] = await Promise.all([
        uploadPhoto(frontPhoto, 'front'),
        uploadPhoto(backPhoto, 'back')
      ]);

      // For now, use a default height - in production you'd get this from user profile
      const height = 70; // Default to 5'10" (70 inches)
      const weightLbs = parseFloat(weight);
      const estimatedBodyFat = estimateBodyFat(weightLbs, height);

      // Save check-in data
      const { error } = await supabase
        .from('weekly_checkins')
        .insert({
          user_id: user.id,
          weight_lbs: weightLbs,
          estimated_bodyfat_percentage: estimatedBodyFat,
          front_photo_url: frontPhotoUrl,
          back_photo_url: backPhotoUrl,
          notes: notes || null
        });

      if (error) throw error;

      // Assign new macros based on the check-in weight
      await assignNewMacros(weightLbs, 'maintain', 'moderate');

      toast.success(`Check-in saved! Estimated body fat: ${estimatedBodyFat.toFixed(1)}%`);
      setIsOpen(false);
      
      // Reset form
      setWeight("");
      setNotes("");
      setFrontPhoto(null);
      setBackPhoto(null);

    } catch (error) {
      console.error('Error saving check-in:', error);
      toast.error("Failed to save check-in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Scale className="h-4 w-4" />
          Weekly Check-in
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Weekly Check-in</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="weight">Weight (lbs) *</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your current weight"
              required
            />
          </div>

          <div>
            <Label htmlFor="front-photo">Front Photo *</Label>
            <Input
              id="front-photo"
              type="file"
              accept="image/*"
              onChange={(e) => setFrontPhoto(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div>
            <Label htmlFor="back-photo">Back Photo *</Label>
            <Input
              id="back-photo"
              type="file"
              accept="image/*"
              onChange={(e) => setBackPhoto(e.target.files?.[0] || null)}
              required
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling? Any observations?"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Check-in"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WeeklyCheckIn;