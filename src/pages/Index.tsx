import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
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

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold">Welcome to 40+Ripped!</h1>
          <p className="text-muted-foreground">You're signed in. Let's get started!</p>
          <Button
            className="bg-thrive-blue hover:bg-thrive-blue/90"
            onClick={() => navigate("/dashboard")}
          >
            Go to Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="min-h-screen flex items-center">
          <div className="container mx-auto px-4 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Column - Text Content */}
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
                    Fitness <span className="text-[#3a86ff]">After 40</span> Starts Here
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-md">
                    Personalized fitness tracking and wellness strategies designed specifically for those 40 and beyond.
                  </p>
                  <Button
                    className="bg-[#3a86ff] hover:bg-[#3a86ff]/90 text-white px-8 py-6 text-lg"
                    onClick={() => navigate("/onboarding")}
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>

                {/* Right Column - Feature Cards */}
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-32 h-32 bg-[#8ecae6] rounded-lg opacity-20"></div>
                  <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#4d908e] rounded-lg opacity-20"></div>
                  <div className="grid grid-cols-2 gap-4 relative">
                    <FeatureCard
                      icon="💪"
                      title="Strength Training"
                      description="Age-appropriate resistance workouts"
                      iconBg="bg-[#3a86ff]/10"
                      iconColor="text-[#3a86ff]"
                    />
                    <FeatureCard
                      icon="🥗"
                      title="Nutrition"
                      description="Metabolic health tracking"
                      iconBg="bg-[#f77f00]/10"
                      iconColor="text-[#f77f00]"
                    />
                    <FeatureCard
                      icon="🏋️"
                      title="Recovery"
                      description="Smart rest and recuperation"
                      iconBg="bg-[#4d908e]/10"
                      iconColor="text-[#4d908e]"
                    />
                    <FeatureCard
                      icon="🧠"
                      title="Mindset"
                      description="Mental wellness strategies"
                      iconBg="bg-[#9b5de5]/10"
                      iconColor="text-[#9b5de5]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose 40+Ripped?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <BenefitCard
                icon="📊"
                title="Personalized Fitness"
                description="Tailored workout plans for 40+ individuals"
                iconBg="bg-[#3a86ff]/10"
              />
              <BenefitCard
                icon="🔄"
                title="Adaptive Strategies"
                description="Evolving approach to fitness as you age"
                iconBg="bg-[#4d908e]/10"
              />
              <BenefitCard
                icon="📱"
                title="Easy Tracking"
                description="Monitor progress with simple tools"
                iconBg="bg-[#f77f00]/10"
              />
            </div>
            <div className="text-center mt-12">
              <Button
                className="bg-[#3a86ff] hover:bg-[#3a86ff]/90 text-white px-8 py-6 text-lg"
                onClick={() => navigate("/onboarding")}
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, iconBg, iconColor }: {
  icon: string;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}) => (
  <div className="bg-white shadow-lg rounded-lg p-4 transform hover:-translate-y-1 transition-transform">
    <div className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center mb-3`}>
      <span className={iconColor}>{icon}</span>
    </div>
    <h3 className="font-medium">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

const BenefitCard = ({ icon, title, description, iconBg }: {
  icon: string;
  title: string;
  description: string;
  iconBg: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm text-center">
    <div className={`w-12 h-12 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
      <span className="text-xl">{icon}</span>
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Index;
