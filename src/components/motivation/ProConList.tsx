import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from "lucide-react";
import GoalDisplay from "./pros-cons/GoalDisplay";
import ItemList from "./pros-cons/ItemList";
import Reflection from "./pros-cons/Reflection";
import type { ProCon } from "./pros-cons/types";

const ProConList = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [pros, setPros] = useState<ProCon[]>([]);
  const [cons, setCons] = useState<ProCon[]>([]);
  const [newPro, setNewPro] = useState("");
  const [newCon, setNewCon] = useState("");
  const [goal, setGoal] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserGoal();
      fetchProsCons();
    }
  }, [user]);

  const fetchUserGoal = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('goals')
        .select('goal_body_type_id, body_types!body_types(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      
      if (data && data.body_types) {
        setGoal(`Become ${data.body_types.name}`);
      }
    } catch (err) {
      console.error("Error fetching goal:", err);
    }
  };

  const fetchProsCons = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('motivation_pros_cons')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      const typedData = data as ProCon[];
      setPros(typedData.filter(item => item.type === 'pro'));
      setCons(typedData.filter(item => item.type === 'con'));
    } catch (err) {
      console.error("Error fetching pros and cons:", err);
      toast({
        title: "Error",
        description: "Failed to load your pros and cons list",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (type: 'pro' | 'con') => {
    if (!user) return;
    
    const text = type === 'pro' ? newPro : newCon;
    if (!text.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('motivation_pros_cons')
        .insert([
          {
            user_id: user.id,
            text: text.trim(),
            type
          }
        ])
        .select();
      
      if (error) throw error;
      
      const newItem = data[0] as ProCon;
      
      if (type === 'pro') {
        setPros([...pros, newItem]);
        setNewPro("");
      } else {
        setCons([...cons, newItem]);
        setNewCon("");
      }
      
      toast({
        title: "Success",
        description: `Added to your ${type === 'pro' ? 'pros' : 'cons'} list`,
      });
    } catch (err) {
      console.error(`Error adding ${type}:`, err);
      toast({
        title: "Error",
        description: `Failed to add your ${type}`,
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (id: string, type: 'pro' | 'con') => {
    try {
      const { error } = await supabase
        .from('motivation_pros_cons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      if (type === 'pro') {
        setPros(pros.filter(p => p.id !== id));
      } else {
        setCons(cons.filter(c => c.id !== id));
      }
      
      toast({
        title: "Success",
        description: `Removed from your ${type === 'pro' ? 'pros' : 'cons'} list`,
      });
    } catch (err) {
      console.error(`Error deleting ${type}:`, err);
      toast({
        title: "Error",
        description: `Failed to delete from your ${type === 'pro' ? 'pros' : 'cons'} list`,
        variant: "destructive",
      });
    }
  };

  const handleMarkComplete = () => {
    if (pros.length === 0) {
      toast({
        title: "Cannot complete",
        description: "Please add at least one pro to continue",
        variant: "destructive",
      });
      return;
    }
    
    setCompleted(true);
    toast({
      title: "Step completed",
      description: "You've completed the Ambivalence step!",
    });
  };

  return (
    <div className="space-y-6">
      <GoalDisplay goal={goal} />
      
      <div className="grid md:grid-cols-2 gap-6">
        <ItemList
          type="pro"
          items={pros}
          newItem={newPro}
          loading={loading}
          onNewItemChange={setNewPro}
          onAddItem={() => addItem('pro')}
          onDeleteItem={(id) => deleteItem(id, 'pro')}
        />
        
        <ItemList
          type="con"
          items={cons}
          newItem={newCon}
          loading={loading}
          onNewItemChange={setNewCon}
          onAddItem={() => addItem('con')}
          onDeleteItem={(id) => deleteItem(id, 'con')}
        />
      </div>
      
      <Reflection />
      
      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleMarkComplete}
          className="bg-purple-600 hover:bg-purple-700"
          disabled={completed || pros.length === 0}
        >
          {completed ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" /> Completed
            </>
          ) : (
            "Mark as Complete"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProConList;
