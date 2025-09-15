import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Utensils, Plus, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useBabyStore } from "@/store/useBabyStore";
import { useEffect } from "react";

interface Baby {
  id: string;
  name: string;
  color: string;
}

interface FoodFrequency {
  name: string;
  count: number;
  lastIntroduced: string;
}

interface AnalyticsProps {
  babies: Baby[];
  selectedWeek?: string;
}

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', 'hsl(var(--baby-1))', 'hsl(var(--baby-2))'];

export function Analytics({ babies }: AnalyticsProps) {
  const { selectedBaby, meals, foods, fetchMeals, fetchFoods } = useBabyStore();

  useEffect(() => {
    fetchFoods();
    if (selectedBaby) {
      fetchMeals(selectedBaby.id);
    }
  }, [fetchFoods, fetchMeals, selectedBaby]);

  if (!selectedBaby) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Please select a baby to view insights.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter meals for selected baby
  const babyMeals = meals.filter(meal => meal.baby_id === selectedBaby.id);
  
  // Calculate last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const weeklyData = last7Days.map(date => {
    const dayMeals = babyMeals.filter(meal => meal.meal_date === date);
    const uniqueFoods = new Set();
    dayMeals.forEach(meal => {
      meal.items.forEach(item => {
        if (item.food_id) uniqueFoods.add(item.food_id);
      });
    });
    
    return {
      day: new Date(date).toLocaleDateString('en', { weekday: 'short' }),
      meals: dayMeals.length,
      newFoods: uniqueFoods.size,
    };
  });

  // Calculate food frequency
  const foodCounts = new Map<string, number>();
  babyMeals.forEach(meal => {
    meal.items.forEach(item => {
      if (item.food_id) {
        foodCounts.set(item.food_id, (foodCounts.get(item.food_id) || 0) + 1);
      }
    });
  });

  const foodFrequencyData = Array.from(foodCounts.entries())
    .map(([foodId, count]) => {
      const food = foods.find(f => f.id === foodId);
      return {
        name: food?.name || foodId,
        count,
        lastIntroduced: babyMeals
          .filter(meal => meal.items.some(item => item.food_id === foodId))
          .sort((a, b) => new Date(a.meal_date).getTime() - new Date(b.meal_date).getTime())[0]?.meal_date || ''
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  // Calculate basic statistics
  const totalMeals = weeklyData.reduce((sum, day) => sum + day.meals, 0);
  const totalNewFoods = weeklyData.reduce((sum, day) => sum + day.newFoods, 0);
  const lessFrequentFoods = foodFrequencyData.filter(food => food.count < 5);
  
  // Prepare pie chart data
  const pieData = foodFrequencyData.map(food => ({
    name: food.name,
    value: food.count
  }));

  const mostPopularFood = foodFrequencyData[0]?.name || "None yet";
  const totalReactions = babyMeals.filter(meal => meal.reactions && meal.reactions.length > 0).length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{selectedBaby.name}'s Insights</h1>
        <Badge variant="outline" className="text-sm">
          Last 7 days
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Meals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalMeals}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              New Foods Tried
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalNewFoods}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Most Popular Food
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{mostPopularFood}</div>
            <p className="text-xs text-muted-foreground">{foodFrequencyData[0]?.count || 0} times</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reactions Recorded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{totalReactions}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Meals Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Daily Meals This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="meals" fill="hsl(var(--primary))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Food Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Food Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💡 Food Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Based on your feeding patterns, here are some recommendations:
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Try These Foods More Often:</h4>
              <div className="flex flex-wrap gap-2">
                {lessFrequentFoods.map(food => (
                  <Badge key={food.name} variant="outline" className="flex items-center gap-2">
                    {food.name}
                    <span className="text-xs">{food.count}x</span>
                  </Badge>
                ))}
                {lessFrequentFoods.length === 0 && (
                  <p className="text-sm text-muted-foreground">All foods are being offered regularly!</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">New Foods to Consider:</h4>
              <div className="flex flex-wrap gap-2">
                {["Quinoa", "Lentils", "Mango", "Blueberries", "Chicken"].map(food => (
                  <Badge key={food} variant="secondary">
                    {food}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}