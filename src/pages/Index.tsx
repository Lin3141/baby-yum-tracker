import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/Calendar";
import { Analytics } from "@/components/Analytics";
import { Navigation } from "@/components/Navigation";
import { SafetyBanner } from "@/components/SafetyBanner";
import { AllergenTracker } from "@/pages/AllergenTracker";
import { FoodLibrary } from "@/pages/FoodLibrary";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const mockBabies = [
  { id: "1", name: "Emma", color: "baby-1" },
  { id: "2", name: "Noah", color: "baby-2" },
];

const Index = () => {
  const [currentView, setCurrentView] = useState<"home" | "allergens" | "insights" | "foods" | "babies" | "settings">("home");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Allow access to app without authentication (guest mode)
  // Data won't be saved unless user is authenticated

  if (loading) {
    return (
      <div className="min-h-screen gradient-soft flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "home":
        return <Calendar />;
      case "allergens":
        return <AllergenTracker />;
      case "insights":
        return <Analytics babies={mockBabies} />;
      case "foods":
        return <FoodLibrary />;
      case "babies":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Manage Babies</h1>
            <p className="text-muted-foreground">Baby management features coming soon...</p>
          </div>
        );
      case "settings":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <p className="text-muted-foreground">Settings features coming soon...</p>
          </div>
        );
      default:
        return <Calendar />;
    }
  };

  return (
    <div className="min-h-screen gradient-soft">
      <SafetyBanner />
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
};

export default Index;