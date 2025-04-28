
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type StressRating } from "@/hooks/useStressRatings";

interface StressRatingTableProps {
  stressRatings: StressRating[];
  onRatingChange: (index: number, rating: number) => void;
  onExplanationChange: (index: number, explanation: string) => void;
}

const StressRatingTable: React.FC<StressRatingTableProps> = ({ 
  stressRatings, 
  onRatingChange, 
  onExplanationChange 
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold text-purple-800">STRESSOR</TableHead>
            <TableHead className="font-semibold text-purple-800">RATING</TableHead>
            <TableHead className="font-semibold text-purple-800">EXPLANATION FOR RATING</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stressRatings.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item.stressor}</TableCell>
              <TableCell>
                <Select
                  value={item.rating?.toString() || ""}
                  onValueChange={(value) => onRatingChange(index, parseInt(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Textarea
                  value={item.explanation}
                  onChange={(e) => onExplanationChange(index, e.target.value)}
                  placeholder="Explain your rating..."
                  className="min-h-[80px]"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default StressRatingTable;
