import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import { useState } from "react";
import { CitationCard } from "./CitationCard";

export interface AlertRule {
  rule_key: string;
  short_text: string;
  severity: "info" | "caution" | "danger";
  publisher: string;
  url: string;
  published_at: string;
  last_verified_at: string;
  quote: string;
  tags: string[];
}

interface AlertCardProps {
  rule: AlertRule;
  onAdjustFood?: () => void;
  onLogReaction?: () => void;
}

export function AlertCard({ rule, onAdjustFood, onLogReaction }: AlertCardProps) {
  const [showCitation, setShowCitation] = useState(false);

  const getSeverityIcon = () => {
    switch (rule.severity) {
      case "danger":
        return <AlertTriangle className="h-4 w-4" />;
      case "caution":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getSeverityVariant = () => {
    switch (rule.severity) {
      case "danger":
        return "destructive" as const;
      case "caution":
        return "default" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <>
      <Alert variant={getSeverityVariant()} className="mb-4">
        {getSeverityIcon()}
        <AlertTitle className="flex items-center justify-between">
          <span>Safety Alert</span>
          <Badge variant="outline" className="text-xs">
            {rule.severity.toUpperCase()}
          </Badge>
        </AlertTitle>
        <AlertDescription className="space-y-3">
          <p>{rule.short_text}</p>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCitation(true)}
            >
              Learn why [1]
            </Button>
            {onAdjustFood && (
              <Button variant="outline" size="sm" onClick={onAdjustFood}>
                Adjust food
              </Button>
            )}
            {onLogReaction && (
              <Button variant="outline" size="sm" onClick={onLogReaction}>
                Log reaction
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>

      {showCitation && (
        <CitationCard
          rule={rule}
          isOpen={showCitation}
          onClose={() => setShowCitation(false)}
        />
      )}
    </>
  );
}