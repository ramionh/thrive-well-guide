
import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoalProgress from "./GoalProgress";

const InsightsTabs: React.FC = () => {
  return (
    <div className="mb-6">
      <Tabs defaultValue="goals">
        <TabsList className="bg-background">
          <TabsTrigger value="goals">Goals Progress</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        <TabsContent value="goals" className="mt-4">
          <GoalProgress />
        </TabsContent>
        <TabsContent value="insights" className="mt-4">
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              As you continue to track your progress, personalized insights will appear here.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsightsTabs;
