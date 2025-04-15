
import { useState } from "react";

export type SleepFormState = {
  sleepHours: string;
  sleepQuality: number[];
  sleepAdherence: "red" | "yellow" | "green";
};

export const useSleepForm = (initialState?: Partial<SleepFormState>) => {
  const [sleepHours, setSleepHours] = useState(initialState?.sleepHours || "7.5");
  const [sleepQuality, setSleepQuality] = useState(initialState?.sleepQuality || [70]);
  const [sleepAdherence, setSleepAdherence] = useState<"red" | "yellow" | "green">(
    initialState?.sleepAdherence || "yellow"
  );

  const getFormData = () => ({
    sleepHours,
    sleepQuality,
    sleepAdherence,
  });

  return {
    sleepHours,
    setSleepHours,
    sleepQuality,
    setSleepQuality,
    sleepAdherence,
    setSleepAdherence,
    getFormData,
  };
};
