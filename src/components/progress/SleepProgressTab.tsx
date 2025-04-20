
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const sleepData = [
  { day: "Mon", hours: 6.5 },
  { day: "Tue", hours: 7.2 },
  { day: "Wed", hours: 6.8 },
  { day: "Thu", hours: 7.5 },
  { day: "Fri", hours: 8.0 },
  { day: "Sat", hours: 8.5 },
  { day: "Sun", hours: 7.2 },
];

const SleepProgressTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sleep Duration</CardTitle>
          <CardDescription>Your sleep patterns over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#3a86ff" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Average Sleep</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center text-thrive-blue">
              {(sleepData.reduce((acc, item) => acc + item.hours, 0) / sleepData.length).toFixed(1)}h
            </div>
            <p className="text-center text-muted-foreground mt-2">Past 7 days</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sleep Consistency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center text-thrive-blue">
              85%
            </div>
            <p className="text-center text-muted-foreground mt-2">Bedtime consistency score</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SleepProgressTab;
