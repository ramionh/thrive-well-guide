
export type Habit = {
  id: string;
  name: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly";
  type: "exercise" | "nutrition" | "sleep" | "other";
  isActive: boolean;
  createdAt: Date;
  userId: string;
};
