
import React from "react";
import { Circle } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

type StoplightValue = "red" | "yellow" | "green";

interface StoplightControlProps {
  value?: StoplightValue;
  onValueChange?: (value: StoplightValue) => void;
  label?: string;
  readOnly?: boolean;
}

export const StoplightControl = ({
  value,
  onValueChange,
  label,
  readOnly = false,
}: StoplightControlProps) => {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium leading-none">{label}</label>}
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(value) => !readOnly && onValueChange && value && onValueChange(value as StoplightValue)}
        className="flex justify-center gap-2"
        disabled={readOnly}
      >
        <ToggleGroupItem
          value="red"
          className={cn(
            "p-2 data-[state=on]:bg-red-100",
            value === "red" && "ring-2 ring-red-500"
          )}
        >
          <Circle className="h-6 w-6 fill-red-500 text-red-500" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="yellow"
          className={cn(
            "p-2 data-[state=on]:bg-yellow-100",
            value === "yellow" && "ring-2 ring-yellow-500"
          )}
        >
          <Circle className="h-6 w-6 fill-yellow-500 text-yellow-500" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="green"
          className={cn(
            "p-2 data-[state=on]:bg-green-100",
            value === "green" && "ring-2 ring-green-500"
          )}
        >
          <Circle className="h-6 w-6 fill-green-500 text-green-500" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};
