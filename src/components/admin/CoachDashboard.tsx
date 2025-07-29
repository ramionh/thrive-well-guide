import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, User, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import ClientDetailView from "./ClientDetailView";

interface Client {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  height_feet?: number;
  height_inches?: number;
  weight_lbs?: number;
  is_active: boolean;
}

const CoachDashboard = () => {
  const { isCoach, role } = useUserRole();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isCoach) {
      fetchMyClients();
    }
  }, [isCoach]);

  const fetchMyClients = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: clients, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('assigned_coach_id', user.id)
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;

      setClients(clients || []);
    } catch (error: any) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  if (!isCoach) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            This section is only available for coaches.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (selectedClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setSelectedClient(null)}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
          <h2 className="text-2xl font-bold">Client Overview: {selectedClient.full_name}</h2>
        </div>
        <ClientDetailView client={selectedClient} />
      </div>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Clients...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            My Clients
          </CardTitle>
          <CardDescription>
            Manage and track progress for your assigned clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No Clients Assigned</h3>
              <p className="text-muted-foreground">
                You don't have any clients assigned to you yet. Contact an administrator to assign clients.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clients.map((client) => (
                <Card 
                  key={client.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedClient(client)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {client.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{client.full_name}</CardTitle>
                        <CardDescription>{client.email}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {client.phone && (
                        <p className="text-sm text-muted-foreground">📞 {client.phone}</p>
                      )}
                      {client.date_of_birth && (
                        <p className="text-sm text-muted-foreground">
                          🎂 {new Date(client.date_of_birth).toLocaleDateString()}
                        </p>
                      )}
                      {client.height_feet && client.weight_lbs && (
                        <p className="text-sm text-muted-foreground">
                          📏 {client.height_feet}'{client.height_inches || 0}" • {client.weight_lbs} lbs
                        </p>
                      )}
                      <Badge variant={client.is_active ? "default" : "destructive"}>
                        {client.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoachDashboard;