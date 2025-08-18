import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Save, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Obstacle {
  pitfall: string;
  contingency: string;
}

interface DayPlanData {
  id?: string;
  description: string;
  obstacles: Obstacle[];
}

interface DayPlanEditorProps {
  planType: 'best_day' | 'worst_day';
  habitId: string;
  initialData?: DayPlanData;
  onSave: (planType: 'best_day' | 'worst_day', data: DayPlanData) => void;
}

const DayPlanEditor: React.FC<DayPlanEditorProps> = ({
  planType,
  habitId,
  initialData,
  onSave
}) => {
  const [isEditing, setIsEditing] = useState(!initialData);
  const [description, setDescription] = useState(initialData?.description || '');
  const [obstacles, setObstacles] = useState<Obstacle[]>(
    initialData?.obstacles || [{ pitfall: '', contingency: '' }]
  );
  const { toast } = useToast();

  const planTitle = planType === 'best_day' ? 'Best Day Plan' : 'Worst Day Plan';
  const planDescription = planType === 'best_day' 
    ? 'When energy is high and conditions are ideal'
    : 'When exhausted, busy, or facing challenges';

  const addObstacle = () => {
    setObstacles([...obstacles, { pitfall: '', contingency: '' }]);
  };

  const removeObstacle = (index: number) => {
    if (obstacles.length > 1) {
      setObstacles(obstacles.filter((_, i) => i !== index));
    }
  };

  const updateObstacle = (index: number, field: 'pitfall' | 'contingency', value: string) => {
    const updated = [...obstacles];
    updated[index][field] = value;
    setObstacles(updated);
  };

  const handleSave = () => {
    // Validate that we have at least one obstacle with both fields filled
    const validObstacles = obstacles.filter(o => o.pitfall.trim() && o.contingency.trim());
    
    if (!description.trim()) {
      toast({
        title: "Missing Description",
        description: "Please add a description for your plan.",
        variant: "destructive"
      });
      return;
    }

    if (validObstacles.length === 0) {
      toast({
        title: "Missing Obstacles",
        description: "Please add at least one obstacle with a contingency plan.",
        variant: "destructive"
      });
      return;
    }

    const planData: DayPlanData = {
      id: initialData?.id,
      description: description.trim(),
      obstacles: validObstacles
    };

    onSave(planType, planData);
    setIsEditing(false);
    
    toast({
      title: "Plan Saved",
      description: `Your ${planTitle.toLowerCase()} has been saved successfully.`
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!isEditing && initialData) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="mb-2">{planTitle}</Badge>
          <Button onClick={handleEdit} size="sm" variant="ghost">
            <Edit3 className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mb-2">{planDescription}</p>
        <p className="text-sm font-medium">{initialData.description}</p>
        
        {initialData.obstacles.length > 0 && (
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Obstacles & Contingencies
            </h5>
            {initialData.obstacles.map((obstacle, index) => (
              <div key={index} className="bg-muted/50 p-3 rounded-lg text-sm">
                <div className="font-medium text-orange-600 mb-1">
                  Pitfall: {obstacle.pitfall}
                </div>
                <div className="text-green-600">
                  Contingency: {obstacle.contingency}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="border-2 border-dashed border-primary/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Edit3 className="h-4 w-4" />
          Create Your {planTitle}
        </CardTitle>
        <p className="text-xs text-muted-foreground">{planDescription}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Plan Description</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={`Describe your strategy for ${planType === 'best_day' ? 'optimal' : 'challenging'} days...`}
            className="min-h-[80px]"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium">Obstacles & Contingencies</label>
            <Button onClick={addObstacle} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add Obstacle
            </Button>
          </div>
          
          <div className="space-y-3">
            {obstacles.map((obstacle, index) => (
              <div key={index} className="border rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Obstacle {index + 1}</span>
                  {obstacles.length > 1 && (
                    <Button
                      onClick={() => removeObstacle(index)}
                      size="sm"
                      variant="ghost"
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-orange-600 mb-1">
                    What could go wrong or stop you?
                  </label>
                  <Input
                    value={obstacle.pitfall}
                    onChange={(e) => updateObstacle(index, 'pitfall', e.target.value)}
                    placeholder="e.g., Running late in the morning"
                    className="text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-green-600 mb-1">
                    What's your backup plan?
                  </label>
                  <Input
                    value={obstacle.contingency}
                    onChange={(e) => updateObstacle(index, 'contingency', e.target.value)}
                    placeholder="e.g., Do 5 push-ups instead of full workout"
                    className="text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} size="sm" className="flex-1">
            <Save className="h-4 w-4 mr-1" />
            Save Plan
          </Button>
          {initialData && (
            <Button onClick={() => setIsEditing(false)} size="sm" variant="outline">
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DayPlanEditor;