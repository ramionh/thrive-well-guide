
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";

const AffirmationExamples: React.FC = () => {
  return (
    <>
      <TableRow>
        <TableCell className="italic text-gray-500">Example: "I'm not very athletic."</TableCell>
        <TableCell className="italic text-gray-500">Example: "I am capable of being active."</TableCell>
      </TableRow>
      <TableRow>
        <TableCell className="italic text-gray-500">Example: "I won't find someone else to workout with."</TableCell>
        <TableCell className="italic text-gray-500">Example: "I am worthy of supportive fitness partners."</TableCell>
      </TableRow>
    </>
  );
};

export default AffirmationExamples;
