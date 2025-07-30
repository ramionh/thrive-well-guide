import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, Activity, BookOpen, TrendingUp, Heart, Moon, Utensils } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Client {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  height_feet?: number;
  height_inches?: number;
  weight_lbs?: number;
  is_active: boolean;
}

interface CheckIn {
  id: string;
  created_at: string;
  estimated_bodyfat_percentage?: number;
  body_fat_percentage?: number;
  front_photo_url?: string;
  back_photo_url?: string;
}

interface Goal {
  id: string;
  started_date: string;
  target_date: string;
  current_body_type: { name: string };
  goal_body_type: { name: string };
}

interface MotivationProgress {
  step_name: string;
  completed: boolean;
  table_name: string;
}

interface HabitAssessment {
  category: string;
  identified_habit: string;
  question_1_answer: string;
  question_2_answer: string;
  question_3_answer?: string;
  created_at: string;
}

interface DailyHealth {
  id: string;
  date: string;
  mood?: number;
  sleep_hours?: number;
  exercise_minutes?: number;
  water?: number;
  steps?: number;
  calories?: number;
  protein?: number;
  created_at: string;
}

interface ClientDetailViewProps {
  client: Client;
}

const ClientDetailView = ({ client }: ClientDetailViewProps) => {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [motivationProgress, setMotivationProgress] = useState<MotivationProgress[]>([]);
  const [habitAssessments, setHabitAssessments] = useState<HabitAssessment[]>([]);
  const [dailyHealthData, setDailyHealthData] = useState<DailyHealth[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientData();
  }, [client.id]);

  const fetchClientData = async () => {
    try {
      await Promise.all([
        fetchCheckIns(),
        fetchGoals(),
        fetchMotivationProgress(),
        fetchHabitAssessments(),
        fetchDailyHealthData(),
      ]);
    } catch (error: any) {
      console.error('Error fetching client data:', error);
      toast.error('Failed to fetch client data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCheckIns = async () => {
    const { data, error } = await supabase
      .from('weekly_checkins')
      .select('*')
      .eq('user_id', client.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;
    setCheckIns(data || []);
  };

  const fetchGoals = async () => {
    const { data, error } = await supabase
      .from('goals')
      .select(`
        *,
        current_body_type:body_types!current_body_type_id(name),
        goal_body_type:body_types!goal_body_type_id(name)
      `)
      .eq('user_id', client.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setGoals(data || []);
  };

  const fetchMotivationProgress = async () => {
    // Check various motivation tables for completed steps
    const progress: MotivationProgress[] = [];

    // Check each table individually with proper typing
    try {
      const affirmations = await supabase
        .from('motivation_affirmations')
        .select('created_at')
        .eq('user_id', client.id);
      
      if (affirmations.data && affirmations.data.length > 0) {
        progress.push({
          step_name: 'AFFIRMATIONS',
          completed: true,
          table_name: 'motivation_affirmations'
        });
      }
    } catch (error) {
      console.warn('Error checking affirmations:', error);
    }

    try {
      const attitude = await supabase
        .from('motivation_attitude')
        .select('created_at')
        .eq('user_id', client.id);
      
      if (attitude.data && attitude.data.length > 0) {
        progress.push({
          step_name: 'ATTITUDE',
          completed: true,
          table_name: 'motivation_attitude'
        });
      }
    } catch (error) {
      console.warn('Error checking attitude:', error);
    }

    try {
      const behaviors = await supabase
        .from('motivation_behaviors')
        .select('created_at')
        .eq('user_id', client.id);
      
      if (behaviors.data && behaviors.data.length > 0) {
        progress.push({
          step_name: 'BEHAVIORS',
          completed: true,
          table_name: 'motivation_behaviors'
        });
      }
    } catch (error) {
      console.warn('Error checking behaviors:', error);
    }

    try {
      const values = await supabase
        .from('motivation_clarifying_values')
        .select('created_at')
        .eq('user_id', client.id);
      
      if (values.data && values.data.length > 0) {
        progress.push({
          step_name: 'CLARIFYING VALUES',
          completed: true,
          table_name: 'motivation_clarifying_values'
        });
      }
    } catch (error) {
      console.warn('Error checking clarifying values:', error);
    }

    try {
      const confidenceSteps = await supabase
        .from('motivation_confidence_steps')
        .select('created_at')
        .eq('user_id', client.id);
      
      if (confidenceSteps.data && confidenceSteps.data.length > 0) {
        progress.push({
          step_name: 'CONFIDENCE STEPS',
          completed: true,
          table_name: 'motivation_confidence_steps'
        });
      }
    } catch (error) {
      console.warn('Error checking confidence steps:', error);
    }

    try {
      const confidenceTalk = await supabase
        .from('motivation_confidence_talk')
        .select('created_at')
        .eq('user_id', client.id);
      
      if (confidenceTalk.data && confidenceTalk.data.length > 0) {
        progress.push({
          step_name: 'CONFIDENCE TALK',
          completed: true,
          table_name: 'motivation_confidence_talk'
        });
      }
    } catch (error) {
      console.warn('Error checking confidence talk:', error);
    }

    try {
      const control = await supabase
        .from('motivation_control')
        .select('created_at')
        .eq('user_id', client.id);
      
      if (control.data && control.data.length > 0) {
        progress.push({
          step_name: 'CONTROL',
          completed: true,
          table_name: 'motivation_control'
        });
      }
    } catch (error) {
      console.warn('Error checking control:', error);
    }

    try {
      const ambivalence = await supabase
        .from('motivation_addressing_ambivalence')
        .select('created_at')
        .eq('user_id', client.id);
      
      if (ambivalence.data && ambivalence.data.length > 0) {
        progress.push({
          step_name: 'ADDRESSING AMBIVALENCE',
          completed: true,
          table_name: 'motivation_addressing_ambivalence'
        });
      }
    } catch (error) {
      console.warn('Error checking addressing ambivalence:', error);
    }

    setMotivationProgress(progress);
  };

  const fetchHabitAssessments = async () => {
    const { data, error } = await supabase
      .from('existing_habits_assessment')
      .select('*')
      .eq('user_id', client.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    setHabitAssessments(data || []);
  };

  const fetchDailyHealthData = async () => {
    const { data, error } = await supabase
      .from('daily_health_tracking')
      .select('*')
      .eq('user_id', client.id)
      .order('date', { ascending: true })
      .limit(30); // Last 30 days

    if (error) throw error;
    setDailyHealthData(data || []);
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getHabitGrade = (category: string) => {
    const categoryAssessments = habitAssessments.filter(h => h.category === category);
    if (categoryAssessments.length === 0) return 'N/A';
    
    // Simple grading based on completion and quality of answers
    const avgLength = categoryAssessments.reduce((sum, h) => 
      sum + (h.question_1_answer?.length || 0) + (h.question_2_answer?.length || 0), 0
    ) / (categoryAssessments.length * 2);
    
    if (avgLength > 50) return 'A';
    if (avgLength > 30) return 'B';
    if (avgLength > 15) return 'C';
    return 'D';
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Client Data...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const motivationCompletionRate = (motivationProgress.length / 8) * 100; // Assuming 8 total steps
  const uniqueCategories = [...new Set(habitAssessments.map(h => h.category))];

  // Calculate health trends
  const recentHealthData = dailyHealthData.slice(-7); // Last 7 days
  const avgMood = recentHealthData.reduce((sum, d) => sum + (d.mood || 0), 0) / recentHealthData.length;
  const avgSleep = recentHealthData.reduce((sum, d) => sum + (d.sleep_hours || 0), 0) / recentHealthData.length;
  const avgExercise = recentHealthData.reduce((sum, d) => sum + (d.exercise_minutes || 0), 0) / recentHealthData.length;

  // Prepare chart data
  const healthChartData = dailyHealthData.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    mood: d.mood || 0,
    sleep: d.sleep_hours || 0,
    exercise: d.exercise_minutes || 0,
    water: d.water || 0,
    steps: d.steps || 0
  }));

  const bodyFatChartData = checkIns.map(c => ({
    date: new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    estimated: c.estimated_bodyfat_percentage || 0,
    actual: c.body_fat_percentage || 0
  })).reverse();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-ins</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkIns.length}</div>
            <p className="text-xs text-muted-foreground">Total weekly check-ins</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.length}</div>
            <p className="text-xs text-muted-foreground">Active goals</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Motivation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(motivationCompletionRate)}%</div>
            <Progress value={motivationCompletionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Mood</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMood ? avgMood.toFixed(1) : 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sleep</CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgSleep ? `${avgSleep.toFixed(1)}h` : 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Exercise</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgExercise ? `${Math.round(avgExercise)}m` : 'N/A'}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="analytics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="checkins">Check-ins</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="motivation">Motivation</TabsTrigger>
          <TabsTrigger value="habits">Habits</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Body Fat Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Body Fat Progress</CardTitle>
                <CardDescription>Body fat percentage trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                {bodyFatChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bodyFatChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="estimated" 
                        stroke="hsl(var(--primary))" 
                        name="Estimated BF%" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="actual" 
                        stroke="hsl(var(--destructive))" 
                        name="Actual BF%" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No body fat data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Metrics Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Health Metrics</CardTitle>
                <CardDescription>Sleep, mood, and exercise trends</CardDescription>
              </CardHeader>
              <CardContent>
                {healthChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={healthChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="mood" 
                        stroke="hsl(var(--primary))" 
                        name="Mood (1-10)" 
                        strokeWidth={2}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sleep" 
                        stroke="hsl(var(--secondary))" 
                        name="Sleep (hours)" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No daily health data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Exercise Minutes Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Exercise Activity</CardTitle>
                <CardDescription>Daily exercise minutes and water intake</CardDescription>
              </CardHeader>
              <CardContent>
                {healthChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={healthChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar 
                        dataKey="exercise" 
                        fill="hsl(var(--primary))" 
                        name="Exercise (min)" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No exercise data available
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Steps and Water Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Activity & Hydration</CardTitle>
                <CardDescription>Daily steps and water intake</CardDescription>
              </CardHeader>
              <CardContent>
                {healthChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={healthChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line 
                        yAxisId="left"
                        type="monotone" 
                        dataKey="steps" 
                        stroke="hsl(var(--primary))" 
                        name="Steps" 
                        strokeWidth={2}
                      />
                      <Line 
                        yAxisId="right"
                        type="monotone" 
                        dataKey="water" 
                        stroke="hsl(var(--secondary))" 
                        name="Water (glasses)" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No activity data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="demographics">
          <Card>
            <CardHeader>
              <CardTitle>Client Demographics</CardTitle>
              <CardDescription>Personal information and physical stats</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Email:</strong> {client.email}</p>
                      {client.phone && <p><strong>Phone:</strong> {client.phone}</p>}
                      {client.date_of_birth && (
                        <p><strong>Age:</strong> {calculateAge(client.date_of_birth)} years old</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Physical Stats</h4>
                    <div className="space-y-2 text-sm">
                      {client.height_feet && (
                        <p><strong>Height:</strong> {client.height_feet}'{client.height_inches || 0}"</p>
                      )}
                      {client.weight_lbs && (
                        <p><strong>Weight:</strong> {client.weight_lbs} lbs</p>
                      )}
                      <p><strong>Status:</strong> 
                        <Badge variant={client.is_active ? "default" : "destructive"} className="ml-2">
                          {client.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checkins">
          <Card>
            <CardHeader>
              <CardTitle>Check-in History</CardTitle>
              <CardDescription>Weekly progress tracking and body fat measurements</CardDescription>
            </CardHeader>
            <CardContent>
              {checkIns.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No check-ins recorded yet.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Body Fat %</TableHead>
                      <TableHead>Estimated BF %</TableHead>
                      <TableHead>Photos</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {checkIns.map((checkin) => (
                      <TableRow key={checkin.id}>
                        <TableCell>
                          {new Date(checkin.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {checkin.body_fat_percentage ? `${checkin.body_fat_percentage}%` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {checkin.estimated_bodyfat_percentage ? `${checkin.estimated_bodyfat_percentage}%` : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {checkin.front_photo_url && (
                              <Badge variant="secondary">Front</Badge>
                            )}
                            {checkin.back_photo_url && (
                              <Badge variant="secondary">Back</Badge>
                            )}
                            {!checkin.front_photo_url && !checkin.back_photo_url && (
                              <span className="text-muted-foreground">None</span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <Card>
            <CardHeader>
              <CardTitle>Body Type Goals</CardTitle>
              <CardDescription>Current body type and transformation goals</CardDescription>
            </CardHeader>
            <CardContent>
              {goals.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No goals set yet.</p>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Transformation Goal</h4>
                        <Badge variant="outline">
                          {new Date(goal.started_date).toLocaleDateString()} - {new Date(goal.target_date).toLocaleDateString()}
                        </Badge>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Current Body Type</p>
                          <Badge variant="secondary" className="text-lg px-4 py-2">
                            {goal.current_body_type?.name || 'Unknown'}
                          </Badge>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground mb-2">Goal Body Type</p>
                          <Badge variant="default" className="text-lg px-4 py-2">
                            {goal.goal_body_type?.name || 'Unknown'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="motivation">
          <Card>
            <CardHeader>
              <CardTitle>Motivation Progress</CardTitle>
              <CardDescription>Completed motivation steps and progress tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {motivationProgress.length} / 8 steps completed
                  </span>
                </div>
                <Progress value={motivationCompletionRate} className="h-2" />
                
                <div className="grid gap-2 mt-6">
                  {motivationProgress.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">No motivation steps completed yet.</p>
                  ) : (
                    motivationProgress.map((step, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 bg-muted rounded-lg">
                        <span className="text-sm">{step.step_name}</span>
                        <Badge variant="default">Completed</Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habits">
          <Card>
            <CardHeader>
              <CardTitle>Habit Assessment Grades</CardTitle>
              <CardDescription>Performance grades across different habit categories</CardDescription>
            </CardHeader>
            <CardContent>
              {habitAssessments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No habit assessments completed yet.</p>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {uniqueCategories.map((category) => (
                      <div key={category} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium capitalize">{category.replace(/_/g, ' ')}</h4>
                          <Badge 
                            variant={getHabitGrade(category) === 'A' ? 'default' : 
                                   getHabitGrade(category) === 'B' ? 'secondary' : 'outline'}
                            className="text-lg px-3 py-1"
                          >
                            {getHabitGrade(category)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {habitAssessments.filter(h => h.category === category).length} assessment(s) completed
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h4 className="font-medium mb-4">Recent Assessments</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead>Identified Habit</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Grade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {habitAssessments.slice(0, 5).map((assessment) => (
                          <TableRow key={assessment.identified_habit + assessment.created_at}>
                            <TableCell className="capitalize">
                              {assessment.category.replace(/_/g, ' ')}
                            </TableCell>
                            <TableCell>{assessment.identified_habit}</TableCell>
                            <TableCell>
                              {new Date(assessment.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {getHabitGrade(assessment.category)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetailView;