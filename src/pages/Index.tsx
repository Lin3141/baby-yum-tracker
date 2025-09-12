import { useState } from "react";
import { Calendar } from "@/components/Calendar";
import { Analytics } from "@/components/Analytics";
import { Navigation } from "@/components/Navigation";

const mockBabies = [
  { id: "1", name: "Emma", color: "baby-1" },
  { id: "2", name: "Noah", color: "baby-2" },
];

const Index = () => {
  const [currentView, setCurrentView] = useState<"calendar" | "analytics" | "babies" | "settings">("calendar");

  const renderCurrentView = () => {
    switch (currentView) {
      case "calendar":
        return <Calendar />;
      case "analytics":
        return <Analytics babies={mockBabies} />;
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
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      {renderCurrentView()}
    </div>
  );
};

export default Index;