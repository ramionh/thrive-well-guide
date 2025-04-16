
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploaderProps {
  userId: string;
  currentAvatarUrl: string | null;
  userName: string;
  onAvatarUpdate: (url: string) => void;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  userId,
  currentAvatarUrl,
  userName,
  onAvatarUpdate,
}) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));

      try {
        // Validate userId is a proper UUID before using it
        if (!userId || typeof userId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId)) {
          throw new Error("Invalid user ID. Please sign in again.");
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `avatar-${Date.now()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file, { 
            cacheControl: '3600', 
            upsert: true 
          });
        
        if (uploadError) {
          throw uploadError;
        }
        
        const { data: urlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        
        onAvatarUpdate(urlData.publicUrl);
        
        toast({
          title: "Success",
          description: "Avatar uploaded successfully!",
        });
      } catch (error: any) {
        console.error("Avatar upload error:", error);
        toast({
          title: "Upload Error",
          description: error.message || "Failed to upload avatar",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-20 w-20">
        <AvatarImage 
          src={avatarPreview || currentAvatarUrl || ""} 
          alt={userName || "User avatar"} 
        />
        <AvatarFallback className="text-2xl bg-thrive-blue text-white">
          {userName ? userName.split(' ').map(n => n[0]).join('') : "U"}
        </AvatarFallback>
      </Avatar>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleAvatarChange}
        className="hidden" 
        id="avatar-upload" 
      />
      <label 
        htmlFor="avatar-upload" 
        className="absolute bottom-0 right-0 bg-thrive-blue text-white rounded-full p-1 cursor-pointer hover:bg-blue-600 transition-colors"
      >
        <Camera className="h-4 w-4" />
      </label>
    </div>
  );
};

export default AvatarUploader;
