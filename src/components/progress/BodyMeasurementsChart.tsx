
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/hooks/useUser";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

type MeasurementData = {
  selected_date: string;
  weight_lbs: number;
  bodyfat_percentage: number | null;
  body_type: string;
}

const BodyMeasurementsChart = () => {
  const { user } = useUser();
  const [measurements, setMeasurements] = useState<MeasurementData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurements = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_body_types')
          .select(`
            selected_date,
            weight_lbs,
            bodyfat_percentage,
            body_types (
              name
            )
          `)
          .eq('user_id', user.id)
          .order('selected_date', { ascending: true });

        if (error) {
          console.error('Error fetching measurements:', error);
          return;
        }

        const formattedData = data.map(item => ({
          selected_date: item.selected_date,
          weight_lbs: item.weight_lbs,
          bodyfat_percentage: item.bodyfat_percentage,
          body_type: item.body_types.name
        }));

        setMeasurements(formattedData);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeasurements();
  }, [user]);

  if (isLoading) {
    return <div>Loading measurements...</div>;
  }

  const config = {
    weight: {
      label: "Weight (lbs)",
      theme: { light: "#3b82f6", dark: "#60a5fa" }
    },
    bodyfat: {
      label: "Body Fat %",
      theme: { light: "#ef4444", dark: "#f87171" }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Body Measurements History</CardTitle>
        <CardDescription>Track your progress over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ChartContainer config={config}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={measurements} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="selected_date" 
                  tickFormatter={(date) => format(new Date(date), 'MMM d')}
                />
                <YAxis yAxisId="weight" domain={['auto', 'auto']} />
                <YAxis yAxisId="bodyfat" orientation="right" domain={[0, 100]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium">
                              {format(new Date(payload[0].payload.selected_date), 'PP')}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-muted-foreground">Weight:</span>
                              <span className="font-medium">
                                {payload[0].value} lbs
                              </span>
                            </div>
                            {payload[1]?.value && (
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-muted-foreground">Body Fat:</span>
                                <span className="font-medium">
                                  {payload[1].value}%
                                </span>
                              </div>
                            )}
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-muted-foreground">Body Type:</span>
                              <span className="font-medium">
                                {payload[0].payload.body_type}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Line
                  yAxisId="weight"
                  type="monotone"
                  dataKey="weight_lbs"
                  name="Weight"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  yAxisId="bodyfat"
                  type="monotone"
                  dataKey="bodyfat_percentage"
                  name="Body Fat %"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BodyMeasurementsChart;
