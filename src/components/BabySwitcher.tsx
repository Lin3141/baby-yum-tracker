import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Baby, ChevronDown } from "lucide-react";
import { useBabyStore } from "@/store/useBabyStore";

export function BabySwitcher() {
  const { babies, selectedBaby, setSelectedBaby, fetchBabies } = useBabyStore();

  useEffect(() => {
    fetchBabies();
  }, [fetchBabies]);

  useEffect(() => {
    // Auto-select first baby if none selected
    if (babies.length > 0 && !selectedBaby) {
      setSelectedBaby(babies[0]);
    }
  }, [babies, selectedBaby, setSelectedBaby]);

  if (babies.length === 0) {
    return (
      <Button variant="ghost" size="sm" className="text-muted-foreground">
        <Baby className="h-4 w-4 mr-2" />
        No babies
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2">
          <Baby className="h-4 w-4" />
          <span className="hidden sm:inline">
            {selectedBaby?.name || "Select Baby"}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border border-border">
        {babies.map((baby) => (
          <DropdownMenuItem
            key={baby.id}
            onClick={() => setSelectedBaby(baby)}
            className={`cursor-pointer ${
              selectedBaby?.id === baby.id ? "bg-accent" : ""
            }`}
          >
            <Baby className="h-4 w-4 mr-2" />
            {baby.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}