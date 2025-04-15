
import React from "react";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { StoplightControl } from "@/components/ui/stoplight-control";

interface ProgressTabLayoutProps {
  title: string;
  description: string;
  adherenceValue: "red" | "yellow" | "green";
  onAdherenceChange: (value: "red" | "yellow" | "green") => void;
  adherenceLabel: string;
  children: React.ReactNode;
}

const ProgressTabLayout: React.FC<ProgressTabLayoutProps> = ({
  title,
  description,
  adherenceValue,
  onAdherenceChange,
  adherenceLabel,
  children,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <StoplightControl
          value={adherenceValue}
          onValueChange={onAdherenceChange}
          label={adherenceLabel}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default ProgressTabLayout;

