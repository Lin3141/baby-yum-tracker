import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MealDialog } from "./MealDialog";
import { Plus } from "lucide-react";

import type { Baby, Meal } from "@/store/useBabyStore";

interface DayCardProps {
  date: Date | null;
  baby: Baby;
  meals: Meal[];
}

export function DayCard({ date, baby, meals }: DayCardProps) {
  if (!date) {
    return <div className="h-32"></div>;
  }

  const dateStr = date.toISOString().split('T')[0];
  const dayMeals = meals.filter(meal => 
    meal.meal_date === dateStr && meal.baby_id === baby.id
  );
  
  const isToday = date.toDateString() === new Date().toDateString();
  const isCurrentMonth = date.getMonth() === new Date().getMonth();

  const getMealIndicators = () => {
    const mealTypes = ["breakfast", "lunch", "dinner", "snack"] as const;
    const mealTypeColors = {
      breakfast: "hsl(var(--breakfast))",
      lunch: "hsl(var(--lunch))", 
      dinner: "hsl(var(--dinner))",
      snack: "hsl(var(--snack))"
    };

    return mealTypes.map(mealType => {
      const mealEntries = dayMeals.filter(meal => meal.meal_type === mealType);
      if (mealEntries.length === 0) return null;

      return (
        <div key={mealType} className="flex flex-wrap gap-1 mb-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: mealTypeColors[mealType] }}
            title={`${mealType} logged`}
          />
        </div>
      );
    }).filter(Boolean);
  };

  return (
    <Card 
      className={`
        h-32 p-2 transition-all duration-200 hover:shadow-soft group
        ${isToday ? 'ring-2 ring-primary shadow-soft' : ''}
        ${!isCurrentMonth ? 'opacity-50' : ''}
      `}
    >
        <div className="flex flex-col h-full">
        <div className={`
          text-sm font-medium mb-2 flex justify-between items-center
          ${isToday ? 'text-primary font-semibold' : 'text-foreground'}
        `}>
          <span>{date.getDate()}</span>
          {dayMeals.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">{dayMeals.length}</span>
            </div>
          )}
        </div>
        <div className="flex-1 overflow-hidden flex flex-wrap gap-1">
          {getMealIndicators()}
        </div>
        {dayMeals.some(meal => meal.reactions && meal.reactions.length > 0) && (
          <div className="mt-1">
            <Badge variant="destructive" className="text-xs px-1 py-0">
              ⚠️
            </Badge>
          </div>
        )}
      </div>
    </Card>
  );
}