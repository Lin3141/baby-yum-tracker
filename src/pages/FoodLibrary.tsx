import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Filter, Plus, BookOpen, AlertTriangle, Baby, Utensils } from "lucide-react";
import { FoodPill } from "@/components/FoodPill";
import { useBabyStore } from "@/store/useBabyStore";

const FOOD_CATEGORIES = [
  { id: "all", name: "All Categories", icon: "🍽️" },
  { id: "fruit", name: "Fruits", icon: "🍎" },
  { id: "vegetable", name: "Vegetables", icon: "🥕" },
  { id: "protein", name: "Proteins", icon: "🥩" },
  { id: "dairy", name: "Dairy", icon: "🥛" },
  { id: "grain", name: "Grains", icon: "🌾" },
  { id: "sweetener", name: "Sweeteners", icon: "🍯" },
  { id: "drink", name: "Drinks", icon: "🧃" },
];

const AGE_FILTERS = [
  { id: "all", name: "All Ages" },
  { id: "6-9", name: "6-9 months" },
  { id: "9-12", name: "9-12 months" },
  { id: "12-18", name: "12-18 months" },
  { id: "18-24", name: "18-24 months" },
];

export function FoodLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAge, setSelectedAge] = useState("all");
  const [showAllergenFilter, setShowAllergenFilter] = useState(false);
  const [selectedFood, setSelectedFood] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { foods, fetchFoods, loading } = useBabyStore();

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const filteredFoods = foods.filter((food) => {
    // Text search
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    // Category filter
    const matchesCategory = selectedCategory === "all" || food.category === selectedCategory;

    // Allergen filter
    const matchesAllergen = !showAllergenFilter || (food.allergens && food.allergens.length === 0);

    return matchesSearch && matchesCategory && matchesAllergen;
  });

  const getAgeSuitability = (food: any) => {
    // Simple age recommendations based on common guidelines
    const hasAllergens = food.allergens && food.allergens.length > 0;
    const isHoney = food.tags.includes('sweetener') && food.name.toLowerCase().includes('honey');
    const isJuice = food.tags.includes('juice');
    const hasChokingRisk = food.choking_form_notes;

    if (isHoney) return "12+ months (botulism risk)";
    if (isJuice) return "12+ months (AAP guidelines)";
    if (hasAllergens) return "6+ months (introduce carefully)";
    if (hasChokingRisk) return "9+ months (with modifications)";
    
    return "6+ months";
  };

  const getNutritionHighlights = (food: any) => {
    const highlights = [];
    
    if (food.iron_mg_per_100g > 10) highlights.push("High Iron");
    if (food.tags.includes('omega-3')) highlights.push("Omega-3");
    if (food.tags.includes('healthy-fat')) highlights.push("Healthy Fats");
    if (food.tags.includes('iron-fortified')) highlights.push("Iron Fortified");
    if (food.category === 'vegetable' && food.tags.includes('orange-vegetable')) highlights.push("Vitamin A");
    if (food.category === 'vegetable' && food.tags.includes('green-vegetable')) highlights.push("Folate & Vitamin K");
    
    return highlights;
  };

  const handleFoodClick = (food: any) => {
    setSelectedFood(food);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading food library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            Foods Library
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive database of baby-friendly foods with safety information and nutrition data
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex gap-4 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search foods, categories, or nutrients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FOOD_CATEGORIES.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Allergen Filter */}
            <Button
              variant={showAllergenFilter ? "default" : "outline"}
              onClick={() => setShowAllergenFilter(!showAllergenFilter)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Allergen-Free Only
            </Button>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredFoods.length} of {foods.length} foods</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span>Contains allergens</span>
              </div>
              <div className="flex items-center gap-1">
                <Baby className="h-4 w-4 text-blue-500" />
                <span>Age-specific notes</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Food Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredFoods.map((food) => (
          <Card 
            key={food.id} 
            className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
            onClick={() => handleFoodClick(food)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Food Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <FoodPill food={food} className="mb-2" />
                    <h3 className="font-semibold text-lg">{food.name}</h3>
                  </div>
                  {(food.allergens && food.allergens.length > 0) && (
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-1" />
                  )}
                </div>

                {/* Age Suitability */}
                <div className="flex items-center gap-2">
                  <Baby className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">
                    {getAgeSuitability(food)}
                  </span>
                </div>

                {/* Nutrition Highlights */}
                {getNutritionHighlights(food).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {getNutritionHighlights(food).map((highlight) => (
                      <Badge key={highlight} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Allergens */}
                {food.allergens && food.allergens.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {food.allergens.map((allergen) => (
                      <Badge key={allergen} variant="destructive" className="text-xs">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Choking Notes Preview */}
                {food.choking_form_notes && (
                  <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                    ⚠️ {food.choking_form_notes.substring(0, 60)}...
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredFoods.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Foods Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters
            </p>
          </CardContent>
        </Card>
      )}

      {/* Food Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedFood && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <FoodPill food={selectedFood} />
                  {selectedFood.name}
                </DialogTitle>
                <DialogDescription>
                  Complete nutritional and safety information
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Age & Safety */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Baby className="h-4 w-4 text-blue-500" />
                      Age Suitability & Safety
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="font-medium">Recommended Age: </span>
                      <span>{getAgeSuitability(selectedFood)}</span>
                    </div>
                    
                    {selectedFood.choking_form_notes && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                          <div>
                            <span className="font-medium text-amber-800">Safety Notes:</span>
                            <p className="text-sm text-amber-700 mt-1">{selectedFood.choking_form_notes}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedFood.allergens && selectedFood.allergens.length > 0 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                          <div>
                            <span className="font-medium text-red-800">Allergen Alert:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {selectedFood.allergens.map((allergen: string) => (
                                <Badge key={allergen} variant="destructive" className="text-xs">
                                  {allergen}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Nutrition */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-green-500" />
                      Nutritional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedFood.iron_mg_per_100g && (
                      <div className="flex justify-between items-center">
                        <span>Iron (per 100g):</span>
                        <Badge variant="outline" className={selectedFood.iron_mg_per_100g > 2 ? "bg-green-50 text-green-700" : "bg-gray-50"}>
                          {selectedFood.iron_mg_per_100g}mg
                        </Badge>
                      </div>
                    )}
                    
                    {getNutritionHighlights(selectedFood).length > 0 && (
                      <div>
                        <span className="font-medium">Nutrition highlights:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {getNutritionHighlights(selectedFood).map((highlight) => (
                            <Badge key={highlight} variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedFood.tags && selectedFood.tags.length > 0 && (
                      <div>
                        <span className="font-medium">Tags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedFood.tags.map((tag: string) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Serving Suggestions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Serving Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Start with small portions (1-2 tablespoons)</p>
                      <p>• Offer multiple times even if initially rejected</p>
                      <p>• Always supervise eating and ensure proper texture for age</p>
                      {selectedFood.category === 'protein' && (
                        <p>• Cook thoroughly and check for proper temperature</p>
                      )}
                      {selectedFood.category === 'fruit' && (
                        <p>• Fresh is best - avoid added sugars when possible</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}