
import React from "react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StoplightControl } from "@/components/ui/stoplight-control";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type HistoricalSummaryProps = {
  date: Date | undefined;
  isOpen: boolean;
  onClose: () => void;
};

const HistoricalSummary: React.FC<HistoricalSummaryProps> = ({ date, isOpen, onClose }) => {
  const { data: healthData, isLoading, error } = useQuery({
    queryKey: ['healthData', date],
    queryFn: async () => {
      if (!date) return null;
      
      const formattedDate = format(date, 'yyyy-MM-dd');
      console.log('Querying for date:', formattedDate);
      
      const { data, error } = await supabase
        .from('daily_health_tracking')
        .select('*')
        .eq('date', formattedDate)
        .maybeSingle();
        
      if (error) {
        console.error('Query error:', error);
        throw error;
      }
      
      console.log('Query result:', data);
      return data;
    },
    enabled: !!date,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {date ? format(date, 'MMMM d, yyyy') : 'Select a date'}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 py-8">
            Error loading data: {error.message}
          </div>
        ) : !healthData ? (
          <div className="text-center text-muted-foreground py-8">
            No data recorded for this date
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sleep</CardTitle>
                <StoplightControl 
                  value={healthData.sleep_adherence as "red" | "yellow" | "green"} 
                  readOnly 
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.sleep_hours}h</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Exercise</CardTitle>
                <StoplightControl 
                  value={healthData.exercise_adherence as "red" | "yellow" | "green"} 
                  readOnly 
                />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{healthData.exercise_minutes}m</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nutrition</CardTitle>
                <StoplightControl 
                  value={healthData.nutrition_adherence as "red" | "yellow" | "green"} 
                  readOnly 
                />
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <div>Calories: {healthData.calories}</div>
                  <div>Protein: {healthData.protein}g</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Goals</CardTitle>
                <StoplightControl 
                  value={healthData.goals_adherence as "red" | "yellow" | "green"} 
                  readOnly 
                />
              </CardHeader>
              <CardContent>
                <div className="text-muted-foreground">
                  {healthData.notes || 'No notes recorded'}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default HistoricalSummary;
