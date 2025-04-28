// Creating active change steps starting from step 61 
// (since the charting path now includes steps up to step 60)
import type { StepConfig } from "../../types/motivation";

export const activeChangeSteps: StepConfig[] = [
  {
    id: 61,
    title: "Prioritizing the Change",
    description: "Making your fitness goals a priority",
    component: (onComplete) => <div className="p-4 bg-gray-100 rounded-md">
      <p>Content for the Prioritizing Change step will be added soon.</p>
      <button 
        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        onClick={onComplete}
      >
        Complete Step
      </button>
    </div>
  },
  // Additional active change steps can be added here
];
