
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useMotivationForm } from "@/hooks/useMotivationForm";

interface SocialSupportProps {
  onComplete: () => void;
}

interface SocialSkillOption {
  id: string;
  label: string;
}

const SocialSupport: React.FC<SocialSupportProps> = ({ onComplete }) => {
  const socialSkillOptions: SocialSkillOption[] = [
    { id: "meet_new_people", label: "MEET NEW PEOPLE" },
    { id: "comfortable_social", label: "FEEL COMFORTABLE IN NEW SOCIAL SITUATIONS" },
    { id: "maintain_connections", label: "MAINTAIN CONNECTIONS WITH A LOT OF FRIENDS" },
    { id: "make_friends", label: "MAKE FRIENDS EASILY" },
    { id: "start_conversation", label: "START A CONVERSATION WITH PEOPLE" },
    { id: "laugh_with_people", label: "LAUGH WITH PEOPLE" },
    { id: "good_friend", label: "BE A GOOD FRIEND" },
    { id: "flexible_social", label: "BE FLEXIBLE WHEN SOCIAL SITUATIONS CHANGE" },
    { id: "make_others_laugh", label: "MAKE OTHER PEOPLE LAUGH" }
  ];

  const initialState = {
    supportTypes: {
      financial: "",
      listeners: "",
      encouragers: "",
      valuers: "",
      talkers: ""
    },
    socialSkills: [] as string[],
    socialFeelings: "",
    buildSocial: ""
  };

  const { formData, updateForm, submitForm, isLoading } = useMotivationForm({
    tableName: "motivation_social_support",
    initialState,
    onSuccess: onComplete,
    transformData: (data) => {
      return {
        support_types: data.supportTypes,
        social_skills: data.socialSkills,
        social_feelings: data.socialFeelings,
        build_social: data.buildSocial
      };
    }
  });

  const handleSocialSkillToggle = (skillId: string) => {
    const updatedSkills = formData.socialSkills.includes(skillId)
      ? formData.socialSkills.filter(id => id !== skillId)
      : [...formData.socialSkills, skillId];
    
    updateForm("socialSkills", updatedSkills);
  };

  const handleUpdateSupportType = (key: keyof typeof formData.supportTypes, value: string) => {
    updateForm("supportTypes", {
      ...formData.supportTypes,
      [key]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-bold text-purple-800">Social Support and Social Competence</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <p className="mb-6 text-gray-600">
          Let's take a look at your support system, or the people you can rely on, as well as your ability to access and accept help from others. 
          In the first part of this exercise, consider all the different ways people can be helpful, such as providing financial support, 
          being a good listener, or believing in you. You may know someone who is able to do all these things, some of these things, or just one of these things. 
          Write the names of as many people as you like for each type of support.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-purple-700">I have close friends or family members who can support me in the following ways:</h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="financial" className="text-purple-600">Help financially:</Label>
                <Input 
                  id="financial"
                  value={formData.supportTypes.financial}
                  onChange={(e) => handleUpdateSupportType("financial", e.target.value)}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="listeners" className="text-purple-600">Listen:</Label>
                <Input 
                  id="listeners"
                  value={formData.supportTypes.listeners}
                  onChange={(e) => handleUpdateSupportType("listeners", e.target.value)}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="encouragers" className="text-purple-600">Encourage me:</Label>
                <Input 
                  id="encouragers"
                  value={formData.supportTypes.encouragers}
                  onChange={(e) => handleUpdateSupportType("encouragers", e.target.value)}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="valuers" className="text-purple-600">Value my abilities:</Label>
                <Input 
                  id="valuers"
                  value={formData.supportTypes.valuers}
                  onChange={(e) => handleUpdateSupportType("valuers", e.target.value)}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Label htmlFor="talkers" className="text-purple-600">Regularly talk:</Label>
                <Input 
                  id="talkers"
                  value={formData.supportTypes.talkers}
                  onChange={(e) => handleUpdateSupportType("talkers", e.target.value)}
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-purple-700">Now that you've identified who can help, what skills will assist you in reaching out for assistance? Check all that apply below. I am able to:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {socialSkillOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option.id}
                    checked={formData.socialSkills.includes(option.id)}
                    onCheckedChange={() => handleSocialSkillToggle(option.id)}
                    disabled={isLoading}
                  />
                  <label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="socialFeelings" className="text-purple-600">How do you feel about the social aspect of your life?</Label>
              <Textarea 
                id="socialFeelings"
                value={formData.socialFeelings}
                onChange={(e) => updateForm("socialFeelings", e.target.value)}
                className="mt-1"
                rows={4}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="buildSocial" className="text-purple-600">What can you build on or add to any of these social supports and strengths?</Label>
              <Textarea 
                id="buildSocial"
                value={formData.buildSocial}
                onChange={(e) => updateForm("buildSocial", e.target.value)}
                className="mt-1"
                rows={4}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button 
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SocialSupport;
