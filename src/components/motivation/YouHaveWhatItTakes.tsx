
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";

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

// Custom parser for the characteristics data
const parseCharacteristicsData = (data: any) => {
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
    }
  }
  
  console.log("Parsed characteristics:", characteristics);
  console.log("Parsed examples:", examples);
  
  return {
    characteristics,
    examples
  };
};

const YouHaveWhatItTakes: React.FC<YouHaveWhatItTakesProps> = ({ onComplete }) => {
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
    parseData: parseCharacteristicsData
  });

  useEffect(() => {
    fetchData().then(() => {
      console.log("Fetch completed");
    });
  }, []);

  // Update local state when formData changes
  useEffect(() => {
    console.log("Form data updated:", formData);
    if (formData) {
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
    
    updateForm("characteristics", selectedCharacteristics);
    updateForm("examples", [example1, example2]);
    
    submitForm();
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">You Have What It Takes</h2>
              <p className="text-gray-600 mb-6">
                There are certain characteristics or personal qualities that are common among successful people. 
                Circle all that apply to you.
              </p>
            </div>

            <div className="space-y-5">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="grid grid-cols-5 gap-4">
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
                      className="min-h-[80px] focus:border-purple-500 focus:ring-purple-500"
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
                      className="min-h-[80px] focus:border-purple-500 focus:ring-purple-500"
                      placeholder="Describe a time when you demonstrated this characteristic..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-purple-600 hover:bg-purple-700"
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
