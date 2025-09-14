import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Plus, Calendar, Clock, FileText, Thermometer } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Baby } from "@/store/useBabyStore";
import type { Tables } from "@/integrations/supabase/types";

const REACTION_TYPES = [
  { id: "skin", name: "Skin Reaction", icon: "🔴", symptoms: ["Hives", "Rash", "Eczema flare", "Itching", "Swelling"] },
  { id: "digestive", name: "Digestive", icon: "🤢", symptoms: ["Nausea", "Vomiting", "Diarrhea", "Stomach pain", "Gas/Bloating"] },
  { id: "respiratory", name: "Respiratory", icon: "🫁", symptoms: ["Wheezing", "Coughing", "Runny nose", "Sneezing", "Difficulty breathing"] },
  { id: "severe", name: "Severe/Anaphylaxis", icon: "🚨", symptoms: ["Difficulty breathing", "Swelling of face/throat", "Rapid pulse", "Dizziness", "Loss of consciousness"] },
];

const SEVERITY_LEVELS = [
  { id: "mild", name: "Mild", color: "bg-green-100 text-green-800", description: "Minor discomfort" },
  { id: "moderate", name: "Moderate", color: "bg-yellow-100 text-yellow-800", description: "Noticeable symptoms" },
  { id: "severe", name: "Severe", color: "bg-orange-100 text-orange-800", description: "Significant distress" },
  { id: "emergency", name: "Emergency", color: "bg-red-100 text-red-800", description: "Medical attention needed" },
];

interface ReactionLogProps {
  baby: Baby;
}

type Exposure = Tables<'exposures'>;

