import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Scale, Camera } from "lucide-react";

interface InitialCheckInStepProps {
  onNext: () => void;
}

const InitialCheckInStep: React.FC<InitialCheckInStepProps> = ({ onNext }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [weight, setWeight] = useState("");
  const [frontPhoto, setFrontPhoto] = useState<File | null>(null);
  const [backPhoto, setBackPhoto] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estimateBodyFat = (weightLbs: number, height: number): number => {
    // Simple BMI-based estimation (placeholder)
    const heightM = height * 0.0254;
    const weightKg = weightLbs * 0.453592;
    const bmi = weightKg / (heightM * heightM);
    
    // Basic estimation - this would be more sophisticated in a real app
    if (bmi < 18.5) return 8;
    if (bmi < 25) return 15;
    if (bmi < 30) return 25;
    return 35;
  };

  const uploadPhoto = async (file: File, photoType: 'front' | 'back'): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${user?.id}/${Date.now()}_${photoType}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from('weekly-checkins')
      .upload(fileName, file);

    if (uploadError) {
      throw uploadError;
    }

    return fileName;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight) {
      toast({
        title: "Weight Required",
        description: "Please enter your current weight to continue.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let frontPhotoUrl = null;
      let backPhotoUrl = null;

      // Upload photos if provided
      if (frontPhoto) {
        frontPhotoUrl = await uploadPhoto(frontPhoto, 'front');
      }
      if (backPhoto) {
        backPhotoUrl = await uploadPhoto(backPhoto, 'back');
      }

      // Get user profile for height calculation
      const { data: profile } = await supabase
        .from('profiles')
        .select('height_feet, height_inches')
        .eq('id', user?.id)
        .single();

      const heightInches = (profile?.height_feet || 0) * 12 + (profile?.height_inches || 0);
      const estimatedBodyFat = estimateBodyFat(parseFloat(weight), heightInches);

      // Save the check-in data
      const { error } = await supabase
        .from('weekly_checkins')
        .insert({
          user_id: user?.id,
          weight_lbs: parseFloat(weight),
          body_fat_percentage: estimatedBodyFat,
          front_photo_url: frontPhotoUrl,
          back_photo_url: backPhotoUrl,
          notes: notes || null
        });

      if (error) throw error;

      toast({
        title: "Initial Check-In Complete!",
        description: "Your baseline measurements have been saved.",
      });

      onNext();
    } catch (error) {
      console.error('Error saving initial check-in:', error);
      toast({
        title: "Error",
        description: "Failed to save your check-in. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, photoType: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      if (photoType === 'front') {
        setFrontPhoto(file);
      } else {
        setBackPhoto(file);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Scale className="h-5 w-5" />
          Initial Check-In
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Let's establish your baseline measurements to track your progress throughout your GenXShred journey.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Weight Input */}
          <div className="space-y-2">
            <Label htmlFor="weight" className="text-sm font-medium">
              Current Weight (lbs) *
            </Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              min="50"
              max="500"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter your current weight"
              required
            />
          </div>

          {/* Photo Uploads */}
          <div className="space-y-4">
            <Label className="text-sm font-medium">Progress Photos (Optional)</Label>
            <p className="text-xs text-muted-foreground">
              Take photos in good lighting wearing fitted clothing for best results.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Front Photo */}
              <div className="space-y-2">
                <Label htmlFor="frontPhoto" className="text-sm">Front Photo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="frontPhoto"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'front')}
                    className="hidden"
                  />
                  <label htmlFor="frontPhoto" className="cursor-pointer">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {frontPhoto ? frontPhoto.name : "Click to upload front photo"}
                    </p>
                  </label>
                </div>
              </div>

              {/* Back Photo */}
              <div className="space-y-2">
                <Label htmlFor="backPhoto" className="text-sm">Back Photo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="backPhoto"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'back')}
                    className="hidden"
                  />
                  <label htmlFor="backPhoto" className="cursor-pointer">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {backPhoto ? backPhoto.name : "Click to upload back photo"}
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling? Any goals or thoughts for your journey?"
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-thrive-blue hover:bg-thrive-blue/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Complete Initial Check-In"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InitialCheckInStep;