
import React from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, Target, Zap, Calendar } from "lucide-react";

const MetricsGrid: React.FC = () => {
  const metrics = [
    {
      title: "Sleep Quality",
      value: "7.5",
      unit: "hours",
      change: "+0.5h",
      trend: "up",
      icon: Calendar,
      color: "blue"
    },
    {
      title: "Nutrition",
      value: "2,458",
      unit: "kcal",
      change: "+5%",
      trend: "up", 
      icon: Target,
      color: "orange"
    },
    {
      title: "Exercise",
      value: "14:00",
      unit: "minutes",
      change: "+12%",
      trend: "up",
      icon: Zap,
      color: "green"
    },
    {
      title: "Goals",
      value: "3/5",
      unit: "complete",
      change: "+1",
      trend: "up",
      icon: TrendingUp,
      color: "purple"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'green':
        return { bg: 'bg-green-500/20', text: 'text-green-400', icon: 'text-green-400' };
      case 'orange':
        return { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: 'text-orange-400' };
      case 'blue':
        return { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: 'text-blue-400' };
      case 'purple':
        return { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: 'text-purple-400' };
      default:
        return { bg: 'bg-slate-500/20', text: 'text-slate-400', icon: 'text-slate-400' };
    }
  };

  return (
    <>
      {metrics.map((metric, index) => {
        const colors = getColorClasses(metric.color);
        const Icon = metric.icon;
        
        return (
          <Card key={index}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 ${colors.bg} rounded-lg`}>
                  <Icon className={`h-5 w-5 ${colors.icon}`} />
                </div>
                <div className={`text-sm font-medium ${colors.text}`}>
                  {metric.change}
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.unit}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </>
  );
};

export default MetricsGrid;
