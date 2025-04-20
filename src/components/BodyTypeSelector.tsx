
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { supabase } from "@/integrations/supabase/client";
import { useBodyTypes } from "@/hooks/useBodyTypes";
import ErrorBoundary from "./ui/error-boundary";
import LoadingState from "./body-type/LoadingState";
import MeasurementsForm from "./body-type/MeasurementsForm";
import BodyTypeGrid from "./body-type/BodyTypeGrid";
import { useBodyTypeSelection } from "@/hooks/useBodyTypeSelection";
import { toast } from "sonner";

const BodyTypeSelector: React.FC = () => {
  const { user } = useUser();
  const { bodyTypes, bodyTypeImages, isLoading, error } = useBodyTypes();
  const fetchUserBodyType = async () => {
    if (!user) return;
    
    try {
      // Updated to order by created_at instead of selected_date to get the most recent record
      const { data: latestData, error: fetchError } = await supabase
        .from('user_body_types')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (fetchError) {
        console.error('Error fetching user body type:', fetchError);
        return;
      }

      if (latestData && latestData.length > 0) {
        console.log('Latest body type data:', latestData[0]);
        setSelectedBodyType(latestData[0].body_type_id);
        setWeight(latestData[0].weight_lbs);
        setBodyfat(latestData[0].bodyfat_percentage || '');
      } else {
        console.log('No body type data found for user');
      }
    } catch (error) {
      console.error('Error fetching user body type:', error);
    }
  };

  const {
    selectedBodyType,
    setSelectedBodyType,
    weight,
    setWeight,
    bodyfat,
    setBodyfat,
    isSaving,
    handleBodyTypeSelect,
    handleSaveBodyType
  } = useBodyTypeSelection(user, fetchUserBodyType);

  useEffect(() => {
    fetchUserBodyType();
  }, [user]);

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
                <BodyTypeGrid
                  bodyTypes={bodyTypes}
                  bodyTypeImages={bodyTypeImages}
                  selectedBodyType={selectedBodyType}
                  onSelect={handleBodyTypeSelect}
                />
                
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
                  disabled={!selectedBodyType || !weight || isLoading || isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Body Type'}
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
