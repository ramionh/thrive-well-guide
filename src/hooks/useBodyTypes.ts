
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BodyType } from "@/types/bodyType";

export const useBodyTypes = () => {
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([]);
  const [bodyTypeImages, setBodyTypeImages] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

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

  const loadBodyTypeImages = () => {
    try {
      const imageMap: Record<string, string> = {};
      
      for (const bodyType of bodyTypes) {
        const capitalizedName = bodyType.name.charAt(0).toUpperCase() + bodyType.name.slice(1).toLowerCase();
        const imageName = capitalizedName.replace(/\s+/g, '-');
        const { data } = supabase.storage
          .from('body-types')
          .getPublicUrl(`${imageName}.png`);
          
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
  }, [bodyTypes]);

  return { bodyTypes, bodyTypeImages, isLoading, error };
};

