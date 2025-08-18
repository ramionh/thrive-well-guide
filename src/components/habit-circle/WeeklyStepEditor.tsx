import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Save, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WeeklyStepEditorProps {
  weekNumber: number;
  title: string;
  description: string;
  initialContent: string;
  isCurrentWeek: boolean;
  isCompleted: boolean;
  onSave: (weekNumber: number, content: string) => void;
}

const getWeeklyPrompts = (weekNumber: number, habitName: string) => {
  const prompts = {
    1: `For Week 1 - Foundation Building with "${habitName}":
• What is the minimum version of this habit you can commit to daily?
• What time of day will you perform this habit?
• What environmental setup do you need?`,
    
    2: `For Week 2 - Consistency Focus with "${habitName}":
• How will you track your daily progress?
• What small rewards will you give yourself for consistency?
• What backup plans do you have for missed days?`,
    
    3: `For Week 3 - Obstacle Planning with "${habitName}":
• What are your 3 most likely obstacles?
• What specific backup plans will you use for each obstacle?
• How will you quickly recover from setbacks?`,
    
    4: `For Week 4 - Environment Design with "${habitName}":
• How can you modify your environment to make this habit easier?
• What visual cues or reminders will you place?
• What barriers to bad habits can you create?`,
    
    5: `For Week 5 - System Integration with "${habitName}":
• How does this habit connect to your other routines?
• What habit stack can you create (After I do X, I will do this habit)?
• How will this habit support your other goals?`,
    
    6: `For Week 6 - Scaling Up with "${habitName}":
• How can you gradually increase the intensity or duration?
• What advanced variations might you try?
• How will you maintain motivation as difficulty increases?`,
    
    7: `For Week 7 - Mastery & Maintenance with "${habitName}":
• How will you maintain this habit long-term?
• What systems will keep you accountable?
• How will you continue evolving and improving this habit?`
  };
  
  return prompts[weekNumber as keyof typeof prompts] || '';
};

const WeeklyStepEditor: React.FC<WeeklyStepEditorProps> = ({
  weekNumber,
  title,
  description,
  initialContent,
  isCurrentWeek,
  isCompleted,
  onSave
}) => {
  const [content, setContent] = useState(initialContent);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSave = () => {
    onSave(weekNumber, content);
    setIsEditing(false);
    toast({
      title: "Step Saved",
      description: `Week ${weekNumber} implementation step has been saved.`
    });
  };

  const getCardStyling = () => {
    if (isCurrentWeek) {
      return 'border-primary bg-primary/5';
    }
    if (isCompleted) {
      return 'border-green-500 bg-green-50/50';
    }
    return 'border-border bg-background';
  };

  const getBadgeVariant = () => {
    if (isCurrentWeek) return 'default';
    if (isCompleted) return 'secondary';
    return 'outline';
  };

  return (
    <Card className={getCardStyling()}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={getBadgeVariant()}>
              {isCompleted ? '✓' : weekNumber} Week {weekNumber}
            </Badge>
            <CardTitle className="text-sm">{title}</CardTitle>
          </div>
          {!isEditing && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardHeader>
      
      <CardContent className="pt-0">
        {isEditing ? (
          <div className="space-y-3">
            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              {getWeeklyPrompts(weekNumber, 'this habit')}
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Enter your implementation plan for Week ${weekNumber}...`}
              className="min-h-[120px] text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setContent(initialContent);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {content ? (
              <div className="text-sm whitespace-pre-wrap">{content}</div>
            ) : (
              <div className="text-sm text-muted-foreground italic">
                Click edit to add your implementation plan for this week
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeeklyStepEditor;