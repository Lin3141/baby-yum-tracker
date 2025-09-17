import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";
import { useBabyStore } from "@/store/useBabyStore";
import { FoodPill } from "./FoodPill";
import { ReactionChips } from "./ReactionChips";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface LogMealModalProps {
  children: React.ReactNode;
}

export function LogMealModal({ children }: LogMealModalProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const [mealType, setMealType] = useState("");
  const [foodSearch, setFoodSearch] = useState("");
  const [selectedFoods, setSelectedFoods] = useState<Array<{
    id: string;
    name: string;
    portion: string;
  }>>([]);
  const [reactions, setReactions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const { selectedBaby, foods, fetchFoods, addMeal } = useBabyStore();
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchFoods();
    }
  }, [open, fetchFoods]);

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(foodSearch.toLowerCase())
  );

  const addFood = (food: any, portion: string = "taste") => {
    if (!selectedFoods.find(f => f.id === food.id)) {
      setSelectedFoods([...selectedFoods, {
        id: food.id,
        name: food.name,
        portion
      }]);
      setFoodSearch("");
    }
  };

  const removeFood = (foodId: string) => {
    setSelectedFoods(selectedFoods.filter(f => f.id !== foodId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mealType || selectedFoods.length === 0) {
      toast({
        title: "Missing information", 
        description: "Please fill in meal type and add at least one food.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedBaby) {
      toast({
        title: "Guest Mode",
        description: "Sign up to save your meals permanently.",
        variant: "default",
      });
      // In guest mode, we'll still allow logging but won't save to database
      setMealType("");
      setSelectedFoods([]);
      setReactions([]);
      setNotes("");
      setFoodSearch("");
      setOpen(false);
      return;
    }

    try {
      await addMeal({
        baby_id: selectedBaby.id,
        meal_date: date,
        meal_time: time,
        meal_type: mealType,
        items: selectedFoods.map(food => ({
          food_id: food.id,
          portion_tag: food.portion
        })),
        reactions,
        notes: notes || null,
      });

      toast({
        title: "Meal logged",
        description: `Meal logged for ${selectedBaby.name}`,
      });

      // Reset form
      setMealType("");
      setSelectedFoods([]);
      setReactions([]);
      setNotes("");
      setFoodSearch("");
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log meal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Log a Meal for {selectedBaby?.name || "Baby"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="meal-type">Meal Type</Label>
            <Select value={mealType} onValueChange={setMealType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="food-search">Add Foods</Label>
            <Input
              id="food-search"
              placeholder="Search for foods..."
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
            />
            {foodSearch && filteredFoods.length > 0 && (
              <div className="max-h-32 overflow-y-auto border rounded-md p-2 space-y-1">
                {filteredFoods.slice(0, 5).map((food) => (
                  <Button
                    key={food.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => addFood(food)}
                    className="w-full justify-start text-left h-auto p-2"
                  >
                    <div>
                      <div className="font-medium">{food.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {food.category}
                        {food.allergens.length > 0 && ` • Contains: ${food.allergens.join(", ")}`}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            )}
          </div>

          {selectedFoods.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Foods</Label>
              <div className="flex flex-wrap gap-2">
                {selectedFoods.map((selectedFood) => {
                  const foodData = foods.find(f => f.id === selectedFood.id);
                  if (!foodData) return null;
                  
                  return (
                    <div key={selectedFood.id} className="flex items-center space-x-1">
                      <FoodPill 
                        food={foodData} 
                        selected={true}
                        onClick={() => {}}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFood(selectedFood.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Reactions (if any)</Label>
            <ReactionChips
              selectedReactions={reactions}
              onToggle={(reaction) => {
                setReactions(prev => 
                  prev.includes(reaction)
                    ? prev.filter(r => r !== reaction)
                    : [...prev, reaction]
                );
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about this meal..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!mealType || selectedFoods.length === 0}
            >
              Log Meal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}