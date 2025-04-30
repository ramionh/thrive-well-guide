
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

interface SupportSystemRolesProps {
  onComplete?: () => void;
}

interface SupportPerson {
  who: string;
  help: string;
}

const SupportSystemRoles: React.FC<SupportSystemRolesProps> = ({ onComplete }) => {
  const [supportSystem, setSupportSystem] = useState<SupportPerson[]>([
    { who: "", help: "" },
    { who: "", help: "" },
    { who: "", help: "" },
    { who: "", help: "" },
    { who: "", help: "" }
  ]);

  const { 
    formData,
    isLoading, 
    isSaving, 
    submitForm, 
    updateForm 
  } = useMotivationForm({
    tableName: "motivation_support_system_roles",
    initialState: {
      support_system: []
    },
    onSuccess: onComplete
  });

  useEffect(() => {
    if (formData && formData.support_system && formData.support_system.length > 0) {
      setSupportSystem(formData.support_system);
    }
  }, [formData]);

  const handleWhoChange = (index: number, value: string) => {
    const updatedSystem = [...supportSystem];
    updatedSystem[index].who = value;
    setSupportSystem(updatedSystem);
  };

  const handleHelpChange = (index: number, value: string) => {
    const updatedSystem = [...supportSystem];
    updatedSystem[index].help = value;
    setSupportSystem(updatedSystem);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty rows before saving
    const filteredSystem = supportSystem.filter(person => person.who.trim() !== '' || person.help.trim() !== '');
    updateForm("support_system", filteredSystem);
    submitForm();
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading ? (
          <LoadingState />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Support System Roles</h2>
              
              <p className="text-gray-600 mb-6">
                In previous sections, you identified your support system, the people who believe in you, and listed some ways 
                they might be able to help you. Now that you have planned your action steps more clearly, revisit the list and 
                make any necessary additions or revisions here.
              </p>

              <div className="overflow-x-auto">
                <Table className="border border-purple-200 rounded-lg">
                  <TableHeader className="bg-purple-50">
                    <TableRow className="hover:bg-purple-100">
                      <TableHead className="w-1/3 font-semibold text-purple-800">WHO</TableHead>
                      <TableHead className="w-2/3 font-semibold text-purple-800">HOW THEY CAN HELP</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supportSystem.map((person, index) => (
                      <TableRow key={index} className="hover:bg-purple-50">
                        <TableCell>
                          <Input
                            value={person.who}
                            onChange={(e) => handleWhoChange(index, e.target.value)}
                            placeholder={index === 0 ? "Personal trainer Alex" : "Enter name"}
                            className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={person.help}
                            onChange={(e) => handleHelpChange(index, e.target.value)}
                            placeholder={index === 0 ? "Create personalized workout plans and help me maintain proper form during exercises" : "How can they help you?"}
                            className="border-purple-200 focus:ring-purple-500 focus:border-purple-500"
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

export default SupportSystemRoles;
