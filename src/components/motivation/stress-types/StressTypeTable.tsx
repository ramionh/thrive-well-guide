
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

export interface StressType {
  stressor: string;
  type: "Distress" | "Eustress" | "";
}

interface StressTypeTableProps {
  stressTypes: StressType[];
  onStressTypeChange: (index: number, value: "Distress" | "Eustress") => void;
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
                    onStressTypeChange(index, value as "Distress" | "Eustress")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type of stress" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Distress">Distress</SelectItem>
                    <SelectItem value="Eustress">Eustress</SelectItem>
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
