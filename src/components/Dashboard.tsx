import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, TrendingUp, Heart, Zap } from "lucide-react";
import { LogMealModal } from "./LogMealModal";
import { useBabyStore } from "@/store/useBabyStore";
import { DayCard } from "./DayCard";

export function Dashboard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { selectedBaby, meals, fetchMeals, foods, fetchFoods } = useBabyStore();

  useEffect(() => {
    if (selectedBaby) {
      fetchMeals(selectedBaby.id);
    }
    fetchFoods();
  }, [selectedBaby, fetchMeals, fetchFoods]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate insights
  const currentMonthMeals = meals.filter(meal => {
    const mealDate = new Date(meal.meal_date);
    return mealDate.getMonth() === currentDate.getMonth() && 
           mealDate.getFullYear() === currentDate.getFullYear();
  });

  const uniqueFoodsThisMonth = new Set();
  currentMonthMeals.forEach(meal => {
    meal.items.forEach(item => {
      if (item.food_id) {
        const food = foods.find(f => f.id === item.food_id);
        if (food) uniqueFoodsThisMonth.add(food.name);
      } else if (item.free_text) {
        uniqueFoodsThisMonth.add(item.free_text);
      }
    });
  });

  const mealsWithReactions = currentMonthMeals.filter(meal => 
    meal.reactions && meal.reactions.length > 0
  );

  if (!selectedBaby) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Welcome to Baby Food Tracker</h2>
          <p className="text-muted-foreground mb-6">
            Start by adding a baby profile to track their food journey
          </p>
          <LogMealModal>
            <Button size="lg" className="gradient-primary text-primary-foreground">
              <Plus className="h-5 w-5 mr-2" />
              Add Your First Baby
            </Button>
          </LogMealModal>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header with baby info and quick actions */}
      <div className="gradient-warm rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {selectedBaby.name}'s Food Journey
            </h1>
            <p className="text-muted-foreground">
              Track meals, discover patterns, and nurture healthy eating habits
            </p>
          </div>
          <LogMealModal>
            <Button size="lg" className="shadow-button">
              <Plus className="h-5 w-5 mr-2" />
              Log Meal
            </Button>
          </LogMealModal>
        </div>

        {/* Quick insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{currentMonthMeals.length}</p>
                  <p className="text-xs text-muted-foreground">meals logged</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <Zap className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">New Foods</p>
                  <p className="text-2xl font-bold">{uniqueFoodsThisMonth.size}</p>
                  <p className="text-xs text-muted-foreground">foods tried</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reactions</p>
                  <p className="text-2xl font-bold">{mealsWithReactions.length}</p>
                  <p className="text-xs text-muted-foreground">meals flagged</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Calendar */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{monthYear}</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div
                key={day}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => (
              <DayCard
                key={index}
                date={day}
                baby={selectedBaby}
                meals={meals}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}