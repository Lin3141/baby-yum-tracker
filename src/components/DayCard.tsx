import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MealDialog } from "./MealDialog";
import { Plus } from "lucide-react";

interface Baby {
  id: string;
  name: string;
  color: string;
}

interface MealEntry {
  id: string;
  babyId: string;
  date: string;
  meal: "breakfast" | "lunch" | "dinner";
  foods: string[];
  reactions?: string[];
}

interface DayCardProps {
  date: Date | null;
  babies: Baby[];
  mealData: MealEntry[];
}

export function DayCard({ date, babies, mealData }: DayCardProps) {
  if (!date) {
    return <div className="h-32"></div>;
  }

  const dateStr = date.toISOString().split('T')[0];
  const dayMeals = mealData.filter(meal => meal.date === dateStr);
  
  const isToday = date.toDateString() === new Date().toDateString();
  const isCurrentMonth = date.getMonth() === new Date().getMonth();

  const getMealIndicators = () => {
    const meals = ["breakfast", "lunch", "dinner"] as const;
    return meals.map(mealType => {
      const mealEntries = dayMeals.filter(meal => meal.meal === mealType);
      if (mealEntries.length === 0) return null;

      return (
        <div key={mealType} className="flex flex-wrap gap-1 mb-1">
          {babies.map(baby => {
            const babyMeal = mealEntries.find(meal => meal.babyId === baby.id);
            if (!babyMeal) return null;

            return (
              <Badge
                key={`${mealType}-${baby.id}`}
                variant="outline"
                className={`text-xs px-1 py-0 bg-meal-${mealType} border-meal-${mealType} text-meal-${mealType}-foreground`}
              >
                {baby.name[0]}
              </Badge>
            );
          })}
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
          <MealDialog date={date} babies={babies}>
            <Button
              size="icon"
              variant="ghost"
              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </MealDialog>
        </div>
        <div className="flex-1 overflow-hidden">
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