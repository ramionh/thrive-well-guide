
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import BodyTypeImageUploader from "@/components/BodyTypeImageUploader";
import { BodyType } from "@/types/bodyType";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const BodyTypeImageUploadPage: React.FC = () => {
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([]);

  useEffect(() => {
    const fetchBodyTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('body_types')
          .select('*');

        if (error) throw error;
        setBodyTypes(data || []);
      } catch (error: any) {
        console.error('Error fetching body types:', error);
        toast.error('Failed to fetch body types');
      }
    };

    fetchBodyTypes();
  }, []);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Body Type Image Uploader</CardTitle>
      </CardHeader>
      <CardContent>
        <BodyTypeImageUploader bodyTypes={bodyTypes} />
      </CardContent>
    </Card>
  );
};

export default BodyTypeImageUploadPage;
