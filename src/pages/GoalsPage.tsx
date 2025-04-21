
import React from "react";
import BodyTypeCarousel from "@/components/body-type/BodyTypeCarousel";
import GoalsManager from "@/components/goals/GoalsManager";

const GoalsPage = () => (
  <div className="container mx-auto p-6 max-w-7xl">
    <h1 className="text-3xl font-bold mb-6">Goals</h1>
    <BodyTypeCarousel />
    <GoalsManager />
  </div>
);

export default GoalsPage;
