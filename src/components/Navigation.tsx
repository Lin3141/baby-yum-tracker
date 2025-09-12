import { Button } from "@/components/ui/button";
import { Calendar, BarChart3, Baby, Settings } from "lucide-react";

interface NavigationProps {
  currentView: "calendar" | "analytics" | "babies" | "settings";
  onViewChange: (view: "calendar" | "analytics" | "babies" | "settings") => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: "calendar" as const, label: "Calendar", icon: Calendar },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
    { id: "babies" as const, label: "Babies", icon: Baby },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <div className="flex justify-center p-4 bg-background border-b border-border">
      <div className="flex gap-2">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={currentView === item.id ? "default" : "ghost"}
              onClick={() => onViewChange(item.id)}
              className="flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}