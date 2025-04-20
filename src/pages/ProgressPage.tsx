import React from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Dumbbell, Moon, Apple } from "lucide-react";
import BodyMeasurementsChart from "@/components/progress/BodyMeasurementsChart";

const ProgressPage: React.FC = () => {
  const sleepData = [
    { day: "Mon", hours: 6.5 },
    { day: "Tue", hours: 7.2 },
    { day: "Wed", hours: 6.8 },
    { day: "Thu", hours: 7.5 },
    { day: "Fri", hours: 8.0 },
    { day: "Sat", hours: 8.5 },
    { day: "Sun", hours: 7.2 },
  ];
  
  const nutritionData = [
    { day: "Mon", calories: 1850, protein: 85 },
    { day: "Tue", calories: 2100, protein: 95 },
    { day: "Wed", calories: 1920, protein: 90 },
    { day: "Thu", calories: 2000, protein: 100 },
    { day: "Fri", calories: 1750, protein: 80 },
    { day: "Sat", calories: 2200, protein: 110 },
    { day: "Sun", calories: 1900, protein: 90 },
  ];
  
  const exerciseData = [
    { day: "Mon", minutes: 30, steps: 6500 },
    { day: "Tue", minutes: 45, steps: 8000 },
    { day: "Wed", minutes: 20, steps: 5000 },
    { day: "Thu", minutes: 60, steps: 9000 },
    { day: "Fri", minutes: 30, steps: 7500 },
    { day: "Sat", minutes: 90, steps: 12000 },
    { day: "Sun", minutes: 45, steps: 8500 },
  ];
  
  return (
    <div className="container mx-auto animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Your Progress</h1>
      
      <Tabs defaultValue="measurements">
        <TabsList className="mb-6">
          <TabsTrigger value="measurements" className="flex items-center gap-2">
            <ChartLine className="h-4 w-4" />
            Measurements
          </TabsTrigger>
          <TabsTrigger value="sleep" className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            Sleep
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center gap-2">
            <Apple className="h-4 w-4" />
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="exercise" className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4" />
            Exercise
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="measurements">
          <BodyMeasurementsChart />
        </TabsContent>
        
        <TabsContent value="sleep" className="space-y-6">
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
        </TabsContent>
        
        <TabsContent value="nutrition" className="space-y-6">
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
        </TabsContent>
        
        <TabsContent value="exercise" className="space-y-6">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgressPage;
