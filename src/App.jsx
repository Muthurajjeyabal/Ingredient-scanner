import { useState, useMemo } from "react";
import { Search, Leaf, FlaskConical, Flame, AlertTriangle, ChevronLeft, ScanLine, Info, Camera, Loader2, X, Image as ImageIcon, Sparkles } from "lucide-react";

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
];

// ---------- Safety heuristic ----------
const FLAGGED_ADDITIVES = [
  { kw: "sodium lauryl sulfate", note: "SLS — can dry out skin/scalp for some users" },
  { kw: "sodium laureth sulfate", note: "SLES — mild irritant for sensitive skin" },
  { kw: "paraben", note: "Paraben — debated link to hormone disruption" },
  { kw: "tbhq", note: "TBHQ — regular high intake isn't advised" },
  { kw: "monosodium glutamate", note: "MSG — may trigger headaches/sensitivity in some" },
  { kw: " msg", note: "MSG — may trigger headaches/sensitivity in some" },
  { kw: "hydrogenated", note: "Hydrogenated / trans fat — linked to heart health risk" },
  { kw: "phosphoric acid", note: "Phosphoric acid — frequent high intake may affect bone health" },
  { kw: "chloroxylenol", note: "Chloroxylenol — strong antibacterial, avoid prolonged skin contact" },
  { kw: "ci 14700", note: "Synthetic dye" },
  { kw: "ci 15985", note: "Synthetic dye" },
  { kw: "ci 16035", note: "Synthetic dye" },
  { kw: "ci 19140", note: "Synthetic dye — some studies link to hyperactivity" },
  { kw: "ci 42090", note: "Synthetic dye" },
  { kw: "ci 74160", note: "Synthetic dye" },
  { kw: "e150d", note: "Caramel colour (E150d) — flagged in some studies" },
  { kw: "e319", note: "TBHQ (E319) — regular high intake isn't advised" },
];

function analyzeSafety(item) {
  const haystack = `${item.ingredients || ""} ${(item.chemicals || []).join(" ")}`.toLowerCase();
  const reasons = [];
  for (const f of FLAGGED_ADDITIVES) {
    if (haystack.includes(f.kw) && !reasons.includes(f.note)) reasons.push(f.note);
  }
  const n = item.nutrition;
  if (n?.sugar_g != null && n.sugar_g > 22) reasons.push(`High sugar (${n.sugar_g}g/100g)`);
  if (n?.salt_g != null && n.salt_g > 1.5) reasons.push(`High salt (${n.salt_g}g/100g)`);

  let level = "clean";
  if (reasons.length >= 3) level = "high";
  else if (reasons.length >= 1) level = "moderate";
  return { level, reasons };
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

function SafetyBadge({ item }) {
  const { level, reasons } = analyzeSafety(item);
  const config = {
    clean: { color: LIME, label: "Looks clean", sub: "No flagged additives found" },
    moderate: { color: AMBER, label: "Worth a closer look", sub: `${reasons.length} thing${reasons.length > 1 ? "s" : ""} to know` },
    high: { color: CORAL, label: "Several flags", sub: `${reasons.length} things to know` },
  }[level];
  return (
    <div
      className="mb-5 rounded-2xl overflow-hidden"
      style={{ background: SURFACE_2, border: `1px solid ${config.color}40` }}
    >
      <div className="flex items-center gap-3 px-4 py-3.5" style={{ borderBottom: reasons.length ? `1px solid ${BORDER}` : "none" }}>
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: config.color, boxShadow: `0 0 12px ${config.color}` }} />
        <div className="min-w-0">
          <p className="body-f text-sm font-semibold" style={{ color: TEXT }}>{config.label}</p>
          <p className="body-f text-xs" style={{ color: MUTED }}>{config.sub}</p>
        </div>
      </div>
      {reasons.length > 0 && (
        <ul className="px-4 py-3 space-y-1.5">
          {reasons.map((r, i) => (
            <li key={i} className="body-f text-xs flex items-start gap-2" style={{ color: TEXT, opacity: 0.85 }}>
              <span style={{ color: config.color }} className="mt-0.5">·</span>{r}
            </li>
          ))}
        </ul>
      )}
      <p className="px-4 pb-3 body-f text-[10px]" style={{ color: MUTED }}>
        General consumer-awareness info, not medical advice.
      </p>
    </div>
  );
}

