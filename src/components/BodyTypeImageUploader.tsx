
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BodyType } from "@/types/bodyType";

interface BodyTypeImageUploaderProps {
  bodyTypes: BodyType[];
}

const BodyTypeImageUploader: React.FC<BodyTypeImageUploaderProps> = ({ bodyTypes }) => {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (bodyType: BodyType, file: File) => {
    try {
      // Create a consistent filename based on body type name
      const fileName = `${bodyType.name.toLowerCase().replace(/\s+/g, '-')}.jpg`;
      
      const { error } = await supabase.storage
        .from('body-types')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      toast.success(`Image uploaded for ${bodyType.name}`);
    } catch (error: any) {
      console.error(`Error uploading image for ${bodyType.name}:`, error);
      toast.error(`Failed to upload image for ${bodyType.name}`);
    }
  };

  const triggerFileUpload = (bodyType: BodyType) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/jpg';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        handleImageUpload(bodyType, file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Upload Body Type Images</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bodyTypes.map((bodyType) => (
          <div key={bodyType.id} className="border p-4 rounded-lg">
            <h3 className="mb-2">{bodyType.name}</h3>
            <Button 
              onClick={() => triggerFileUpload(bodyType)}
              disabled={uploading}
            >
              Upload Image
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BodyTypeImageUploader;
