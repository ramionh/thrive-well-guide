import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserCheck, Mail, Phone, Info } from "lucide-react";
import { useUser } from "@/context/UserContext";

interface Coach {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  bio: string;
}

const AssignedCoach: React.FC = () => {
  const { user } = useUser();
  const [showBioModal, setShowBioModal] = useState(false);

  // Get user profile to find assigned coach ID
  const { data: profile } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('assigned_coach_id')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  // Get coach details if assigned
  const { data: coach, isLoading: coachLoading } = useQuery({
    queryKey: ['assigned-coach', profile?.assigned_coach_id],
    queryFn: async () => {
      if (!profile?.assigned_coach_id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, bio')
        .eq('id', profile.assigned_coach_id)
        .single();
      
      if (error) throw error;
      return data as Coach;
    },
    enabled: !!profile?.assigned_coach_id
  });

  if (coachLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            Your Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile?.assigned_coach_id || !coach) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            Your Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No coach assigned yet. You'll be paired with a coach soon!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            Your Coach
          </CardTitle>
          <CardDescription>
            Your personal fitness coach and guide
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <button
              onClick={() => setShowBioModal(true)}
              className="text-lg font-semibold text-primary hover:underline transition-colors"
            >
              {coach.full_name}
            </button>
          </div>
          
          {coach.email && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="h-4 w-4 mr-2" />
              <a href={`mailto:${coach.email}`} className="hover:text-primary transition-colors">
                {coach.email}
              </a>
            </div>
          )}
          
          {coach.phone && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="h-4 w-4 mr-2" />
              <a href={`tel:${coach.phone}`} className="hover:text-primary transition-colors">
                {coach.phone}
              </a>
            </div>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBioModal(true)}
            className="mt-3"
          >
            <Info className="h-4 w-4 mr-2" />
            View Bio
          </Button>
        </CardContent>
      </Card>

      {/* Coach Bio Modal */}
      <Dialog open={showBioModal} onOpenChange={setShowBioModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <UserCheck className="h-5 w-5 mr-2" />
              {coach.full_name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium">Contact Information</h3>
                <div className="space-y-1 mt-2">
                  {coach.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${coach.email}`} className="hover:text-primary transition-colors">
                        {coach.email}
                      </a>
                    </div>
                  )}
                  {coach.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2" />
                      <a href={`tel:${coach.phone}`} className="hover:text-primary transition-colors">
                        {coach.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {coach.bio && (
              <div>
                <h3 className="font-medium mb-3">About Your Coach</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {coach.bio}
                  </p>
                </div>
              </div>
            )}
            
            {!coach.bio && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Coach bio coming soon...
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssignedCoach;