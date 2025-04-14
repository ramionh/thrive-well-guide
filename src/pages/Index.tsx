
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { ArrowRight } from "lucide-react";

const Index = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();
  
  // Redirect to dashboard if user has completed onboarding
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
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col md:flex-row items-center justify-center px-4 py-12 md:py-24">
        <div className="text-center md:text-left md:w-1/2 space-y-6 md:pr-8">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Fitness <span className="text-thrive-blue">After 40</span> Starts Here
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto md:mx-0">
            Personalized fitness tracking and wellness strategies designed specifically for those 40 and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button 
              className="bg-thrive-blue hover:bg-thrive-blue/90 text-lg px-8 py-6"
              onClick={() => navigate("/onboarding")}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="md:w-1/2 mt-12 md:mt-0 max-w-md">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-thrive-lightblue rounded-lg opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-thrive-teal rounded-lg opacity-20 animate-pulse"></div>
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="bg-white shadow-lg rounded-lg p-4 transform hover:-translate-y-1 transition-transform">
                <div className="w-8 h-8 bg-thrive-blue/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-thrive-blue">💪</span>
                </div>
                <h3 className="font-medium">Strength Training</h3>
                <p className="text-sm text-muted-foreground">Age-appropriate resistance workouts</p>
              </div>
              
              <div className="bg-white shadow-lg rounded-lg p-4 transform hover:-translate-y-1 transition-transform">
                <div className="w-8 h-8 bg-thrive-orange/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-thrive-orange">🥗</span>
                </div>
                <h3 className="font-medium">Nutrition</h3>
                <p className="text-sm text-muted-foreground">Metabolic health tracking</p>
              </div>
              
              <div className="bg-white shadow-lg rounded-lg p-4 transform hover:-translate-y-1 transition-transform">
                <div className="w-8 h-8 bg-thrive-teal/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-thrive-teal">🏋️</span>
                </div>
                <h3 className="font-medium">Recovery</h3>
                <p className="text-sm text-muted-foreground">Smart rest and recuperation</p>
              </div>
              
              <div className="bg-white shadow-lg rounded-lg p-4 transform hover:-translate-y-1 transition-transform">
                <div className="w-8 h-8 bg-thrive-purple/10 rounded-full flex items-center justify-center mb-3">
                  <span className="text-thrive-purple">🧠</span>
                </div>
                <h3 className="font-medium">Mindset</h3>
                <p className="text-sm text-muted-foreground">Mental wellness strategies</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-muted py-12 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-12">Why Choose 40+Ripped?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-thrive-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-thrive-blue text-xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Fitness</h3>
              <p className="text-muted-foreground">Tailored workout plans for 40+ individuals.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-thrive-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-thrive-teal text-xl">🔄</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Adaptive Strategies</h3>
              <p className="text-muted-foreground">Evolving approach to fitness as you age.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-thrive-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-thrive-orange text-xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Tracking</h3>
              <p className="text-muted-foreground">Monitor progress with simple tools.</p>
            </div>
          </div>
          
          <Button 
            className="mt-12 bg-thrive-blue hover:bg-thrive-blue/90 text-lg px-8 py-6"
            onClick={() => navigate("/onboarding")}
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-background py-8 px-4 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 40+Ripped. All rights reserved.</p>
          <p className="text-sm mt-2">Made with ❤️ for fitness after 40</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