export function ReactionLog({ baby }: ReactionLogProps) {
  const [reactions, setReactions] = useState<Exposure[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Form state
  const [formData, setFormData] = useState({
    allergen: "",
    exposure_date: format(new Date(), 'yyyy-MM-dd'),
    reaction_type: "",
    severity: "",
    symptoms: [] as string[],
    onset_time: "",
    duration: "",
    treatment: "",
    notes: "",
  });

  useEffect(() => {
    fetchReactions();
  }, [baby.id]);

  const fetchReactions = async () => {
    try {
      const { data, error } = await supabase
        .from('exposures')
        .select('*')
        .eq('baby_id', baby.id)
        .order('exposure_date', { ascending: false });

      if (error) throw error;
      setReactions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch reaction history.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const reactionData = {
        allergen: formData.allergen,
        exposure_date: formData.exposure_date,
        reaction: JSON.stringify({
          type: formData.reaction_type,
          severity: formData.severity,
          symptoms: formData.symptoms,
          onset_time: formData.onset_time,
          duration: formData.duration,
          treatment: formData.treatment,
        }),
        notes: formData.notes,
        baby_id: baby.id,
        user_id: user.id,
      };

      const { data, error } = await supabase
        .from('exposures')
        .insert([reactionData])
        .select()
        .single();

      if (error) throw error;

      setReactions([data, ...reactions]);
      setIsDialogOpen(false);
      resetForm();
      
      toast({
        title: "Reaction logged",
        description: "Reaction has been recorded successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log reaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      allergen: "",
      exposure_date: format(new Date(), 'yyyy-MM-dd'),
      reaction_type: "",
      severity: "",
      symptoms: [],
      onset_time: "",
      duration: "",
      treatment: "",
      notes: "",
    });
  };

  const parseReaction = (reactionStr: string) => {
    try {
      return JSON.parse(reactionStr);
    } catch {
      return { type: "", severity: "", symptoms: [], onset_time: "", duration: "", treatment: "" };
    }
  };

  const getSeverityBadge = (severity: string) => {
    const level = SEVERITY_LEVELS.find(s => s.id === severity);
    return level ? (
      <Badge className={level.color}>
        {level.name}
      </Badge>
    ) : null;
  };

  const getReactionTypeIcon = (type: string) => {
    const reactionType = REACTION_TYPES.find(r => r.id === type);
    return reactionType?.icon || "⚠️";
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reaction history...</p>
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
                <FileText className="h-5 w-5 text-primary" />
                Reaction History for {baby.name}
              </CardTitle>
              <CardDescription>
                Track allergic reactions, symptoms, and treatments
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Log Reaction
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Log New Reaction</DialogTitle>
                  <DialogDescription>
                    Record details about an allergic reaction or food sensitivity
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="allergen">Allergen/Food</Label>
                      <Input
                        id="allergen"
                        value={formData.allergen}
                        onChange={(e) => setFormData({...formData, allergen: e.target.value})}
                        placeholder="e.g., Peanuts, Milk, Eggs"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="exposure_date">Date of Exposure</Label>
                      <Input
                        id="exposure_date"
                        type="date"
                        value={formData.exposure_date}
                        onChange={(e) => setFormData({...formData, exposure_date: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="reaction_type">Reaction Type</Label>
                      <Select value={formData.reaction_type} onValueChange={(value) => setFormData({...formData, reaction_type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reaction type" />
                        </SelectTrigger>
                        <SelectContent>
                          {REACTION_TYPES.map((type) => (
                            <SelectItem key={type.id} value={type.id}>
                              <span className="flex items-center gap-2">
                                <span>{type.icon}</span>
                                {type.name}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="severity">Severity Level</Label>
                      <Select value={formData.severity} onValueChange={(value) => setFormData({...formData, severity: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          {SEVERITY_LEVELS.map((level) => (
                            <SelectItem key={level.id} value={level.id}>
                              {level.name} - {level.description}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="onset_time">Onset Time</Label>
                      <Input
                        id="onset_time"
                        value={formData.onset_time}
                        onChange={(e) => setFormData({...formData, onset_time: e.target.value})}
                        placeholder="e.g., Within 5 minutes, 30 minutes later"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        placeholder="e.g., 2 hours, All day"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="treatment">Treatment Given</Label>
                    <Input
                      id="treatment"
                      value={formData.treatment}
                      onChange={(e) => setFormData({...formData, treatment: e.target.value})}
                      placeholder="e.g., Antihistamine, EpiPen, Hospital visit"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Describe symptoms, context, or other observations..."
                      rows={3}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      Log Reaction
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {reactions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Reactions Recorded</h3>
              <p className="text-muted-foreground mb-4">
                Start logging reactions to track patterns and share with healthcare providers
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Log First Reaction
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reactions.map((reaction) => {
                const parsedReaction = parseReaction(reaction.reaction || '{}');
                return (
                  <Card key={reaction.id} className="border-l-4 border-l-orange-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">
                            {getReactionTypeIcon(parsedReaction.type)}
                          </span>
                          <div>
                            <h3 className="font-semibold text-lg">{reaction.allergen}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {format(new Date(reaction.exposure_date), 'MMM dd, yyyy')}
                              {parsedReaction.onset_time && (
                                <>
                                  <Clock className="h-4 w-4 ml-2" />
                                  {parsedReaction.onset_time}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {parsedReaction.severity && getSeverityBadge(parsedReaction.severity)}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {parsedReaction.symptoms?.length > 0 && (
                          <div>
                            <Label className="text-sm font-semibold">Symptoms</Label>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {parsedReaction.symptoms.map((symptom: string, index: number) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {symptom}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {parsedReaction.treatment && (
                          <div>
                            <Label className="text-sm font-semibold">Treatment</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {parsedReaction.treatment}
                            </p>
                          </div>
                        )}

                        {parsedReaction.duration && (
                          <div>
                            <Label className="text-sm font-semibold">Duration</Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {parsedReaction.duration}
                            </p>
                          </div>
                        )}
                      </div>

                      {reaction.notes && (
                        <div className="mt-3">
                          <Label className="text-sm font-semibold">Notes</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {reaction.notes}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}