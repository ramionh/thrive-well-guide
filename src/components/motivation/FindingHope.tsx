
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";

interface FindingHopeProps {
  onComplete?: () => void;
}

const FindingHope: React.FC<FindingHopeProps> = ({ onComplete }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [generalHope, setGeneralHope] = useState("");
  const [personalHope, setPersonalHope] = useState("");
  const [changeHope, setChangeHope] = useState("");

  useEffect(() => {
    const fetchExistingData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("motivation_finding_hope")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setGeneralHope(data.general_hope || "");
          setPersonalHope(data.personal_hope || "");
          setChangeHope(data.change_hope || "");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load your previous responses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingData();
  }, [user, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("motivation_finding_hope")
        .insert({
          user_id: user.id,
          general_hope: generalHope,
          personal_hope: personalHope,
          change_hope: changeHope
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your response has been saved",
      });

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error saving response:", error);
      toast({
        title: "Error",
        description: "Failed to save your response",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-purple-500 rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Finding Hope</h2>
              <p className="text-gray-600 mb-6">
                Hope is feeling optimistic about the future. It's an expectation that something will turn out well. 
                Whether it's something you install (instantly have) or instill (slowly build up), 
                being hopeful about achieving your goal is paramount. 
                Finding hope is a matter of calling forth that which is already there.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  What makes people feel hopeful (in general)?
                </label>
                <Textarea
                  value={generalHope}
                  onChange={(e) => setGeneralHope(e.target.value)}
                  placeholder="Enter your thoughts"
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  What makes you feel hopeful (in general)?
                </label>
                <Textarea
                  value={personalHope}
                  onChange={(e) => setPersonalHope(e.target.value)}
                  placeholder="Enter your thoughts"
                  rows={4}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-2">
                  What gives you hope about making this change?
                </label>
                <Textarea
                  value={changeHope}
                  onChange={(e) => setChangeHope(e.target.value)}
                  placeholder="Enter your thoughts"
                  rows={4}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Saving..." : "Complete Step"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default FindingHope;
