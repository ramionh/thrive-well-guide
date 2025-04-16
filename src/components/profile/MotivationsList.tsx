
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MotivationsListProps {
  motivationalResponses: Record<string, string>;
}

const MotivationsList: React.FC<MotivationsListProps> = ({ motivationalResponses }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Motivations</CardTitle>
        <CardDescription>Your responses from the motivational interview</CardDescription>
      </CardHeader>
      <CardContent>
        {motivationalResponses && Object.keys(motivationalResponses).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(motivationalResponses).map(([category, response]) => (
              <div key={category} className="space-y-2">
                <h3 className="font-medium capitalize">{category}</h3>
                <p className="text-sm p-4 bg-muted rounded-md">
                  {String(response)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            You haven't completed the motivational interview yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default MotivationsList;
