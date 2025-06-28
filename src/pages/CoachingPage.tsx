
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, CheckCircle, Users, Star, MessageCircle, Phone, Target, Heart, Zap, Shield, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

const CoachingPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { email, password }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast.error('Failed to start checkout process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/7bcf9ab6-a729-4686-8b02-57e3e77ec2b1.png" 
                alt="Gen X Shred" 
                className="h-10"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Home
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Award className="h-4 w-4 mr-2" />
              Trusted by 2000+ clients
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Personal <span className="text-blue-600">Motivational Coaching</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Stop focusing on the "HOW" and start discovering your personal "WHY" with our revolutionary 
              one-on-one motivational interviewing coaching program.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600 mb-8">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span>4.9/5 rating</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span>89% success rate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-lg mx-auto">
            <Card className="border-2 border-blue-500 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <CardHeader className="text-center bg-gradient-to-br from-blue-50 to-purple-50 pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mb-4 mx-auto">
                  <Heart className="h-8 w-8" />
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-2">Motivational Coaching Program</CardTitle>
                <div className="text-5xl font-bold text-blue-600 mb-2">
                  $189<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">Your daily partner in transformation</p>
              </CardHeader>
              <CardContent className="p-8">
                <ul className="space-y-4 mb-8">
                  {[
                    "Daily 1-on-1 motivational coaching via text/SMS",
                    "Weekly strategy & accountability phone calls", 
                    "Expert guidance on the 5 Core Principles",
                    "Personalized habit formation strategies",
                    "Focus on YOUR lifestyle, not generic plans",
                    "Certified motivational interviewing coaches"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <Dialog open={showSignupDialog} onOpenChange={setShowSignupDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg rounded-lg shadow-lg">
                      Start Your Transformation
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create Your Account</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handlePurchase} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create a password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                      <Button 
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg rounded-lg shadow-lg"
                      >
                        {isLoading ? "Processing..." : "Continue to Payment"}
                        {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
                
                <div className="text-center mt-6">
                  <p className="text-sm text-gray-500 mb-2">30-day money-back guarantee</p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                    <span>Secure Payment</span>
                    <span>•</span>
                    <span>Cancel Anytime</span>
                    <span>•</span>
                    <span>No Setup Fees</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">What You Get</h2>
              <p className="text-xl text-gray-600">
                Comprehensive support designed to make your health goals second nature
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ServiceCard
                icon={<MessageCircle className="h-12 w-12 text-blue-600" />}
                title="Daily Personal Coaching"
                description="Connect with your dedicated coach via text/SMS every day. These aren't just check-ins - they're skilled conversations designed to reinforce your motivation and celebrate your wins."
              />
              
              <ServiceCard
                icon={<Phone className="h-12 w-12 text-green-600" />}
                title="Weekly Strategy Calls"
                description="Dedicated phone calls to dive deeper, review progress, and set powerful goals for the week ahead in a supportive, non-judgmental space."
              />
              
              <ServiceCard
                icon={<Target className="h-12 w-12 text-purple-600" />}
                title="Personalized Approach"
                description="Master the 5 Core Principles of lasting fitness in a way that works for YOUR lifestyle. No rigid, one-size-fits-all plans here."
              />
              
              <ServiceCard
                icon={<Zap className="h-12 w-12 text-orange-600" />}
                title="Habit Formation Mastery"
                description="Learn how to build new behaviors until they become automatic with proven exercises and strategies."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your "Why"?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join the program that focuses on lasting motivation, not temporary fixes.
          </p>
          <Button 
            onClick={() => setShowSignupDialog(true)}
            className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-xl rounded-lg shadow-lg"
          >
            Start Your Coaching Journey
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
          <p className="text-sm mt-4 opacity-75">30-day money-back guarantee • Cancel anytime</p>
        </div>
      </section>
    </div>
  );
};

const ServiceCard = ({ 
  icon, 
  title, 
  description 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card className="p-8 hover:shadow-lg transition-shadow border-0 shadow-md">
    <CardContent className="p-0">
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
    </CardContent>
  </Card>
);

export default CoachingPage;
