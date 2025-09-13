import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const REACTIONS = [
  { id: "none", label: "No reaction", icon: "✅", severity: "safe" },
  { id: "mild_rash", label: "Mild rash", icon: "🔴", severity: "mild" },
  { id: "vomiting", label: "Vomiting", icon: "🤢", severity: "moderate" },
  { id: "swelling", label: "Swelling", icon: "🔺", severity: "severe" },
  { id: "emergency", label: "Emergency", icon: "🚨", severity: "emergency" },
] as const;

interface ReactionChipsProps {
  selectedReactions: string[];
  onToggle: (reactionId: string) => void;
  className?: string;
}

export function ReactionChips({ selectedReactions, onToggle, className }: ReactionChipsProps) {
  const getSeverityColors = (severity: string, selected: boolean) => {
    if (!selected) return "variant-outline";
    
    switch (severity) {
      case "safe":
        return "bg-green-100 text-green-800 border-green-300";
      case "mild":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "moderate":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "severe":
        return "bg-red-100 text-red-800 border-red-300";
      case "emergency":
        return "bg-red-200 text-red-900 border-red-400";
      default:
        return "variant-outline";
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {REACTIONS.map((reaction) => {
        const isSelected = selectedReactions.includes(reaction.id);
        
        return (
          <Button
            key={reaction.id}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onToggle(reaction.id)}
            className={cn(
              "flex items-center gap-2 h-auto py-2 px-3",
              isSelected && getSeverityColors(reaction.severity, true)
            )}
          >
            <span>{reaction.icon}</span>
            <span className="text-sm">{reaction.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

interface ReactionDisplayProps {
  reactions: string[];
  className?: string;
}

export function ReactionDisplay({ reactions, className }: ReactionDisplayProps) {
  if (reactions.length === 0) {
    return (
      <Badge variant="outline" className={cn("text-green-600", className)}>
        ✅ No reactions
      </Badge>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {reactions.map((reactionId) => {
        const reaction = REACTIONS.find(r => r.id === reactionId);
        if (!reaction) return null;

        return (
          <Badge
            key={reactionId}
            variant="outline"
            className={cn(
              "text-xs",
              getSeverityColors(reaction.severity, true)
            )}
          >
            {reaction.icon} {reaction.label}
          </Badge>
        );
      })}
    </div>
  );
}

function getSeverityColors(severity: string, selected: boolean) {
  if (!selected) return "";
  
  switch (severity) {
    case "safe":
      return "bg-green-100 text-green-800 border-green-300";
    case "mild":
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    case "moderate":
      return "bg-orange-100 text-orange-800 border-orange-300";
    case "severe":
      return "bg-red-100 text-red-800 border-red-300";
    case "emergency":
      return "bg-red-200 text-red-900 border-red-400";
    default:
      return "";
  }
}