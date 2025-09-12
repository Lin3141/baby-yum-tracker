import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

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

const mockFoodData: FoodFrequency[] = [
  { name: "Banana", count: 12, lastIntroduced: "2024-01-01" },
  { name: "Sweet Potato", count: 8, lastIntroduced: "2024-01-03" },
  { name: "Rice Cereal", count: 15, lastIntroduced: "2024-01-01" },
  { name: "Peas", count: 6, lastIntroduced: "2024-01-05" },
  { name: "Avocado", count: 4, lastIntroduced: "2024-01-10" },
  { name: "Carrots", count: 7, lastIntroduced: "2024-01-07" },
];

const mockWeeklyData = [
  { day: "Mon", meals: 3, newFoods: 1 },
  { day: "Tue", meals: 3, newFoods: 0 },
  { day: "Wed", meals: 2, newFoods: 2 },
  { day: "Thu", meals: 3, newFoods: 0 },
  { day: "Fri", meals: 3, newFoods: 1 },
  { day: "Sat", meals: 3, newFoods: 0 },
  { day: "Sun", meals: 2, newFoods: 0 },
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))', 'hsl(var(--baby-1))', 'hsl(var(--baby-2))'];

export function Analytics({ babies }: AnalyticsProps) {
  const totalMeals = mockWeeklyData.reduce((sum, day) => sum + day.meals, 0);
  const totalNewFoods = mockWeeklyData.reduce((sum, day) => sum + day.newFoods, 0);
  
  const lessFrequentFoods = mockFoodData
    .filter(food => food.count < 5)
    .sort((a, b) => a.count - b.count);

  const pieData = mockFoodData.slice(0, 6).map(food => ({
    name: food.name,
    value: food.count
  }));

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Weekly Analytics</h1>
        <Badge variant="outline" className="text-sm">
          Week of Jan 15-21, 2024
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
            <div className="text-2xl font-bold text-primary">{mockFoodData[0]?.name}</div>
            <p className="text-xs text-muted-foreground">{mockFoodData[0]?.count} times</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reactions Recorded
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
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
              <BarChart data={mockWeeklyData}>
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
                    <Progress value={(food.count / 10) * 100} className="w-12 h-1" />
                    <span className="text-xs">{food.count}x</span>
                  </Badge>
                ))}
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