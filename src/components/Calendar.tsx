import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { DayCard } from "./DayCard";

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

const mockBabies: Baby[] = [
  { id: "1", name: "Emma", color: "baby-1" },
  { id: "2", name: "Noah", color: "baby-2" },
];

const mockMealData: MealEntry[] = [
  {
    id: "1",
    babyId: "1",
    date: "2024-01-15",
    meal: "breakfast",
    foods: ["Banana", "Rice cereal"],
    reactions: []
  },
  {
    id: "2",
    babyId: "1",
    date: "2024-01-15",
    meal: "lunch",
    foods: ["Sweet potato", "Peas"],
    reactions: []
  }
];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBabies, setSelectedBabies] = useState<string[]>(["1"]);

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

  const toggleBabySelection = (babyId: string) => {
    setSelectedBabies(prev => 
      prev.includes(babyId) 
        ? prev.filter(id => id !== babyId)
        : [...prev, babyId]
    );
  };

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-semibold">
                Baby Food Tracker
              </CardTitle>
              <div className="flex items-center gap-2">
                {mockBabies.map(baby => (
                  <Button
                    key={baby.id}
                    variant={selectedBabies.includes(baby.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleBabySelection(baby.id)}
                    className={`border-2 ${
                      selectedBabies.includes(baby.id) 
                        ? `bg-${baby.color} border-${baby.color}` 
                        : `border-${baby.color} text-${baby.color}`
                    }`}
                  >
                    {baby.name}
                  </Button>
                ))}
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Baby
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

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
                babies={mockBabies.filter(baby => selectedBabies.includes(baby.id))}
                mealData={mockMealData}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}