
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BodyType } from "@/types/bodyType";

export const useBodyTypes = () => {
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([]);
  const [bodyTypeImages, setBodyTypeImages] = useState<Record<string, string>>({});

  const fetchBodyTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('body_types')
        .select('*')
        .order('bodyfat_range', { ascending: true });

      if (error) {
        toast.error('Failed to fetch body types');
        console.error(error);
      } else if (data) {
        setBodyTypes(data as BodyType[]);
      }
    } catch (error) {
      console.error('Error fetching body types:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const loadBodyTypeImages = () => {
    const imageMap: Record<string, string> = {};
    
    for (const bodyType of bodyTypes) {
      try {
        const capitalizedName = bodyType.name.charAt(0).toUpperCase() + bodyType.name.slice(1).toLowerCase();
        const imageName = capitalizedName.replace(/\s+/g, '-');
        const { data } = supabase.storage
          .from('body-types')
          .getPublicUrl(`${imageName}.png`);
          
        imageMap[bodyType.id] = data.publicUrl;
      } catch (error) {
        console.error(`Error getting URL for ${bodyType.name}:`, error);
      }
    }
    
    setBodyTypeImages(imageMap);
  };

  useEffect(() => {
    fetchBodyTypes();
  }, []);

  useEffect(() => {
    if (bodyTypes.length > 0) {
      loadBodyTypeImages();
    }
  }, [bodyTypes]);

  return { bodyTypes, bodyTypeImages };
};
