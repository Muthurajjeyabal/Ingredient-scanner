import { useState, useMemo, useEffect } from "react";
import { Search, Leaf, FlaskConical, Flame, AlertTriangle, ChevronLeft, ScanLine, Info, Camera, Loader2, X, Image as ImageIcon, Sparkles, Share2, Download, Globe } from "lucide-react";
import { LANGUAGES, T } from "./i18n.js";

// ---------- Design tokens ----------
const BG = "#0C1210";
const SURFACE = "#161D19";
const SURFACE_2 = "#1E2621";
const BORDER = "#2A342D";
const LIME = "#C6FF4D";
const CORAL = "#FF6152";
const AMBER = "#FFB648";
const TEXT = "#F3F6F1";
const MUTED = "#8B9A8E";

const DB = [
  { id: "parle-g", name: "Parle-G Original Glucose Biscuits", brand: "Parle Products", category: "food",
    ingredients: "Wheat flour, sugar, edible vegetable oil (palm oil), invert syrup, leavening agents (E500(ii), E503(ii)), salt, milk solids, emulsifiers (E322, E471), and artificial flavouring (vanilla).",
    chemicals: ["E500(ii) - Sodium bicarbonate", "E503(ii) - Ammonium bicarbonate", "E322 - Lecithin", "E471 - Mono/diglycerides"],
    allergens: ["Wheat (gluten)", "Milk", "May contain traces of soy and nuts"],
    nutrition: { calories_kcal_per_100g: 462, protein_g: 7.3, fat_g: 14.6, sugar_g: 24, carbs_g: 76.5, salt_g: 0.6 } },
  { id: "britannia-good-day", name: "Britannia Good Day Cashew Cookies", brand: "Britannia", category: "food",
    ingredients: "Refined wheat flour, sugar, edible vegetable oil (palm oil), cashew nuts (7%), invert syrup, milk solids, leavening agents (E503(ii), E500(ii)), salt, emulsifier (E322 soy lecithin), artificial flavour.",
    chemicals: ["E503(ii) - Ammonium bicarbonate", "E500(ii) - Sodium bicarbonate", "E322 - Soy lecithin"],
    allergens: ["Wheat (gluten)", "Milk", "Cashew nut", "Soy"],
    nutrition: { calories_kcal_per_100g: 495, protein_g: 7.1, fat_g: 24.4, sugar_g: 23.5, carbs_g: 62, salt_g: 0.5 } },
  { id: "maggi", name: "Maggi 2-Minute Masala Noodles", brand: "Nestlé", category: "food",
    ingredients: "Noodles: wheat flour, palm oil, salt, wheat gluten, mineral (calcium carbonate), thickener (E508), acidity regulators (E501(i), E500(i)). Tastemaker: iodised salt, sugar, hydrolysed groundnut protein, spices, onion powder, dried garlic, dried coriander, wheat flour, mineral (E508), acidity regulator (E330), flavour enhancer (E635, E627), colour (E150d), dried yeast.",
    chemicals: ["E508 - Potassium chloride", "E501(i) - Potassium carbonate", "E330 - Citric acid", "E635/E627 - Flavour enhancers", "E150d - Caramel colour"],
    allergens: ["Wheat (gluten)", "Groundnut/peanut", "May contain milk and soy"],
    nutrition: { calories_kcal_per_100g: 454, protein_g: 9.6, fat_g: 17.4, sugar_g: 3.6, carbs_g: 64.2, salt_g: 3.2 } },
  { id: "lays-classic", name: "Lay's Classic Salted Chips", brand: "PepsiCo", category: "food",
    ingredients: "Potatoes, edible vegetable oil (palm olein/rice bran/sunflower), iodised salt.",
    chemicals: [], allergens: ["None declared — may contain traces of milk in shared facility"],
    nutrition: { calories_kcal_per_100g: 536, protein_g: 6.8, fat_g: 33, sugar_g: 0.6, carbs_g: 53, salt_g: 1.6 } },
  { id: "amul-butter", name: "Amul Pasteurised Butter", brand: "Amul", category: "food",
    ingredients: "Milk fat (pasteurised cream), salt, permitted natural colour (E160b annatto).",
    chemicals: ["E160b - Annatto (natural colour)"], allergens: ["Milk"],
    nutrition: { calories_kcal_per_100g: 745, protein_g: 0.5, fat_g: 82, sugar_g: 0.5, carbs_g: 1.3, salt_g: 1.5 } },
  { id: "colgate-maxfresh", name: "Colgate MaxFresh Toothpaste", brand: "Colgate-Palmolive", category: "cosmetic",
    ingredients: "Sorbitol, hydrated silica, aqua, PEG-12, sodium lauryl sulfate, aroma/flavour, cellulose gum, sodium hydroxide, sodium saccharin, titanium dioxide (CI 77891), sodium fluoride (0.32% w/v, 1450 ppm fluoride), carrageenan, mica, limonene, CI 74160, CI 42090, eucalyptol, menthol.",
    chemicals: ["Sodium lauryl sulfate (SLS)", "Sodium fluoride", "Titanium dioxide", "Synthetic colours CI 74160 / CI 42090"],
    allergens: ["Menthol/limonene (fragrance allergens)"], nutrition: null },
  { id: "colgate-total", name: "Colgate Total Toothpaste", brand: "Colgate-Palmolive", category: "cosmetic",
    ingredients: "Sorbitol, hydrated silica, aqua, PVM/MA copolymer, sodium lauryl sulfate, flavour, cellulose gum, sodium hydroxide, sodium saccharin, sodium fluoride (0.32% w/v), carrageenan, titanium dioxide, propylene glycol, mica, CI 77891.",
    chemicals: ["Sodium lauryl sulfate (SLS)", "Sodium fluoride", "Titanium dioxide", "Propylene glycol"],
    allergens: ["Fragrance compounds"], nutrition: null },
  { id: "dove-soap", name: "Dove Cream Beauty Bar", brand: "Unilever", category: "cosmetic",
    ingredients: "Sodium lauroyl isethionate, stearic acid, sodium tallowate/sodium palmate, lauric acid, sodium isethionate, water, sodium stearate, cocamidopropyl betaine, fragrance, sodium chloride, tetrasodium EDTA, tetrasodium etidronate, titanium dioxide (CI 77891), BHT.",
    chemicals: ["Sodium lauroyl isethionate", "Tetrasodium EDTA", "BHT", "Titanium dioxide"],
    allergens: ["Fragrance (parfum)"], nutrition: null },
  { id: "lifebuoy-soap", name: "Lifebuoy Total 10 Soap", brand: "Unilever", category: "cosmetic",
    ingredients: "Sodium palmate/sodium palm kernelate, water, glycerin, sodium chloride, sodium silicate, fragrance, titanium dioxide, tetrasodium EDTA, sodium isopropyl amido dipropyl citrate, chlorhexidine gluconate, red 4 (CI 14700), etidronic acid.",
    chemicals: ["Chlorhexidine gluconate", "Tetrasodium EDTA", "Titanium dioxide", "CI 14700"],
    allergens: ["Fragrance (parfum)"], nutrition: null },
  { id: "himalaya-facewash", name: "Himalaya Purifying Neem Face Wash", brand: "Himalaya Wellness", category: "cosmetic",
    ingredients: "Aqua, sodium lauroyl sarcosinate, cocamidopropyl betaine, neem (Azadirachta indica) extract, turmeric (Curcuma longa) extract, glycerin, sodium chloride, citric acid, methylparaben, propylparaben, fragrance.",
    chemicals: ["Methylparaben / propylparaben", "Sodium lauroyl sarcosinate"],
    allergens: ["Fragrance (parfum)", "Neem extract"], nutrition: null },
  { id: "britannia-marie-gold", name: "Britannia Marie Gold Biscuits", brand: "Britannia", category: "food",
    ingredients: "Wheat flour, sugar, edible vegetable oil (palm oil), invert syrup, raising agents (E500(ii), E503(ii)), iodised salt, emulsifier (E322 soy lecithin), dextrose, artificial flavour.",
    chemicals: ["E500(ii) - Sodium bicarbonate", "E503(ii) - Ammonium bicarbonate", "E322 - Soy lecithin"],
    allergens: ["Wheat (gluten)", "Soy", "May contain milk"],
    nutrition: { calories_kcal_per_100g: 435, protein_g: 7.3, fat_g: 11.6, sugar_g: 18.9, carbs_g: 75.4, salt_g: 0.7 } },
  { id: "kurkure", name: "Kurkure Masala Munch", brand: "PepsiCo", category: "food",
    ingredients: "Rice meal, corn meal, gram meal, edible vegetable oil (palm), seasoning (spices, salt, sugar, acidity regulators E330/E296, flavour enhancers E627/E631, colour E160c), gram flour.",
    chemicals: ["E330 - Citric acid", "E296 - Malic acid", "E627/E631 - Flavour enhancers", "E160c - Paprika oleoresin colour"],
    allergens: ["May contain traces of milk and wheat"],
    nutrition: { calories_kcal_per_100g: 508, protein_g: 6.5, fat_g: 27, sugar_g: 3.5, carbs_g: 59, salt_g: 2.1 } },
  { id: "amul-milk", name: "Amul Taaza Toned Milk", brand: "Amul", category: "food",
    ingredients: "Toned milk (standardised to 3% fat, 8.5% SNF), vitamin A and D (fortified).",
    chemicals: [], allergens: ["Milk"],
    nutrition: { calories_kcal_per_100g: 58, protein_g: 3.3, fat_g: 3, sugar_g: 4.7, carbs_g: 4.7, salt_g: 0.1 } },
  { id: "patanjali-toothpaste", name: "Patanjali Dant Kanti Toothpaste", brand: "Patanjali Ayurved", category: "cosmetic",
    ingredients: "Calcium carbonate, water, glycerin, sorbitol, babool (Acacia), pudina (mint) extract, clove oil, neem extract, sodium lauryl sulfate, sodium saccharin, cellulose gum, flavour.",
    chemicals: ["Sodium lauryl sulfate (SLS)", "Sodium saccharin"],
    allergens: ["Clove oil / mint fragrance"], nutrition: null },
  { id: "haldirams-bhujia", name: "Haldiram's Aloo Bhujia", brand: "Haldiram's", category: "food",
    ingredients: "Gram flour (besan), potato, edible vegetable oil (palm oil), spices, iodised salt, acidity regulator (E330), antioxidant (E319).",
    chemicals: ["E330 - Citric acid", "E319 - TBHQ (antioxidant)"],
    allergens: ["May contain traces of milk, nuts, and wheat"],
    nutrition: { calories_kcal_per_100g: 545, protein_g: 12, fat_g: 36, sugar_g: 2, carbs_g: 45, salt_g: 2.3 } },
  { id: "sunfeast-dark-fantasy", name: "Sunfeast Dark Fantasy Choco Fills", brand: "ITC", category: "food",
    ingredients: "Refined wheat flour, sugar, chocolate cream filling (25%), edible vegetable oil (palm oil), cocoa solids, invert syrup, raising agents (E500(ii), E503(ii)), emulsifiers (E322, E471), salt, artificial flavour.",
    chemicals: ["E500(ii) - Sodium bicarbonate", "E503(ii) - Ammonium bicarbonate", "E322 - Lecithin", "E471 - Mono/diglycerides"],
    allergens: ["Wheat (gluten)", "Milk", "Soy"],
    nutrition: { calories_kcal_per_100g: 490, protein_g: 6.5, fat_g: 22, sugar_g: 32, carbs_g: 66, salt_g: 0.4 } },
  { id: "bingo-mad-angles", name: "Bingo! Mad Angles", brand: "ITC", category: "food",
    ingredients: "Potato, corn starch, edible vegetable oil (palm oil), seasoning (spices, sugar, salt, acidity regulators E330/E296, flavour enhancers E627/E631, colour E160c).",
    chemicals: ["E330 - Citric acid", "E627/E631 - Flavour enhancers", "E160c - Paprika oleoresin colour"],
    allergens: ["May contain traces of milk and wheat"],
    nutrition: { calories_kcal_per_100g: 520, protein_g: 6, fat_g: 30, sugar_g: 3, carbs_g: 58, salt_g: 2 } },
  { id: "tata-salt", name: "Tata Salt (Iodised)", brand: "Tata Consumer Products", category: "food",
    ingredients: "Iodised salt, anti-caking agent (E536 potassium ferrocyanide).",
    chemicals: ["E536 - Potassium ferrocyanide (anti-caking agent)"],
    allergens: [],
    nutrition: { calories_kcal_per_100g: 0, protein_g: 0, fat_g: 0, sugar_g: 0, carbs_g: 0, salt_g: 97 } },
  { id: "fortune-sunflower-oil", name: "Fortune Sunlite Refined Sunflower Oil", brand: "Adani Wilmar", category: "food",
    ingredients: "Refined sunflower oil, anti-foaming agent (E900 dimethylpolysiloxane), fortified with vitamins A and D.",
    chemicals: ["E900 - Dimethylpolysiloxane (anti-foaming agent)"],
    allergens: [],
    nutrition: { calories_kcal_per_100g: 900, protein_g: 0, fat_g: 100, sugar_g: 0, carbs_g: 0, salt_g: 0 } },
  { id: "cadbury-dairy-milk", name: "Cadbury Dairy Milk Chocolate", brand: "Mondelez", category: "food",
    ingredients: "Sugar, cocoa butter, milk solids, cocoa mass, emulsifiers (E442, E476), flavour (natural vanilla extract).",
    chemicals: ["E442 - Ammonium phosphatide", "E476 - PGPR (emulsifier)"],
    allergens: ["Milk", "May contain nuts, wheat, soy"],
    nutrition: { calories_kcal_per_100g: 534, protein_g: 7.1, fat_g: 30, sugar_g: 56, carbs_g: 58, salt_g: 0.2 } },
  { id: "bournvita", name: "Cadbury Bournvita Health Drink", brand: "Mondelez", category: "food",
    ingredients: "Sugar, liquid glucose, malt extract, cocoa solids, milk solids, minerals, vitamins, emulsifier (E322 soy lecithin), flavour.",
    chemicals: ["E322 - Soy lecithin"],
    allergens: ["Milk", "Soy", "May contain nuts"],
    nutrition: { calories_kcal_per_100g: 384, protein_g: 6.9, fat_g: 2.1, sugar_g: 60, carbs_g: 81, salt_g: 0.4 } },
  { id: "nescafe-classic", name: "Nescafé Classic Instant Coffee", brand: "Nestlé", category: "food",
    ingredients: "100% pure instant coffee.",
    chemicals: [],
    allergens: [],
    nutrition: { calories_kcal_per_100g: 96, protein_g: 12.3, fat_g: 0.3, sugar_g: 0, carbs_g: 8.6, salt_g: 0.1 } },
  { id: "frooti", name: "Frooti Mango Drink", brand: "Parle Agro", category: "food",
    ingredients: "Water, sugar, mango pulp (14.4%), acidity regulator (E330), stabilisers (E440, E466), antioxidant (E300), colour (E160a), flavour.",
    chemicals: ["E330 - Citric acid", "E440 - Pectin", "E466 - CMC (stabiliser)", "E300 - Ascorbic acid", "E160a - Beta-carotene colour"],
    allergens: [],
    nutrition: { calories_kcal_per_100g: 54, protein_g: 0, fat_g: 0, sugar_g: 13, carbs_g: 13, salt_g: 0 } },
  { id: "thums-up", name: "Thums Up Cola", brand: "Coca-Cola India", category: "food",
    ingredients: "Carbonated water, sugar, caramel colour (E150d), acidity regulator (E338 phosphoric acid), caffeine, flavours.",
    chemicals: ["E150d - Caramel colour", "E338 - Phosphoric acid", "Caffeine"],
    allergens: [],
    nutrition: { calories_kcal_per_100g: 44, protein_g: 0, fat_g: 0, sugar_g: 11, carbs_g: 11, salt_g: 0 } },
  { id: "nivea-cream", name: "Nivea Soft Light Moisturiser", brand: "Beiersdorf", category: "cosmetic",
    ingredients: "Aqua, glycerin, paraffinum liquidum, dicaprylyl carbonate, cetearyl alcohol, glyceryl stearate citrate, alcohol denat., butylene glycol, dimethicone, jojoba oil, vitamin E acetate, fragrance, carbomer, sodium hydroxide, disodium EDTA.",
    chemicals: ["Dimethicone - silicone emollient", "Disodium EDTA - preservative/chelator", "Paraffinum liquidum - mineral oil"],
    allergens: ["Fragrance (parfum)"], nutrition: null },
  { id: "fair-and-lovely", name: "Glow & Lovely Cream", brand: "Unilever", category: "cosmetic",
    ingredients: "Water, niacinamide, glycerin, mineral oil, stearic acid, glyceryl stearate, titanium dioxide (CI 77891), allantoin, sodium PCA, fragrance, tocopheryl acetate (vitamin E), phenoxyethanol.",
    chemicals: ["Phenoxyethanol - preservative", "Titanium dioxide", "Niacinamide - vitamin B3"],
    allergens: ["Fragrance (parfum)"], nutrition: null },
  { id: "pears-soap", name: "Pears Transparent Soap", brand: "Unilever", category: "cosmetic",
    ingredients: "Sodium tallowate/sodium cocoate, water, glycerin, rosin, castor oil, sodium chloride, fragrance, citric acid, tetrasodium EDTA, CI 47005 (colour), BHT.",
    chemicals: ["Tetrasodium EDTA", "BHT - preservative", "CI 47005 - colour"],
    allergens: ["Fragrance (parfum)"], nutrition: null },
  { id: "santoor-soap", name: "Santoor Sandal & Turmeric Soap", brand: "Wipro", category: "cosmetic",
    ingredients: "Sodium palmate/sodium palm kernelate, water, glycerin, sandalwood oil, turmeric extract, fragrance, sodium chloride, titanium dioxide, tetrasodium EDTA, BHT.",
    chemicals: ["Tetrasodium EDTA", "BHT - preservative", "Titanium dioxide"],
    allergens: ["Fragrance (parfum)"], nutrition: null },
  { id: "head-shoulders", name: "Head & Shoulders Anti-Dandruff Shampoo", brand: "P&G", category: "cosmetic",
    ingredients: "Water, sodium lauryl sulfate, sodium laureth sulfate, zinc pyrithione (1%, active anti-dandruff), dimethicone, glycol distearate, sodium chloride, sodium benzoate, fragrance, citric acid.",
    chemicals: ["Zinc pyrithione - anti-dandruff active", "Sodium lauryl/laureth sulfate - foaming agents", "Sodium benzoate - preservative"],
    allergens: ["Fragrance (parfum)"], nutrition: null },
  { id: "fogg-deodorant", name: "Fogg Fresh Deodorant Body Spray", brand: "Vini Cosmetics", category: "cosmetic",
    ingredients: "Perfume compound in a base of alcohol-free propellants (butane, propane, isobutane), fragrance.",
    chemicals: ["Butane/propane/isobutane - propellants"],
    allergens: ["Fragrance (parfum)"], nutrition: null },
  { id: "dettol-handwash", name: "Dettol Original Liquid Handwash", brand: "Reckitt", category: "cosmetic",
    ingredients: "Aqua, sodium laureth sulfate, cocamidopropyl betaine, chloroxylenol (0.3%, antibacterial), sodium chloride, PEG-7 glyceryl cocoate, fragrance, citric acid, sodium benzoate, CI 14700 (colour).",
    chemicals: ["Chloroxylenol - antibacterial agent", "Sodium benzoate - preservative", "CI 14700 - synthetic red colour"],
    allergens: ["Fragrance (parfum)"], nutrition: null },

  { id: "sunfeast-yippee", name: "Sunfeast Yippee! Magic Masala Noodles", brand: "ITC", category: "food",
    ingredients: "Wheat flour, edible vegetable oil (palm oil), salt, wheat gluten, thickener (E508), acidity regulators (E501(i), E500(i)). Masala: iodised salt, sugar, spices, onion powder, garlic powder, flavour enhancers (E627, E631), acidity regulator (E330), colour (E160c), dried coriander.",
    chemicals: ["E508 - Potassium chloride", "E627/E631 - Flavour enhancers", "E330 - Citric acid", "E160c - Paprika oleoresin colour"],
    allergens: ["Wheat (gluten)", "May contain milk and soy"],
    nutrition: { calories_kcal_per_100g: 441, protein_g: 8.8, fat_g: 16.9, sugar_g: 4.2, carbs_g: 63.5, salt_g: 2.9 } },
  { id: "act-ii-popcorn", name: "Act II Butter Popcorn", brand: "Agro Tech Foods", category: "food",
    ingredients: "Popcorn kernels, edible vegetable oil (palm oil), salt, artificial butter flavour, colour (E160b annatto), diacetyl-free flavouring.",
    chemicals: ["E160b - Annatto (natural colour)"],
    allergens: ["May contain traces of milk"],
    nutrition: { calories_kcal_per_100g: 480, protein_g: 8, fat_g: 24, sugar_g: 1, carbs_g: 58, salt_g: 2.5 } },
  { id: "kitkat", name: "Nestlé KitKat", brand: "Nestlé", category: "food",
    ingredients: "Sugar, wheat flour, cocoa butter, milk solids, cocoa mass, vegetable fat, emulsifiers (E442, E476), raising agent (E500), salt, flavour.",
    chemicals: ["E442 - Ammonium phosphatide", "E476 - PGPR (emulsifier)"],
    allergens: ["Wheat (gluten)", "Milk", "May contain nuts, soy"],
    nutrition: { calories_kcal_per_100g: 518, protein_g: 6.3, fat_g: 26.6, sugar_g: 47.5, carbs_g: 59.2, salt_g: 0.15 } },
  { id: "cadbury-5star", name: "Cadbury 5 Star", brand: "Mondelez", category: "food",
    ingredients: "Sugar, glucose syrup, milk solids, cocoa butter, cocoa mass, edible vegetable fat, caramel, emulsifiers (E442, E476), salt, flavour.",
    chemicals: ["E442 - Ammonium phosphatide", "E476 - PGPR (emulsifier)"],
    allergens: ["Milk", "May contain nuts, wheat, soy"],
    nutrition: { calories_kcal_per_100g: 470, protein_g: 4.5, fat_g: 22, sugar_g: 55, carbs_g: 62, salt_g: 0.2 } },
  { id: "britannia-5050", name: "Britannia 50-50 Sweet & Salty", brand: "Britannia", category: "food",
    ingredients: "Refined wheat flour, edible vegetable oil (palm oil), sugar, invert syrup, salt, leavening agents (E500(ii), E503(ii)), emulsifier (E322 soy lecithin), artificial flavour.",
    chemicals: ["E500(ii) - Sodium bicarbonate", "E503(ii) - Ammonium bicarbonate", "E322 - Soy lecithin"],
    allergens: ["Wheat (gluten)", "Soy", "May contain milk"],
    nutrition: { calories_kcal_per_100g: 470, protein_g: 8, fat_g: 16, sugar_g: 14, carbs_g: 71, salt_g: 1.8 } },
  { id: "mother-dairy-paneer", name: "Mother Dairy Paneer", brand: "Mother Dairy", category: "food",
    ingredients: "Milk, citric acid (coagulant).",
    chemicals: [],
    allergens: ["Milk"],
    nutrition: { calories_kcal_per_100g: 265, protein_g: 18.3, fat_g: 20.8, sugar_g: 1.2, carbs_g: 1.2, salt_g: 0.02 } },
  { id: "aashirvaad-atta", name: "Aashirvaad Whole Wheat Atta", brand: "ITC", category: "food",
    ingredients: "100% whole wheat flour.",
    chemicals: [],
    allergens: ["Wheat (gluten)"],
    nutrition: { calories_kcal_per_100g: 341, protein_g: 12, fat_g: 1.7, sugar_g: 0, carbs_g: 69, salt_g: 0 } },
  { id: "everest-garam-masala", name: "Everest Garam Masala", brand: "Everest Spices", category: "food",
    ingredients: "Coriander, cumin, black pepper, cinnamon, cloves, cardamom, bay leaf, nutmeg, mace, dried chilli, salt.",
    chemicals: [],
    allergens: [],
    nutrition: { calories_kcal_per_100g: 330, protein_g: 12, fat_g: 13, sugar_g: 2, carbs_g: 45, salt_g: 4 } },
  { id: "kissan-ketchup", name: "Kissan Fresh Tomato Ketchup", brand: "Unilever", category: "food",
    ingredients: "Tomato paste (46%), sugar, iodised salt, acidity regulator (E260), spices, onion, garlic, preservative (E211 sodium benzoate), stabiliser (E415 xanthan gum).",
    chemicals: ["E211 - Sodium benzoate (preservative)", "E260 - Acetic acid", "E415 - Xanthan gum"],
    allergens: [],
    nutrition: { calories_kcal_per_100g: 120, protein_g: 1.2, fat_g: 0.2, sugar_g: 24, carbs_g: 27, salt_g: 2.1 } },
  { id: "limca", name: "Limca", brand: "Coca-Cola India", category: "food",
    ingredients: "Carbonated water, sugar, acidity regulator (E330 citric acid), preservative (E211 sodium benzoate), flavours.",
    chemicals: ["E330 - Citric acid", "E211 - Sodium benzoate (preservative)"],
    allergens: [],
    nutrition: { calories_kcal_per_100g: 42, protein_g: 0, fat_g: 0, sugar_g: 10.5, carbs_g: 10.5, salt_g: 0 } },

  { id: "vaseline-lotion", name: "Vaseline Intensive Care Lotion", brand: "Unilever", category: "cosmetic",
    ingredients: "Water, glycerin, mineral oil, stearic acid, cetearyl alcohol, dimethicone, petrolatum, fragrance, carbomer, sodium hydroxide, disodium EDTA, methylparaben, propylparaben.",
    chemicals: ["Methylparaben / propylparaben - preservatives", "Disodium EDTA", "Petrolatum/mineral oil"],
    allergens: ["Fragrance (parfum)"], nutrition: null },
  { id: "ponds-cream", name: "Pond's Cold Cream", brand: "Unilever", category: "cosmetic",
    ingredients: "Mineral oil, water, beeswax, ceresin, sodium borate, fragrance, methylparaben, propylparaben.",
    chemicals: ["Methylparaben / propylparaben - preservatives", "Mineral oil"],
    allergens: ["Fragrance (parfum)", "Beeswax"], nutrition: null },
  { id: "garnier-shampoo", name: "Garnier Ultra Blends Shampoo", brand: "L'Oréal", category: "cosmetic",
    ingredients: "Water, sodium laureth sulfate, cocamidopropyl betaine, sodium chloride, glycol distearate, dimethicone, fragrance, citric acid, sodium benzoate, methylchloroisothiazolinone.",
    chemicals: ["Sodium laureth sulfate - foaming agent", "Methylchloroisothiazolinone - preservative (known contact allergen)", "Sodium benzoate"],
    allergens: ["Fragrance (parfum)", "Methylchloroisothiazolinone"], nutrition: null },
  { id: "cinthol-soap", name: "Cinthol Original Soap", brand: "Godrej", category: "cosmetic",
    ingredients: "Sodium palmate/sodium palm kernelate, water, glycerin, fragrance, sodium chloride, titanium dioxide, tetrasodium EDTA, BHT, trisodium etidronate.",
    chemicals: ["Tetrasodium EDTA", "BHT - preservative", "Titanium dioxide"],
    allergens: ["Fragrance (parfum)"], nutrition: null },
  { id: "medimix-soap", name: "Medimix Ayurvedic Soap", brand: "Cholayil", category: "cosmetic",
    ingredients: "Sodium palmate/sodium palate, water, glycerin, Ayurvedic herbal extracts (18 herbs), fragrance, sodium chloride, tetrasodium EDTA, titanium dioxide.",
    chemicals: ["Tetrasodium EDTA", "Titanium dioxide"],
    allergens: ["Fragrance (parfum)"], nutrition: null },
  { id: "parachute-coconut-oil", name: "Parachute Coconut Oil", brand: "Marico", category: "cosmetic",
    ingredients: "100% pure coconut oil.",
    chemicals: [],
    allergens: ["Coconut"], nutrition: null },
  { id: "boroline-cream", name: "Boroline Antiseptic Cream", brand: "GD Pharmaceuticals", category: "cosmetic",
    ingredients: "Boric acid, zinc oxide, lanolin, light liquid paraffin, sandalwood oil, chlorocresol (preservative), perfume.",
    chemicals: ["Boric acid - mild antiseptic", "Chlorocresol - preservative"],
    allergens: ["Fragrance (parfum)", "Lanolin"], nutrition: null },
  { id: "emami-navratna-oil", name: "Navratna Cool Oil", brand: "Emami", category: "cosmetic",
    ingredients: "Light liquid paraffin, coconut oil, sesame oil, extracts of amla, brahmi, henna, mint, camphor, menthol, fragrance.",
    chemicals: ["Camphor", "Menthol"],
    allergens: ["Fragrance (parfum)", "Menthol"], nutrition: null },
  { id: "colgate-vedshakti", name: "Colgate Vedshakti Toothpaste", brand: "Colgate-Palmolive", category: "cosmetic",
    ingredients: "Sorbitol, hydrated silica, water, clove oil, salt, sodium lauryl sulfate, cellulose gum, sodium fluoride (0.32% w/v), flavour, sodium saccharin, herbal extracts.",
    chemicals: ["Sodium lauryl sulfate (SLS)", "Sodium fluoride"],
    allergens: ["Clove oil fragrance"], nutrition: null },
  { id: "bajaj-almond-drops", name: "Bajaj Almond Drops Hair Oil", brand: "Bajaj Consumer Care", category: "cosmetic",
    ingredients: "Light liquid paraffin, almond oil, vitamin E, fragrance.",
    chemicals: [],
    allergens: ["Almond (tree nut)", "Fragrance (parfum)"], nutrition: null },
];

