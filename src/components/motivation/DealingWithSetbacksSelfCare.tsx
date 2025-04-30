
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import LoadingState from "./shared/LoadingState";

interface SelfCareProps {
  onComplete: () => void;
}

interface SelfCareCategory {
  label: string;
  options: Array<string | { value: string; custom: boolean }>;
}

const DealingWithSetbacksSelfCare: React.FC<SelfCareProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // States for each category
  const [physicalItems, setPhysicalItems] = useState<string[]>([]);
  const [psychologicalItems, setPsychologicalItems] = useState<string[]>([]);
  const [spiritualItems, setSpiritualItems] = useState<string[]>([]);
  const [interpersonalItems, setInterpersonalItems] = useState<string[]>([]);
  
  // States for custom inputs
  const [customPhysical, setCustomPhysical] = useState<string[]>(["", ""]);
  const [customPsychological, setCustomPsychological] = useState<string[]>(["", ""]);
  const [customSpiritual, setCustomSpiritual] = useState<string[]>(["", ""]);
  const [customInterpersonal, setCustomInterpersonal] = useState<string[]>(["", ""]);

  // Define self-care categories and options
  const selfCareCategories: SelfCareCategory[] = [
    {
      label: "PHYSICAL",
      options: [
        "Work on eating habits",
        "Exercise",
        "Take care of medical issues",
        "Get a massage",
        "Get enough sleep",
        "Take vacations",
        { value: customPhysical[0], custom: true },
        { value: customPhysical[1], custom: true }
      ]
    },
    {
      label: "PSYCHOLOGICAL/EMOTIONAL",
      options: [
        "Make time for self-reflection",
        "Pay attention to my inner experiences (thoughts, beliefs, attitudes, feelings)",
        "Write in a journal",
        "Read",
        "Say no to things that I don't want to do",
        "Read my affirmations",
        "Allow myself to cry",
        "Find things that make me laugh",
        "Express myself in social action, letters, donations, messages",
        { value: customPsychological[0], custom: true },
        { value: customPsychological[1], custom: true }
      ]
    },
    {
      label: "SPIRITUAL",
      options: [
        "Spend time in nature",
        "Be open to inspiration",
        "Be open to the unknown/not knowing",
        "Pray",
        "Meditate",
        "Sing",
        "Find a spiritual connection or community",
        { value: customSpiritual[0], custom: true },
        { value: customSpiritual[1], custom: true }
      ]
    },
    {
      label: "INTERPERSONAL",
      options: [
        "Schedule regular dates or activities with loved ones",
        "Call out-of-town relatives",
        "Spend time with my pet(s)",
        "Enlarge my social circle",
        "Allow others to help me",
        { value: customInterpersonal[0], custom: true },
        { value: customInterpersonal[1], custom: true }
      ]
    }
  ];

  useEffect(() => {
    fetchSelfCareData();
  }, [user?.id]);

  const fetchSelfCareData = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("motivation_dealing_setbacks_self_care")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setPhysicalItems(data.physical || []);
        setPsychologicalItems(data.psychological || []);
        setSpiritualItems(data.spiritual || []);
        setInterpersonalItems(data.interpersonal || []);

        // Extract custom inputs
        const customPhysicalEntries = data.physical.filter(item => 
          !selfCareCategories[0].options.some(opt => 
            typeof opt === 'string' && opt === item
          )
        );
        
        const customPsychologicalEntries = data.psychological.filter(item => 
          !selfCareCategories[1].options.some(opt => 
            typeof opt === 'string' && opt === item
          )
        );
        
        const customSpiritualEntries = data.spiritual.filter(item => 
          !selfCareCategories[2].options.some(opt => 
            typeof opt === 'string' && opt === item
          )
        );
        
        const customInterpersonalEntries = data.interpersonal.filter(item => 
          !selfCareCategories[3].options.some(opt => 
            typeof opt === 'string' && opt === item
          )
        );
        
        setCustomPhysical([
          customPhysicalEntries[0] || "",
          customPhysicalEntries[1] || ""
        ]);
        
        setCustomPsychological([
          customPsychologicalEntries[0] || "",
          customPsychologicalEntries[1] || ""
        ]);
        
        setCustomSpiritual([
          customSpiritualEntries[0] || "",
          customSpiritualEntries[1] || ""
        ]);
        
        setCustomInterpersonal([
          customInterpersonalEntries[0] || "",
          customInterpersonalEntries[1] || ""
        ]);
      }
    } catch (error) {
      console.error("Error fetching self-care data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch your self-care data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckboxChange = (category: string, value: string, checked: boolean) => {
    switch (category) {
      case "PHYSICAL":
        setPhysicalItems(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
      case "PSYCHOLOGICAL/EMOTIONAL":
        setPsychologicalItems(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
      case "SPIRITUAL":
        setSpiritualItems(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
      case "INTERPERSONAL":
        setInterpersonalItems(prev => 
          checked ? [...prev, value] : prev.filter(item => item !== value)
        );
        break;
    }
  };

  const handleCustomInputChange = (category: string, index: number, value: string) => {
    switch (category) {
      case "PHYSICAL":
        setCustomPhysical(prev => {
          const updated = [...prev];
          updated[index] = value;
          return updated;
        });
        break;
      case "PSYCHOLOGICAL/EMOTIONAL":
        setCustomPsychological(prev => {
          const updated = [...prev];
          updated[index] = value;
          return updated;
        });
        break;
      case "SPIRITUAL":
        setCustomSpiritual(prev => {
          const updated = [...prev];
          updated[index] = value;
          return updated;
        });
        break;
      case "INTERPERSONAL":
        setCustomInterpersonal(prev => {
          const updated = [...prev];
          updated[index] = value;
          return updated;
        });
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    
    // Add non-empty custom inputs to their respective arrays
    const finalPhysical = [...physicalItems];
    const finalPsychological = [...psychologicalItems];
    const finalSpiritual = [...spiritualItems];
    const finalInterpersonal = [...interpersonalItems];

    customPhysical.forEach(item => {
      if (item.trim() && !finalPhysical.includes(item.trim())) {
        finalPhysical.push(item.trim());
      }
    });

    customPsychological.forEach(item => {
      if (item.trim() && !finalPsychological.includes(item.trim())) {
        finalPsychological.push(item.trim());
      }
    });

    customSpiritual.forEach(item => {
      if (item.trim() && !finalSpiritual.includes(item.trim())) {
        finalSpiritual.push(item.trim());
      }
    });

    customInterpersonal.forEach(item => {
      if (item.trim() && !finalInterpersonal.includes(item.trim())) {
        finalInterpersonal.push(item.trim());
      }
    });

    try {
      const { error } = await supabase
        .from("motivation_dealing_setbacks_self_care")
        .upsert({
          user_id: user.id,
          physical: finalPhysical,
          psychological: finalPsychological,
          spiritual: finalSpiritual,
          interpersonal: finalInterpersonal,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Mark step as complete
      await supabase
        .from("motivation_steps_progress")
        .upsert({
          user_id: user.id,
          step_number: 89,
          step_name: "Dealing with Setbacks: Self-Care",
          completed: true,
          completed_at: new Date().toISOString(),
          available: true
        });

      // Make next step available
      await supabase
        .from("motivation_steps_progress")
        .upsert({
          user_id: user.id,
          step_number: 90,
          step_name: "Change Your Plan",
          completed: false,
          available: true,
          completed_at: null
        });

      toast({
        title: "Success",
        description: "Your self-care plan has been saved"
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving self-care plan:", error);
      toast({
        title: "Error",
        description: "Failed to save your self-care plan",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-purple-800 mb-4">Dealing with Setbacks: Self-Care</h2>
            <p className="text-gray-700 mb-6">
              When you experience setbacks or relapses, make sure you forgive yourself. Beating yourself up for not being perfect won't get you closer to your fitness goals; it will just lower your morale. Instead, engage in self-care, which can involve psychological, physical, emotional, spiritual, relationship, and work activities. Taking time for some self-care can put you back in a positive state of mind to refocus and recommit to your plan.
            </p>
            <p className="text-gray-700 mb-6">
              Review this list of ideas, adapted from Lisa D. Butler's "Developing Your Self-Care Plan." Check off the activities you would like to try or do more frequently to improve your self-care. Add any additional ideas, too.
            </p>
          </div>
          
          <div className="space-y-8">
            {selfCareCategories.map((category, categoryIndex) => (
              <div key={category.label} className="space-y-3">
                <h3 className="font-semibold text-lg text-purple-800">{category.label}</h3>
                <div className="space-y-2">
                  {category.options.map((option, optionIndex) => {
                    if (typeof option === 'string') {
                      // Regular checkbox option
                      let isChecked = false;
                      switch (category.label) {
                        case "PHYSICAL":
                          isChecked = physicalItems.includes(option);
                          break;
                        case "PSYCHOLOGICAL/EMOTIONAL":
                          isChecked = psychologicalItems.includes(option);
                          break;
                        case "SPIRITUAL":
                          isChecked = spiritualItems.includes(option);
                          break;
                        case "INTERPERSONAL":
                          isChecked = interpersonalItems.includes(option);
                          break;
                      }
                      
                      return (
                        <div key={optionIndex} className="flex items-center space-x-3">
                          <Checkbox 
                            id={`${category.label}-${optionIndex}`}
                            checked={isChecked}
                            onCheckedChange={(checked) => 
                              handleCheckboxChange(category.label, option, checked as boolean)
                            }
                          />
                          <label 
                            htmlFor={`${category.label}-${optionIndex}`}
                            className="text-gray-700 cursor-pointer"
                          >
                            {option}
                          </label>
                        </div>
                      );
                    } else if (option.custom) {
                      // Custom input option
                      const customIndex = optionIndex - (category.options.length - 2); // Assuming 2 custom fields per category
                      let customArray: string[] = [];
                      switch (category.label) {
                        case "PHYSICAL":
                          customArray = customPhysical;
                          break;
                        case "PSYCHOLOGICAL/EMOTIONAL":
                          customArray = customPsychological;
                          break;
                        case "SPIRITUAL":
                          customArray = customSpiritual;
                          break;
                        case "INTERPERSONAL":
                          customArray = customInterpersonal;
                          break;
                      }
                      
                      return (
                        <div key={optionIndex} className="flex items-start space-x-3">
                          <Checkbox 
                            id={`${category.label}-custom-${customIndex}`}
                            checked={customArray[customIndex] !== "" && (
                              (category.label === "PHYSICAL" && physicalItems.includes(customArray[customIndex])) ||
                              (category.label === "PSYCHOLOGICAL/EMOTIONAL" && psychologicalItems.includes(customArray[customIndex])) ||
                              (category.label === "SPIRITUAL" && spiritualItems.includes(customArray[customIndex])) ||
                              (category.label === "INTERPERSONAL" && interpersonalItems.includes(customArray[customIndex]))
                            )}
                            onCheckedChange={(checked) => {
                              if (customArray[customIndex].trim()) {
                                handleCheckboxChange(category.label, customArray[customIndex], checked as boolean);
                              }
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center">
                              <label 
                                htmlFor={`${category.label}-custom-${customIndex}`}
                                className="text-gray-700 mr-2"
                              >
                                Other:
                              </label>
                              <Input 
                                type="text"
                                value={customArray[customIndex]}
                                onChange={(e) => 
                                  handleCustomInputChange(category.label, customIndex, e.target.value)
                                }
                                className="max-w-[250px]"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSaving}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSaving ? "Saving..." : "Complete Step"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DealingWithSetbacksSelfCare;
