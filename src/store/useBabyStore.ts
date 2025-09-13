import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Baby = Tables<'babies'>;
export type Food = Tables<'foods'>;
export type SafetyRule = Tables<'rules'>;

export interface Meal extends Omit<Tables<'meals'>, 'items'> {
  items: Array<{
    food_id?: string;
    free_text?: string;
    portion_tag: string;
  }>;
}

interface BabyStore {
  // State
  babies: Baby[];
  foods: Food[];
  meals: Meal[];
  rules: SafetyRule[];
  selectedBaby: Baby | null;
  loading: boolean;
  error: string | null;

  // Actions
  fetchBabies: () => Promise<void>;
  fetchFoods: () => Promise<void>;
  fetchMeals: (babyId?: string) => Promise<void>;
  fetchRules: () => Promise<void>;
  
  addBaby: (baby: Omit<Baby, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Baby>;
  updateBaby: (id: string, updates: Partial<Baby>) => Promise<void>;
  deleteBaby: (id: string) => Promise<void>;
  
  addMeal: (meal: Omit<Meal, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<Meal>;
  updateMeal: (id: string, updates: Partial<Meal>) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  
  setSelectedBaby: (baby: Baby | null) => void;
  setError: (error: string | null) => void;
  
  // Safety engine
  checkSafetyRules: (babyId: string, items: Meal['items']) => SafetyRule[];
}

export const useBabyStore = create<BabyStore>((set, get) => ({
  // Initial state
  babies: [],
  foods: [],
  meals: [],
  rules: [],
  selectedBaby: null,
  loading: false,
  error: null,

  // Actions
  fetchBabies: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('babies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ babies: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchFoods: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('foods')
        .select('*')
        .order('name');

      if (error) throw error;
      set({ foods: data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchMeals: async (babyId?: string) => {
    set({ loading: true, error: null });
    try {
      let query = supabase
        .from('meals')
        .select('*')
        .order('meal_date', { ascending: false })
        .order('meal_time', { ascending: false });

      if (babyId) {
        query = query.eq('baby_id', babyId);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Transform the data to match our Meal interface
      const transformedData: Meal[] = data.map(meal => ({
        ...meal,
        items: Array.isArray(meal.items) ? meal.items as Meal['items'] : []
      }));
      
      set({ meals: transformedData, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  fetchRules: async () => {
    try {
      const { data, error } = await supabase
        .from('rules')
        .select('*');

      if (error) throw error;
      set({ rules: data as SafetyRule[] });
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  addBaby: async (babyData) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const insertData: TablesInsert<'babies'> = {
        ...babyData,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('babies')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      
      const { babies } = get();
      set({ babies: [data, ...babies], loading: false });
      return data;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateBaby: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('babies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const { babies } = get();
      set({ 
        babies: babies.map(baby => baby.id === id ? data : baby),
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteBaby: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('babies')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      const { babies } = get();
      set({ 
        babies: babies.filter(baby => baby.id !== id),
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  addMeal: async (mealData) => {
    set({ loading: true, error: null });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const insertData = {
        ...mealData,
        user_id: user.id,
        items: mealData.items as any // Cast to satisfy JSONB type
      };

      const { data, error } = await supabase
        .from('meals')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;
      
      // Transform the response
      const transformedMeal: Meal = {
        ...data,
        items: Array.isArray(data.items) ? data.items as Meal['items'] : []
      };
      
      const { meals } = get();
      set({ meals: [transformedMeal, ...meals], loading: false });
      return transformedMeal;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  updateMeal: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const updateData = {
        ...updates,
        items: updates.items ? updates.items as any : undefined
      };

      const { data, error } = await supabase
        .from('meals')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const transformedMeal: Meal = {
        ...data,
        items: Array.isArray(data.items) ? data.items as Meal['items'] : []
      };
      
      const { meals } = get();
      set({ 
        meals: meals.map(meal => meal.id === id ? transformedMeal : meal),
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteMeal: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      const { meals } = get();
      set({ 
        meals: meals.filter(meal => meal.id !== id),
        loading: false 
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  setSelectedBaby: (baby) => set({ selectedBaby: baby }),
  setError: (error) => set({ error }),

  // Safety rules engine
  checkSafetyRules: (babyId, items) => {
    const { babies, rules, foods } = get();
    const baby = babies.find(b => b.id === babyId);
    if (!baby) return [];

    // Calculate baby's age in months
    const birthDate = new Date(baby.date_of_birth);
    const now = new Date();
    const ageInMonths = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));

    const triggeredRules: SafetyRule[] = [];

    // Check each meal item against rules
    items.forEach(item => {
      let food: Food | undefined;
      
      if (item.food_id) {
        food = foods.find(f => f.id === item.food_id);
      } else if (item.free_text) {
        // Simple fuzzy matching for free text
        const searchText = item.free_text.toLowerCase();
        food = foods.find(f => 
          f.name.toLowerCase().includes(searchText) ||
          searchText.includes(f.name.toLowerCase())
        );
      }

      if (food) {
        // Check rules for this food
        rules.forEach(rule => {
          if (ageInMonths >= rule.age_min_months && ageInMonths <= rule.age_max_months) {
            const shouldTrigger = rule.tags.some(tag => {
              const lowerTag = tag.toLowerCase();
              const foodName = food!.name.toLowerCase();
              const foodTags = food!.tags.map(t => t.toLowerCase());
              
              return foodName.includes(lowerTag) || 
                     foodTags.includes(lowerTag) ||
                     food!.allergens.some(allergen => allergen.toLowerCase().includes(lowerTag));
            });

            if (shouldTrigger && !triggeredRules.find(r => r.rule_key === rule.rule_key)) {
              triggeredRules.push(rule);
            }
          }
        });
      }
    });

    return triggeredRules.sort((a, b) => {
      const severityOrder = { danger: 3, caution: 2, info: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }
}));