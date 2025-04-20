
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const exerciseData = [
  { day: "Mon", minutes: 30, steps: 6500 },
  { day: "Tue", minutes: 45, steps: 8000 },
  { day: "Wed", minutes: 20, steps: 5000 },
  { day: "Thu", minutes: 60, steps: 9000 },
  { day: "Fri", minutes: 30, steps: 7500 },
  { day: "Sat", minutes: 90, steps: 12000 },
  { day: "Sun", minutes: 45, steps: 8500 },
];

const ExerciseProgressTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Exercise Duration</CardTitle>
          <CardDescription>Your activity over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={exerciseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="minutes" 
                  stroke="#4d908e" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="steps" 
                  stroke="#8ecae6" 
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
            <CardTitle>Active Minutes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center text-thrive-teal">
              {Math.round(exerciseData.reduce((acc, item) => acc + item.minutes, 0) / exerciseData.length)} min
            </div>
            <p className="text-center text-muted-foreground mt-2">average per day</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Average Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center text-thrive-lightblue">
              {Math.round(exerciseData.reduce((acc, item) => acc + item.steps, 0) / exerciseData.length).toLocaleString()}
            </div>
            <p className="text-center text-muted-foreground mt-2">steps per day</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExerciseProgressTab;
