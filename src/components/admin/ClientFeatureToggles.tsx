import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ClientFeatureTogglesProps {
  clientId: string;
  clientName: string;
}

const AVAILABLE_FEATURES = [
  {
    name: 'Repurpose Habits',
    key: 'repurpose_habits',
    description: 'Access to habit repurposing wizard and related features'
  }
];

const ClientFeatureToggles: React.FC<ClientFeatureTogglesProps> = ({ clientId, clientName }) => {
  const queryClient = useQueryClient();

  const { data: featureToggles, isLoading } = useQuery({
    queryKey: ['clientFeatureToggles', clientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('client_feature_toggles')
        .select('*')
        .eq('user_id', clientId);
      
      if (error) throw error;
      return data || [];
    }
  });

  const toggleFeatureMutation = useMutation({
    mutationFn: async ({ featureKey, enabled }: { featureKey: string; enabled: boolean }) => {
      const { data, error } = await supabase
        .from('client_feature_toggles')
        .upsert({
          user_id: clientId,
          feature_name: featureKey,
          is_enabled: enabled
        }, {
          onConflict: 'user_id,feature_name'
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientFeatureToggles', clientId] });
      toast.success('Feature toggle updated successfully');
    },
    onError: (error) => {
      console.error('Error updating feature toggle:', error);
      toast.error('Failed to update feature toggle');
    }
  });

  const getFeatureStatus = (featureKey: string) => {
    const toggle = featureToggles?.find(t => t.feature_name === featureKey);
    return toggle?.is_enabled ?? true; // Default to enabled if not set
  };

  const handleToggle = (featureKey: string, enabled: boolean) => {
    toggleFeatureMutation.mutate({ featureKey, enabled });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Feature Toggles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Toggles for {clientName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {AVAILABLE_FEATURES.map((feature) => (
          <div key={feature.key} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor={feature.key} className="font-medium">
                {feature.name}
              </Label>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
            <Switch
              id={feature.key}
              checked={getFeatureStatus(feature.key)}
              onCheckedChange={(enabled) => handleToggle(feature.key, enabled)}
              disabled={toggleFeatureMutation.isPending}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ClientFeatureToggles;