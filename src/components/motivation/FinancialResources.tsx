
import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMotivationForm } from "@/hooks/motivation/useMotivationForm";
import { Coins } from "lucide-react";
import { parseFinancialResourcesData, FinancialResourcesFormData } from "@/hooks/motivation/parseFinancialResourcesData";
import LoadingState from "./shared/LoadingState";

interface FinancialResourcesProps {
  onComplete?: () => void;
}

const FinancialResources: React.FC<FinancialResourcesProps> = ({ onComplete }) => {
  const didInitialFetch = useRef(false);
  
  const initialState: FinancialResourcesFormData = {
    income: "",
    job_stability: "",
    workplace_benefits: "",
    flexible_schedule: "",
    job_satisfaction: "",
    financial_feelings: "",
    build_resources: ""
  };

  const transformData = (formData: FinancialResourcesFormData) => {
    console.log("FinancialResources: Transforming data for database:", formData);
    return {
      income: formData.income,
      job_stability: formData.job_stability,
      workplace_benefits: formData.workplace_benefits,
      flexible_schedule: formData.flexible_schedule,
      job_satisfaction: formData.job_satisfaction,
      financial_feelings: formData.financial_feelings,
      build_resources: formData.build_resources
    };
  };

  const { 
    formData, 
    updateForm, 
    submitForm, 
    isLoading, 
    isSaving, 
    error,
    fetchData 
  } = useMotivationForm<FinancialResourcesFormData>({
    tableName: "motivation_financial_resources",
    initialState,
    parseData: parseFinancialResourcesData,
    transformData,
    onSuccess: () => {
      console.log("FinancialResources: Form submitted successfully, calling onComplete");
      if (onComplete) {
        onComplete();
      }
    },
    stepNumber: 50,
    nextStepNumber: 51,
    stepName: "Financial and Economic Resources",
    nextStepName: "Social Support and Social Competence"
  });

  // Fetch data on component mount
  useEffect(() => {
    if (!didInitialFetch.current) {
      console.log("FinancialResources: Fetching data on mount");
      fetchData();
      didInitialFetch.current = true;
    }
  }, [fetchData]);

  // Debug log to see current form data
  useEffect(() => {
    console.log("FinancialResources: Current form data state:", formData);
    console.log("FinancialResources: Is loading:", isLoading);
    console.log("FinancialResources: Is saving:", isSaving);
  }, [formData, isLoading, isSaving]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("FinancialResources: Submitting form with data:", formData);
    submitForm();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="p-4 text-red-500">
            <p>An error occurred while loading this component. Please try refreshing the page.</p>
            <p className="text-sm mt-2">{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Coins className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-semibold text-purple-800">Financial and Economic Resources</h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Below are some economic resources and strengths that can help you achieve your goal. 
          Explain how each applicable item might be helpful to you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-1">
              Income:
            </label>
            <Textarea
              id="income"
              rows={2}
              value={formData.income || ""}
              onChange={(e) => {
                console.log("FinancialResources: Updating income field:", e.target.value);
                updateForm("income", e.target.value);
              }}
              className="w-full resize-none"
            />
          </div>

          <div>
            <label htmlFor="job_stability" className="block text-sm font-medium text-gray-700 mb-1">
              Job stability:
            </label>
            <Textarea
              id="job_stability" 
              rows={2}
              value={formData.job_stability || ""}
              onChange={(e) => {
                console.log("FinancialResources: Updating job_stability field:", e.target.value);
                updateForm("job_stability", e.target.value);
              }}
              className="w-full resize-none"
            />
          </div>

          <div>
            <label htmlFor="workplace_benefits" className="block text-sm font-medium text-gray-700 mb-1">
              Workplace benefits:
            </label>
            <Textarea
              id="workplace_benefits"
              rows={2}
              value={formData.workplace_benefits || ""}
              onChange={(e) => {
                console.log("FinancialResources: Updating workplace_benefits field:", e.target.value);
                updateForm("workplace_benefits", e.target.value);
              }}
              className="w-full resize-none"
            />
          </div>

          <div>
            <label htmlFor="flexible_schedule" className="block text-sm font-medium text-gray-700 mb-1">
              Flexible work schedule:
            </label>
            <Textarea
              id="flexible_schedule"
              rows={2}
              value={formData.flexible_schedule || ""}
              onChange={(e) => {
                console.log("FinancialResources: Updating flexible_schedule field:", e.target.value);
                updateForm("flexible_schedule", e.target.value);
              }}
              className="w-full resize-none"
            />
          </div>

          <div>
            <label htmlFor="job_satisfaction" className="block text-sm font-medium text-gray-700 mb-1">
              Job satisfaction:
            </label>
            <Textarea
              id="job_satisfaction"
              rows={2}
              value={formData.job_satisfaction || ""}
              onChange={(e) => {
                console.log("FinancialResources: Updating job_satisfaction field:", e.target.value);
                updateForm("job_satisfaction", e.target.value);
              }}
              className="w-full resize-none"
            />
          </div>

          <div>
            <label htmlFor="financial_feelings" className="block text-sm font-medium text-gray-700 mb-1">
              How do you feel about finances in general?
            </label>
            <Textarea
              id="financial_feelings"
              rows={2}
              value={formData.financial_feelings || ""}
              onChange={(e) => {
                console.log("FinancialResources: Updating financial_feelings field:", e.target.value);
                updateForm("financial_feelings", e.target.value);
              }}
              className="w-full resize-none"
            />
          </div>

          <div>
            <label htmlFor="build_resources" className="block text-sm font-medium text-gray-700 mb-1">
              What can you do to build on or add to any of these resources?
            </label>
            <Textarea
              id="build_resources"
              rows={3}
              value={formData.build_resources || ""}
              onChange={(e) => {
                console.log("FinancialResources: Updating build_resources field:", e.target.value);
                updateForm("build_resources", e.target.value);
              }}
              className="w-full resize-none"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSaving}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 mt-6"
          >
            {isSaving ? "Saving..." : "Complete Step"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FinancialResources;
