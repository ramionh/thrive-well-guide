
import React from "react";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts";

const ActivityTracker: React.FC = () => {
  const weeklyData = [
    { day: 'Mon', steps: 8500, calories: 2100, active: 45 },
    { day: 'Tue', steps: 9200, calories: 2200, active: 52 },
    { day: 'Wed', steps: 7800, calories: 1950, active: 38 },
    { day: 'Thu', steps: 10500, calories: 2350, active: 65 },
    { day: 'Fri', steps: 9800, calories: 2180, active: 58 },
    { day: 'Sat', steps: 12000, calories: 2400, active: 72 },
    { day: 'Sun', steps: 6500, calories: 1800, active: 28 }
  ];

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Activity Tracking</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-slate-400">Steps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-slate-400">Active Minutes</span>
            </div>
          </div>
        </div>
        
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey="steps"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#stepsGradient)"
              />
              <Area
                type="monotone"
                dataKey="active"
                stroke="#f97316"
                strokeWidth={2}
                fill="url(#activeGradient)"
                scale={100}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-white">9.2K</p>
            <p className="text-sm text-slate-400">Avg Steps</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">51</p>
            <p className="text-sm text-slate-400">Avg Active Min</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">2,139</p>
            <p className="text-sm text-slate-400">Avg Calories</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ActivityTracker;
