
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
  const { user } = useUser();

  useEffect(() => {
    fetchBodyTypes();
  }, []);

  const fetchBodyTypes = async () => {
    try {
      // Use a more specific type assertion that bypasses type checking for the table name
      const { data, error } = await (supabase
        .from('body_types' as any)
        .select('*') as any);

      if (error) {
        toast.error('Failed to fetch body types');
        console.error(error);
      } else if (data) {
        // Ensure data matches the BodyType interface when setting state
        setBodyTypes(data as BodyType[]);
      }
    } catch (error) {
      console.error('Error fetching body types:', error);
      toast.error('An unexpected error occurred');
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
      // Use a more specific type assertion that bypasses type checking for the table name
      const { data, error } = await (supabase
        .from('user_body_types' as any)
        .insert({
          user_id: user.id,
          body_type_id: selectedBodyType,
          selected_date: new Date().toISOString().split('T')[0]
        })
        .select() as any);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Body Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bodyTypes.map((bodyType) => (
            <div 
              key={bodyType.id} 
              className={`border rounded-lg p-4 cursor-pointer transition-all 
                ${selectedBodyType === bodyType.id 
                  ? 'border-primary ring-2 ring-primary' 
                  : 'hover:border-primary'}`}
              onClick={() => handleBodyTypeSelect(bodyType.id)}
            >
              <div className="flex flex-col items-center space-y-2 relative">
                {selectedBodyType === bodyType.id && (
                  <Check className="absolute top-2 right-2 text-primary" />
                )}
                <img 
                  src={bodyType.image_url} 
                  alt={bodyType.name} 
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="text-center">
                  <h3 className="font-semibold">{bodyType.name}</h3>
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
        <Button 
          onClick={handleSaveBodyType} 
          className="mt-6 w-full"
          disabled={!selectedBodyType}
        >
          Save Body Type
        </Button>
      </CardContent>
    </Card>
  );
};

export default BodyTypeSelector;
