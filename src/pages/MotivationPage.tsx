
import React from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Motivation from "@/components/motivation/Motivation";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";

const MotivationPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Query to check if user has any goals
  const { data: goals, isLoading } = useQuery({
    queryKey: ['user-goals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data || [];
    },
    onSuccess: (data) => {
      if (data.length === 0) {
        toast({
          title: "No Goals Found",
          description: "Please set your fitness goals before starting your motivation journey.",
          variant: "destructive"
        });
        navigate('/goals');
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!goals || goals.length === 0) {
    return null; // Component will unmount as navigation occurs
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Motivation Journey</h1>
      <Motivation />
    </div>
  );
};

export default MotivationPage;
