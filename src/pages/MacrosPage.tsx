import React from "react";
import Layout from "@/components/Layout";
import MacrosDisplay from "@/components/macros/MacrosDisplay";
import { useMacros } from "@/hooks/useMacros";
import { useClientFeatures } from "@/hooks/useClientFeatures";
import { Navigate } from "react-router-dom";

const MacrosPage: React.FC = () => {
  const { currentMacros, isLoading } = useMacros();
  const { isFeatureEnabled, isLoading: featuresLoading } = useClientFeatures();

  if (featuresLoading) {
    return (
      <Layout>
        <div className="p-6">
          <div>Loading...</div>
        </div>
      </Layout>
    );
  }

  if (!isFeatureEnabled('macros')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Macros</h1>
          <p className="text-muted-foreground">
            Track your personalized macronutrient targets
          </p>
        </div>

        <div className="max-w-md">
          <MacrosDisplay macros={currentMacros} isLoading={isLoading} />
        </div>
      </div>
    </Layout>
  );
};

export default MacrosPage;