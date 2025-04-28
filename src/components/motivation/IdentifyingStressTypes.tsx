
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import LoadingState from "./shared/LoadingState";
import { toast } from "@/components/ui/use-toast";

interface IdentifyingStressTypesProps {
  onComplete?: () => void;
}

interface StressType {
  stressor: string;
  type: "Distress" | "Eustress" | "";
}

interface StressTypesData {
  stress_types: StressType[];
}

const IdentifyingStressTypes: React.FC<IdentifyingStressTypesProps> = ({ onComplete }) => {
  const { user } = useUser();
  const [stressTypes, setStressTypes] = useState<StressType[]>([]);
  const [isLoadingStressors, setIsLoadingStressors] = useState(true);

  const {
    formData,
    isLoading,
    isSubmitting,
    fetchData,
    updateForm,
    submitForm,
  } = useMotivationForm<StressTypesData>({
    tableName: "motivation_stress_types",
    initialState: {
      stress_types: []
    }
  });

  // Fetch stressors from the previous step
  useEffect(() => {
    const fetchStressors = async () => {
      if (!user) return;

      try {
        setIsLoadingStressors(true);
        
        // Fetch stressors from ManagingStress step
        const { data, error } = await supabase
          .from("motivation_managing_stress")
          .select("stressors")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) {
          throw error;
        }

        // Fetch any existing stress type classifications
        const result = await fetchData();
        
        if (data?.stressors && Array.isArray(data.stressors)) {
          // Ensure we're working with string values and filter out empty stressors
          const filteredStressors = data.stressors
            .map(s => typeof s === 'string' ? s.trim() : String(s).trim())
            .filter(s => s !== "");
          
          // Check if we have existing data with complete null checks
          if (result && 
              result !== null && 
              typeof result === 'object' && 
              !('error' in result) && 
              'stress_types' in result && 
              Array.isArray(result.stress_types)) {
            // If we have existing data, use it
            setStressTypes(result.stress_types);
          } else {
            // Otherwise initialize with stressors but empty type selections
            setStressTypes(
              filteredStressors.map(stressor => ({
                stressor,
                type: ""
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching stressors:", error);
        toast({
          title: "Error",
          description: "Failed to load stressors from previous step",
          variant: "destructive",
        });
      } finally {
        setIsLoadingStressors(false);
      }
    };

    fetchStressors();
  }, [user, fetchData]);

  const handleStressTypeChange = (index: number, value: "Distress" | "Eustress") => {
    const updatedStressTypes = [...stressTypes];
    updatedStressTypes[index].type = value;
    setStressTypes(updatedStressTypes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all stress types have been selected
    const allTypesSelected = stressTypes.every(item => item.type !== "");
    
    if (!allTypesSelected) {
      toast({
        title: "Please complete all fields",
        description: "Please classify each stressor as either Distress or Eustress",
        variant: "destructive"
      });
      return;
    }
    
    updateForm("stress_types", stressTypes);
    submitForm(e, onComplete);
  };

  const isLoaderVisible = isLoading || isLoadingStressors;

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoaderVisible ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">
                Identifying Your Type of Stress
              </h2>
              <p className="text-gray-600 mb-4">
                We generally dislike stress because it makes us feel anxious, sad, or tense. 
                In extreme situations it overwhelms our ability to meet the demands of everyday life. 
                This is called distress, and it stems from difficult life events that challenge our 
                ability to adapt or cope, like the loss of a job or death of a loved one.
              </p>
              <p className="text-gray-600 mb-4">
                But there is another kind of stress. Eustress is a type of stressor that arises 
                when we experience something positive. It's what you might experience after being 
                promoted at work. While it feels awesome to be recognized for your efforts, the 
                new job may come with additional responsibilities that make you anxious. You might 
                also feel eustress while preparing to attend a fitness competition: while you're 
                excited about meeting new people and showing your progress, you're also nervous 
                and intimidated.
              </p>
            </div>

            <div className="space-y-4">
              <Label className="block text-sm font-medium text-gray-700">
                For each of your identified stressors, indicate whether it is a source of distress or eustress:
              </Label>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-1/2 font-semibold text-purple-800">STRESSOR</TableHead>
                      <TableHead className="w-1/2 font-semibold text-purple-800">DISTRESS OR EUSTRESS?</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stressTypes.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.stressor}</TableCell>
                        <TableCell>
                          <Select
                            value={item.type}
                            onValueChange={(value) => 
                              handleStressTypeChange(index, value as "Distress" | "Eustress")
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select type of stress" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Distress">Distress</SelectItem>
                              <SelectItem value="Eustress">Eustress</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default IdentifyingStressTypes;
