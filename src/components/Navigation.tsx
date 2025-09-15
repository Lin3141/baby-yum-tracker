import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, PlusCircle, Target, TrendingUp, Baby, Settings, LogOut, User, BookOpen, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { BabySwitcher } from "./BabySwitcher";
import { LogMealModal } from "./LogMealModal";

interface NavigationProps {
  currentView: "home" | "allergens" | "insights" | "foods" | "babies" | "settings";
  onViewChange: (view: "home" | "allergens" | "insights" | "foods" | "babies" | "settings") => void;
}

export function Navigation({ currentView, onViewChange }: NavigationProps) {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const navItems = [
    { id: "home" as const, label: "Home", icon: Calendar },
    { id: "allergens" as const, label: "Allergens", icon: Target },
    { id: "insights" as const, label: "Insights", icon: TrendingUp },
    { id: "foods" as const, label: "Foods", icon: BookOpen },
    { id: "babies" as const, label: "Babies", icon: Baby },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <nav className="glass-panel border-soft p-4 m-4 rounded-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <BabySwitcher />
            <LogMealModal>
              <Button 
                variant="default" 
                size="sm"
                className="flex items-center space-x-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Log Meal</span>
              </Button>
            </LogMealModal>
          </div>
          
          <div className="flex space-x-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentView === item.id ? "default" : "ghost"}
                onClick={() => onViewChange(item.id)}
                className="flex items-center space-x-2 transition-all duration-200"
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {user ? (
            <>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {user?.email || user?.phone || 'User'}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <AlertTriangle className="h-3 w-3" />
                  <span className="text-xs">Guest Mode - Data Not Saved</span>
                </Badge>
              </div>
              <Button
                variant="default"
                size="sm"
                onClick={() => navigate("/auth")}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Up to Save</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}