
import React from "react";

interface DashboardHeaderProps {
  firstName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ firstName }) => {
  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {firstName}
          </h1>
          <p className="text-slate-400 text-lg">
            Your Health, Visualized Like Never Before
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="text-slate-400">
              Track every step towards your goals
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
