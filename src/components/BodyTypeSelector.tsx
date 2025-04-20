import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useBodyTypes } from "@/hooks/useBodyTypes";
import BodyTypeCard from "./body-type/BodyTypeCard";
import MeasurementsForm from "./body-type/MeasurementsForm";
import ErrorBoundary from "./ui/error-boundary";
import LoadingState from "./body-type/LoadingState";

const BodyTypeSelector: React.FC = () => {
  const [selectedBodyType, setSelectedBodyType] = useState<string | null>(null);
  const [weight, setWeight] = useState<number | ''>('');
  const [bodyfat, setBodyfat] = useState<number | ''>('');
  const { user } = useUser();
  const { bodyTypes, bodyTypeImages, isLoading, error } = useBodyTypes();

  useEffect(() => {
    if (user) {
      fetchUserBodyType();
    }
  }, [user]);

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

    if (!weight) {
      toast.error('Please enter your weight');
      return;
    }

    try {
      const { error } = await supabase
        .from('user_body_types')
        .insert({
          user_id: user.id,
          body_type_id: selectedBodyType,
          selected_date: new Date().toISOString().split('T')[0],
          weight_lbs: weight,
          bodyfat_percentage: bodyfat || null
        });

      if (error) {
        toast.error('Failed to save body type');
        console.error(error);
      } else {
        toast.success('Body type and measurements saved successfully');
      }
    } catch (error) {
      console.error('Error saving body type:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const getBodyTypeRows = () => {
    const rows = [];
    const itemsPerRow = 3;
    
    for (let i = 0; i < bodyTypes.length; i += itemsPerRow) {
      rows.push(bodyTypes.slice(i, i + itemsPerRow));
    }
    
    return rows;
  };

  if (error) {
    return (
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Error Loading Body Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-destructive">
            {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <ErrorBoundary>
      <Card className="max-w-6xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Select Your Body Type</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {isLoading ? (
              <LoadingState />
            ) : (
              <>
                {getBodyTypeRows().map((row, rowIndex) => (
                  <div key={`row-${rowIndex}`} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {row.map((bodyType) => (
                      <BodyTypeCard
                        key={bodyType.id}
                        bodyType={bodyType}
                        imageUrl={bodyTypeImages[bodyType.id]}
                        isSelected={selectedBodyType === bodyType.id}
                        onSelect={handleBodyTypeSelect}
                      />
                    ))}
                  </div>
                ))}
                
                {selectedBodyType && (
                  <MeasurementsForm
                    weight={weight}
                    setWeight={setWeight}
                    bodyfat={bodyfat}
                    setBodyfat={setBodyfat}
                  />
                )}
                
                <Button 
                  onClick={handleSaveBodyType} 
                  className="mt-8 w-full bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={!selectedBodyType || !weight || isLoading}
                >
                  Save Body Type
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
};

export default BodyTypeSelector;
