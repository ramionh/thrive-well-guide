import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Users, Target, Clock, Scale, Dumbbell, Shield, Moon } from "lucide-react";

const DefaultPage = () => {
  const navigate = useNavigate();
  
  const handleStartJourney = () => {
    navigate('/auth', { state: { defaultTab: 'register' } });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-8">
                <div className="mb-8">
                  <img 
                    src="/lovable-uploads/7bcf9ab6-a729-4686-8b02-57e3e77ec2b1.png" 
                    alt="Gen X Shred" 
                    className="h-32 mb-6"
                  />
                </div>
                <div className="space-y-6">
                  <h1 className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight">
                    We Don't Focus on the <span className="text-gray-400">HOW</span>
                    <br />
                    We Focus on the <span className="text-blue-600">WHY</span>
                  </h1>
                  <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                    Transform your body aesthetics with personalized motivational interviewing and habit coaching. 
                    Built for Gen X, proven for every generation.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg shadow-lg"
                      onClick={handleStartJourney}
                    >
                      Start Your Transformation
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg rounded-lg"
                      onClick={() => navigate("/coaching")}
                    >
                      Personal Coaching
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column - Visual Elements */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-6">
                  <StatsCard number="6" label="Body Type Classifications" />
                  <StatsCard number="5" label="Core Principles" />
                  <StatsCard number="1:1" label="Personal Coaching" />
                  <StatsCard number="24/7" label="Habit Support" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">The Secret Isn't <span className="text-gray-400">HOW</span> to Do It</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every fitness program teaches the same methods. We're different. We help you discover your 
              <span className="font-semibold text-blue-600"> internal motivation</span> and build 
              <span className="font-semibold text-blue-600"> lasting habits</span> that become second nature.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <DifferenceCard
              icon={<Target className="h-8 w-8 text-red-500" />}
              title="Other Programs Focus on HOW"
              description="Generic meal plans, cookie-cutter workouts, and temporary motivation that fades when life gets hard."
              isNegative={true}
            />
            <DifferenceCard
              icon={<Brain className="h-8 w-8 text-blue-500" />}
              title="We Focus on WHY"
              description="Motivational interviewing techniques to uncover your deepest reasons for change and build unshakeable habits."
              isNegative={false}
            />
          </div>
        </div>
      </section>

      {/* 5 Core Principles */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">5 Universal Principles</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                The HOW doesn't matter. As long as you follow these 5 principles, 
                you'll achieve your body transformation goals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <PrincipleCard
                icon={<Moon className="h-8 w-8 text-indigo-500" />}
                title="Sleep"
                description="Get 7-9 hours of quality sleep every night"
                principle="1"
              />
              <PrincipleCard
                icon={<Scale className="h-8 w-8 text-green-500" />}
                title="Calories"
                description="Monitor your calorie consumption daily"
                principle="2"
              />
              <PrincipleCard
                icon={<Target className="h-8 w-8 text-orange-500" />}
                title="Protein"
                description="Eat 1 gram of protein per pound of body weight"
                principle="3"
              />
              <PrincipleCard
                icon={<Dumbbell className="h-8 w-8 text-red-500" />}
                title="Adaptation"
                description="Train with weights and vary your routine"
                principle="4"
              />
              <PrincipleCard
                icon={<Shield className="h-8 w-8 text-purple-500" />}
                title="Guardrails"
                description="Manage stress, monitor sugar and alcohol"
                principle="5"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Body Type Classification */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Your Body Type Journey</h2>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              We classify every client into one of 6 body types based on body fat percentage. 
              Your personal coach will help you progress to the next level.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <BodyTypeCard type="Ripped" maleBF="<10%" femaleBF="<14%" color="bg-green-500" />
              <BodyTypeCard type="Elite" maleBF="10-13%" femaleBF="14-17%" color="bg-blue-500" />
              <BodyTypeCard type="Fit" maleBF="14-17%" femaleBF="18-21%" color="bg-indigo-500" />
              <BodyTypeCard type="Average" maleBF="18-24%" femaleBF="22-28%" color="bg-yellow-500" />
              <BodyTypeCard type="Overweight" maleBF="25-29%" femaleBF="28-32%" color="bg-orange-500" />
              <BodyTypeCard type="Obese" maleBF="≥30%" femaleBF="≥32%" color="bg-red-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Personal Coaching */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Users className="h-16 w-16 mx-auto mb-6 text-blue-200" />
            <h2 className="text-4xl font-bold mb-6">Personal Motivational Interviewing Coach</h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Every client is assigned a professionally trained motivational interviewing health coach. 
              Daily check-ins, habit building exercises, and personalized motivation strategies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg rounded-lg shadow-lg"
                onClick={() => navigate("/coaching")}
              >
                Learn About Personal Coaching
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-blue-700 px-8 py-4 text-lg rounded-lg"
                onClick={handleStartJourney}
              >
                Join Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your WHY?</h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Join Gen X Shred and discover the internal motivation that will drive your lasting transformation.
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl rounded-lg shadow-lg"
            onClick={handleStartJourney}
          >
            Start Your Journey Today
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </section>
    </div>
  );
};

const StatsCard = ({ number, label }: { number: string; label: string }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg text-center border border-gray-100">
    <div className="text-3xl font-bold text-blue-600 mb-2">{number}</div>
    <div className="text-sm text-gray-600 font-medium">{label}</div>
  </div>
);

const DifferenceCard = ({ 
  icon, 
  title, 
  description, 
  isNegative 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  isNegative: boolean;
}) => (
  <div className={`p-8 rounded-2xl shadow-lg ${isNegative ? 'bg-red-50 border-l-4 border-red-500' : 'bg-blue-50 border-l-4 border-blue-500'}`}>
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const PrincipleCard = ({ 
  icon, 
  title, 
  description, 
  principle 
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  principle: string;
}) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      {icon}
      <span className="text-2xl font-bold text-gray-300">#{principle}</span>
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const BodyTypeCard = ({ 
  type, 
  maleBF, 
  femaleBF, 
  color 
}: {
  type: string;
  maleBF: string;
  femaleBF: string;
  color: string;
}) => (
  <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 text-center">
    <div className={`w-8 h-8 ${color} rounded-full mx-auto mb-3`}></div>
    <h4 className="font-bold text-sm mb-2">{type}</h4>
    <div className="text-xs text-gray-600">
      <div>♂ {maleBF}%</div>
      <div>♀ {femaleBF}%</div>
    </div>
  </div>
);

export default DefaultPage;
