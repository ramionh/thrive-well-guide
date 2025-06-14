import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowRight, CheckCircle, Users, Clock, Star, MessageCircle, Phone, Target, Heart, Zap, Shield } from "lucide-react";
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
        // Redirect to Stripe checkout
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

  const benefits = [
    "Daily 1-on-1 motivational coaching via text/SMS",
    "Weekly strategy & accountability phone calls", 
    "Expert guidance on the 5 Core Principles",
    "Personalized habit formation strategies",
    "Focus on YOUR lifestyle, not generic plans",
    "Certified motivational interviewing coaches"
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      age: 45,
      quote: "My coach helped me discover my 'why' and I've lost 30 pounds in 4 months!",
      rating: 5
    },
    {
      name: "Mike R.",
      age: 52,
      quote: "The personalized approach made all the difference. Finally sustainable results.",
      rating: 5
    },
    {
      name: "Lisa K.",
      age: 41,
      quote: "Best investment I've made in my health. The motivation techniques actually work.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Gen X Shred <span className="text-blue-600">Motivational Coaching Program</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Stop focusing on the "HOW" and start discovering your personal "WHY" with our revolutionary 
              one-on-one motivational interviewing coaching program.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Card - Moved to second position */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-blue-500 shadow-xl">
              <CardHeader className="text-center bg-blue-50">
                <CardTitle className="text-2xl text-blue-800">Motivational Coaching Program</CardTitle>
                <div className="text-4xl font-bold text-blue-600 mt-4">
                  $189<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-2">Your daily partner in motivation</p>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 mb-6">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
                
                <Dialog open={showSignupDialog} onOpenChange={setShowSignupDialog}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg rounded-lg shadow-lg">
                      Ready to Stop Starting Over?
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
                
                <p className="text-sm text-gray-500 text-center mt-4">
                  30-day money-back guarantee
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Are You Tired of Starting Over?</h2>
            </div>
            
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p>
                Are you tired of the endless cycle of starting a fitness plan, only to fall off track weeks later? 
                You've been given the meal plans and the workout routines, but they never seem to stick. That's 
                because they all focus on the "how," without ever addressing your personal "why."
              </p>
              
              <p>
                The Gen X Shred Motivational Coaching Program is different. We're not just a fitness service; 
                we're your daily partner in motivation. We use the power of one-on-one Motivational Interviewing 
                to help you uncover your deep-seated drive, conquer ambivalence, and finally build the sustainable 
                habits that lead to profound, lasting change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What You Get: Your Personal Motivation Toolkit</h2>
              <p className="text-xl text-gray-600">
                For one monthly price, you get constant, personalized support designed to make your health goals second nature.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureCard
                icon={<MessageCircle className="h-8 w-8 text-blue-500" />}
                title="Daily 1-on-1 Motivational Coaching"
                description="Every day, connect with your dedicated, certified coach via text/SMS. These aren't just 'check-in' messages; they are skilled, empathetic conversations designed to reinforce your 'why,' celebrate your wins, and keep your motivation burning bright."
              />
              
              <FeatureCard
                icon={<Phone className="h-8 w-8 text-green-500" />}
                title="Weekly Strategy & Accountability Calls"
                description="Dedicated phone calls to dive deeper, review progress, set powerful goals for the week ahead, and work through roadblocks in a supportive, non-judgmental space."
              />
              
              <FeatureCard
                icon={<Target className="h-8 w-8 text-purple-500" />}
                title="A Focus on YOU, Not Just a Plan"
                description="Master the 5 Core Principles of lasting fitness (Sleep, Calories, Protein, Adaptation, Guardrails) in a way that works for YOUR lifestyle. No rigid, one-size-fits-all plans here."
              />
              
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-orange-500" />}
                title="Expert Guidance on Habit Formation"
                description="Learn how to codify new behaviors until they become automatic. We provide exercises and strategies to strengthen both your habits and your resolve."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why It Works: The Power of the "Why"</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <WhyItWorksCard
                icon={<Heart className="h-6 w-6 text-red-500" />}
                title="Build Intrinsic Motivation"
                description="Discover a desire for health that comes from within, making you unstoppable."
              />
              
              <WhyItWorksCard
                icon={<Shield className="h-6 w-6 text-blue-500" />}
                title="Overcome Mental Hurdles"
                description="Your coach is trained to help you work through the ambivalence and self-doubt that have held you back."
              />
              
              <WhyItWorksCard
                icon={<Users className="h-6 w-6 text-green-500" />}
                title="Accountability Meets Empathy"
                description="Get the perfect blend of support and accountability, without shame or judgment."
              />
              
              <WhyItWorksCard
                icon={<Star className="h-6 w-6 text-yellow-500" />}
                title="Achieve Lasting Transformation"
                description="Stop renting your results and start owning them. Build a system for health that you won't want to quit because it's built entirely around you."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}, {testimonial.age}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">What makes this different from other coaching?</h3>
                <p className="text-gray-600">
                  We use motivational interviewing techniques to help you discover your internal motivation rather than just telling you what to do. This creates lasting change from within, focusing on your personal "why" instead of generic "how" instructions.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">How does the daily coaching work?</h3>
                <p className="text-gray-600">
                  You'll receive personalized text messages from your certified coach every day. These aren't automated messages - they're real conversations designed to reinforce your motivation, celebrate wins, and help navigate challenges.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. We also offer a 30-day money-back guarantee for new clients.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Find Your "Why"?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            If you're ready to make a change that truly lasts, the Motivational Coaching Program is for you.
          </p>
          <Button 
            onClick={() => setShowSignupDialog(true)}
            className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-6 text-xl rounded-lg shadow-lg"
          >
            Start Your Coaching Journey
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow">
    <CardContent className="p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </CardContent>
  </Card>
);

const WhyItWorksCard = ({ 
  icon, 
  title, 
  description 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

export default CoachingPage;