function DetailCard({ data, sourceLabel }) {
  const chemicals = data.chemicals || [];
  const allergens = data.allergens || [];
  const nutrition = data.nutrition;
  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
      <div className="p-5" style={{ borderBottom: `1px solid ${BORDER}` }}>
        <h2 className="display text-2xl leading-tight" style={{ color: TEXT }}>{data.name || data.product_name}</h2>
        {data.brand && <p className="body-f text-sm mt-1" style={{ color: MUTED }}>{data.brand}</p>}
        {sourceLabel && (
          <span
            className="inline-flex items-center gap-1 mt-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mono-f"
            style={{ background: LIME + "1a", color: LIME, border: `1px solid ${LIME}40` }}
          >
            <Sparkles size={11} />{sourceLabel}
          </span>
        )}
      </div>

      <div className="p-5">
        <SafetyBadge item={data} />

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2.5">
            <Leaf size={15} color={LIME} />
            <h3 className="body-f text-xs font-bold uppercase tracking-widest" style={{ color: MUTED }}>Ingredients</h3>
          </div>
          <p className="body-f text-[15px] leading-relaxed" style={{ color: TEXT, opacity: 0.9 }}>
            {data.ingredients || "Ingredients not available."}
          </p>
        </div>

        {chemicals.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2.5">
              <FlaskConical size={15} color={CORAL} />
              <h3 className="body-f text-xs font-bold uppercase tracking-widest" style={{ color: MUTED }}>Additives &amp; chemicals</h3>
            </div>
            <div className="flex flex-wrap">{chemicals.map((a, i) => <Chip key={i} tone="coral">{a}</Chip>)}</div>
          </div>
        )}

        {allergens.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2.5">
              <AlertTriangle size={15} color={AMBER} />
              <h3 className="body-f text-xs font-bold uppercase tracking-widest" style={{ color: MUTED }}>Allergen warnings</h3>
            </div>
            <div className="flex flex-wrap">{allergens.map((a, i) => <Chip key={i} tone="amber">{a}</Chip>)}</div>
          </div>
        )}

        {nutrition && (
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Flame size={15} color={CORAL} />
              <h3 className="body-f text-xs font-bold uppercase tracking-widest" style={{ color: MUTED }}>Nutrition — per 100g</h3>
            </div>
            <div>
              <Nutrient label="Calories" value={nutrition.calories_kcal_per_100g} unit="kcal" />
              <Nutrient label="Protein" value={nutrition.protein_g} unit="g" />
              <Nutrient label="Fat" value={nutrition.fat_g} unit="g" />
              <Nutrient label="Sugar" value={nutrition.sugar_g} unit="g" />
              <Nutrient label="Carbohydrate" value={nutrition.carbs_g} unit="g" />
              <Nutrient label="Salt" value={nutrition.salt_g} unit="g" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------- Image + AI helpers ----------
function compressImage(file, maxDimension = 1280, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
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
      const dataUrl = canvas.toDataURL("image/jpeg", quality);
      resolve({ base64: dataUrl.split(",")[1], mediaType: "image/jpeg" });
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

  const [imgPreview, setImgPreview] = useState(null);
  const [scanStatus, setScanStatus] = useState("idle"); // idle | loading | done | error
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState("");

  const [recentScans, setRecentScans] = useState(() => {
    try {
      const saved = localStorage.getItem("insider_recent_scans");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveToRecent = (item) => {
    setRecentScans((prev) => {
      const withoutDupe = prev.filter(
        (p) => (p.name || p.product_name) !== (item.name || item.product_name)
      );
      const next = [{ ...item, _scannedAt: Date.now() }, ...withoutDupe].slice(0, 10);
      try {
        localStorage.setItem("insider_recent_scans", JSON.stringify(next));
      } catch {
        // storage full or unavailable — non-critical, skip
      }
      return next;
    });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const inMode = DB.filter((p) => p.category === mode);
    if (!q) return inMode;
    return inMode.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
  }, [query, mode]);

  const handleFile = async (file) => {
    if (!file) return;
    setScanStatus("loading");
    setScanResult(null);
    setScanError("");
    setImgPreview(URL.createObjectURL(file));

    try {
      const { base64, mediaType } = await compressImage(file);

      const prompt = `This is a photo of the back-of-pack label for an Indian ${mode === "food" ? "food/grocery" : "personal-care/cosmetic"} product. Read the ingredients list, nutrition facts, and brand name visible in the image, then respond with ONLY a raw JSON object (no markdown fences, no commentary) in exactly this shape:
{
  "name": string,
  "brand": string,
  "ingredients": string,
  "chemicals": string[],
  "allergens": string[],
  "nutrition": ${mode === "food" ? `{ "calories_kcal_per_100g": number|null, "protein_g": number|null, "fat_g": number|null, "sugar_g": number|null, "carbs_g": number|null, "salt_g": number|null }` : "null"}
}
If the label truly isn't readable, respond with only: {"error": "Couldn't read the label clearly — try a closer, well-lit photo"}`;

      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mediaType, base64, prompt }),
      });

      if (!response.ok) {
        const t = await response.text();
        throw new Error(`API error ${response.status}: ${t.slice(0, 200)}`);
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
      setScanError(msg.includes("Failed to fetch") ? "Network issue — check your connection and try again" : msg);
      setScanStatus("error");
    }
  };

  const resetScan = () => {
    setScanStatus("idle");
    setScanResult(null);
    setScanError("");
    setImgPreview(null);
  };

  const openRecent = (item) => {
    setScanResult(item);
    setScanStatus("done");
    setImgPreview(null);
  };

  return (
    <div className="min-h-screen w-full" style={{ background: BG }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        .display { font-family: 'Fraunces', serif; }
        .body-f { font-family: 'Inter', sans-serif; }
        .mono-f { font-family: 'JetBrains Mono', monospace; }
        @keyframes scanmove { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        .scan-glow { animation: scanmove 2.2s ease-in-out infinite; }
        .tap-scale { transition: transform .15s ease, border-color .15s ease, background .15s ease; }
        .tap-scale:active { transform: scale(0.98); }
        @keyframes fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadein .35s ease both; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .shimmer { background: linear-gradient(90deg, ${SURFACE_2} 25%, #2A342D 50%, ${SURFACE_2} 75%); background-size: 200% 100%; animation: shimmer 1.5s ease-in-out infinite; }
      `}</style>

      {/* Header */}
      <header className="relative px-5 pt-8 pb-7 overflow-hidden">
        <div
          className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full"
          style={{ background: `radial-gradient(circle, ${LIME}22 0%, transparent 70%)` }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: LIME }} />
            <span className="body-f text-[11px] tracking-[0.25em] uppercase" style={{ color: MUTED }}>
              AI Label Scanner
            </span>
          </div>
          <h1 className="display text-[2.6rem] leading-[1.05]" style={{ color: TEXT }}>
            Know what's<br /><em style={{ color: LIME, fontStyle: "italic" }}>really</em> inside.
          </h1>
          <p className="body-f text-sm mt-3" style={{ color: MUTED }}>
            Food, toothpaste, soap — scan any label to see the ingredients, chemicals and nutrition behind it.
          </p>

          {/* Browse / Scan segmented control */}
          <div className="flex gap-2 mt-6 p-1 rounded-2xl" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <button
              onClick={() => { setView("browse"); resetScan(); }}
              className="tap-scale flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold body-f"
              style={{ background: view === "browse" ? LIME : "transparent", color: view === "browse" ? "#0C1210" : MUTED }}
            >
              <Search size={14} /> Browse
            </button>
            <button
              onClick={() => setView("scan")}
              className="tap-scale flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold body-f"
              style={{ background: view === "scan" ? LIME : "transparent", color: view === "scan" ? "#0C1210" : MUTED }}
            >
              <ScanLine size={14} /> Scan
            </button>
          </div>

          {view === "browse" && (
            <>
              <div className="flex gap-2 mt-4">
                {[{ id: "food", label: "Food" }, { id: "cosmetic", label: "Personal care" }].map(({ id, label }) => (
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
                  placeholder={mode === "food" ? "Parle-G, Maggi, Lay's…" : "Colgate, Dove, Lifebuoy…"}
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
            {results.length === 0 && (
              <div className="text-center py-12 body-f" style={{ color: MUTED }}>
                <p className="text-sm">No match in the curated list yet.</p>
                <p className="text-xs mt-1">Try the Scan tab to read any product's label directly.</p>
              </div>
            )}
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
                        <p className="body-f text-[10px]" style={{ color: MUTED }}>kcal/100g</p>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {view === "browse" && selected && (
          <div>
            <button onClick={() => setSelected(null)} className="body-f flex items-center gap-1 text-xs font-semibold mb-4" style={{ color: MUTED }}>
              <ChevronLeft size={14} /> Back to list
            </button>
            <DetailCard data={selected} />
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
                    <span className="body-f text-sm font-semibold" style={{ color: TEXT }}>Camera</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                  </label>
                  <label
                    className="tap-scale flex flex-col items-center justify-center gap-2.5 py-9 rounded-2xl cursor-pointer"
                    style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
                  >
                    <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: SURFACE_2 }}>
                      <ImageIcon size={20} color={MUTED} />
                    </div>
                    <span className="body-f text-sm font-semibold" style={{ color: TEXT }}>Gallery</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                  </label>
                </div>
                <p className="body-f text-xs mt-4 text-center" style={{ color: MUTED }}>
                  Good lighting and a close, sharp shot of the ingredients list works best.
                </p>

                {recentScans.length > 0 && (
                  <div className="mt-7 animate-fade-in">
                    <p className="body-f text-xs font-bold uppercase tracking-widest mb-2.5" style={{ color: MUTED }}>Recent scans</p>
                    <div className="flex gap-2 overflow-x-auto pb-1 -mx-5 px-5">
                      {recentScans.map((item, i) => {
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
                <img src={imgPreview} alt="scanned label" className="w-full max-h-56 object-cover" />
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
                  <p className="text-sm">Reading the label…</p>
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
                <p className="text-sm font-semibold" style={{ color: TEXT }}>Couldn't read that</p>
                <p className="text-xs mt-2" style={{ color: MUTED }}>{scanError}</p>
                <label className="tap-scale body-f mt-4 inline-block px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer" style={{ background: LIME, color: "#0C1210" }}>
                  Try another photo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                </label>
              </div>
            )}

            {scanStatus === "done" && scanResult && (
              <div className="animate-fade-in">
                <DetailCard data={scanResult} sourceLabel="Scanned" />
                <button onClick={resetScan} className="tap-scale body-f mt-4 w-full py-3 rounded-2xl text-sm font-semibold" style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT }}>
                  Scan another product
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="px-5 py-8 body-f text-[11px]" style={{ color: MUTED }}>
        <div className="flex items-start gap-1.5 max-w-2xl mx-auto">
          <Info size={13} className="shrink-0 mt-0.5" />
          <p>Browse covers {DB.length} curated products, offline. Scan reads any label live using AI — needs an internet connection.</p>
        </div>
      </footer>
    </div>
  );
}
