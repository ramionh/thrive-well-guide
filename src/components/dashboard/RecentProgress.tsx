
import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, TrendingUp, Calendar } from "lucide-react";

const RecentProgress: React.FC = () => {
  const recentAchievements = [
    {
      title: "Daily Protein Goal",
      description: "Hit 120g protein target",
      time: "2 hours ago",
      type: "nutrition",
      completed: true
    },
    {
      title: "Morning Workout",
      description: "45 min strength training",
      time: "This morning",
      type: "exercise",
      completed: true
    },
    {
      title: "Sleep Schedule",
      description: "8 hours quality sleep",
      time: "Last night",
      type: "recovery",
      completed: true
    },
    {
      title: "Hydration Goal",
      description: "2.5L water intake",
      time: "Yesterday",
      type: "wellness",
      completed: false
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'nutrition':
        return 'text-green-400';
      case 'exercise':
        return 'text-blue-400';
      case 'recovery':
        return 'text-purple-400';
      case 'wellness':
        return 'text-orange-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Recent Progress</h3>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </div>
        
        <div className="space-y-4">
          {recentAchievements.map((achievement, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 mt-1">
                {achievement.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">{achievement.title}</p>
                <p className="text-muted-foreground text-xs">{achievement.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{achievement.time}</span>
                  <span className={`text-xs font-medium ${getTypeColor(achievement.type)} capitalize`}>
                    {achievement.type}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">This Week's Progress</span>
            <span className="text-lg font-bold text-green-500">85%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RecentProgress;
