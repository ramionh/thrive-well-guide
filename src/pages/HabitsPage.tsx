
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ListChecks, Plus } from "lucide-react";
import HabitsList from "@/components/habits/HabitsList";
import HabitForm from "@/components/habits/HabitForm";
import { Habit } from "@/types/habit";

const HabitsPage = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

  const handleSubmit = (data: Omit<Habit, "id" | "createdAt" | "userId">) => {
    if (editingHabit) {
      // Update existing habit
      setHabits(
        habits.map((h) =>
          h.id === editingHabit.id
            ? { ...editingHabit, ...data }
            : h
        )
      );
    } else {
      // Create new habit
      const newHabit: Habit = {
        ...data,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        userId: "user-id", // This should come from your auth context
      };
      setHabits([...habits, newHabit]);
    }
    handleCancel();
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const handleDelete = (habitId: string) => {
    setHabits(habits.filter((h) => h.id !== habitId));
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingHabit(undefined);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListChecks className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Habits</h1>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Habit
        </Button>
      </div>

      {isFormOpen ? (
        <div className="bg-card p-4 rounded-lg shadow">
          <HabitForm
            habit={editingHabit}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <HabitsList
          habits={habits}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default HabitsPage;
