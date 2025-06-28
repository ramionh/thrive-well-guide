
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Star, Users, Target, Zap, Shield, Award } from "lucide-react";

const DefaultPage = () => {
  const navigate = useNavigate();
  
  const handleStartJourney = () => {
    navigate('/auth', { state: { defaultTab: 'register' } });
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
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Reviews</a>
              <Button
                variant="outline"
                onClick={handleStartJourney}
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/coaching")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Transform Your Body
                <br />
                <span className="text-blue-600">After 40</span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Personalized coaching that focuses on your "WHY" - not just another workout plan. 
                Built for Gen X, proven for every generation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button
                  onClick={() => navigate("/coaching")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg"
                  size="lg"
                >
                  Start Your Transformation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("#demo")}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg rounded-lg"
                  size="lg"
                >
                  Watch Demo
                </Button>
              </div>
              
              {/* Social Proof */}
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span>4.9/5 from 500+ clients</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span>2,000+ transformations</span>
                </div>
              </div>
            </div>

            {/* Hero Image/Stats */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <StatCard number="89%" label="Client Success Rate" />
                  <StatCard number="6-12" label="Months to Transform" />
                  <StatCard number="24/7" label="Personal Support" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why We Focus on <span className="text-gray-400">WHY</span>, Not <span className="text-blue-600">HOW</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Every fitness program teaches the same methods. We help you discover your internal motivation 
                and build lasting habits that become second nature.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Target className="h-8 w-8 text-blue-600" />}
                title="Personal Motivation Discovery"
                description="Uncover your deepest reasons for change through proven motivational interviewing techniques."
              />
              <FeatureCard
                icon={<Zap className="h-8 w-8 text-purple-600" />}
                title="Habit Formation Science"
                description="Build unshakeable habits using behavioral psychology and personalized strategies."
              />
              <FeatureCard
                icon={<Shield className="h-8 w-8 text-green-600" />}
                title="Age-Appropriate Training"
                description="Fitness strategies designed specifically for those 40+ with recovery and sustainability in mind."
              />
              <FeatureCard
                icon={<Users className="h-8 w-8 text-orange-600" />}
                title="1-on-1 Personal Coaching"
                description="Daily support from certified motivational interviewing coaches who understand your journey."
              />
              <FeatureCard
                icon={<Award className="h-8 w-8 text-red-600" />}
                title="Proven Results"
                description="Join thousands who've achieved lasting transformation through our unique approach."
              />
              <FeatureCard
                icon={<CheckCircle className="h-8 w-8 text-teal-600" />}
                title="Lifetime Support"
                description="Access to our community and resources to maintain your transformation for life."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Discover Your Why?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands who've transformed their lives by focusing on sustainable motivation, not quick fixes.
          </p>
          <Button
            onClick={() => navigate("/coaching")}
            className="bg-white text-blue-600 hover:bg-gray-100 px-12 py-6 text-xl rounded-lg shadow-lg"
            size="lg"
          >
            Start Your Journey Today
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ number, label }: { number: string; label: string }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-blue-600 mb-2">{number}</div>
    <div className="text-gray-600 font-medium">{label}</div>
  </div>
);

const FeatureCard = ({ 
  icon, 
  title, 
  description 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default DefaultPage;
