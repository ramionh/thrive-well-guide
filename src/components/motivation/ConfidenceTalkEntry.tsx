
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { ConfidenceTalkEntry as EntryType } from "@/hooks/useConfidenceTalk";

interface ConfidenceTalkEntryProps {
  entry: EntryType;
  index: number;
  isExample?: boolean;
  onChange?: (index: number, field: keyof EntryType, value: string) => void;
}

const ConfidenceTalkEntry: React.FC<ConfidenceTalkEntryProps> = ({ 
  entry, 
  index, 
  isExample = false,
  onChange 
}) => {
  if (isExample) {
    return (
      <div className="grid grid-cols-2 border-b border-purple-100 bg-gray-50">
        <div className="p-4 border-r border-purple-100 italic text-gray-600">
          {entry.unhelpful}
        </div>
        <div className="p-4 italic text-gray-600">
          {entry.helpful}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 border-b border-purple-100">
      <div className="p-2 border-r border-purple-100">
        <Textarea
          placeholder="Enter an unhelpful thought"
          value={entry.unhelpful}
          onChange={(e) => onChange && onChange(index, "unhelpful", e.target.value)}
          className="min-h-[80px] bg-white"
        />
      </div>
      <div className="p-2">
        <Textarea
          placeholder="Enter a helpful confidence-building thought"
          value={entry.helpful}
          onChange={(e) => onChange && onChange(index, "helpful", e.target.value)}
          className="min-h-[80px] bg-white"
        />
      </div>
    </div>
  );
};

export default ConfidenceTalkEntry;
