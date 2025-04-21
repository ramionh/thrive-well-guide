
import React from "react";
import BodyTypeCarousel from "@/components/body-type/BodyTypeCarousel";
import GoalsManager from "@/components/goals/GoalsManager";

const GoalsPage = () => (
  <div className="container mx-auto p-6 max-w-7xl">
    <h1 className="text-3xl font-bold mb-6">Goals</h1>
    <BodyTypeCarousel />
    <div className="bg-white rounded-lg shadow-md border border-gray-300 p-6 mb-6 max-w-3xl mx-auto">
      <p className="text-gray-800 text-base leading-relaxed">
        Goals are important. Pursuing our fitness goals helps us feel fulfilled, satisfied and happy and can give meaning and purpose to our lives. Goals don't have to be complex. We have simplified your fitness goals as moving up 1 level in the bodytype scale in the next 90 days.
      </p>
    </div>
    <GoalsManager />
  </div>
);

export default GoalsPage;
