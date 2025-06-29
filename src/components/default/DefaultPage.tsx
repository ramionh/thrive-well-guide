
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Star, Users, Target, Zap, Shield, Award, Play } from "lucide-react";

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
              <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">About</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Success Stories</a>
              <a href="#coaching" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">Coaching</a>
              <Button
                onClick={() => navigate("/coaching")}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Your Body
                <br />
                <span className="text-red-600">After 40</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of men over 40 who've discovered the secret to sustainable fat loss, 
                muscle building, and peak energy - without endless hours in the gym.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                onClick={() => navigate("/coaching")}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-full font-semibold shadow-lg"
                size="lg"
              >
                Start Your Transformation
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 text-lg rounded-full font-semibold flex items-center"
                size="lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Success Stories
              </Button>
            </div>
            
            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600 mb-12">
              <div className="flex items-center space-x-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="font-medium">4.9/5 from 2,000+ clients</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-red-600" />
                <span className="font-medium">89% Success Rate</span>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="bg-gradient-to-r from-red-100 to-gray-100 rounded-2xl p-12 mb-8 shadow-xl">
              <div className="text-gray-500 text-center">
                <div className="text-6xl mb-4">💪</div>
                <p className="text-lg font-medium">Real Transformation Results</p>
                <p className="text-sm">Before & After Photos Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8">
              Tired of Programs That Don't Work for Men Over 40?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <ProblemCard
                title="Generic Workouts"
                description="Cookie-cutter programs that ignore your body's changing needs after 40"
              />
              <ProblemCard
                title="Slow Recovery"
                description="Feeling sore for days and struggling to bounce back like you used to"
              />
              <ProblemCard
                title="Stubborn Fat"
                description="Diet and exercise aren't working like they did in your 20s and 30s"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                The GenX Shred Method
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A science-based approach designed specifically for men over 40, focusing on 
                sustainable results that fit your busy lifestyle.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SolutionCard
                icon={<Target className="h-8 w-8 text-red-600" />}
                title="Personalized Programming"
                description="Workouts tailored to your age, fitness level, and recovery capacity"
              />
              <SolutionCard
                icon={<Zap className="h-8 w-8 text-blue-600" />}
                title="Metabolic Optimization"
                description="Boost your metabolism and energy levels naturally"
              />
              <SolutionCard
                icon={<Shield className="h-8 w-8 text-green-600" />}
                title="Injury Prevention"
                description="Safe, effective training that protects your joints and mobility"
              />
              <SolutionCard
                icon={<Users className="h-8 w-8 text-purple-600" />}
                title="Expert Coaching"
                description="Personal guidance from certified trainers who understand your challenges"
              />
              <SolutionCard
                icon={<Award className="h-8 w-8 text-orange-600" />}
                title="Proven Results"
                description="Thousands of success stories from men just like you"
              />
              <SolutionCard
                icon={<CheckCircle className="h-8 w-8 text-teal-600" />}
                title="Lifestyle Integration"
                description="Fits seamlessly into your work and family commitments"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Real Men, Real Results
              </h2>
              <p className="text-xl text-gray-600">
                See what's possible when you have the right system
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                name="Mike, 45"
                result="Lost 35 lbs in 4 months"
                quote="Finally found a program that works with my schedule. Down 3 pant sizes and feeling better than I have in years."
              />
              <TestimonialCard
                name="David, 52"
                result="Gained 15 lbs of muscle"
                quote="Stronger than I was in my 30s. The personalized approach made all the difference."
              />
              <TestimonialCard
                name="Tom, 48"
                result="Improved energy & sleep"
                quote="No more afternoon crashes. My wife says I'm like a new person."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Life?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join the thousands of men over 40 who've reclaimed their strength, energy, and confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => navigate("/coaching")}
              className="bg-white text-red-600 hover:bg-gray-100 px-12 py-6 text-xl rounded-full shadow-lg font-semibold"
              size="lg"
            >
              Start Your Transformation Today
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <p className="text-sm opacity-75">30-day money-back guarantee</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProblemCard = ({ title, description }: { title: string; description: string }) => (
  <div className="text-center">
    <h3 className="text-xl font-bold mb-3 text-red-400">{title}</h3>
    <p className="text-gray-300">{description}</p>
  </div>
);

const SolutionCard = ({ 
  icon, 
  title, 
  description 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const TestimonialCard = ({ 
  name, 
  result, 
  quote 
}: {
  name: string;
  result: string;
  quote: string;
}) => (
  <div className="bg-white p-8 rounded-xl shadow-lg">
    <div className="mb-4">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
        ))}
      </div>
    </div>
    <p className="text-gray-600 mb-6 italic">"{quote}"</p>
    <div>
      <p className="font-bold text-gray-900">{name}</p>
      <p className="text-red-600 font-semibold">{result}</p>
    </div>
  </div>
);

export default DefaultPage;
