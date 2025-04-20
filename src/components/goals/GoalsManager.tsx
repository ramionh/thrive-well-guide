
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

type BodyType = {
  id: string;
  name: string;
};

type Goal = {
  id: string;
  user_id: string;
  current_body_type_id: string;
  goal_body_type_id: string;
  started_date: string;
  target_date: string;
  created_at: string;
  updated_at: string;
  currentBodyType?: BodyType;
  goalBodyType?: BodyType;
};

const GoalsManager: React.FC = () => {
  const { user } = useUser();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [bodyTypes, setBodyTypes] = useState<BodyType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  // Fetch all body types for id->name mapping
  useEffect(() => {
    const fetchBodyTypes = async () => {
      const { data, error } = await supabase.from("body_types").select("id,name");
      if (!error && data) setBodyTypes(data);
    };
    fetchBodyTypes();
  }, []);

  // Fetch user's goals
  const fetchGoals = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("user_id", user.id);
    if (!error && data) {
      setGoals(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchGoals();
    // eslint-disable-next-line
  }, [user]);

  // Helper for id->BodyType lookup
  const bodyTypeById = (id: string | undefined) =>
    bodyTypes.find((b) => b.id === id)?.name || "Unknown";

  // Create Goal logic (fetch latest user bodytype, use RPC for goalBodyType)
  const handleCreateGoal = async () => {
    if (!user) return;
    setCreating(true);

    // Get latest user_body_types record for this user
    const { data, error } = await supabase
      .from("user_body_types")
      .select("body_type_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data || !data.body_type_id) {
      toast.error("Couldn't find latest body type for user.");
      setCreating(false);
      return;
    }
    const currentBodyTypeId = data.body_type_id;

    // Get next better body type using the function
    const { data: next, error: rpcError } = await supabase.rpc(
      "get_next_better_body_type", { current_body_type_id: currentBodyTypeId }
    );
    if (rpcError || !next) {
      toast.error("Error getting goal body type.");
      setCreating(false);
      return;
    }

    // Insert new goal
    const today = new Date().toISOString().split("T")[0];
    const targetDate = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000)
      .toISOString().split("T")[0];

    const { error: insertError } = await supabase.from("goals").insert({
      user_id: user.id,
      current_body_type_id: currentBodyTypeId,
      goal_body_type_id: next,
      started_date: today,
      target_date: targetDate,
    });
    if (insertError) {
      toast.error("Failed to create goal: " + insertError.message);
      setCreating(false);
      return;
    }
    toast.success("Goal created!");
    setCreating(false);
    fetchGoals();
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle>Transformation Goals</CardTitle>
          <CardDescription>
            Your transformation journey, automatically managed and tracked.
          </CardDescription>
        </div>
        <Button onClick={handleCreateGoal} disabled={creating || isLoading}>
          {creating ? "Creating..." : "Create New Goal"}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8">Loading...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Current Body Type</TableHead>
                <TableHead>Goal Body Type</TableHead>
                <TableHead>Started Date</TableHead>
                <TableHead>Target Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {goals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">No goals yet.</TableCell>
                </TableRow>
              ) : (
                goals.map((goal) => (
                  <TableRow key={goal.id}>
                    <TableCell>{bodyTypeById(goal.current_body_type_id)}</TableCell>
                    <TableCell>{bodyTypeById(goal.goal_body_type_id)}</TableCell>
                    <TableCell>{format(new Date(goal.started_date), "PP")}</TableCell>
                    <TableCell>{format(new Date(goal.target_date), "PP")}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalsManager;
