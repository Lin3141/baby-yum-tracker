import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dashboard } from "@/components/Dashboard";
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
  const [currentView, setCurrentView] = useState<"home" | "insights" | "foods" | "settings">("home");
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
        return <Dashboard />;
      case "insights":
        return <Analytics babies={mockBabies} />;
      case "foods":
        return <FoodLibrary />;
      case "settings":
        return (
          <div className="p-6 max-w-4xl mx-auto">
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-muted-foreground">Manage your account and babies</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Manage Babies</h2>
                  <AllergenTracker />
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
                  <p className="text-muted-foreground">Account management features coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <Dashboard />;
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