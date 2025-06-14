
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    const handlePaymentSuccess = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        toast.error('No payment session found');
        navigate('/coaching');
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('handle-payment-success', {
          body: { sessionId }
        });

        if (error) throw error;

        if (data?.success) {
          setSuccess(true);
          toast.success('Account created successfully! Please log in with your credentials.');
        } else {
          throw new Error('Failed to create account');
        }
      } catch (error) {
        console.error('Error processing payment success:', error);
        toast.error('There was an issue creating your account. Please contact support.');
        navigate('/coaching');
      } finally {
        setIsProcessing(false);
      }
    };

    handlePaymentSuccess();
  }, [searchParams, navigate]);

  const handleContinueToLogin = () => {
    navigate('/auth');
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-2xl font-bold mb-2">Processing Your Payment</h2>
            <p className="text-gray-600">Please wait while we set up your account...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-700">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 mb-6">
              Your payment has been processed and your account has been created successfully. 
              You can now log in to access your motivational coaching program.
            </p>
            <Button 
              onClick={handleContinueToLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-lg"
            >
              Continue to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default PaymentSuccessPage;
