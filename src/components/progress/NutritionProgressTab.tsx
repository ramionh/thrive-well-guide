
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const nutritionData = [
  { day: "Mon", calories: 1850, protein: 85 },
  { day: "Tue", calories: 2100, protein: 95 },
  { day: "Wed", calories: 1920, protein: 90 },
  { day: "Thu", calories: 2000, protein: 100 },
  { day: "Fri", calories: 1750, protein: 80 },
  { day: "Sat", calories: 2200, protein: 110 },
  { day: "Sun", calories: 1900, protein: 90 },
];

const NutritionProgressTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calorie Intake</CardTitle>
          <CardDescription>Your calorie consumption over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={nutritionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#f77f00" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="protein" 
                  stroke="#4d908e" 
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
            <CardTitle>Average Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center text-thrive-orange">
              {Math.round(nutritionData.reduce((acc, item) => acc + item.calories, 0) / nutritionData.length)}
            </div>
            <p className="text-center text-muted-foreground mt-2">calories per day</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Average Protein</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-center text-thrive-teal">
              {Math.round(nutritionData.reduce((acc, item) => acc + item.protein, 0) / nutritionData.length)}g
            </div>
            <p className="text-center text-muted-foreground mt-2">protein per day</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NutritionProgressTab;
