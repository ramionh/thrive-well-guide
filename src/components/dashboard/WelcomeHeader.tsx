
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserRound } from "lucide-react";

interface WelcomeHeaderProps {
  firstName: string;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ firstName }) => {
  return (
    <>
      <div className="flex items-center mb-6">
        <div className="flex items-center pointer-events-none">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-muted">
              <UserRound className="h-5 w-5 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <span className="ml-3 text-lg font-medium text-muted-foreground">
            {firstName}
          </span>
        </div>
      </div>

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
