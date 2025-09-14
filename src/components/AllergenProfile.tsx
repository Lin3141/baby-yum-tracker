import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Plus, X, Save, Shield } from "lucide-react";
import { useBabyStore, type Baby } from "@/store/useBabyStore";
import { useToast } from "@/hooks/use-toast";

const COMMON_ALLERGENS = [
  { id: "milk", name: "Milk", severity: "moderate", icon: "🥛" },
  { id: "egg", name: "Egg", severity: "moderate", icon: "🥚" },
  { id: "peanut", name: "Peanut", severity: "severe", icon: "🥜" },
  { id: "tree-nuts", name: "Tree Nuts", severity: "severe", icon: "🌰" },
  { id: "fish", name: "Fish", severity: "moderate", icon: "🐟" },
  { id: "shellfish", name: "Shellfish", severity: "severe", icon: "🦐" },
  { id: "wheat", name: "Wheat", severity: "mild", icon: "🌾" },
  { id: "soy", name: "Soy", severity: "mild", icon: "🫘" },
  { id: "sesame", name: "Sesame", severity: "moderate", icon: "🌰" },
];

const SEVERITY_LEVELS = [
  { id: "mild", label: "Intolerance", description: "Digestive discomfort, mild symptoms", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  { id: "moderate", label: "Allergy", description: "Hives, swelling, breathing issues", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { id: "severe", label: "Severe Allergy", description: "Anaphylaxis risk, life-threatening", color: "bg-red-100 text-red-800 border-red-300" },
];

interface AllergenProfileProps {
  baby: Baby;
}

export function AllergenProfile({ baby }: AllergenProfileProps) {
  const [knownAllergies, setKnownAllergies] = useState<string[]>(baby.known_allergies || []);
  const [suspectedAllergies, setSuspectedAllergies] = useState<string[]>(baby.suspected_allergies || []);
  const [customAllergen, setCustomAllergen] = useState("");
  const [pediatricianContact, setPediatricianContact] = useState(baby.pediatrician_contact || "");
  const [isSaving, setIsSaving] = useState(false);
  
  const { updateBaby } = useBabyStore();
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateBaby(baby.id, {
        known_allergies: knownAllergies,
        suspected_allergies: suspectedAllergies,
        pediatrician_contact: pediatricianContact.trim() || null,
      });
      
      toast({
        title: "Profile updated",
        description: "Allergen profile has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update allergen profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addKnownAllergen = (allergen: string) => {
    if (!knownAllergies.includes(allergen)) {
      setKnownAllergies([...knownAllergies, allergen]);
      // Remove from suspected if it's there
      setSuspectedAllergies(suspectedAllergies.filter(a => a !== allergen));
    }
  };

  const addSuspectedAllergen = (allergen: string) => {
    if (!suspectedAllergies.includes(allergen) && !knownAllergies.includes(allergen)) {
      setSuspectedAllergies([...suspectedAllergies, allergen]);
    }
  };

  const removeKnownAllergen = (allergen: string) => {
    setKnownAllergies(knownAllergies.filter(a => a !== allergen));
  };

  const removeSuspectedAllergen = (allergen: string) => {
    setSuspectedAllergies(suspectedAllergies.filter(a => a !== allergen));
  };

  const addCustomAllergen = () => {
    if (customAllergen.trim() && !knownAllergies.includes(customAllergen) && !suspectedAllergies.includes(customAllergen)) {
      setSuspectedAllergies([...suspectedAllergies, customAllergen.trim()]);
      setCustomAllergen("");
    }
  };

  const getSeverityInfo = (allergen: string) => {
    const common = COMMON_ALLERGENS.find(a => a.id === allergen || a.name.toLowerCase() === allergen.toLowerCase());
    return common ? SEVERITY_LEVELS.find(s => s.id === common.severity) : SEVERITY_LEVELS[1]; // Default to moderate
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Allergen Profile for {baby.name}
          </CardTitle>
          <CardDescription>
            Manage known and suspected allergens to get personalized meal safety alerts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Known Allergies */}
          <div>
            <Label className="text-base font-semibold text-red-700 flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4" />
              Confirmed Allergies
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Allergens with confirmed reactions that require strict avoidance
            </p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {knownAllergies.map((allergen) => (
                <Badge 
                  key={allergen} 
                  variant="outline" 
                  className="bg-red-50 text-red-700 border-red-200 px-3 py-1"
                >
                  {allergen}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeKnownAllergen(allergen)}
                    className="ml-2 h-4 w-4 p-0 hover:bg-red-200"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>

            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {COMMON_ALLERGENS.filter(a => !knownAllergies.includes(a.id) && !knownAllergies.includes(a.name))
                .map((allergen) => (
                <Button
                  key={allergen.id}
                  variant="outline"
                  size="sm"
                  onClick={() => addKnownAllergen(allergen.name)}
                  className="justify-start h-auto py-2 hover:bg-red-50 hover:border-red-200"
                >
                  <span className="mr-2">{allergen.icon}</span>
                  {allergen.name}
                  <Badge variant="outline" className="ml-auto text-xs">
                    {getSeverityInfo(allergen.id)?.label}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Suspected Allergies */}
          <div>
            <Label className="text-base font-semibold text-orange-700 flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4" />
              Suspected Allergies & Sensitivities
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Foods that may cause reactions or sensitivities to monitor
            </p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {suspectedAllergies.map((allergen) => (
                <Badge 
                  key={allergen} 
                  variant="outline" 
                  className="bg-orange-50 text-orange-700 border-orange-200 px-3 py-1"
                >
                  {allergen}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSuspectedAllergen(allergen)}
                    className="ml-2 h-4 w-4 p-0 hover:bg-orange-200"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>

            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {COMMON_ALLERGENS.filter(a => 
                !knownAllergies.includes(a.id) && 
                !knownAllergies.includes(a.name) &&
                !suspectedAllergies.includes(a.id) &&
                !suspectedAllergies.includes(a.name)
              ).map((allergen) => (
                <Button
                  key={allergen.id}
                  variant="outline"
                  size="sm"
                  onClick={() => addSuspectedAllergen(allergen.name)}
                  className="justify-start h-auto py-2 hover:bg-orange-50 hover:border-orange-200"
                >
                  <span className="mr-2">{allergen.icon}</span>
                  {allergen.name}
                  <Badge variant="outline" className="ml-auto text-xs">
                    {getSeverityInfo(allergen.id)?.label}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Custom Allergen Input */}
            <div className="flex gap-2 mt-3">
              <Input
                placeholder="Add custom allergen or sensitivity..."
                value={customAllergen}
                onChange={(e) => setCustomAllergen(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomAllergen()}
              />
              <Button onClick={addCustomAllergen} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Emergency Contact */}
          <div>
            <Label className="text-base font-semibold mb-3 block">
              Pediatrician Contact
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Emergency contact information for allergic reactions
            </p>
            <Input
              placeholder="Dr. Smith - (555) 123-4567"
              value={pediatricianContact}
              onChange={(e) => setPediatricianContact(e.target.value)}
            />
          </div>

          {/* Severity Legend */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <Label className="text-base font-semibold mb-3 block">
              Severity Levels
            </Label>
            <div className="grid gap-2 md:grid-cols-3">
              {SEVERITY_LEVELS.map((level) => (
                <div key={level.id} className="flex items-start gap-2">
                  <Badge variant="outline" className={level.color}>
                    {level.label}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {level.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}