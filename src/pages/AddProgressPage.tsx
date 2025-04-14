
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Moon, Apple, Dumbbell } from "lucide-react";

const AddProgressPage: React.FC = () => {
  const { user, updateGoal, addVital } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [sleepHours, setSleepHours] = useState("7.5");
  const [sleepQuality, setSleepQuality] = useState([70]);
  
  const [calories, setCalories] = useState("2000");
  const [protein, setProtein] = useState("90");
  const [water, setWater] = useState("6");
  
  const [exerciseMinutes, setExerciseMinutes] = useState("45");
  const [steps, setSteps] = useState("8000");
  
  const [selectedGoal, setSelectedGoal] = useState("");
  const [goalProgress, setGoalProgress] = useState("");
  
  const handleSaveProgress = () => {
    // Update selected goal if one is chosen
    if (selectedGoal && goalProgress) {
      updateGoal(selectedGoal, {
        currentValue: parseFloat(goalProgress)
      });
    }
    
    // Add vitals
    addVital({
      name: "Sleep Duration",
      value: parseFloat(sleepHours),
      unit: "hours",
      category: "sleep"
    });
    
    addVital({
      name: "Sleep Quality",
      value: sleepQuality[0],
      unit: "%",
      category: "sleep"
    });
    
    addVital({
      name: "Calories",
      value: parseInt(calories),
      unit: "kcal",
      category: "nutrition"
    });
    
    addVital({
      name: "Protein",
      value: parseInt(protein),
      unit: "g",
      category: "nutrition"
    });
    
    addVital({
      name: "Water",
      value: parseInt(water),
      unit: "glasses",
      category: "nutrition"
    });
    
    addVital({
      name: "Exercise",
      value: parseInt(exerciseMinutes),
      unit: "minutes",
      category: "exercise"
    });
    
    addVital({
      name: "Steps",
      value: parseInt(steps),
      unit: "steps",
      category: "exercise"
    });
    
    toast({
      title: "Progress updated",
      description: "Your wellness data has been saved successfully.",
    });
    
    navigate("/dashboard");
  };
  
  return (
    <div className="container mx-auto max-w-4xl animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Record Your Progress</h1>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancel
        </Button>
      </div>
      
      <Tabs defaultValue="sleep">
        <TabsList className="mb-6 w-full">
          <TabsTrigger value="sleep" className="flex-1">
            <Moon className="mr-2 h-4 w-4" />
            Sleep
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex-1">
            <Apple className="mr-2 h-4 w-4" />
            Nutrition
          </TabsTrigger>
          <TabsTrigger value="exercise" className="flex-1">
            <Dumbbell className="mr-2 h-4 w-4" />
            Exercise
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex-1">
            Goals
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sleep">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Tracking</CardTitle>
              <CardDescription>How well did you sleep?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sleepHours">Hours of Sleep</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="sleepHours"
                    type="number"
                    step="0.1"
                    min="0"
                    max="24"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                  />
                  <span className="flex items-center">hours</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Sleep Quality</Label>
                  <p className="text-sm text-muted-foreground">
                    How would you rate the quality of your sleep?
                  </p>
                </div>
                <div className="px-2">
                  <Slider
                    value={sleepQuality}
                    max={100}
                    step={1}
                    onValueChange={setSleepQuality}
                  />
                  <div className="flex justify-between mt-1 text-sm text-muted-foreground">
                    <span>Poor</span>
                    <span>{sleepQuality}%</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Tracking</CardTitle>
              <CardDescription>Track your daily nutrition</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories Consumed</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="calories"
                    type="number"
                    min="0"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                  />
                  <span className="flex items-center">kcal</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="protein">Protein Consumed</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="protein"
                    type="number"
                    min="0"
                    value={protein}
                    onChange={(e) => setProtein(e.target.value)}
                  />
                  <span className="flex items-center">grams</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="water">Water Intake</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="water"
                    type="number"
                    min="0"
                    value={water}
                    onChange={(e) => setWater(e.target.value)}
                  />
                  <span className="flex items-center">glasses</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="exercise">
          <Card>
            <CardHeader>
              <CardTitle>Exercise Tracking</CardTitle>
              <CardDescription>Track your physical activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="exerciseMinutes">Exercise Duration</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="exerciseMinutes"
                    type="number"
                    min="0"
                    value={exerciseMinutes}
                    onChange={(e) => setExerciseMinutes(e.target.value)}
                  />
                  <span className="flex items-center">minutes</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="steps">Step Count</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="steps"
                    type="number"
                    min="0"
                    value={steps}
                    onChange={(e) => setSteps(e.target.value)}
                  />
                  <span className="flex items-center">steps</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Update Goal Progress</CardTitle>
              <CardDescription>Track your progress towards your goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="goalSelect">Select Goal</Label>
                <Select value={selectedGoal} onValueChange={setSelectedGoal}>
                  <SelectTrigger id="goalSelect">
                    <SelectValue placeholder="Select a goal to update" />
                  </SelectTrigger>
                  <SelectContent>
                    {user?.goals.map((goal) => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.name} ({goal.targetValue} {goal.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedGoal && (
                <div className="space-y-2">
                  <Label htmlFor="goalProgress">Current Progress</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="goalProgress"
                      type="number"
                      min="0"
                      value={goalProgress}
                      onChange={(e) => setGoalProgress(e.target.value)}
                    />
                    <span className="flex items-center">
                      {user?.goals.find(g => g.id === selectedGoal)?.unit}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button 
          className="bg-thrive-green hover:bg-thrive-green/90"
          onClick={handleSaveProgress}
        >
          Save Progress
        </Button>
      </div>
    </div>
  );
};

export default AddProgressPage;
