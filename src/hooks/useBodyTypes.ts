
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
      
      // For each body type, construct image name based on gender
      for (const bodyType of bodyTypes) {
        let imageName = '';
        
        // Use gender-specific image naming convention
        if (userGender === 'female') {
          imageName = `woman_${bodyType.name.toLowerCase()}.png`;
        } else {
          imageName = `${bodyType.name}.png`;
        }
        
        console.log(`Looking for image: ${imageName} for gender: ${userGender}, body type: ${bodyType.name}`);
        
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
