
import React from "react";

interface WelcomeHeaderProps {
  firstName: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ firstName }) => {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {firstName}</h1>
          <p className="text-muted-foreground">Here's an overview of your wellness journey</p>
        </div>
      </div>
    </>
  );
};

export default WelcomeHeader;
