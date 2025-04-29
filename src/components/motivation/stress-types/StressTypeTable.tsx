
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
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
  onStressorChange: (index: number, value: string) => void;
  onTypeChange: (index: number, value: "distress" | "eustress" | "") => void;
}

const StressTypeTable: React.FC<StressTypeTableProps> = ({
  stressTypes,
  onStressorChange,
  onTypeChange,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/6 font-semibold text-purple-800 text-center">#</TableHead>
            <TableHead className="w-1/2 font-semibold text-purple-800">STRESSOR</TableHead>
            <TableHead className="w-1/3 font-semibold text-purple-800">DISTRESS OR EUSTRESS?</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stressTypes.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium text-center">{index + 1}.</TableCell>
              <TableCell>
                <Input
                  value={item.stressor}
                  onChange={(e) => onStressorChange(index, e.target.value)}
                  placeholder="Enter a stressor..."
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Select
                  value={item.type}
                  onValueChange={(value) => 
                    onTypeChange(index, value as "distress" | "eustress" | "")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
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
