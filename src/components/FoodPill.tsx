import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FoodPillProps {
  food: {
    id: string;
    name: string;
    category: string;
    allergens?: string[];
  };
  selected?: boolean;
  removable?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export function FoodPill({ 
  food, 
  selected = false, 
  removable = false, 
  onClick, 
  onRemove,
  className 
}: FoodPillProps) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "fruit":
        return "🍎";
      case "vegetable":
        return "🥕";
      case "protein":
        return "🥩";
      case "grain":
        return "🌾";
      case "dairy":
        return "🥛";
      case "sweetener":
        return "🍯";
      case "drink":
        return "🧃";
      default:
        return "🍽️";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "fruit":
        return "bg-red-100 text-red-800 border-red-200";
      case "vegetable":
        return "bg-green-100 text-green-800 border-green-200";
      case "protein":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "grain":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "dairy":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "sweetener":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "drink":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const hasAllergens = food.allergens && food.allergens.length > 0;

  if (onClick) {
    return (
      <Button
        variant={selected ? "default" : "outline"}
        size="sm"
        onClick={onClick}
        className={cn(
          "flex items-center gap-2 h-auto py-2 px-3 relative",
          selected && "ring-2 ring-primary ring-offset-2",
          hasAllergens && "border-destructive/50",
          className
        )}
      >
        <span className="text-sm">{getCategoryIcon(food.category)}</span>
        <span className="text-sm font-medium">{food.name}</span>
        {hasAllergens && (
          <Badge variant="destructive" className="text-xs ml-1">
            ⚠️
          </Badge>
        )}
        {removable && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="h-4 w-4 p-0 ml-1 hover:bg-destructive hover:text-destructive-foreground"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </Button>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium",
        getCategoryColor(food.category),
        hasAllergens && "border-destructive/50",
        className
      )}
    >
      <span>{getCategoryIcon(food.category)}</span>
      <span>{food.name}</span>
      {hasAllergens && (
        <Badge variant="destructive" className="text-xs">
          ⚠️
        </Badge>
      )}
      {removable && onRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}