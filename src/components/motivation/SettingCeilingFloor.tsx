
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import LoadingState from "./shared/LoadingState";

interface SettingCeilingFloorProps {
  onComplete?: () => void;
}

const SettingCeilingFloor: React.FC<SettingCeilingFloorProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // track the DB row's PK so our upsert will update instead of insert
  const [recordId, setRecordId] = useState<string | null>(null);

  const [bestOutcome, setBestOutcome] = useState("");
  const [worstOutcome, setWorstOutcome] = useState("");

  useEffect(() => {
    fetchData();
  }, [user]);

  async function fetchData() {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // pull back only the *latest* row for this user
      const { data: row, error } = await supabase
        .from("motivation_ceiling_floor")
        .select("id, best_outcome, worst_outcome, updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false }) // newest first
        .limit(1)
        .single();                                   // treat as one object

      // PGRST116 = "no rows found" — safe to ignore, just means first time
      if (error && (error.code !== "PGRST116" && error.message !== "No rows found")) {
        throw error;
      }

      if (row) {
        setRecordId(row.id);
        setBestOutcome(row.best_outcome || "");
        setWorstOutcome(row.worst_outcome || "");
      }
    } catch (err) {
      console.error("Error fetching ceiling/floor:", err);
      toast({
        title: "Error",
        description: "Could not load your previous answers.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      // build payload: include `id` if we fetched one, so upsert uses PK conflict
      const payload: any = {
        user_id: user.id,
        best_outcome: bestOutcome,
        worst_outcome: worstOutcome,
      };
      if (recordId) payload.id = recordId;

      const { error } = await supabase
        .from("motivation_ceiling_floor")
        .upsert(payload /* defaults to ON CONFLICT (id) */);

      if (error) throw error;

      toast({
        title: "Saved",
        description: "Your ceiling & floor have been stored.",
      });
      onComplete?.();
    } catch (err) {
      console.error("Error saving ceiling/floor:", err);
      toast({
        title: "Error",
        description: "Could not save your answers.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Card className="bg-white shadow-lg border border-purple-200">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-purple-800 mb-4">
          Setting Ceiling &amp; Floor
        </h2>

        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-gray-700">
              Before moving on to assessing your level of confidence in taking action,
              let's set your importance floor and ceiling.
            </p>

            <div>
              <label
                htmlFor="best-outcome"
                className="block mb-2 font-medium text-purple-700"
              >
                Imagine you scored yourself a 10… What's the best thing that could happen
                if you make this change?
              </label>
              <Textarea
                id="best-outcome"
                value={bestOutcome}
                onChange={(e) => setBestOutcome(e.target.value)}
                rows={4}
                placeholder="Describe the best possible outcome…"
                required
                className="w-full border-purple-200 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label
                htmlFor="worst-outcome"
                className="block mb-2 font-medium text-purple-700"
              >
                Now imagine you scored yourself a 1… What's the worst thing that could
                happen if you don't make this change?
              </label>
              <Textarea
                id="worst-outcome"
                value={worstOutcome}
                onChange={(e) => setWorstOutcome(e.target.value)}
                rows={4}
                placeholder="Describe the worst possible outcome…"
                required
                className="w-full border-purple-200 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSaving ? "Saving…" : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default SettingCeilingFloor;
