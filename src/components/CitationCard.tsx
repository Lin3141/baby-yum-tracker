import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Shield } from "lucide-react";
import { AlertRule } from "./AlertCard";

interface CitationCardProps {
  rule: AlertRule;
  isOpen: boolean;
  onClose: () => void;
}

export function CitationCard({ rule, isOpen, onClose }: CitationCardProps) {
  const getPublisherLogo = (publisher: string) => {
    // In a real app, you'd have actual logos
    switch (publisher.toLowerCase()) {
      case "cdc":
        return "🏛️";
      case "aap / healthychildren":
        return "👨‍⚕️";
      case "fda":
        return "🔬";
      case "dietary guidelines for americans":
        return "📊";
      default:
        return "📋";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{getPublisherLogo(rule.publisher)}</span>
            <span>Source Citation</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Publisher Info */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getPublisherLogo(rule.publisher)}</span>
            <div>
              <h3 className="font-semibold">{rule.publisher}</h3>
              <p className="text-sm text-muted-foreground">Trusted Health Authority</p>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-primary-soft p-4 rounded-lg">
            <p className="text-sm">
              <strong>According to {rule.publisher}:</strong> {rule.short_text}
            </p>
          </div>

          {/* Direct Quote */}
          <div className="border-l-4 border-primary pl-4">
            <p className="italic text-foreground">"{rule.quote}"</p>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Region: US
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Age: 0-24 months
            </Badge>
            {rule.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Source Link and Dates */}
          <div className="bg-muted p-3 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Published: {rule.published_at}
              </span>
              <span className="text-sm text-muted-foreground">
                Verified: {rule.last_verified_at}
              </span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(rule.url, '_blank')}
              className="w-full"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Original Source
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="bg-secondary/20 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">
              This information is for educational purposes only and is not medical advice. 
              Always consult your pediatrician for personalized guidance.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}