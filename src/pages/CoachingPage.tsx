
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Users, Clock, Star, MessageCircle } from "lucide-react";

const CoachingPage = () => {
  const navigate = useNavigate();

  const handlePurchase = () => {
    // This will be implemented when we add payment functionality
    console.log("Purchase coaching package");
    // For now, redirect to auth page
    navigate("/auth");
  };

  const benefits = [
    "Weekly 1-on-1 video coaching sessions",
    "Personalized motivational interviewing techniques", 
    "Custom habit building strategies",
    "24/7 text support and accountability",
    "Progress tracking and goal adjustment",
    "Access to exclusive coaching resources"
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
              Personal <span className="text-blue-600">Motivational Interviewing</span> Coach
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Work one-on-one with a professionally trained motivational interviewing health coach. 
              We don't just tell you what to do - we help you discover your internal motivation for lasting change.
            </p>
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">1:1 Personal Coaching</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">Weekly Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                <span className="text-gray-700">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Card */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-blue-500 shadow-xl">
              <CardHeader className="text-center bg-blue-50">
                <CardTitle className="text-2xl text-blue-800">Personal Coaching Package</CardTitle>
                <div className="text-4xl font-bold text-blue-600 mt-4">
                  $297<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mt-2">Complete transformation program</p>
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
                <Button 
                  onClick={handlePurchase}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg rounded-lg shadow-lg"
                >
                  Start Your Transformation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-sm text-gray-500 text-center mt-4">
                  30-day money-back guarantee
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How Personal Coaching Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Discovery Session</h3>
              <p className="text-gray-600">
                We start with a deep dive into your motivations, barriers, and goals using proven motivational interviewing techniques.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Weekly Coaching</h3>
              <p className="text-gray-600">
                Regular 45-minute sessions focused on building sustainable habits and overcoming internal obstacles.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Ongoing Support</h3>
              <p className="text-gray-600">
                24/7 text support, progress tracking, and plan adjustments to keep you on track between sessions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">What makes this different from other coaching?</h3>
                <p className="text-gray-600">
                  We use motivational interviewing techniques to help you discover your internal motivation rather than just telling you what to do. This creates lasting change from within.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">How long are the coaching sessions?</h3>
                <p className="text-gray-600">
                  Each session is 45 minutes, conducted weekly via video call at a time that works for your schedule.
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
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your WHY?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of Gen X individuals who have discovered their internal motivation and achieved lasting results.
          </p>
          <Button 
            onClick={handlePurchase}
            className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-6 text-xl rounded-lg shadow-lg"
          >
            Start Your Personal Coaching Journey
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CoachingPage;
