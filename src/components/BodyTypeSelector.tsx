
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BodyType, UserBodyType } from "@/types/bodyType";
import { Check } from "lucide-react";

const BodyTypeSelector: React.FC = () => {
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([]);
  const [selectedBodyType, setSelectedBodyType] = useState<string | null>(null);
  const [bodyTypeImages, setBodyTypeImages] = useState<Record<string, string>>({});
  const { user } = useUser();

  useEffect(() => {
    fetchBodyTypes();
    if (user) {
      fetchUserBodyType();
    }
  }, [user]);

  // Load images for all body types after they are fetched
  useEffect(() => {
    if (bodyTypes.length > 0) {
      loadBodyTypeImages();
    }
  }, [bodyTypes]);

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
        // We can now set the data directly since image_url is optional
        setBodyTypes(data as BodyType[]);
      }
    } catch (error) {
      console.error('Error fetching body types:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const loadBodyTypeImages = async () => {
    const imageMap: Record<string, string> = {};
    
    for (const bodyType of bodyTypes) {
      try {
        const { data } = supabase.storage.from('body-types').getPublicUrl(`${bodyType.name.toLowerCase()}.jpg`);
        imageMap[bodyType.id] = data.publicUrl;
      } catch (error) {
        console.error(`Error fetching image for ${bodyType.name}:`, error);
      }
    }
    
    setBodyTypeImages(imageMap);
  };

  const fetchUserBodyType = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_body_types')
        .select('*')
        .eq('user_id', user.id)
        .order('selected_date', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching user body type:', error);
      } else if (data && data.length > 0) {
        setSelectedBodyType(data[0].body_type_id);
      }
    } catch (error) {
      console.error('Error fetching user body type:', error);
    }
  };

  const handleBodyTypeSelect = (bodyTypeId: string) => {
    setSelectedBodyType(bodyTypeId);
  };

  const handleSaveBodyType = async () => {
    if (!selectedBodyType || !user) {
      toast.error('Please select a body type');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_body_types')
        .insert({
          user_id: user.id,
          body_type_id: selectedBodyType,
          selected_date: new Date().toISOString().split('T')[0]
        });

      if (error) {
        toast.error('Failed to save body type');
        console.error(error);
      } else {
        toast.success('Body type saved successfully');
      }
    } catch (error) {
      console.error('Error saving body type:', error);
      toast.error('An unexpected error occurred');
    }
  };

  // Function to map bodyTypes into rows
  const getBodyTypeRows = () => {
    const rows = [];
    const itemsPerRow = 3;
    
    for (let i = 0; i < bodyTypes.length; i += itemsPerRow) {
      rows.push(bodyTypes.slice(i, i + itemsPerRow));
    }
    
    return rows;
  };

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Select Your Body Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {getBodyTypeRows().map((row, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {row.map((bodyType) => (
                <div 
                  key={bodyType.id} 
                  className={`border rounded-lg p-4 cursor-pointer transition-all 
                    ${selectedBodyType === bodyType.id 
                      ? 'border-primary ring-2 ring-primary shadow-md' 
                      : 'hover:border-primary hover:shadow-sm'}`}
                  onClick={() => handleBodyTypeSelect(bodyType.id)}
                >
                  <div className="flex flex-col items-center space-y-3 relative">
                    {selectedBodyType === bodyType.id && (
                      <div className="absolute top-2 right-2 bg-primary rounded-full p-1 z-10">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div className="w-full aspect-square overflow-hidden rounded-lg">
                      {/* Use the pre-loaded image URL from state */}
                      <img 
                        src={bodyTypeImages[bodyType.id] || '/placeholder.svg'} 
                        alt={bodyType.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center mt-2 w-full">
                      <h3 className="font-semibold text-lg">{bodyType.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Body Fat: {bodyType.bodyfat_range}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Population: {bodyType.population_percentage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <Button 
          onClick={handleSaveBodyType} 
          className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white"
          disabled={!selectedBodyType}
        >
          Save Body Type
        </Button>
      </CardContent>
    </Card>
  );
};

export default BodyTypeSelector;
