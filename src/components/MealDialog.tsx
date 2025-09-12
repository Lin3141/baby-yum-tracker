import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X, AlertTriangle } from "lucide-react";

interface Baby {
  id: string;
  name: string;
  color: string;
}

interface MealDialogProps {
  date: Date;
  babies: Baby[];
  children: React.ReactNode;
}

export function MealDialog({ date, babies, children }: MealDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBaby, setSelectedBaby] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("");
  const [foods, setFoods] = useState<string[]>([]);
  const [newFood, setNewFood] = useState("");
  const [reactions, setReactions] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  const commonFoods = [
    "Banana", "Sweet potato", "Avocado", "Rice cereal", "Oat cereal",
    "Peas", "Carrots", "Apples", "Pears", "Broccoli", "Chicken", "Beef"
  ];

  const commonReactions = [
    "Rash", "Hives", "Vomiting", "Diarrhea", "Gas", "Fussiness", "Constipation"
  ];

  const addFood = (food: string) => {
    if (food.trim() && !foods.includes(food.trim())) {
      setFoods([...foods, food.trim()]);
      setNewFood("");
    }
  };

  const removeFood = (food: string) => {
    setFoods(foods.filter(f => f !== food));
  };

  const toggleReaction = (reaction: string) => {
    setReactions(prev => 
      prev.includes(reaction)
        ? prev.filter(r => r !== reaction)
        : [...prev, reaction]
    );
  };

  const handleSubmit = () => {
    // TODO: Save meal entry
    console.log({
      babyId: selectedBaby,
      date: date.toISOString().split('T')[0],
      meal: selectedMeal,
      foods,
      reactions,
      notes
    });
    setIsOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedBaby("");
    setSelectedMeal("");
    setFoods([]);
    setReactions([]);
    setNotes("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Add Meal Entry - {date.toLocaleDateString()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Baby Selection */}
          <div className="space-y-2">
            <Label>Select Baby</Label>
            <Select value={selectedBaby} onValueChange={setSelectedBaby}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a baby" />
              </SelectTrigger>
              <SelectContent>
                {babies.map(baby => (
                  <SelectItem key={baby.id} value={baby.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-${baby.color}`} />
                      {baby.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Meal Type Selection */}
          <div className="space-y-2">
            <Label>Meal Type</Label>
            <Select value={selectedMeal} onValueChange={setSelectedMeal}>
              <SelectTrigger>
                <SelectValue placeholder="Choose meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
                <SelectItem value="lunch">☀️ Lunch</SelectItem>
                <SelectItem value="dinner">🌙 Dinner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Foods */}
          <div className="space-y-3">
            <Label>Foods</Label>
            
            {/* Common foods */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Quick add common foods:</p>
              <div className="flex flex-wrap gap-2">
                {commonFoods.map(food => (
                  <Button
                    key={food}
                    variant="outline"
                    size="sm"
                    onClick={() => addFood(food)}
                    disabled={foods.includes(food)}
                  >
                    {food}
                  </Button>
                ))}
              </div>
            </div>

            {/* Custom food input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add custom food..."
                value={newFood}
                onChange={(e) => setNewFood(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addFood(newFood)}
              />
              <Button onClick={() => addFood(newFood)} disabled={!newFood.trim()}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Selected foods */}
            {foods.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected foods:</p>
                <div className="flex flex-wrap gap-2">
                  {foods.map(food => (
                    <Badge key={food} variant="secondary" className="flex items-center gap-1">
                      {food}
                      <button onClick={() => removeFood(food)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reactions */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Reactions (if any)
            </Label>
            <div className="flex flex-wrap gap-2">
              {commonReactions.map(reaction => (
                <Button
                  key={reaction}
                  variant={reactions.includes(reaction) ? "destructive" : "outline"}
                  size="sm"
                  onClick={() => toggleReaction(reaction)}
                >
                  {reaction}
                </Button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              placeholder="Any additional notes about this meal..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!selectedBaby || !selectedMeal || foods.length === 0}
            >
              Save Meal Entry
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}