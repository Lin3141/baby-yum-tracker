import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, AlertTriangle, Calendar, BarChart3, Target } from "lucide-react";
import { format, subDays, subWeeks, subMonths } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import type { Baby } from "@/store/useBabyStore";
import type { Tables } from "@/integrations/supabase/types";

interface AllergenInsightsProps {
  baby: Baby;
}

type Exposure = Tables<'exposures'>;

interface InsightData {
  totalReactions: number;
  allergenFrequency: Record<string, number>;
  severityTrends: Record<string, number>;
  monthlyTrends: Array<{ month: string; reactions: number }>;
  recentPatterns: string[];
  recommendations: string[];
}

export function AllergenInsights({ baby }: AllergenInsightsProps) {
  const [timeRange, setTimeRange] = useState("3months");
  const [insights, setInsights] = useState<InsightData>({
    totalReactions: 0,
    allergenFrequency: {},
    severityTrends: {},
    monthlyTrends: [],
    recentPatterns: [],
    recommendations: [],
  });
  const [loading, setLoading] = useState(true);
  const [reactions, setReactions] = useState<Exposure[]>([]);

  useEffect(() => {
    fetchData();
  }, [baby.id, timeRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Calculate date range
      const endDate = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case "1month":
          startDate = subMonths(endDate, 1);
          break;
        case "3months":
          startDate = subMonths(endDate, 3);
          break;
        case "6months":
          startDate = subMonths(endDate, 6);
          break;
        case "1year":
          startDate = subMonths(endDate, 12);
          break;
        default:
          startDate = subMonths(endDate, 3);
      }

      const { data, error } = await supabase
        .from('exposures')
        .select('*')
        .eq('baby_id', baby.id)
        .gte('exposure_date', format(startDate, 'yyyy-MM-dd'))
        .order('exposure_date', { ascending: false });

      if (error) throw error;
      
      setReactions(data || []);
      generateInsights(data || []);
    } catch (error) {
      console.error('Failed to fetch exposure data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (exposures: Exposure[]) => {
    const allergenFreq: Record<string, number> = {};
    const severityTrends: Record<string, number> = {};
    const monthlyData: Record<string, number> = {};

    exposures.forEach((exposure) => {
      // Count allergens
      allergenFreq[exposure.allergen] = (allergenFreq[exposure.allergen] || 0) + 1;

      // Parse reaction data
      let reactionData: any = {};
      try {
        reactionData = JSON.parse(exposure.reaction || '{}');
      } catch {}

      // Count severity levels
      if (reactionData.severity) {
        severityTrends[reactionData.severity] = (severityTrends[reactionData.severity] || 0) + 1;
      }

      // Monthly trends
      const monthKey = format(new Date(exposure.exposure_date), 'MMM yyyy');
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
    });

    const monthlyTrends = Object.entries(monthlyData)
      .map(([month, reactions]) => ({ month, reactions }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

    const patterns = generatePatterns(exposures);
    const recommendations = generateRecommendations(exposures, baby);

    setInsights({
      totalReactions: exposures.length,
      allergenFrequency: allergenFreq,
      severityTrends,
      monthlyTrends,
      recentPatterns: patterns,
      recommendations,
    });
  };

  const generatePatterns = (exposures: Exposure[]): string[] => {
    const patterns: string[] = [];
    
    if (exposures.length === 0) return patterns;

    // Find most frequent allergen
    const allergenCounts = Object.entries(insights.allergenFrequency)
      .sort(([,a], [,b]) => b - a);
    
    if (allergenCounts.length > 0 && allergenCounts[0][1] > 1) {
      patterns.push(`${allergenCounts[0][0]} is the most frequent trigger (${allergenCounts[0][1]} reactions)`);
    }

    // Check for recent reactions
    const recentReactions = exposures.filter(r => 
      new Date(r.exposure_date) > subWeeks(new Date(), 2)
    );
    
    if (recentReactions.length > 0) {
      patterns.push(`${recentReactions.length} reaction${recentReactions.length !== 1 ? 's' : ''} in the last 2 weeks`);
    }

    // Check severity trends
    const severeTrends = Object.entries(insights.severityTrends);
    const severeCount = severeTrends.find(([severity]) => severity === 'severe')?.[1] || 0;
    const emergencyCount = severeTrends.find(([severity]) => severity === 'emergency')?.[1] || 0;
    
    if (severeCount + emergencyCount > 0) {
      patterns.push(`${severeCount + emergencyCount} severe reaction${severeCount + emergencyCount !== 1 ? 's' : ''} recorded`);
    }

    return patterns;
  };

  const generateRecommendations = (exposures: Exposure[], baby: Baby): string[] => {
    const recommendations: string[] = [];

    // Check if emergency plan is needed
    const hasEmergencyReactions = exposures.some(r => {
      try {
        const reactionData = JSON.parse(r.reaction || '{}');
        return reactionData.severity === 'emergency' || reactionData.severity === 'severe';
      } catch {
        return false;
      }
    });

    if (hasEmergencyReactions && !baby.pediatrician_contact) {
      recommendations.push("Add pediatrician contact information for emergency situations");
    }

    // Check for frequent reactions
    if (exposures.length > 3) {
      recommendations.push("Consider consulting an allergist for comprehensive allergy testing");
    }

    // Check for multiple allergens
    const uniqueAllergens = new Set(exposures.map(r => r.allergen));
    if (uniqueAllergens.size > 3) {
      recommendations.push("Multiple allergens detected - consider creating a detailed avoidance plan");
    }

    // Check for recent reactions
    const recentReactions = exposures.filter(r => 
      new Date(r.exposure_date) > subWeeks(new Date(), 4)
    );
    
    if (recentReactions.length > 2) {
      recommendations.push("Multiple recent reactions - review meal preparation and ingredient checking");
    }

    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push("Continue monitoring reactions and maintaining detailed logs");
      recommendations.push("Regular follow-ups with healthcare provider are recommended");
    }

    return recommendations;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-orange-100 text-orange-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing reaction patterns...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Allergen Insights for {baby.name}
              </CardTitle>
              <CardDescription>
                Patterns and trends from reaction history
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {insights.totalReactions === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
              <p className="text-muted-foreground">
                No reactions recorded in the selected time period. Insights will appear as you log reactions.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700">Total Reactions</p>
                        <p className="text-2xl font-bold text-blue-900">{insights.totalReactions}</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-700">Unique Allergens</p>
                        <p className="text-2xl font-bold text-orange-900">
                          {Object.keys(insights.allergenFrequency).length}
                        </p>
                      </div>
                      <Target className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700">Time Period</p>
                        <p className="text-xl font-bold text-green-900">
                          {timeRange === "1month" ? "1 Month" : 
                           timeRange === "3months" ? "3 Months" : 
                           timeRange === "6months" ? "6 Months" : "1 Year"}
                        </p>
                      </div>
                      <Calendar className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Allergen Frequency */}
              {Object.keys(insights.allergenFrequency).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Most Common Triggers</CardTitle>
                    <CardDescription>
                      Allergens causing the most reactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(insights.allergenFrequency)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([allergen, count]) => (
                          <div key={allergen} className="flex items-center justify-between">
                            <span className="font-medium">{allergen}</span>
                            <div className="flex items-center gap-3 flex-1 ml-4">
                              <Progress 
                                value={(count / Math.max(...Object.values(insights.allergenFrequency))) * 100} 
                                className="flex-1"
                              />
                              <Badge variant="outline" className="min-w-12 justify-center">
                                {count}
                              </Badge>
                            </div>
                          </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Severity Distribution */}
              {Object.keys(insights.severityTrends).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Reaction Severity</CardTitle>
                    <CardDescription>
                      Distribution of reaction severity levels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(insights.severityTrends).map(([severity, count]) => (
                        <Badge key={severity} className={getSeverityColor(severity)}>
                          {severity}: {count}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Patterns */}
              {insights.recentPatterns.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Patterns</CardTitle>
                    <CardDescription>
                      Key observations from your data
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {insights.recentPatterns.map((pattern, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-sm">{pattern}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-800">Recommendations</CardTitle>
                  <CardDescription className="text-amber-700">
                    Suggested next steps based on your data
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">📋</span>
                        <span className="text-sm text-amber-800">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}