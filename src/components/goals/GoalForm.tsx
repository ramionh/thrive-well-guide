
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// This is now a read-only view since goals are assigned by the system
const GoalForm: React.FC = () => {
  return (
    <div className="space-y-4">
      <FormDescription>
        Goals are now assigned by the system based on your body type selection and cannot be manually created or edited.
      </FormDescription>
      
      <Button 
        variant="outline" 
        onClick={() => window.location.href = "/body-type"}
        className="w-full"
      >
        Go to Body Type Selection
      </Button>
    </div>
  );
};

export default GoalForm;
