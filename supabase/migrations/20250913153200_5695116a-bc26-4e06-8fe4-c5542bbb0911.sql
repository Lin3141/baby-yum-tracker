-- Create core tables for Baby Bites app

-- Babies table
CREATE TABLE public.babies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  known_allergies TEXT[] DEFAULT '{}',
  suspected_allergies TEXT[] DEFAULT '{}',
  pediatrician_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Foods library table
CREATE TABLE public.foods (
  id TEXT NOT NULL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  allergens TEXT[] DEFAULT '{}',
  choking_form_notes TEXT,
  iron_mg_per_100g DECIMAL(5,2),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Meals table
CREATE TABLE public.meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  meal_date DATE NOT NULL,
  meal_time TIME NOT NULL,
  meal_type TEXT, -- breakfast, lunch, dinner, snack
  items JSONB NOT NULL DEFAULT '[]', -- [{food_id?, free_text?, portion_tag}]
  reactions TEXT[] DEFAULT '{}', -- none, mild_rash, vomiting, swelling, emergency
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Allergen exposures tracking
CREATE TABLE public.exposures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  baby_id UUID NOT NULL REFERENCES public.babies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  allergen TEXT NOT NULL,
  exposure_date DATE NOT NULL,
  reaction TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Safety rules
CREATE TABLE public.rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_key TEXT NOT NULL UNIQUE,
  short_text TEXT NOT NULL,
  age_min_months INTEGER NOT NULL DEFAULT 0,
  age_max_months INTEGER NOT NULL DEFAULT 24,
  tags TEXT[] DEFAULT '{}',
  publisher TEXT NOT NULL,
  url TEXT NOT NULL,
  published_at DATE NOT NULL,
  last_verified_at DATE NOT NULL,
  direct_quote TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info', -- info, caution, danger
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.babies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exposures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rules ENABLE ROW LEVEL SECURITY;

-- RLS policies for babies
CREATE POLICY "Users can view their own babies" ON public.babies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own babies" ON public.babies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own babies" ON public.babies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own babies" ON public.babies
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for foods (public read access)
CREATE POLICY "Anyone can view foods" ON public.foods
  FOR SELECT USING (true);

-- RLS policies for meals
CREATE POLICY "Users can view their own meals" ON public.meals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own meals" ON public.meals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meals" ON public.meals
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meals" ON public.meals
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for exposures
CREATE POLICY "Users can view their own exposures" ON public.exposures
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exposures" ON public.exposures
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exposures" ON public.exposures
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exposures" ON public.exposures
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for rules (public read access)
CREATE POLICY "Anyone can view rules" ON public.rules
  FOR SELECT USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_babies_updated_at
  BEFORE UPDATE ON public.babies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_foods_updated_at
  BEFORE UPDATE ON public.foods
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_meals_updated_at
  BEFORE UPDATE ON public.meals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exposures_updated_at
  BEFORE UPDATE ON public.exposures
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rules_updated_at
  BEFORE UPDATE ON public.rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();