// ---------- Safety heuristic ----------
// Matches against item.ingredients + item.chemicals (chemicals stay English always).
// Returns keys, not display text — components look up the translated note via t.additiveNotes[key].
// AI-scanned results don't always come back in the exact shape we asked for
// (e.g. "chemicals" as a single string instead of an array). Coercing
// defensively here prevents a render crash (blank white screen) when that
// happens — a raw .join()/.map() on a non-array would throw and unmount
// the whole app since there's no error boundary.
function asArray(v) {
  if (Array.isArray(v)) return v;
  if (v == null || v === "") return [];
  return [String(v)];
}
function asText(v) {
  if (v == null) return "";
  return Array.isArray(v) ? v.join(", ") : String(v);
}

// Picks a representative emoji for a key ingredient by simple keyword
// matching — kept client-side (not AI-chosen) so it's fast and consistent.
const INGREDIENT_ICONS = [
  { kw: ["milk", "dairy", "cream", "whey", "curd", "paneer", "cheese"], icon: "🥛" },
  { kw: ["sugar", "glucose", "fructose", "syrup", "honey", "jaggery", "dextrose", "sweeten"], icon: "🍬" },
  { kw: ["starch", "flour", "wheat", "maida", "gram", "besan", "corn meal", "rice"], icon: "🌽" },
  { kw: ["salt", "sodium chloride"], icon: "🧂" },
  { kw: ["oil", "fat", "ghee", "butter", "palm"], icon: "🧈" },
  { kw: ["egg"], icon: "🥚" },
  { kw: ["flavour", "flavor", "essence", "aroma"], icon: "🧪" },
  { kw: ["colour", "color", "carotene", "tartrazine", "annatto"], icon: "🎨" },
  { kw: ["acid", "preservative", "sorbate", "benzoate", "edta", "bht"], icon: "🧫" },
  { kw: ["cocoa", "chocolate"], icon: "🍫" },
  { kw: ["fruit", "mango", "apple", "orange", "berry", "pulp"], icon: "🍓" },
  { kw: ["spice", "pepper", "chilli", "chili", "masala", "herb"], icon: "🌶️" },
  { kw: ["vitamin", "mineral", "calcium", "iron", "fortif"], icon: "💊" },
  { kw: ["water", "aqua"], icon: "💧" },
  { kw: ["fragrance", "perfume", "parfum"], icon: "🌸" },
  { kw: ["surfactant", "sulfate", "betaine", "sarcosinate"], icon: "🫧" },
];
function ingredientIcon(name) {
  const n = (name || "").toLowerCase();
  for (const { kw, icon } of INGREDIENT_ICONS) {
    if (kw.some((k) => n.includes(k))) return icon;
  }
  return "•";
}

