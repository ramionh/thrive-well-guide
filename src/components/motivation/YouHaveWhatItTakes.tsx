
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";
import { CheckSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface YouHaveWhatItTakesProps {
  onComplete?: () => void;
}

const CHARACTERISTICS = [
  ["ACCEPTING", "COMMITTED", "FEARLESS", "PERCEPTIVE", "STUBBORN"],
  ["ACTIVE", "COMPETENT", "FLEXIBLE", "PERSEVERING", "THANKFUL"],
  ["ADAPTABLE", "CONCERNED", "FOCUSED", "PERSISTENT", "THOROUGH"],
  ["ADVENTURESOME", "CONFIDENT", "FORGIVING", "POSITIVE", "THOUGHTFUL"],
  ["AFFECTIONATE", "CONSIDERATE", "FORWARD-LOOKING", "POWERFUL", "TOUGH"],
  ["ALERT", "CREATIVE", "FREE", "PRAYERFUL", "TRUSTWORTHY"],
  ["AMBITIOUS", "DEDICATED", "HEALTHY", "REASONABLE", "UNDERSTANDING"],
  ["ANCHORED", "DETERMINED", "IMAGINATIVE", "RELAXED", "UNIQUE"],
  ["ASSERTIVE", "DIE-HARD", "INGENIOUS", "RELIABLE", "UNSTOPPABLE"],
  ["ASSURED", "DILIGENT", "INTELLIGENT", "RESOURCEFUL", "VIGOROUS"],
  ["ATTENTIVE", "DIRECT", "KNOWLEDGEABLE", "RESPONSIBLE", "VISIONARY"],
  ["BOLD", "DOER", "LOVING", "SENSIBLE", "WHOLE"],
  ["BRAVE", "EAGER", "MATURE", "SKILLFUL", "WILLING"],
  ["CAPABLE", "EARNEST", "OPEN", "SOLID", "WISE"],
  ["CAREFUL", "ENERGETIC", "ORDERLY", "STABLE", "WORTHY"],
  ["CHEERFUL", "EXPERIENCED", "ORGANIZED", "STEADY", "ZEALOUS"],
  ["CLEVER", "FAITHFUL", "PATIENT", "STRONG", "ZESTFUL"],
];

const YouHaveWhatItTakes: React.FC<YouHaveWhatItTakesProps> = ({ onComplete }) => {
  const { toast } = useToast();
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);
  const [example1, setExample1] = useState("");
  const [example2, setExample2] = useState("");

  const { 
    formData, 
    isLoading, 
    isSaving, 
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm({
    tableName: "motivation_characteristics",
    initialState: {
      characteristics: [] as string[],
      examples: ["", ""] as string[]
    },
    onSuccess: onComplete,
    parseData: (data) => {
      console.log("Parsing characteristics data:", data);
      
      // Initialize with empty arrays if the data doesn't exist
      let characteristics: string[] = [];
      let examples: string[] = ["", ""];
      
      // Parse characteristics
      if (data.characteristics) {
        if (Array.isArray(data.characteristics)) {
          characteristics = data.characteristics;
        } else if (typeof data.characteristics === 'string') {
          try {
            characteristics = JSON.parse(data.characteristics);
          } catch (e) {
            console.error("Error parsing characteristics JSON:", e);
            characteristics = [];
          }
        } else if (typeof data.characteristics === 'object') {
          // Handle case where characteristics is already a JSON object
          characteristics = Array.isArray(data.characteristics) ? data.characteristics : [];
        }
      }
      
      // Parse examples
      if (data.examples) {
        if (Array.isArray(data.examples)) {
          examples = data.examples.length >= 2 
            ? [data.examples[0] || "", data.examples[1] || ""] 
            : [...data.examples, ...Array(2 - data.examples.length).fill("")];
        } else if (typeof data.examples === 'string') {
          try {
            const parsedExamples = JSON.parse(data.examples);
            examples = Array.isArray(parsedExamples) 
              ? (parsedExamples.length >= 2 
                  ? [parsedExamples[0] || "", parsedExamples[1] || ""] 
                  : [...parsedExamples, ...Array(2 - parsedExamples.length).fill("")])
              : ["", ""];
          } catch (e) {
            console.error("Error parsing examples JSON:", e);
            examples = ["", ""];
          }
        } else if (typeof data.examples === 'object') {
          // Handle case where examples is already a JSON object
          examples = Array.isArray(data.examples) ? 
            (data.examples.length >= 2 ? data.examples : [...data.examples, ...Array(2 - data.examples.length).fill("")]) : 
            ["", ""];
        }
      }
      
      console.log("Parsed characteristics:", characteristics);
      console.log("Parsed examples:", examples);
      
      return {
        characteristics,
        examples
      };
    },
    transformData: (data) => {
      // Ensure data is properly formatted for saving to database
      return {
        characteristics: data.characteristics,
        examples: [example1, example2]
      };
    }
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchData();
        console.log("Characteristics fetch completed");
      } catch (error) {
        console.error("Error fetching characteristics:", error);
        toast({
          title: "Error",
          description: "Failed to load characteristics data",
          variant: "destructive"
        });
      }
    };
    
    loadData();
  }, [fetchData, toast]);

  // Update local state when formData changes
  useEffect(() => {
    if (formData) {
      console.log("Characteristics form data updated:", formData);
      
      // Handle characteristics
      if (Array.isArray(formData.characteristics)) {
        setSelectedCharacteristics(formData.characteristics);
      }
      
      // Handle examples
      if (Array.isArray(formData.examples)) {
        if (formData.examples.length >= 1) {
          setExample1(formData.examples[0] || "");
        }
        if (formData.examples.length >= 2) {
          setExample2(formData.examples[1] || "");
        }
      }
    }
  }, [formData]);

  const handleCharacteristicToggle = (characteristic: string) => {
    setSelectedCharacteristics(prev => {
      if (prev.includes(characteristic)) {
        return prev.filter(c => c !== characteristic);
      } else {
        return [...prev, characteristic];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Log data before submission to ensure it's properly formatted
    console.log("Submitting characteristics:", selectedCharacteristics);
    console.log("Submitting examples:", [example1, example2]);
    
    // Update the form with current state
    updateForm("characteristics", selectedCharacteristics);
    updateForm("examples", [example1, example2]);
    
    // Submit the form data
    submitForm();
  };

  return (
    <Card className="bg-white shadow-lg border border-purple-200">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckSquare className="h-5 w-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-purple-800">You Have What It Takes</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              There are certain characteristics or personal qualities that are common among successful people. 
              Select all that apply to you.
            </p>

            <div className="space-y-5">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {CHARACTERISTICS.map((row, rowIndex) => (
                    <React.Fragment key={`row-${rowIndex}`}>
                      {row.map((characteristic) => (
                        <div key={characteristic} className="flex items-start space-x-2">
                          <Checkbox 
                            id={characteristic}
                            checked={selectedCharacteristics.includes(characteristic)}
                            onCheckedChange={() => handleCharacteristicToggle(characteristic)}
                            className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                          />
                          <Label 
                            htmlFor={characteristic} 
                            className="text-xs font-medium text-gray-700 cursor-pointer"
                          >
                            {characteristic}
                          </Label>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium text-purple-700 mb-3">
                  Choose two characteristics and describe a time you showed each quality.
                </h3>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="example1" className="block text-sm font-medium text-gray-700">
                      Characteristic 1 Example
                    </Label>
                    <Textarea
                      id="example1"
                      value={example1}
                      onChange={(e) => setExample1(e.target.value)}
                      className="min-h-[80px] border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Describe a time when you demonstrated this characteristic..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="example2" className="block text-sm font-medium text-gray-700">
                      Characteristic 2 Example
                    </Label>
                    <Textarea
                      id="example2"
                      value={example2}
                      onChange={(e) => setExample2(e.target.value)}
                      className="min-h-[80px] border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Describe a time when you demonstrated this characteristic..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isSaving ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default YouHaveWhatItTakes;
