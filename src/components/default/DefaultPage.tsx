
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Star, Users, Target, Zap, Shield, Award, Play, Clock, Heart } from "lucide-react";

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
                src="/lovable-uploads/7d7b8c91-cb21-4fdb-845f-9b7594d4a358.png" 
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
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Text Content */}
              <div className="space-y-8">
                <div className="inline-flex items-center bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <Award className="h-4 w-4 mr-2" />
                  For Men Over 40
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Stop Making Excuses.
                  <br />
                  <span className="text-red-600">Start Getting Results.</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  You're not 25 anymore. Your body has changed, your schedule is packed, and 
                  generic fitness advice doesn't work. It's time for a system built specifically 
                  for men over 40 who are serious about getting their edge back.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <Button
                    onClick={() => navigate("/coaching")}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg rounded-lg font-semibold shadow-lg"
                    size="lg"
                  >
                    Get Started Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>5-min setup</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Shield className="h-4 w-4" />
                      <span>30-day guarantee</span>
                    </div>
                  </div>
                </div>
                
                {/* Social Proof */}
                <div className="flex items-center space-x-8 pt-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-700">4.9/5 from 2,000+ clients</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-gray-700">89% Success Rate</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Hero Image */}
              <div className="relative">
                <div className="bg-gradient-to-br from-red-50 to-gray-100 rounded-2xl p-12 shadow-2xl">
                  <div className="text-center">
                    <div className="text-8xl mb-6">💪</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Real Transformation</h3>
                    <p className="text-gray-600 mb-6">Join thousands of men who've reclaimed their strength</p>
                    <div className="flex justify-center space-x-4 text-sm">
                      <div className="text-center">
                        <div className="font-bold text-xl text-red-600">-35lbs</div>
                        <div className="text-gray-600">Average Fat Loss</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-xl text-red-600">+15lbs</div>
                        <div className="text-gray-600">Muscle Gained</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-xl text-red-600">12 weeks</div>
                        <div className="text-gray-600">Average Time</div>
                      </div>
                    </div>
                  </div>
                </div>
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
              Why Everything You've Tried Has Failed
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              You've tried the diets, joined the gyms, followed the "experts." 
              But here's the truth: none of it was designed for YOUR body at YOUR age.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ProblemCard
                title="Generic Programs"
                description="Cookie-cutter workouts designed for 25-year-olds, not men with real responsibilities and changing hormones"
              />
              <ProblemCard
                title="Impossible Standards"
                description="Unrealistic expectations that ignore your career, family, and the reality of life after 40"
              />
              <ProblemCard
                title="Quick Fix Lies"
                description="Promises of overnight transformation that leave you frustrated, injured, and back at square one"
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
                The GenX Shred Difference
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Finally, a system that respects your time, works with your body's changes, 
                and delivers sustainable results that last.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <SolutionCard
                icon={<Target className="h-8 w-8 text-red-600" />}
                title="Age-Specific Training"
                description="Workouts designed for declining testosterone, slower recovery, and busy schedules"
              />
              <SolutionCard
                icon={<Zap className="h-8 w-8 text-blue-600" />}
                title="Hormone Optimization"
                description="Natural strategies to boost energy, improve sleep, and enhance fat burning"
              />
              <SolutionCard
                icon={<Shield className="h-8 w-8 text-green-600" />}
                title="Injury Prevention"
                description="Safe, joint-friendly movements that build strength without breaking you down"
              />
              <SolutionCard
                icon={<Heart className="h-8 w-8 text-purple-600" />}
                title="Sustainable Nutrition"
                description="No extreme diets. Just real food strategies that work with your lifestyle"
              />
              <SolutionCard
                icon={<Award className="h-8 w-8 text-orange-600" />}
                title="Proven Results"
                description="Over 2,000 men transformed using our exact system"
              />
              <SolutionCard
                icon={<CheckCircle className="h-8 w-8 text-teal-600" />}
                title="Time-Efficient"
                description="Maximum results in minimal time - because you have a life to live"
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
                Real Men, Real Results, Real Lives Changed
              </h2>
              <p className="text-xl text-gray-600">
                These aren't paid actors or cherry-picked results. These are regular guys who decided to stop making excuses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TestimonialCard
                name="Mike Rodriguez, 45"
                result="Lost 42 lbs, gained confidence"
                quote="I was skeptical, but GenX Shred worked around my crazy schedule. Down 4 pant sizes and stronger than I've been in 15 years. My wife can't keep her hands off me."
                avatar="👨‍💼"
              />
              <TestimonialCard
                name="David Chen, 52"
                result="Gained 18 lbs of muscle"
                quote="Finally found something that works with my body, not against it. My teenage sons ask ME for workout advice now. Best investment I've ever made."
                avatar="👨‍🔧"
              />
              <TestimonialCard
                name="Tom Williams, 48"
                result="Energy through the roof"
                quote="No more 3pm crashes. I'm outworking guys half my age and sleeping like a baby. This program gave me my life back."
                avatar="👨‍💻"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Stop Waiting. Start Transforming.</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            You're not getting any younger. Every day you wait is another day you could be getting stronger, 
            leaner, and more confident. The choice is yours.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={() => navigate("/coaching")}
              className="bg-white text-red-600 hover:bg-gray-100 px-12 py-6 text-xl rounded-lg shadow-lg font-semibold"
              size="lg"
            >
              Transform Your Body Today
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <div className="text-center">
              <p className="text-sm opacity-75 mb-1">30-day money-back guarantee</p>
              <p className="text-xs opacity-60">Join 2,000+ men who've already transformed</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProblemCard = ({ title, description }: { title: string; description: string }) => (
  <div className="text-center p-6 bg-gray-800 rounded-lg">
    <h3 className="text-xl font-bold mb-4 text-red-400">{title}</h3>
    <p className="text-gray-300 leading-relaxed">{description}</p>
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
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 group">
    <div className="mb-6 group-hover:scale-110 transition-transform duration-300">{icon}</div>
    <h3 className="text-xl font-bold mb-4 text-gray-900">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const TestimonialCard = ({ 
  name, 
  result, 
  quote,
  avatar
}: {
  name: string;
  result: string;
  quote: string;
  avatar: string;
}) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex items-center mb-6">
      <div className="text-3xl mr-4">{avatar}</div>
      <div>
        <div className="flex mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
          ))}
        </div>
        <p className="font-bold text-gray-900">{name}</p>
        <p className="text-red-600 font-semibold text-sm">{result}</p>
      </div>
    </div>
    <p className="text-gray-600 italic leading-relaxed">"{quote}"</p>
  </div>
);

export default DefaultPage;
