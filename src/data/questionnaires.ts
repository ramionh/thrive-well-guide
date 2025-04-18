
import { QuestionnaireSection } from "@/types/questionnaire";

export const nutritionQuestionnaire: QuestionnaireSection = {
  title: "Calorie & Protein Intake",
  questions: [
    {
      id: "calorie_tracking",
      text: "Do you currently track your daily calorie intake?",
      type: "single",
      options: [
        { label: "Yes – every day", value: "daily" },
        { label: "Yes – a few times per week", value: "weekly" },
        { label: "No – but I used to", value: "used_to" },
        { label: "No – never", value: "never" }
      ]
    },
    // ... Add all nutrition questions following the same pattern
  ]
};

export const exerciseQuestionnaire: QuestionnaireSection = {
  title: "Exercise Habits & Progression",
  questions: [
    {
      id: "exercise_frequency",
      text: "How many days per week do you typically exercise?",
      type: "single",
      options: [
        { label: "0 days", value: "0" },
        { label: "1–2 days", value: "1-2" },
        { label: "3–4 days", value: "3-4" },
        { label: "5–6 days", value: "5-6" },
        { label: "7 days", value: "7" }
      ]
    },
    // ... Add all exercise questions following the same pattern
  ]
};

export const sleepQuestionnaire: QuestionnaireSection = {
  title: "Sleep Habits & Quality",
  questions: [
    {
      id: "sleep_hours",
      text: "On average, how many hours of sleep do you get on a typical night?",
      type: "single",
      options: [
        { label: "Less than 4 hours", value: "lt4" },
        { label: "4–5 hours", value: "4-5" },
        { label: "6–7 hours", value: "6-7" },
        { label: "7–8 hours", value: "7-8" },
        { label: "More than 8 hours", value: "gt8" }
      ]
    },
    // ... Add all sleep questions following the same pattern
  ]
};
