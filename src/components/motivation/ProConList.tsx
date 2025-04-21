
import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Plus, Trash } from "lucide-react";

interface ProCon {
  id: string;
  user_id: string;
  text: string;
  type: 'pro' | 'con';
  created_at: string;
}

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
      // Fix the query by specifically selecting the columns we need
      const { data, error } = await supabase
        .from('goals')
        .select('goal_body_type_id, body_types!body_types(name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      
      // Access the name property correctly
      // The body_types property now contains an object with a name property
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
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">Your Fitness Goal</h3>
        <p className="text-gray-700">{goal || "No specific goal defined yet"}</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Pros List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-green-700">Pros (Benefits)</h3>
          <p className="text-sm text-gray-600">What are the benefits of achieving your goal?</p>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add a benefit..."
              value={newPro}
              onChange={(e) => setNewPro(e.target.value)}
              className="flex-grow"
            />
            <Button 
              onClick={() => addItem('pro')} 
              size="sm"
              disabled={!newPro.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="border rounded-md">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : pros.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No pros added yet</div>
            ) : (
              <Table>
                <TableBody>
                  {pros.map((pro) => (
                    <TableRow key={pro.id}>
                      <TableCell className="flex justify-between items-center">
                        <span>{pro.text}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteItem(pro.id, 'pro')}
                          className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
        
        {/* Cons List */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-red-700">Cons (Drawbacks)</h3>
          <p className="text-sm text-gray-600">What might be challenging or difficult?</p>
          
          <div className="flex gap-2">
            <Input
              placeholder="Add a challenge..."
              value={newCon}
              onChange={(e) => setNewCon(e.target.value)}
              className="flex-grow"
            />
            <Button 
              onClick={() => addItem('con')} 
              size="sm"
              disabled={!newCon.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="border rounded-md">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            ) : cons.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No cons added yet</div>
            ) : (
              <Table>
                <TableBody>
                  {cons.map((con) => (
                    <TableRow key={con.id}>
                      <TableCell className="flex justify-between items-center">
                        <span>{con.text}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteItem(con.id, 'con')}
                          className="text-red-500 hover:text-red-700 h-8 w-8 p-0"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
      
      {/* Reflection */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Reflection</h3>
        <p className="mb-4">
          Looking at your pros and cons, what do you notice? Do the benefits outweigh the challenges?
          How might you address some of the challenges you've identified?
        </p>
      </div>
      
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
