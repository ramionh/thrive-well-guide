
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BodyType } from "@/types/bodyType";
import { Upload, Image } from "lucide-react";

interface BodyTypeImageUploaderProps {
  bodyTypes: BodyType[];
}

const BodyTypeImageUploader: React.FC<BodyTypeImageUploaderProps> = ({ bodyTypes }) => {
  const [uploading, setUploading] = useState<string | null>(null);

  const handleImageUpload = async (bodyType: BodyType, file: File) => {
    try {
      // Create a filename with capitalized first letter
      const capitalizedName = bodyType.name.charAt(0).toUpperCase() + bodyType.name.slice(1).toLowerCase();
      const fileName = `${capitalizedName.replace(/\s+/g, '-')}.png`;
      
      setUploading(bodyType.id);
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
    } finally {
      setUploading(null);
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
          <div 
            key={bodyType.id} 
            className="border p-4 rounded-lg flex flex-col items-center space-y-4"
          >
            <h3 className="text-lg font-semibold">{bodyType.name}</h3>
            <div className="w-full aspect-square border rounded flex items-center justify-center">
              <Image className="h-12 w-12 text-gray-400" />
            </div>
            <Button 
              onClick={() => triggerFileUpload(bodyType)}
              disabled={uploading === bodyType.id}
              className="w-full"
            >
              {uploading === bodyType.id ? 'Uploading...' : 'Upload Image'}
              <Upload className="ml-2 h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BodyTypeImageUploader;

