
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

const YouHaveWhatItTakes: React.FC<YouHaveWhatItTakesProps> = ({ onComplete }) => {
  const [selectedCharacteristics, setSelectedCharacteristics] = useState<string[]>([]);
  const [example1, setExample1] = useState("");
  const [example2, setExample2] = useState("");

  const { 
    formData, 
    isLoading, 
    isSubmitting, 
    fetchData,
    updateForm,
    submitForm
  } = useMotivationForm({
    tableName: "motivation_characteristics",
    initialState: {
      characteristics: [],
      examples: ["", ""]
    }
  });

  useEffect(() => {
    fetchData().then((data) => {
      if (data) {
        if (Array.isArray(data.characteristics)) {
          setSelectedCharacteristics(data.characteristics);
        }
        
        if (Array.isArray(data.examples) && data.examples.length === 2) {
          setExample1(data.examples[0] || "");
          setExample2(data.examples[1] || "");
        }
      }
    });
  }, []);

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
    
    submitForm(e, onComplete);
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

export default YouHaveWhatItTakes;
