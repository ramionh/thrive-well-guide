import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { ArrowRight, BarChart3, Brain, Apple, Battery } from "lucide-react";

const HomePage = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  
  React.useEffect(() => {
    if (!isLoading && user?.onboardingCompleted) {
      navigate("/dashboard");
    }
  }, [isLoading, user, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const handleStartJourney = () => {
    navigate('/auth', { state: { defaultTab: 'register' } });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex items-center bg-gradient-to-br from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-6">
                <div className="mb-6">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="w-1/2 pr-4">
                          <img 
                            src="/lovable-uploads/cbd8cfd2-7a33-4843-bc1e-a8c55c2b2939.png" 
                            alt="Gen X Shred" 
                            className="h-[700px]"
                          />
                        </td>
                        <td className="w-1/2 pl-4 align-middle">
                          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                            Built for <span className="text-blue-500">Gen X</span>. Proven for Every Generation.
                          </h1>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-lg text-gray-600 max-w-md">
                  Personalized fitness tracking and wellness strategies designed specifically for those 40 and beyond.
                </p>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-full"
                  onClick={() => navigate("/auth")}
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Right Column - Feature Cards */}
              <div className="relative">
                <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-blue-100 rounded-lg opacity-20"></div>
                <div className="grid grid-cols-2 gap-4 relative">
                  <FeatureCard
                    icon={<BarChart3 className="h-5 w-5 text-blue-500" />}
                    title="Strength Training"
                    description="Age-appropriate resistance workouts"
                  />
                  <FeatureCard
                    icon={<Apple className="h-5 w-5 text-orange-500" />}
                    title="Nutrition"
                    description="Metabolic health tracking"
                  />
                  <FeatureCard
                    icon={<Battery className="h-5 w-5 text-teal-500" />}
                    title="Recovery"
                    description="Smart rest and recuperation"
                  />
                  <FeatureCard
                    icon={<Brain className="h-5 w-5 text-purple-500" />}
                    title="Mindset"
                    description="Mental wellness strategies"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Gen X Shred?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <BenefitCard
              icon={<BarChart3 className="h-6 w-6 text-blue-500" />}
              title="Personalized Fitness"
              description="Tailored workout plans for 40+ individuals"
            />
            <BenefitCard
              icon={<ArrowRight className="h-6 w-6 text-teal-500" />}
              title="Adaptive Strategies"
              description="Evolving approach to fitness as you age"
            />
            <BenefitCard
              icon={<Brain className="h-6 w-6 text-orange-500" />}
              title="Easy Tracking"
              description="Monitor progress with simple tools"
            />
          </div>
          <div className="text-center mt-12">
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-6 text-lg rounded-full"
              onClick={handleStartJourney}
            >
              Join Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
    <div className="mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const BenefitCard = ({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="bg-white p-8 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
    <div className="inline-block p-3 bg-gray-50 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default HomePage;
