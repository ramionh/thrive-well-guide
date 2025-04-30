
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AffirmationItem } from "@/hooks/useAffirmationsForm";
import AffirmationExamples from "./AffirmationExamples";
import { MessageSquare } from "lucide-react";

interface AffirmationsFormProps {
  affirmations: AffirmationItem[];
  isSaving: boolean;
  updateAffirmation: (index: number, field: keyof AffirmationItem, value: string) => void;
  saveAffirmations: () => void;
}

const AffirmationForm: React.FC<AffirmationsFormProps> = ({ 
  affirmations, 
  isSaving, 
  updateAffirmation, 
  saveAffirmations 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <MessageSquare className="h-5 w-5 text-purple-600" />
        <h2 className="text-2xl font-bold text-purple-800">Affirmations</h2>
      </div>

      <div className="space-y-4">
        <p className="text-gray-700">
          Positive self-talk helps us build confidence, and affirmations are especially effective. 
          Affirmations are positive judgments about yourself or others that you repeat aloud or write down every day. 
          Over time, these affirmations can change the way you view yourself and assess your own capabilities.
        </p>
        
        <p className="text-gray-700">
          For this exercise, create your own affirmations. In the first column, make a list of personal 
          qualities you consider negative or unhelpful. In the second column, rewrite that criticism in a positive way. 
          Try not to use the same terms in reverse. For example, if you wrote, "I'm not athletic," avoid writing, 
          "I am athletic." Instead, elaborate on why you are athletic by writing something like, 
          "I am capable of being active."
        </p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/2 bg-purple-100">CRITICISM</TableHead>
            <TableHead className="w-1/2 bg-purple-100">AFFIRMATION</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <AffirmationExamples />
          {affirmations.map((affirmation, index) => (
            <TableRow key={index}>
              <TableCell>
                <Input
                  value={affirmation.criticism || ""}
                  onChange={(e) => updateAffirmation(index, "criticism", e.target.value)}
                  placeholder="Enter your criticism here..."
                  className="w-full"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={affirmation.positive || ""}
                  onChange={(e) => updateAffirmation(index, "positive", e.target.value)}
                  placeholder="Enter your positive affirmation here..."
                  className="w-full"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="space-y-4">
        <p className="text-gray-700">
          Write your affirmations on a piece of paper and place it where you will see them every day. 
          If you're creative, decorate the page with colors and images. Try speaking your affirmations out 
          loud several times a day, every day, until you feel more comfortable with these statements.
        </p>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={saveAffirmations}
          disabled={isSaving}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          {isSaving ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              Saving...
            </>
          ) : (
            "Complete Step"
          )}
        </Button>
      </div>
    </div>
  );
};

export default AffirmationForm;
