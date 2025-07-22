import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { format } from "date-fns";
import { Scale, Camera } from "lucide-react";

const WeeklyCheckInsTab: React.FC = () => {
  const { user } = useUser();

  const { data: checkIns, isLoading } = useQuery({
    queryKey: ['weekly-checkins', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('weekly_checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Check-ins</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!checkIns || checkIns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Check-ins</CardTitle>
          <CardDescription>
            Track your progress with weekly weight and body fat measurements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No check-ins yet.</p>
            <p className="text-sm">Start tracking your progress with your first weekly check-in!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weekly Check-ins</CardTitle>
          <CardDescription>
            Your progress over time with weight and estimated body fat percentage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checkIns.map((checkIn) => (
              <Card key={checkIn.id} className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    {format(new Date(checkIn.created_at), 'MMM dd, yyyy')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    <span className="font-medium">{checkIn.weight_lbs} lbs</span>
                  </div>
                  
                  {checkIn.estimated_bodyfat_percentage && (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-secondary flex items-center justify-center">
                        <span className="text-xs font-bold">%</span>
                      </div>
                      <span className="font-medium">
                        {checkIn.estimated_bodyfat_percentage.toFixed(1)}% body fat
                      </span>
                    </div>
                  )}

                  {(checkIn.front_photo_url || checkIn.back_photo_url) && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Camera className="h-4 w-4" />
                      <span className="text-sm">
                        {checkIn.front_photo_url && checkIn.back_photo_url ? 'Front & Back photos' :
                         checkIn.front_photo_url ? 'Front photo' : 'Back photo'}
                      </span>
                    </div>
                  )}

                  {checkIn.notes && (
                    <div className="mt-3 p-2 bg-muted rounded text-sm">
                      <p className="italic">"{checkIn.notes}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {checkIns.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Progress Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {checkIns.length}
                </div>
                <div className="text-sm text-muted-foreground">Check-ins</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {(checkIns[0].weight_lbs - checkIns[checkIns.length - 1].weight_lbs).toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">lbs change</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {checkIns[0].weight_lbs.toFixed(1)}
                </div>
                <div className="text-sm text-muted-foreground">Current weight</div>
              </div>

              {checkIns[0].estimated_bodyfat_percentage && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {checkIns[0].estimated_bodyfat_percentage.toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Current body fat</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeeklyCheckInsTab;