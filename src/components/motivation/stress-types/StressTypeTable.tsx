
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Use the same type as in useStressTypes.ts
interface StressType {
  stressor: string;
  type: "distress" | "eustress" | "";
}

interface StressTypeTableProps {
  stressTypes: StressType[];
  onStressTypeChange: (index: number, value: "distress" | "eustress" | "") => void;
}

const StressTypeTable: React.FC<StressTypeTableProps> = ({
  stressTypes,
  onStressTypeChange,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2 font-semibold text-purple-800">STRESSOR</TableHead>
            <TableHead className="w-1/2 font-semibold text-purple-800">DISTRESS OR EUSTRESS?</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stressTypes.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.stressor}</TableCell>
              <TableCell>
                <Select
                  value={item.type}
                  onValueChange={(value) => 
                    onStressTypeChange(index, value as "distress" | "eustress" | "")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type of stress" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="distress">Distress</SelectItem>
                    <SelectItem value="eustress">Eustress</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StressTypeTable;
