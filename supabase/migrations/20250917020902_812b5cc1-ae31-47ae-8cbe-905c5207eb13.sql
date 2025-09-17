-- Insert foods data into the foods table
INSERT INTO public.foods (id, name, category, allergens, choking_form_notes, iron_mg_per_100g, tags) VALUES
('peanut_butter', 'Peanut butter', 'protein', ARRAY['peanut'], 'Use a thin smear; never by spoonful for infants.', 1.87, ARRAY['allergen']),
('scrambled_egg', 'Scrambled egg', 'protein', ARRAY['egg'], NULL, 1.75, ARRAY['allergen']),
('salmon', 'Salmon', 'protein', ARRAY['fish'], NULL, 0.80, ARRAY['low-mercury', 'omega-3']),
('honey', 'Honey', 'sweetener', ARRAY[]::text[], NULL, NULL, ARRAY['sweetener', 'botulism-risk']),
('grapes', 'Grapes', 'fruit', ARRAY[]::text[], 'Quarter lengthwise for young children.', NULL, ARRAY['choking-hazard']),
('iron_oat_cereal', 'Iron-fortified oat cereal', 'grain', ARRAY[]::text[], NULL, 45.0, ARRAY['iron-fortified']),
('apple_juice', 'Apple juice', 'drink', ARRAY[]::text[], NULL, NULL, ARRAY['juice', 'added-sugar']),
('avocado', 'Avocado', 'fruit', ARRAY[]::text[], NULL, 0.55, ARRAY['healthy-fat']),
('banana', 'Banana', 'fruit', ARRAY[]::text[], NULL, 0.26, ARRAY[]::text[]),
('sweet_potato', 'Sweet potato', 'vegetable', ARRAY[]::text[], NULL, 0.61, ARRAY['orange-vegetable']),
('broccoli', 'Broccoli', 'vegetable', ARRAY[]::text[], NULL, 0.73, ARRAY['green-vegetable']),
('whole_milk', 'Whole milk', 'dairy', ARRAY['milk'], NULL, NULL, ARRAY['allergen']),
('ground_beef', 'Ground beef', 'protein', ARRAY[]::text[], NULL, 2.30, ARRAY['heme-iron']),
('cheerios', 'Cheerios', 'grain', ARRAY['wheat'], NULL, 18.0, ARRAY['iron-fortified', 'allergen']),
('strawberries', 'Strawberries', 'fruit', ARRAY[]::text[], 'Cut into small pieces for young toddlers.', 0.41, ARRAY[]::text[]);