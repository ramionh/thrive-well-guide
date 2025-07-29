import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, UserPlus, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const CreateCoachesAction = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleCreateCoaches = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      console.log("Invoking create-coaches function...");

      const { data, error } = await supabase.functions.invoke('create-coaches');

      if (error) {
        throw new Error(error.message || "Failed to create coaches");
      }

      console.log("Function response:", data);

      if (data.success) {
        setResult(data);
        toast.success(data.message);
      } else {
        throw new Error(data.error || "Unknown error occurred");
      }

    } catch (error: any) {
      console.error('Error creating coaches:', error);
      setError(error.message);
      toast.error('Failed to create coaches');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserPlus className="h-5 w-5 mr-2" />
          Create Demo Coaches
        </CardTitle>
        <CardDescription>
          Generate 3 professional fitness coaches with realistic profiles and randomly assign existing clients to them
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">{result.message}</p>
                {result.coaches && (
                  <div>
                    <p className="text-sm font-medium mb-2">Created Coaches:</p>
                    <ul className="text-sm space-y-1">
                      {result.coaches.map((coach: any) => (
                        <li key={coach.id}>• {coach.name} ({coach.email})</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.assignments && result.assignments.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Client Assignments:</p>
                    <ul className="text-sm space-y-1">
                      {result.assignments.map((assignment: any, index: number) => (
                        <li key={index}>• {assignment.client} → {assignment.coach}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <div>
            <h4 className="font-medium mb-2">This will create:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Sarah Mitchell - 8+ years experience, strength training specialist</li>
              <li>• Mike Rodriguez - 12+ years experience, busy professional specialist</li>
              <li>• Jennifer Thompson - 10+ years experience, hormonal health specialist</li>
            </ul>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Each coach will have a comprehensive bio reflecting their expertise in fitness training for Gen X adults.
            Existing clients without assigned coaches will be randomly distributed among the new coaches.
          </p>
        </div>

        <Button 
          onClick={handleCreateCoaches} 
          disabled={loading}
          className="w-full"
        >
          <Users className="h-4 w-4 mr-2" />
          {loading ? 'Creating Coaches...' : 'Create 3 Coaches & Assign Clients'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CreateCoachesAction;