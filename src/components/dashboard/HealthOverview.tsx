
import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, Activity, Moon, Apple } from "lucide-react";

const HealthOverview: React.FC = () => {
  // Mock data - in real app this would come from user's data
  const healthData = {
    heartRate: { current: 72, target: 80, status: 'good' },
    bloodPressure: { systolic: 120, diastolic: 80, status: 'normal' },
    sleepHours: { current: 7.2, target: 8, percentage: 90 },
    calories: { consumed: 1850, target: 2000, percentage: 93 }
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Health Overview</h2>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-400 text-sm">All systems normal</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Heart Rate */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Heart className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Heart Rate</p>
                <p className="text-2xl font-bold text-white">{healthData.heartRate.current}</p>
                <p className="text-xs text-slate-500">BPM</p>
              </div>
            </div>
          </div>

          {/* Blood Pressure */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Activity className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Blood Pressure</p>
                <p className="text-2xl font-bold text-white">
                  {healthData.bloodPressure.systolic}/{healthData.bloodPressure.diastolic}
                </p>
                <p className="text-xs text-slate-500">mmHg</p>
              </div>
            </div>
          </div>

          {/* Sleep */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Moon className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Sleep Duration</p>
                <p className="text-2xl font-bold text-white">{healthData.sleepHours.current}h</p>
                <Progress value={healthData.sleepHours.percentage} className="h-1 mt-2" />
              </div>
            </div>
          </div>

          {/* Calories */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Apple className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Calories</p>
                <p className="text-2xl font-bold text-white">{healthData.calories.consumed}</p>
                <Progress value={healthData.calories.percentage} className="h-1 mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HealthOverview;
