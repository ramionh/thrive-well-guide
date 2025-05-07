
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import { Book, Smartphone, Newspaper, Tv, Instagram, Youtube, BookOpen, Globe } from "lucide-react";
import LoadingState from "./shared/LoadingState";

interface SeekPositiveInformationProps {
  onComplete?: () => void;
}

const INFORMATION_SOURCES = [
  { value: "websites", label: "WEBSITES (NEWS, EDUCATIONAL, OR BLOGS)", icon: Globe },
  { value: "apps", label: "SMARTPHONE APPS", icon: Smartphone },
  { value: "books", label: "BOOKS", icon: Book },
  { value: "newspapers", label: "NEWSPAPERS", icon: Newspaper },
  { value: "tv", label: "TELEVISION SHOWS", icon: Tv },
  { value: "magazines", label: "MAGAZINES", icon: BookOpen },
  { value: "social_media", label: "SOCIAL MEDIA", icon: Instagram }
];

const SeekPositiveInformation: React.FC<SeekPositiveInformationProps> = ({ onComplete }) => {
  const [selectedSourceTypes, setSelectedSourceTypes] = useState<string[]>([]);
  const [specificSources, setSpecificSources] = useState<string>("");
  
  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_positive_information",
    initialState: {
      selected_source_types: [],
      specific_sources: ""
    },
    onSuccess: onComplete,
    stepNumber: 75,
    stepName: "Seek Positive Information Daily"
  });
  
  useEffect(() => {
    if (formData) {
      if (formData.selected_source_types && Array.isArray(formData.selected_source_types)) {
        setSelectedSourceTypes(formData.selected_source_types);
      }
      
      if (formData.specific_sources) {
        setSpecificSources(formData.specific_sources);
      }
    }
  }, [formData]);
  
  const toggleSourceType = (value: string) => {
    setSelectedSourceTypes(prev => 
      prev.includes(value)
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateForm("selected_source_types", selectedSourceTypes);
    updateForm("specific_sources", specificSources);
    submitForm();
  };
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-purple-800 mb-4">Seek Positive Information Daily</h2>
            
            <p className="text-gray-600 mb-6">
              A steady flow of positive information is essential to staying focused. Each day, consult material that will help you learn and will reinforce your commitment to your fitness goals. Brainstorm some specific sources that will keep your mind focused on your goals and objectives. Think of educational resources that will help you learn more about the goal area or tips for successful efforts. Explore a few possible resources, then list specific ones you want to try. For example, if my goal is to improve my running, I might put Runner's World website on my information list.
            </p>
            
            <div className="space-y-5">
              <Label className="text-purple-700 font-medium">Select information sources you'll consult:</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {INFORMATION_SOURCES.map((source) => {
                  const IconComponent = source.icon;
                  const isChecked = selectedSourceTypes.includes(source.value);
                  
                  return (
                    <div 
                      key={source.value}
                      className={`flex items-center space-x-3 border rounded-lg p-4 cursor-pointer transition-colors ${
                        isChecked 
                          ? 'bg-purple-100 border-purple-300'
                          : 'bg-white border-gray-200 hover:bg-purple-50'
                      }`}
                      onClick={() => toggleSourceType(source.value)}
                    >
                      <Checkbox 
                        id={`source-${source.value}`}
                        checked={isChecked}
                        onCheckedChange={() => toggleSourceType(source.value)}
                        className="data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-5 w-5 text-purple-600" />
                        <span className="font-medium text-gray-700">{source.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6">
                <Label htmlFor="specificSources" className="text-purple-700 font-medium">
                  Specific sources I can use:
                </Label>
                <Textarea
                  id="specificSources"
                  value={specificSources}
                  onChange={(e) => setSpecificSources(e.target.value)}
                  className="mt-2 h-32 resize-none focus:ring-purple-500 focus:border-purple-500"
                  placeholder="List specific websites, apps, books, or other resources you'll use..."
                />
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
      </CardContent>
    </Card>
  );
};

export default SeekPositiveInformation;
