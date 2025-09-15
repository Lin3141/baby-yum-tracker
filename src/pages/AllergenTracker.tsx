import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, User, TrendingUp, FileText } from "lucide-react";
import { AllergenProfile } from "@/components/AllergenProfile";
import { ReactionLog } from "@/components/ReactionLog";
import { AllergenInsights } from "@/components/AllergenInsights";
import { useBabyStore } from "@/store/useBabyStore";
import { useAuth } from "@/hooks/useAuth";

export function AllergenTracker() {
  const [activeTab, setActiveTab] = useState("profiles");
  const { babies, fetchBabies, selectedBaby, setSelectedBaby } = useBabyStore();
  const { user } = useAuth();

  useEffect(() => {
    fetchBabies();
  }, [fetchBabies]);

  const getAllergenCount = (baby: any) => {
    const knownAllergies = baby?.known_allergies?.length || 0;
    const suspectedAllergies = baby?.suspected_allergies?.length || 0;
    return knownAllergies + suspectedAllergies;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">
            {selectedBaby?.name ? `${selectedBaby.name}'s Allergen Tracker` : 'Allergen Tracker'}
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage allergen profiles, track reactions, and get insights for your family
          </p>
        </div>
      </div>

      {/* Family Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {babies.map((baby) => (
          <Card 
            key={baby.id} 
            className={`cursor-pointer transition-all hover:shadow-md border-2 ${
              selectedBaby?.id === baby.id 
                ? "border-primary shadow-lg" 
                : "border-border hover:border-primary/50"
            }`}
            onClick={() => setSelectedBaby(baby)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                <span className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {baby.name}
                </span>
                {getAllergenCount(baby) > 0 && (
                  <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                    {getAllergenCount(baby)} allergens
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Age: {Math.floor((Date.now() - new Date(baby.date_of_birth).getTime()) / (1000 * 60 * 60 * 24 * 30.44))} months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {baby.known_allergies?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span className="text-sm text-muted-foreground">
                      {baby.known_allergies.length} confirmed allergen{baby.known_allergies.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                {baby.suspected_allergies?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm text-muted-foreground">
                      {baby.suspected_allergies.length} suspected allergen{baby.suspected_allergies.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                {getAllergenCount(baby) === 0 && (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    ✅ No known allergens
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedBaby ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profiles" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="reactions" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reactions
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Emergency
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profiles">
            <AllergenProfile baby={selectedBaby} />
          </TabsContent>

          <TabsContent value="reactions">
            <ReactionLog baby={selectedBaby} />
          </TabsContent>

          <TabsContent value="insights">
            <AllergenInsights baby={selectedBaby} />
          </TabsContent>

          <TabsContent value="emergency">
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  Emergency Action Plan
                </CardTitle>
                <CardDescription>
                  Important steps to take during a severe allergic reaction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-700 mb-2">Signs of Severe Allergic Reaction (Anaphylaxis):</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Difficulty breathing or wheezing</li>
                    <li>Swelling of face, lips, tongue, or throat</li>
                    <li>Rapid pulse or dizziness</li>
                    <li>Widespread rash or hives</li>
                    <li>Nausea, vomiting, or diarrhea</li>
                    <li>Loss of consciousness</li>
                  </ul>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-700 mb-2">Emergency Steps:</h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li className="font-medium">Call 911 immediately</li>
                    <li>Give epinephrine (EpiPen) if prescribed</li>
                    <li>Have the person lie down with legs elevated</li>
                    <li>Remove or avoid the allergen if possible</li>
                    <li>Begin CPR if the person stops breathing</li>
                    <li>Stay with the person until emergency help arrives</li>
                  </ol>
                </div>

                <div className="bg-white p-4 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-700 mb-2">Emergency Contacts:</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Emergency Services:</span> 911</p>
                    <p><span className="font-medium">Pediatrician:</span> {selectedBaby.pediatrician_contact || "Not provided"}</p>
                    <p><span className="font-medium">Poison Control:</span> 1-800-222-1222</p>
                  </div>
                </div>

                <p className="text-xs text-red-600 italic">
                  This is general information only. Always follow your doctor's specific instructions and emergency action plan.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select a Family Member</h3>
            <p className="text-muted-foreground">
              Choose a family member above to manage their allergen profile and track reactions
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}