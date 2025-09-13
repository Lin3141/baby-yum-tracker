import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function SafetyBanner() {
  return (
    <Alert className="mb-4 border-yellow-200 bg-yellow-50">
      <AlertTriangle className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800 font-medium">
        <strong>Important:</strong> This app provides general information only — not medical advice. 
        Always consult your pediatrician for personalized guidance. In case of emergency, call 911 immediately.
      </AlertDescription>
    </Alert>
  );
}