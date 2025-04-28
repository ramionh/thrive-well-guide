
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAffirmations } from "@/hooks/useAffirmations";

interface AffirmationsProps {
  onComplete: () => void;
}

const Affirmations: React.FC<AffirmationsProps> = ({ onComplete }) => {
  const { affirmations, isLoading, isSaving, updateAffirmation, saveAffirmations } = useAffirmations(onComplete);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/2 bg-purple-100">CRITICISM</TableHead>
                <TableHead className="w-1/2 bg-purple-100">AFFIRMATION</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="italic text-gray-500">Example: "I'm not very athletic."</TableCell>
                <TableCell className="italic text-gray-500">Example: "I am capable of being active."</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="italic text-gray-500">Example: "I won't find someone else to workout with."</TableCell>
                <TableCell className="italic text-gray-500">Example: "I am worthy of supportive fitness partners."</TableCell>
              </TableRow>
              {affirmations.map((affirmation, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={affirmation.criticism}
                      onChange={(e) => updateAffirmation(index, "criticism", e.target.value)}
                      placeholder="Enter your criticism here..."
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={affirmation.positive}
                      onChange={(e) => updateAffirmation(index, "positive", e.target.value)}
                      placeholder="Enter your positive affirmation here..."
                      className="w-full"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
          className="bg-purple-600 hover:bg-purple-700"
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

export default Affirmations;
