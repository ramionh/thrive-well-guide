
import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import GoalDisplay from "./pros-cons/GoalDisplay";
import ItemList from "./pros-cons/ItemList";
import Reflection from "./pros-cons/Reflection";
import type { ProCon } from "./pros-cons/types";

interface ProConListProps {
  onComplete?: () => void;
}

const ProConList = ({ onComplete }: ProConListProps) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [pros, setPros] = useState<ProCon[]>([]);
  const [cons, setCons] = useState<ProCon[]>([]);
  const [newPro, setNewPro] = useState("");
  const [newCon, setNewCon] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProsCons();
    }
  }, [user]);

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

  return (
    <div className="space-y-6">
      <GoalDisplay />
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
      
      <Reflection onComplete={onComplete} />
    </div>
  );
};

export default ProConList;
