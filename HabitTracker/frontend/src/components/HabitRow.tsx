import { format, subDays, isSameDay } from "date-fns";
import { Check, Flame } from "lucide-react";
import type { Habit } from "../lib/api";
import { cn } from "../lib/utils";

interface HabitRowProps {
  habit: Habit;
  completedDates: string[]; // List of YYYY-MM-DD strings
  onToggle: (habitId: number, date: string, isChecked: boolean) => void;
}

const HabitRow: React.FC<HabitRowProps> = ({ habit, completedDates, onToggle }) => {
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

  const getStatusColor = (category?: string) => {
    if (!category) return "bg-gray-500/20 text-gray-600 dark:text-gray-400";
    switch (category.toLowerCase()) {
      case "health":
        return "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400";
      case "work":
        return "bg-blue-500/20 text-blue-600 dark:text-blue-400";
      case "learning":
        return "bg-purple-500/20 text-purple-600 dark:text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-600 dark:text-gray-400";
    }
  };

  const isCompleted = (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return completedDates.includes(formattedDate);
  };

  const handleToggle = async (date: Date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    const currentlyCompleted = isCompleted(date);
    onToggle(habit.id, formattedDate, !currentlyCompleted);
  };

  return (
    <div className="group flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "p-3 rounded-lg flex items-center justify-center",
            getStatusColor(habit.category)
          )}
        >
          <Flame size={20} className="stroke-current" />
        </div>
        <div>
          <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-lg">
            {habit.name}
          </h3>
          <label className="text-zinc-500 text-sm capitalize">{habit.frequency || "daily"}</label>
        </div>
      </div>

      <div className="flex gap-2">
        {last7Days.map((date) => {
          const completed = isCompleted(date);
          const isToday = isSameDay(date, today);

          return (
            <button
              key={date.toISOString()}
              onClick={() => handleToggle(date)}
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 border-2",
                completed
                  ? "bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900"
                  : "bg-transparent border-zinc-200 dark:border-zinc-800 text-transparent hover:border-zinc-300 dark:hover:border-zinc-700",
                isToday && !completed && "border-zinc-400 dark:border-zinc-500 border-dashed"
              )}
              title={format(date, "EEE, MMM d")}
            >
              <Check size={16} strokeWidth={3} className={cn(completed ? "scale-100" : "scale-0")} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HabitRow;
