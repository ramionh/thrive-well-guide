
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMotivationForm } from "@/hooks/useMotivationForm";
import LoadingState from "./shared/LoadingState";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SocialSystemBoundariesProps {
  onComplete?: () => void;
}

interface Boundary {
  who: string;
  boundary: string;
}

const SocialSystemBoundaries: React.FC<SocialSystemBoundariesProps> = ({ onComplete }) => {
  const [boundaries, setBoundaries] = useState<Boundary[]>([
    { who: "", boundary: "" },
    { who: "", boundary: "" },
    { who: "", boundary: "" },
    { who: "", boundary: "" },
    { who: "", boundary: "" }
  ]);

  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_social_boundaries",
    initialState: {
      boundaries: []
    },
    onSuccess: onComplete
  });

  useEffect(() => {
    if (formData && formData.boundaries && formData.boundaries.length > 0) {
      setBoundaries(formData.boundaries);
    }
  }, [formData]);

  const handleWhoChange = (index: number, value: string) => {
    const updatedBoundaries = [...boundaries];
    updatedBoundaries[index].who = value;
    setBoundaries(updatedBoundaries);
  };

  const handleBoundaryChange = (index: number, value: string) => {
    const updatedBoundaries = [...boundaries];
    updatedBoundaries[index].boundary = value;
    setBoundaries(updatedBoundaries);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty rows before saving
    const filteredBoundaries = boundaries.filter(item => item.who.trim() !== '' || item.boundary.trim() !== '');
    updateForm("boundaries", filteredBoundaries);
    submitForm();
  };

  return (
    <Card className="bg-white shadow-lg border border-purple-200">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Social System Boundaries</h2>
              
              <p className="text-purple-700 mb-6">
                Some people may not be as helpful as you want them to be. Who could be less than helpful as you start to take action? 
                These people don't believe in you or expect you to fail. What boundaries do you need to set with them or yourself?
              </p>

              <div className="overflow-x-auto">
                <Table className="border border-purple-200 rounded-lg">
                  <TableHeader className="bg-purple-50">
                    <TableRow className="hover:bg-purple-100">
                      <TableHead className="w-1/3 font-semibold text-purple-800">WHO</TableHead>
                      <TableHead className="w-2/3 font-semibold text-purple-800">HOW I CAN SET BOUNDARIES</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {boundaries.map((item, index) => (
                      <TableRow key={index} className="hover:bg-purple-50">
                        <TableCell>
                          <Input
                            value={item.who}
                            onChange={(e) => handleWhoChange(index, e.target.value)}
                            placeholder={index === 0 ? "Coworker Jordan" : "Enter name"}
                            className="border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-white"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={item.boundary}
                            onChange={(e) => handleBoundaryChange(index, e.target.value)}
                            placeholder={index === 0 ? "Politely decline offers to go out for unhealthy lunches and bring my planned meals from home" : "How I can set boundaries"}
                            className="border-purple-200 focus:ring-purple-500 focus:border-purple-500 bg-white"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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

export default SocialSystemBoundaries;