// Returns whole days between today and an ISO date string, or null if the
// string isn't a valid, parseable date.
function daysUntil(isoDate) {
  if (!isoDate || typeof isoDate !== "string") return null;
  const target = new Date(isoDate + "T00:00:00");
  if (isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

// ---------- Small UI pieces ----------
function Chip({ children, tone = "line" }) {
  const styles = {
    line: { background: "transparent", border: `1px solid ${BORDER}`, color: TEXT },
    coral: { background: CORAL + "1f", border: `1px solid ${CORAL}55`, color: "#FFD3CC" },
    amber: { background: AMBER + "1f", border: `1px solid ${AMBER}55`, color: "#FFE3B0" },
  }[tone];
  return (
    <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide mr-1.5 mb-1.5" style={styles}>
      {children}
    </span>
  );
}

function Nutrient({ label, value, unit }) {
  if (value === undefined || value === null) return null;
  return (
    <div className="flex items-baseline justify-between py-2.5" style={{ borderBottom: `1px solid ${BORDER}` }}>
      <span className="text-sm" style={{ color: MUTED }}>{label}</span>
      <span className="mono-f text-sm font-semibold" style={{ color: TEXT }}>
        {value}{unit ? <span style={{ color: MUTED }} className="ml-1">{unit}</span> : null}
      </span>
    </div>
  );
}

const FLAGGED_ADDITIVES = [
  { kw: "sodium lauryl sulfate", key: "sls" },
  { kw: "sodium laureth sulfate", key: "sls" },
  { kw: "paraben", key: "parabens" },
  { kw: "tbhq", key: "tbhq" },
  { kw: "e319", key: "tbhq" },
  { kw: "monosodium glutamate", key: "msg" },
  { kw: " msg", key: "msg" },
  { kw: "hydrogenated", key: "transfat" },
  { kw: "phosphoric acid", key: "phosphoric" },
  { kw: "chloroxylenol", key: "chloroxylenol" },
  { kw: "ci 14700", key: "dye" },
  { kw: "ci 15985", key: "dye" },
  { kw: "ci 16035", key: "dye" },
  { kw: "ci 19140", key: "dye" },
  { kw: "ci 42090", key: "dye" },
  { kw: "ci 74160", key: "dye" },
  { kw: "e150d", key: "caramel" },
];

function analyzeSafety(item) {
  const haystack = `${asText(item.ingredients)} ${asArray(item.chemicals).join(" ")}`.toLowerCase();
  const flagKeys = [];
  for (const f of FLAGGED_ADDITIVES) {
    if (haystack.includes(f.kw) && !flagKeys.includes(f.key)) flagKeys.push(f.key);
  }
  const flags = flagKeys.map((key) => ({ type: "additive", key }));
  const n = item.nutrition;
  if (n?.sugar_g != null && n.sugar_g > 22) flags.push({ type: "sugar", value: n.sugar_g });
  if (n?.salt_g != null && n.salt_g > 1.5) flags.push({ type: "salt", value: n.salt_g });
  if (n?.fat_g != null && n.fat_g > 20) flags.push({ type: "fat", value: n.fat_g });
  if (n?.calories_kcal_per_100g != null && n.calories_kcal_per_100g > 400) flags.push({ type: "calorie", value: n.calories_kcal_per_100g });

  let level = "clean";
  if (flags.length >= 3) level = "high";
  else if (flags.length >= 1) level = "moderate";
  return { level, flags };
}

function formatReasons(flags, t) {
  return flags.map((f) => {
    if (f.type === "additive") return t.additiveNotes[f.key] || f.key;
    if (f.type === "sugar") return `${t.highSugar} (${f.value}g/100g)`;
    if (f.type === "salt") return `${t.highSalt} (${f.value}g/100g)`;
    if (f.type === "fat") return `${t.highFat} (${f.value}g/100g)`;
    if (f.type === "calorie") return `${t.highCalorie} (${f.value}kcal/100g)`;
    return "";
  });
}

function levelFromCount(count) {
  if (count >= 3) return "high";
  if (count >= 1) return "moderate";
  return "clean";
}

// Categorizes detected chemicals/ingredient text into simple formulation
// buckets (client-side, no AI) so "why is this processed?" has a concrete answer.
const PROCESSING_CATEGORIES = [
  { key: "catSweetener", kw: ["sugar", "glucose", "fructose", "syrup", "dextrose", "saccharin", "sweetener"] },
  { key: "catPreservative", kw: ["sorbate", "benzoate", "preservative", "tbhq", "bht", " edta"] },
  { key: "catColour", kw: ["colour", "color", "carotene", "tartrazine", "annatto", "ci 1", "ci 4", "ci 7"] },
  { key: "catFlavour", kw: ["flavour", "flavor", "essence", "aroma"] },
  { key: "catThickener", kw: ["starch", "gum", "pectin", "cmc", "stabiliser", "stabilizer", "thickener"] },
  { key: "catEmulsifier", kw: ["lecithin", "emulsifier", "glyceride"] },
  { key: "catAcidRegulator", kw: ["citric acid", "phosphoric acid", "acidity regulator", "malic acid", "acetic acid"] },
];
function classifyProcessing(item) {
  const haystack = `${asArray(item.chemicals).join(" ")} ${asText(item.ingredients)}`.toLowerCase();
  return PROCESSING_CATEGORIES.filter((c) => c.kw.some((k) => haystack.includes(k))).map((c) => c.key);
}

function computeProductInsight(item, t) {
  const { flags } = analyzeSafety(item);
  const chemicals = asArray(item.chemicals);
  const ingredientFlags = flags.filter((f) => f.type === "additive");
  const nutritionFlags = flags.filter((f) => f.type !== "additive");

  const ingredientLevel = levelFromCount(ingredientFlags.length);
  const nutritionLevel = levelFromCount(nutritionFlags.length);
  const order = { clean: 0, moderate: 1, high: 2 };
  const overall = order[ingredientLevel] >= order[nutritionLevel] ? ingredientLevel : nutritionLevel;

  let processing = "procMinimal";
  if (chemicals.length >= 5) processing = "procUltra";
  else if (chemicals.length >= 3) processing = "procHigh";
  else if (chemicals.length >= 1) processing = "procModerate";
  const processingCategories = processing === "procMinimal" ? [] : classifyProcessing(item);

  const carefulKeys = [];
  if (asArray(item.allergens).length > 0) carefulKeys.push("carefulAllergy");
  if (nutritionFlags.some((f) => f.type === "salt")) carefulKeys.push("carefulSodium");
  if (nutritionFlags.some((f) => f.type === "sugar")) carefulKeys.push("carefulSugar");
  if (overall !== "clean") carefulKeys.push("carefulChildren");

  return {
    overall,
    ingredientLevel, ingredientReasons: formatReasons(ingredientFlags, t),
    nutritionLevel, nutritionReasons: formatReasons(nutritionFlags, t),
    processing, processingCategories, carefulKeys,
  };
}

function ProductInsightCard({ item, t, sourceLabel }) {
  const insight = computeProductInsight(item, t);
  const color = { clean: LIME, moderate: AMBER, high: CORAL }[insight.overall];
  const choiceLabel = { clean: t.choiceEveryday, moderate: t.choiceOccasional, high: t.choiceRare }[insight.overall];
  const verdictText = insight.overall === "clean" ? t.verdictEveryday : insight.overall === "moderate" ? t.freqModerate : t.freqHigh;

  const Row = ({ title, level, reasons }) => {
    const dot = { clean: LIME, moderate: AMBER, high: CORAL }[level];
    return (
      <div className="p-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <p className="body-f text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: MUTED }}>{title}</p>
        <div className="flex items-start gap-2">
          <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: dot, boxShadow: `0 0 6px ${dot}` }} />
          {reasons.length === 0 ? (
            <p className="body-f text-sm" style={{ color: TEXT }}>{t.noMajorConcern}</p>
          ) : (
            <div className="flex-1 space-y-1">
              {reasons.map((r, i) => (
                <p key={i} className="body-f text-sm" style={{ color: TEXT }}>{r}</p>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="mb-6 rounded-2xl overflow-hidden" style={{ background: SURFACE_2, border: `1px solid ${BORDER}` }}>
      <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <span className="body-f text-xs font-bold uppercase tracking-widest" style={{ color: MUTED }}>{t.overallChoice}</span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: color + "1a", color }}>
          <span className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
          {choiceLabel}
        </span>
      </div>

      <div className="p-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <p className="body-f text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: MUTED }}>{t.verdict}</p>
        <p className="body-f text-sm" style={{ color: TEXT }}>{verdictText}</p>
      </div>

      <Row title={t.ingredientAssessment} level={insight.ingredientLevel} reasons={insight.ingredientReasons} />
      <Row title={t.nutritionAssessment} level={insight.nutritionLevel} reasons={insight.nutritionReasons} />

      <div className="p-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <p className="body-f text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: MUTED }}>{t.processing}</p>
        <p className="body-f text-sm" style={{ color: TEXT }}>{t[insight.processing]}</p>
        {insight.processingCategories.length > 0 && (
          <p className="body-f text-xs mt-1.5" style={{ color: MUTED }}>
            {t.processedBecause} {insight.processingCategories.map((k) => t[k]).join(", ")}
          </p>
        )}
      </div>

      {insight.carefulKeys.length > 0 && (
        <div className="p-4" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <p className="body-f text-xs font-bold uppercase tracking-widest mb-2" style={{ color: MUTED }}>{t.careful}</p>
          <div className="flex flex-wrap gap-1.5">
            {insight.carefulKeys.map((k) => (
              <span key={k} className="px-2.5 py-1 rounded-full text-[11px] font-medium" style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}>
                {t[k]}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="p-4">
        <p className="body-f text-xs font-bold mb-1" style={{ color: AMBER }}>⚠️ {t.important}</p>
        <p className="body-f text-[11px] leading-relaxed" style={{ color: MUTED }}>{t.assessmentNote}</p>
        {sourceLabel && <p className="body-f text-[11px] mt-1.5" style={{ color: MUTED }}>{t.verifyNote}</p>}
      </div>
    </div>
  );
}


function buildShareText(data, t) {
  const insight = computeProductInsight(data, t);
  const choiceLabel = { clean: t.choiceEveryday, moderate: t.choiceOccasional, high: t.choiceRare }[insight.overall];
  const name = data.name || data.product_name;
  let text = `${name}${data.brand ? ` (${data.brand})` : ""}\n\n${t.overallChoice}: ${choiceLabel}`;
  if (insight.ingredientReasons.length) text += `\n${insight.ingredientReasons.map((r) => `• ${r}`).join("\n")}`;
  if (insight.nutritionReasons.length) text += `\n${insight.nutritionReasons.map((r) => `• ${r}`).join("\n")}`;
  if (data.ingredients) text += `\n\n${t.ingredientsTitle}: ${data.ingredients}`;
  if (data.nutrition?.calories_kcal_per_100g != null) {
    text += `\n\n${t.calories}: ${data.nutrition.calories_kcal_per_100g} kcal/100g`;
  }
  text += `\n\n${t.checkedOn}`;
  return text;
}

async function shareProduct(data, t, setToast) {
  const text = buildShareText(data, t);
  const title = data.name || data.product_name || "Insider";
  try {
    if (navigator.share) {
      await navigator.share({ title, text });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setToast?.(t.copiedClipboard);
    }
  } catch (err) {
    // user cancelled the native share sheet — not an error worth surfacing
    if (err?.name !== "AbortError") {
      try {
        await navigator.clipboard.writeText(text);
        setToast?.(t.copiedClipboard);
      } catch {
        // clipboard unavailable too — silently give up, nothing else we can do
      }
    }
  }
}

function HowItWorks({ onClose, t }) {
  const steps = [
    { icon: Camera, title: t.step1Title, body: t.step1Body },
    { icon: Sparkles, title: t.step2Title, body: t.step2Body },
    { icon: ScanLine, title: t.step3Title, body: t.step3Body },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: "#0C1210CC" }} onClick={onClose}>
      <div
        className="w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-fade-in"
        style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="display text-xl" style={{ color: TEXT }}>{t.howTitle}</h3>
          <button onClick={onClose} className="tap-scale w-8 h-8 rounded-full flex items-center justify-center" style={{ background: SURFACE_2 }}>
            <X size={14} color={MUTED} />
          </button>
        </div>
        <div className="space-y-5">
          {steps.map((s, i) => (
            <div key={i} className="flex gap-3.5">
              <div className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center relative" style={{ background: LIME + "18" }}>
                <s.icon size={16} color={LIME} />
                <span
                  className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full flex items-center justify-center mono-f text-[9px] font-bold"
                  style={{ background: LIME, color: "#0C1210" }}
                >
                  {i + 1}
                </span>
              </div>
              <div>
                <p className="body-f text-sm font-semibold" style={{ color: TEXT }}>{s.title}</p>
                <p className="body-f text-xs mt-1 leading-relaxed" style={{ color: MUTED }}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="body-f text-[11px] mt-6 pt-5" style={{ color: MUTED, borderTop: `1px solid ${BORDER}` }}>
          {t.howDisclaimer}
        </p>
        <button
          onClick={onClose}
          className="tap-scale w-full mt-5 py-3 rounded-2xl body-f text-sm font-semibold"
          style={{ background: LIME, color: "#0C1210" }}
        >
          {t.gotIt}
        </button>
      </div>
    </div>
  );
}

function DetailCard({ data, sourceLabel, t }) {
  const chemicals = asArray(data.chemicals);
  const allergens = asArray(data.allergens);
  const nutrition = data.nutrition;
  const [toast, setToast] = useState("");

  const handleShare = async () => {
    await shareProduct(data, t, setToast);
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <div className="rounded-3xl overflow-hidden relative" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
      {toast && (
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full body-f text-xs font-semibold animate-fade-in"
          style={{ background: LIME, color: "#0C1210" }}
        >
          {toast}
        </div>
      )}
      <div className="p-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <div className="flex items-start justify-between gap-3">
          <h2 className="display text-2xl leading-tight" style={{ color: TEXT }}>{data.name || data.product_name}</h2>
          <button
            onClick={handleShare}
            className="tap-scale shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: SURFACE_2, border: `1px solid ${BORDER}` }}
            aria-label="Share"
          >
            <Share2 size={15} color={TEXT} />
          </button>
        </div>
        {data.brand && <p className="body-f text-sm mt-1" style={{ color: MUTED }}>{data.brand}</p>}
        {asText(data.summary) && (
          <p className="body-f text-sm mt-3 leading-relaxed" style={{ color: TEXT, opacity: 0.85 }}>{asText(data.summary)}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {sourceLabel && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mono-f"
              style={{ background: LIME + "1a", color: LIME, border: `1px solid ${LIME}40` }}
            >
              <Sparkles size={11} />{sourceLabel}
            </span>
          )}
          {sourceLabel && data.confidence === "partial" && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold"
              style={{ background: AMBER + "1a", color: AMBER, border: `1px solid ${AMBER}40` }}
            >
              ⚠️ {t.scanConfidencePartial}
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <ProductInsightCard item={data} t={t} sourceLabel={sourceLabel} />

        {Array.isArray(data.key_ingredients) && data.key_ingredients.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2.5">
              <Search size={15} color={LIME} />
              <h3 className="body-f text-xs font-bold uppercase tracking-widest" style={{ color: MUTED }}>{t.whatsInside}</h3>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: SURFACE_2, border: `1px solid ${BORDER}` }}>
              {data.key_ingredients.map((k, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-2.5"
                  style={{ borderBottom: i < data.key_ingredients.length - 1 ? `1px solid ${BORDER}` : "none" }}
                >
                  <span className="text-base shrink-0">{ingredientIcon(k?.name)}</span>
                  <div className="min-w-0 flex-1">
                    <p className="body-f text-sm font-semibold truncate" style={{ color: TEXT }}>{asText(k?.name)}</p>
                  </div>
                  <span className="body-f text-[11px] shrink-0" style={{ color: MUTED }}>{asText(k?.role)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {(asText(data.meaning) || asText(data.ingredients)) && (
          <div className="mb-6 rounded-2xl p-4" style={{ background: SURFACE_2, border: `1px solid ${BORDER}` }}>
            <p className="body-f text-xs font-bold mb-1" style={{ color: LIME }}>💡 {t.didYouKnow}</p>
            {asText(data.meaning) ? (
              <p className="body-f text-xs leading-relaxed" style={{ color: MUTED }}>{asText(data.meaning)}</p>
            ) : (
              <p className="body-f text-xs leading-relaxed" style={{ color: MUTED }}>
                <span style={{ color: TEXT, fontWeight: 600 }}>{asText(data.ingredients).split(",")[0].trim()}</span> — {t.firstIngredientNote}
              </p>
            )}
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2.5">
            <Leaf size={15} color={LIME} />
            <h3 className="body-f text-xs font-bold uppercase tracking-widest" style={{ color: MUTED }}>{t.ingredientsTitle}</h3>
          </div>
          <p className="body-f text-[15px] leading-relaxed" style={{ color: TEXT, opacity: 0.9 }}>
            {asText(data.ingredients) || t.ingredientsUnavailable}
          </p>
        </div>

        {chemicals.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2.5">
              <FlaskConical size={15} color={CORAL} />
              <h3 className="body-f text-xs font-bold uppercase tracking-widest" style={{ color: MUTED }}>{t.additivesTitle}</h3>
            </div>
            <div className="flex flex-wrap">{chemicals.map((a, i) => <Chip key={i} tone="coral">{asText(a)}</Chip>)}</div>
          </div>
        )}

        {allergens.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2.5">
              <AlertTriangle size={15} color={AMBER} />
              <h3 className="body-f text-xs font-bold uppercase tracking-widest" style={{ color: MUTED }}>{t.allergensTitle}</h3>
            </div>
            <div className="flex flex-wrap">{allergens.map((a, i) => <Chip key={i} tone="amber">{asText(a)}</Chip>)}</div>
          </div>
        )}

        {nutrition && (
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Flame size={15} color={CORAL} />
              <h3 className="body-f text-xs font-bold uppercase tracking-widest" style={{ color: MUTED }}>{t.nutritionTitle}</h3>
            </div>
            <div>
              <Nutrient label={t.calories} value={nutrition.calories_kcal_per_100g} unit="kcal" />
              <Nutrient label={t.protein} value={nutrition.protein_g} unit="g" />
              <Nutrient label={t.fat} value={nutrition.fat_g} unit="g" />
              <Nutrient label={t.sugar} value={nutrition.sugar_g} unit="g" />
              <Nutrient label={t.carbs} value={nutrition.carbs_g} unit="g" />
              <Nutrient label={t.salt} value={nutrition.salt_g} unit="g" />
            </div>
            {typeof nutrition.fat_g === "number" && typeof nutrition.calories_kcal_per_100g === "number" && nutrition.calories_kcal_per_100g > 0 && (nutrition.fat_g * 9) / nutrition.calories_kcal_per_100g > 0.5 && (
              <p className="body-f text-xs mt-2.5" style={{ color: MUTED }}>🥑 {t.mostCaloriesFromFat}</p>
            )}
          </div>
        )}

        {(data.mfg_date_text || data.expiry_date_text || data.expiry_date_iso) && (
          <div className="mb-6 rounded-2xl overflow-hidden" style={{ background: SURFACE_2, border: `1px solid ${BORDER}` }}>
            <div className="p-4 flex items-center gap-2" style={{ borderBottom: `1px solid ${BORDER}` }}>
              <span className="text-sm">📅</span>
              <h3 className="body-f text-xs font-bold uppercase tracking-widest" style={{ color: MUTED }}>{t.datesTitle}</h3>
            </div>
            <div className="p-4">
              {data.mfg_date_text && <Nutrient label={t.mfgDateLabel} value={asText(data.mfg_date_text)} />}
              {data.expiry_date_text && <Nutrient label={t.expiryDateLabel} value={asText(data.expiry_date_text)} />}
              {(() => {
                const d = daysUntil(data.expiry_date_iso);
                if (d === null) return null;
                const expired = d < 0;
                const soon = !expired && d <= 30;
                const color = expired ? CORAL : soon ? AMBER : LIME;
                const text = expired
                  ? `${t.expiredLabel} · ${Math.abs(d)} ${t.daysWord} ${t.agoWord}`
                  : `${t.expiresInLabel} ${d} ${t.daysWord}`;
                return (
                  <div className="flex items-center gap-2 mt-2.5 pt-2.5" style={{ borderTop: `1px solid ${BORDER}` }}>
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                    <span className="body-f text-sm font-semibold" style={{ color }}>{text}</span>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Image + AI helpers ----------
// Uses createImageBitmap with a resize hint where available — this lets the
// browser decode the photo already downscaled instead of first allocating a
// full-resolution buffer (12MP+ phone camera photos can otherwise exhaust
// memory and crash the tab/WebView, showing a blank white screen).
async function compressImage(file, maxDimension = 1280, quality = 0.75) {
  const canvasToBase64 = (canvas) =>
    new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("compress_failed"));
          const reader = new FileReader();
          reader.onload = () => resolve({ base64: reader.result.split(",")[1], mediaType: "image/jpeg" });
          reader.onerror = () => reject(new Error("read_failed"));
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        quality
      );
    });

  if (typeof createImageBitmap === "function") {
    try {
      // Reading natural dimensions via <img> only needs the header, not a
      // full pixel decode — cheap even for a huge photo.
      const { width: srcW, height: srcH } = await new Promise((resolve, reject) => {
        const probe = new Image();
        const probeUrl = URL.createObjectURL(file);
        probe.onload = () => {
          resolve({ width: probe.naturalWidth, height: probe.naturalHeight });
          URL.revokeObjectURL(probeUrl);
        };
        probe.onerror = () => {
          URL.revokeObjectURL(probeUrl);
          reject(new Error("probe_failed"));
        };
        probe.src = probeUrl;
      });

      const scale = Math.min(1, maxDimension / Math.max(srcW, srcH));
      const targetW = Math.max(1, Math.round(srcW * scale));
      const targetH = Math.max(1, Math.round(srcH * scale));

      const bitmap = await createImageBitmap(file, { resizeWidth: targetW, resizeHeight: targetH, resizeQuality: "medium" });
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(bitmap, 0, 0, targetW, targetH);
      bitmap.close?.();
      return await canvasToBase64(canvas);
    } catch {
      // fall through to the <img>-based method below
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = async () => {
      let { width, height } = img;
      if (width > height && width > maxDimension) {
        height = Math.round((height * maxDimension) / width);
        width = maxDimension;
      } else if (height > maxDimension) {
        width = Math.round((width * maxDimension) / height);
        height = maxDimension;
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      try {
        resolve(await canvasToBase64(canvas));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image_decode_failed"));
    };
    img.src = url;
  });
}

function extractJson(text) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Couldn't find JSON in the AI response: " + text.slice(0, 150));
  return JSON.parse(cleaned.slice(start, end + 1));
}

// ---------- App ----------
export default function App() {
  const [view, setView] = useState("browse"); // browse | scan
  const [mode, setMode] = useState("food");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [showHow, setShowHow] = useState(false);

  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem("insider_lang") || "en";
    } catch {
      return "en";
    }
  });
  const t = T[lang] || T.en;
  const currentLangMeta = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  const changeLang = (code) => {
    setLang(code);
    try {
      localStorage.setItem("insider_lang", code);
    } catch {
      // localStorage unavailable — language just won't persist across visits
    }
  };

  useEffect(() => {
    try {
      if (!localStorage.getItem("insider_seen_intro")) {
        setShowHow(true);
        localStorage.setItem("insider_seen_intro", "1");
      }
    } catch {
      // localStorage unavailable — just skip the auto-intro, no harm done
    }
  }, []);

  const [installPrompt, setInstallPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };

  const [imgPreview, setImgPreview] = useState(null);
  const [scanStatus, setScanStatus] = useState("idle"); // idle | loading | done | error
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState("");

  const [recentScans, setRecentScans] = useState(() => {
    try {
      const saved = localStorage.getItem("insider_scanned_products");
      const parsed = saved ? JSON.parse(saved) : [];
      // Drop any previously-saved entries that lack a usable name — these
      // were crashing Browse's search (p.name.toLowerCase() on undefined).
      return Array.isArray(parsed) ? parsed.filter((p) => typeof (p?.name || p?.product_name) === "string" && (p.name || p.product_name).trim()) : [];
    } catch {
      return [];
    }
  });

  // Every successful scan is kept permanently (no cap) and tagged with the
  // mode it was scanned under, so it becomes searchable in Browse too —
  // the app's own database grows from real scans over time.
  const saveToRecent = (item) => {
    const usableName = typeof (item?.name || item?.product_name) === "string" ? (item.name || item.product_name).trim() : "";
    if (!usableName) return; // nothing sensible to search by later — skip saving

    setRecentScans((prev) => {
      const withoutDupe = prev.filter(
        (p) => (p.name || p.product_name) !== (item.name || item.product_name)
      );
      const next = [{ ...item, category: mode, _scannedAt: Date.now() }, ...withoutDupe];
      try {
        localStorage.setItem("insider_scanned_products", JSON.stringify(next));
      } catch {
        // storage full or unavailable — non-critical, skip
      }
      return next;
    });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const scannedInMode = recentScans
      .filter((p) => (p.category || "food") === mode)
      .map((p) => ({
        id: `scanned-${p.name || p.product_name}`,
        name: p.name || p.product_name || "",
        brand: p.brand || "",
        category: p.category,
        ingredients: p.ingredients,
        chemicals: p.chemicals,
        allergens: p.allergens,
        nutrition: p.nutrition,
        _scanned: true,
      }));
    // Curated entries take priority; scanned ones fill in anything not already covered.
    const curatedNames = new Set(DB.filter((p) => p.category === mode).map((p) => p.name.toLowerCase()));
    const combined = [
      ...DB.filter((p) => p.category === mode),
      ...scannedInMode.filter((p) => !curatedNames.has((p.name || "").toLowerCase())),
    ];
    if (!q) return combined;
    return combined.filter((p) => (p.name || "").toLowerCase().includes(q) || (p.brand || "").toLowerCase().includes(q));
  }, [query, mode, recentScans]);

  const handleFile = async (file) => {
    if (!file) return;
    setScanStatus("loading");
    setScanResult(null);
    setScanError("");
    // Release the previous preview's memory before allocating a new one —
    // otherwise repeated scans accumulate undecoded blob memory and the
    // WebView eventually crashes to a blank white screen on a later scan.
    setImgPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });

    try {
      const { base64, mediaType } = await compressImage(file, 1024, 0.7);

      const today = new Date().toISOString().slice(0, 10);
      const prompt = `This is a photo of the back-of-pack label for an Indian ${mode === "food" ? "food/grocery" : "personal-care/cosmetic"} product. Read the ingredients list, nutrition facts, brand name, and any manufacturing/expiry date printed on the label, then respond with ONLY a raw JSON object (no markdown fences, no commentary) in exactly this shape:
{
  "name": string,
  "brand": string,
  "summary": string,
  "ingredients": string,
  "key_ingredients": [{ "name": string, "role": string }],
  "meaning": string,
  "chemicals": string[],
  "allergens": string[],
  "nutrition": ${mode === "food" ? `{ "calories_kcal_per_100g": number|null, "protein_g": number|null, "fat_g": number|null, "sugar_g": number|null, "carbs_g": number|null, "salt_g": number|null }` : "null"},
  "mfg_date_text": string|null,
  "expiry_date_text": string|null,
  "expiry_date_iso": string|null,
  "confidence": "high" | "partial"
}
"summary" is one short plain sentence describing what kind of product this is and its main ingredient base (e.g. "A vegetable-oil based mayonnaise with egg and preservatives.") — written for someone who knows nothing about the product yet.
"key_ingredients" is a list of the 4-7 most significant ingredients IN THE ORDER THEY APPEAR on the label (which is largest-quantity first), each with a short "role" word (e.g. "Main base", "Sweetener", "Thickener", "Preservative", "Colour", "Flavour", "Emulsifier"). Only include what is actually declared on the label — never guess or invent an ingredient that isn't printed there.
"meaning" is one short interpretive sentence about what this ingredient mix tells the person — e.g. that a fruit-flavoured product isn't necessarily made mostly of that fruit, or that a product has several formulation/texture additives beyond its main base. Base this ONLY on what's printed on the label — if there's nothing notable to add beyond the summary, repeat the key point simply rather than inventing something.
"mfg_date_text" is the manufacturing/packing date exactly as printed on the label (e.g. "07/2026" or "MFD: 15/07/2026"), or null if not visible.
"expiry_date_text" is the expiry/"best before" text exactly as printed (e.g. "06/2027" or "Best before 12 months from mfg"), or null if not visible.
"expiry_date_iso" is the actual expiry date in strict YYYY-MM-DD format, but ONLY if you can confidently determine an exact date — either because a full date is printed, or because both a manufacturing date and a relative duration (like "9 months from mfg") are printed and you can calculate it. Today's date is ${today}, for reference only — do not use it as the expiry date. If you can't confidently determine an exact date, set this to null rather than guessing.
"confidence" should be "partial" if any part of the ingredients or nutrition text was blurry, cut off, or you had to guess at a word — otherwise "high".
Write the "summary", "meaning", "ingredients", "allergens", and each key_ingredients "role"/"name" in ${currentLangMeta.english} (using ${currentLangMeta.english} script), since that's the language the person reading this speaks. However, keep the "chemicals" array entries in English exactly as printed (e.g. E-numbers, INCI names like "Sodium Lauryl Sulfate", "TBHQ") since these are technical/scientific names that should stay in their standard form regardless of language. Keep "name" and "brand" exactly as printed on the pack.
If the label truly isn't readable, respond with only: {"error": "Couldn't read the label clearly — try a closer, well-lit photo"}`;

      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaType, base64, prompt }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`API error ${response.status}: ${errText.slice(0, 200)}`);
      }

      const data = await response.json();
      const textOut = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
      if (!textOut) throw new Error("Empty response from AI");

      const parsed = extractJson(textOut);
      if (parsed.error) {
        setScanError(parsed.error);
        setScanStatus("error");
        return;
      }
      setScanResult(parsed);
      setScanStatus("done");
      saveToRecent(parsed);
    } catch (err) {
      const msg = err.message || String(err);
      setScanError(msg.includes("Failed to fetch") ? t.networkIssue : msg);
      setScanStatus("error");
    }
  };

  const resetScan = () => {
    setScanStatus("idle");
    setScanResult(null);
    setScanError("");
    setImgPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  const openRecent = (item) => {
    setScanResult(item);
    setScanStatus("done");
    setImgPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  };

  return (
    <div className="min-h-screen w-full" style={{ background: BG }} dir={lang === "ur" ? "rtl" : "ltr"}>
      {showHow && <HowItWorks onClose={() => setShowHow(false)} t={t} />}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&family=Noto+Sans+Tamil:wght@400;500;600;700&family=Noto+Sans+Telugu:wght@400;500;600;700&family=Noto+Sans+Kannada:wght@400;500;600;700&family=Noto+Sans+Malayalam:wght@400;500;600;700&family=Noto+Sans+Gujarati:wght@400;500;600;700&family=Noto+Sans+Gurmukhi:wght@400;500;600;700&family=Noto+Sans+Oriya:wght@400;500;600;700&family=Noto+Nastaliq+Urdu:wght@400;500;600;700&display=swap');
        .display { font-family: 'Fraunces', serif; }
        .body-f { font-family: 'Inter', 'Noto Sans', 'Noto Sans Devanagari', 'Noto Sans Bengali', 'Noto Sans Tamil', 'Noto Sans Telugu', 'Noto Sans Kannada', 'Noto Sans Malayalam', 'Noto Sans Gujarati', 'Noto Sans Gurmukhi', 'Noto Sans Oriya', 'Noto Nastaliq Urdu', sans-serif; }
        .mono-f { font-family: 'JetBrains Mono', monospace; }
        @keyframes scanmove { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        .scan-glow { animation: scanmove 2.2s ease-in-out infinite; }
        .tap-scale { transition: transform .15s ease, border-color .15s ease, background .15s ease; }
        .tap-scale:active { transform: scale(0.98); }
        @keyframes fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadein .35s ease both; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shimmer { background: linear-gradient(90deg, ${SURFACE_2} 25%, #2A342D 50%, ${SURFACE_2} 75%); background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; }
        .lang-select { -webkit-appearance: none; appearance: none; }
      `}</style>

      {/* Header */}
      <header className="relative px-5 pt-8 pb-7 overflow-hidden">
        <div
          className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full"
          style={{ background: `radial-gradient(circle, ${LIME}22 0%, transparent 70%)` }}
        />
        <div className="relative">
          <div className="flex items-center justify-between gap-2 mb-5">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: LIME }} />
              <span className="body-f text-[11px] tracking-[0.25em] uppercase" style={{ color: MUTED }}>
                {t.tagline}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {installPrompt && !installed && (
                <button
                  onClick={handleInstall}
                  className="tap-scale flex items-center gap-1.5 px-3 py-1.5 rounded-full body-f text-xs font-semibold"
                  style={{ background: LIME, color: "#0C1210" }}
                >
                  <Download size={13} /> {t.installApp}
                </button>
              )}
              <div className="relative">
                <select
                  value={lang}
                  onChange={(e) => changeLang(e.target.value)}
                  className="lang-select tap-scale flex items-center gap-1 pl-2.5 pr-6 py-1.5 rounded-full body-f text-xs font-semibold"
                  style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} style={{ background: SURFACE, color: TEXT }}>
                      {l.native}
                    </option>
                  ))}
                </select>
                <Globe size={11} color={MUTED} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
              </div>
              <button
                onClick={() => setShowHow(true)}
                className="tap-scale w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
                aria-label={t.howItWorksAria}
              >
                <Info size={13} color={MUTED} />
              </button>
            </div>
          </div>
          <h1
            className="display leading-[1.15]"
            style={{ color: TEXT, fontSize: "clamp(1.7rem, 8vw, 2.6rem)", overflowWrap: "break-word", wordBreak: "break-word" }}
          >
            {t.headline1}<br /><em style={{ color: LIME, fontStyle: "italic" }}>{t.headlineEm}</em> {t.headline2}
          </h1>
          <p className="body-f text-sm mt-3" style={{ color: MUTED }}>
            {t.subhead}
          </p>

          {/* Browse / Scan segmented control */}
          <div className="flex gap-2 mt-6 p-1 rounded-2xl" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <button
              onClick={() => { setView("browse"); resetScan(); }}
              className="tap-scale flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold body-f"
              style={{ background: view === "browse" ? LIME : "transparent", color: view === "browse" ? "#0C1210" : MUTED }}
            >
              <Search size={14} /> {t.browse}
            </button>
            <button
              onClick={() => setView("scan")}
              className="tap-scale flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold body-f"
              style={{ background: view === "scan" ? LIME : "transparent", color: view === "scan" ? "#0C1210" : MUTED }}
            >
              <ScanLine size={14} /> {t.scanTab}
            </button>
          </div>

          {view === "browse" && (
            <>
              <div className="flex gap-2 mt-4">
                {[{ id: "food", label: t.food }, { id: "cosmetic", label: t.personalCare }].map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => { setMode(id); setSelected(null); setQuery(""); }}
                    className="tap-scale px-3.5 py-1.5 rounded-full text-xs font-semibold body-f"
                    style={{
                      background: mode === id ? SURFACE_2 : "transparent",
                      color: mode === id ? TEXT : MUTED,
                      border: `1px solid ${mode === id ? LIME + "50" : BORDER}`,
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2.5 px-4 py-3 rounded-2xl" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                <Search size={16} color={MUTED} />
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
                  placeholder={mode === "food" ? t.searchFoodPlaceholder : t.searchCosmeticPlaceholder}
                  className="body-f flex-1 bg-transparent outline-none text-sm"
                  style={{ color: TEXT }}
                />
              </div>
            </>
          )}
        </div>
      </header>

      {/* Body */}
      <main key={view + (selected ? "-detail" : "")} className="px-5 pb-8 max-w-2xl mx-auto animate-fade-in">
        {view === "browse" && !selected && (
          <>
            {query.trim() && results.length === 0 && (
              <div className="text-center py-12 body-f" style={{ color: MUTED }}>
                <p className="text-sm">{t.noMatch}</p>
                <p className="text-xs mt-1">{t.tryScanHint}</p>
              </div>
            )}
            {query.trim() && results.length > 0 && (
            <div className="grid gap-2.5">
              {results.map((p, i) => {
                const { level } = analyzeSafety(p);
                const dot = { clean: LIME, moderate: AMBER, high: CORAL }[level];
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="tap-scale text-left flex items-center gap-3 p-3.5 rounded-2xl animate-fade-in"
                    style={{ background: SURFACE, border: `1px solid ${BORDER}`, animationDelay: `${Math.min(i, 8) * 30}ms` }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 relative" style={{ background: SURFACE_2 }}>
                      {p.category === "food" ? <Flame size={17} color={MUTED} /> : <FlaskConical size={17} color={MUTED} />}
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full" style={{ background: dot, boxShadow: `0 0 6px ${dot}` }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="body-f text-sm font-semibold leading-tight truncate" style={{ color: TEXT }}>{p.name}</p>
                      <p className="body-f text-xs mt-0.5 truncate" style={{ color: MUTED }}>{p.brand}</p>
                    </div>
                    {p.nutrition?.calories_kcal_per_100g != null && (
                      <div className="text-right shrink-0">
                        <p className="mono-f text-sm font-bold" style={{ color: TEXT }}>{p.nutrition.calories_kcal_per_100g}</p>
                        <p className="body-f text-[10px]" style={{ color: MUTED }}>{t.kcalPer100g}</p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
            )}
          </>
        )}

        {view === "browse" && selected && (
          <div>
            <button onClick={() => setSelected(null)} className="body-f flex items-center gap-1 text-xs font-semibold mb-4" style={{ color: MUTED }}>
              <ChevronLeft size={14} /> {t.backToList}
            </button>
            <DetailCard data={selected} t={t} />
          </div>
        )}

        {view === "scan" && (
          <div>
            {scanStatus === "idle" && (
              <div className="pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className="tap-scale relative overflow-hidden flex flex-col items-center justify-center gap-2.5 py-9 rounded-2xl cursor-pointer"
                    style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
                  >
                    <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: LIME + "18" }}>
                      <Camera size={20} color={LIME} />
                    </div>
                    <span className="body-f text-sm font-semibold" style={{ color: TEXT }}>{t.cameraLabel}</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                  </label>
                  <label
                    className="tap-scale flex flex-col items-center justify-center gap-2.5 py-9 rounded-2xl cursor-pointer"
                    style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
                  >
                    <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: SURFACE_2 }}>
                      <ImageIcon size={20} color={MUTED} />
                    </div>
                    <span className="body-f text-sm font-semibold" style={{ color: TEXT }}>{t.galleryLabel}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                  </label>
                </div>
                <p className="body-f text-xs mt-4 text-center" style={{ color: MUTED }}>
                  {t.scanHint}
                </p>

                {recentScans.length > 0 && (
                  <div className="mt-7 animate-fade-in">
                    <p className="body-f text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: MUTED }}>{t.recentScansTitle}</p>
                    <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5">
                      {recentScans.slice(0, 10).map((item, i) => {
                        const { level } = analyzeSafety(item);
                        const dot = { clean: LIME, moderate: AMBER, high: CORAL }[level];
                        return (
                          <button
                            key={i}
                            onClick={() => openRecent(item)}
                            className="tap-scale shrink-0 text-left px-3.5 py-3 rounded-2xl"
                            style={{ background: SURFACE, border: `1px solid ${BORDER}`, minWidth: 148, maxWidth: 168 }}
                          >
                            <span className="w-2 h-2 rounded-full inline-block mb-2" style={{ background: dot, boxShadow: `0 0 6px ${dot}` }} />
                            <p className="body-f text-xs font-semibold leading-snug truncate" style={{ color: TEXT }}>
                              {item.name || item.product_name}
                            </p>
                            {item.brand && <p className="body-f text-[10px] mt-0.5 truncate" style={{ color: MUTED }}>{item.brand}</p>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {(scanStatus === "loading" || scanStatus === "done" || scanStatus === "error") && imgPreview && (
              <div className="mb-4 relative rounded-2xl overflow-hidden animate-fade-in" style={{ border: `1px solid ${BORDER}` }}>
                <img src={imgPreview} alt="scanned label" decoding="async" className="w-full max-h-56 object-cover" />
                {scanStatus === "loading" && (
                  <div className="absolute inset-x-0 h-16 pointer-events-none scan-glow" style={{ background: `linear-gradient(to bottom, transparent, ${LIME}33, transparent)` }} />
                )}
                <button onClick={resetScan} className="absolute top-2 right-2 p-1.5 rounded-full" style={{ background: "#0C1210CC" }}>
                  <X size={14} color={TEXT} />
                </button>
              </div>
            )}

            {scanStatus === "loading" && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-2 justify-center py-4 body-f" style={{ color: MUTED }}>
                  <Loader2 className="animate-spin" size={15} color={LIME} />
                  <p className="text-sm">{t.readingLabel}</p>
                </div>
                <div className="rounded-3xl overflow-hidden p-5" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
                  <div className="shimmer h-5 w-2/3 rounded-lg mb-2.5" />
                  <div className="shimmer h-3 w-1/3 rounded-lg mb-6" />
                  <div className="shimmer h-16 w-full rounded-2xl mb-5" />
                  <div className="shimmer h-3 w-full rounded-lg mb-2" />
                  <div className="shimmer h-3 w-5/6 rounded-lg mb-2" />
                  <div className="shimmer h-3 w-4/6 rounded-lg" />
                </div>
              </div>
            )}

            {scanStatus === "error" && (
              <div className="text-center py-6 body-f rounded-2xl px-4" style={{ color: CORAL, background: SURFACE, border: `1px solid ${CORAL}40` }}>
                <AlertTriangle className="mx-auto mb-2" />
                <p className="text-sm font-semibold" style={{ color: TEXT }}>{t.couldntRead}</p>
                <p className="text-xs mt-2" style={{ color: MUTED }}>{scanError}</p>
                <label className="tap-scale body-f mt-4 inline-block px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer" style={{ background: LIME, color: "#0C1210" }}>
                  {t.tryAnotherPhoto}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                </label>
              </div>
            )}

            {scanStatus === "done" && scanResult && (
              <div className="animate-fade-in">
                <DetailCard data={scanResult} sourceLabel={t.scannedBadge} t={t} />
                <button onClick={resetScan} className="tap-scale body-f mt-4 w-full py-3 rounded-2xl text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}>
                  {t.scanAnotherProduct}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="px-5 py-8 body-f text-[11px]" style={{ color: MUTED }}>
        <div className="flex items-start gap-1.5 max-w-2xl mx-auto">
          <Info size={13} className="shrink-0 mt-0.5" />
          <p>{t.footerPrefix} {DB.length} {t.footerSuffix}</p>
        </div>
      </footer>
    </div>
  );
}
