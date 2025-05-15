
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BodyType } from "@/types/bodyType";
import { useUser } from "@/context/UserContext";

export const useBodyTypes = () => {
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([]);
  const [bodyTypeImages, setBodyTypeImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useUser();

  const fetchBodyTypes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('body_types')
        .select('*')
        .order('bodyfat_range', { ascending: true });

      if (fetchError) {
        throw new Error('Failed to fetch body types');
      }

      if (data) {
        setBodyTypes(data as BodyType[]);
      }
    } catch (err) {
      const error = err as Error;
      setError(error);
      toast.error('Failed to load body types');
      console.error('Error fetching body types:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadBodyTypeImages = async () => {
    try {
      if (!bodyTypes.length) return;

      const userGender = user?.gender?.toLowerCase() || 'male';
      const imageMap: Record<string, string> = {};
      
      // Fetch gender-specific image names from the table
      const { data: genderSpecificData, error: genderError } = await supabase
        .from('gender_body_type_ranges')
        .select('body_type_id, image_name')
        .eq('gender', userGender);
      
      if (genderError) {
        throw genderError;
      }

      // Create a mapping of body_type_id to image_name
      const imageNameMap: Record<string, string> = {};
      if (genderSpecificData) {
        genderSpecificData.forEach(item => {
          imageNameMap[item.body_type_id] = item.image_name;
        });
      }
      
      // Get the public URLs for each image
      for (const bodyType of bodyTypes) {
        // Use the gender-specific image name from our mapping
        const imageName = imageNameMap[bodyType.id];
        
        if (!imageName) {
          console.error(`No image name found for body type ${bodyType.name} and gender ${userGender}`);
          continue;
        }
        
        const { data } = supabase.storage
          .from('body-types')
          .getPublicUrl(imageName);
          
        imageMap[bodyType.id] = data.publicUrl;
      }
      
      setBodyTypeImages(imageMap);
    } catch (error) {
      console.error('Error loading body type images:', error);
      toast.error('Failed to load body type images');
    }
  };

  useEffect(() => {
    fetchBodyTypes();
  }, []);

  useEffect(() => {
    if (bodyTypes.length > 0) {
      loadBodyTypeImages();
    }
  }, [bodyTypes, user?.gender]);

  return { bodyTypes, bodyTypeImages, isLoading, error };
};
