import { useState, useMemo, useRef } from "react";
import { Search, Leaf, FlaskConical, Flame, AlertTriangle, ChevronLeft, PackageSearch, Info, Camera, Loader2, X, ScanLine } from "lucide-react";

const INK = "#20291B";
const PAPER = "#F5F0E3";
const TURMERIC = "#DE9F2E";
const CHILI = "#B8402A";
const CURRY = "#4C6B3C";
const CARD = "#FFFCF4";

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
];

function Chip({ children, tone = "curry" }) {
  const bg = tone === "curry" ? CURRY : tone === "chili" ? CHILI : TURMERIC;
  return <span className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide mr-1.5 mb-1.5" style={{ background: bg, color: PAPER }}>{children}</span>;
}

function Nutrient({ label, value, unit }) {
  if (value === undefined || value === null) return null;
  return (
    <div className="flex items-baseline justify-between border-b py-2" style={{ borderColor: "#DED4B8" }}>
      <span className="text-sm" style={{ color: INK, opacity: 0.75 }}>{label}</span>
      <span className="font-mono text-sm font-semibold" style={{ color: INK }}>
        {value}{unit ? <span className="opacity-60 ml-1">{unit}</span> : null}
      </span>
    </div>
  );
}

function DetailCard({ data, sourceLabel }) {
  const chemicals = data.chemicals || [];
  const allergens = data.allergens || [];
  const nutrition = data.nutrition;
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid #E3D9BB` }}>
      <div className="p-4" style={{ borderBottom: "1px solid #E3D9BB" }}>
        <div className="flex items-center justify-between">
          <h2 className="display text-xl leading-tight" style={{ color: INK }}>{data.name || data.product_name}</h2>
        </div>
        {(data.brand) && <p className="body-f text-xs mt-1" style={{ color: INK, opacity: 0.55 }}>{data.brand}</p>}
        {sourceLabel && (
          <span className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase mono-f" style={{ background: TURMERIC, color: INK }}>
            {sourceLabel}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="mb-5">
          <div className="flex items-center gap-1.5 mb-2">
            <Leaf size={15} color={CURRY} />
            <h3 className="body-f text-sm font-bold uppercase tracking-wide" style={{ color: CURRY }}>சேர்க்கைப் பொருட்கள்</h3>
          </div>
          <p className="body-f text-sm leading-relaxed" style={{ color: INK, opacity: 0.85 }}>
            {data.ingredients || "Label-ல ingredients தெளிவா தெரியல."}
          </p>
        </div>

        {chemicals.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <FlaskConical size={15} color={CHILI} />
              <h3 className="body-f text-sm font-bold uppercase tracking-wide" style={{ color: CHILI }}>Additives / கெமிக்கல்ஸ்</h3>
            </div>
            <div className="flex flex-wrap">{chemicals.map((a, i) => <Chip key={i} tone="chili">{a}</Chip>)}</div>
          </div>
        )}

        {allergens.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center gap-1.5 mb-2">
              <AlertTriangle size={15} color={TURMERIC} />
              <h3 className="body-f text-sm font-bold uppercase tracking-wide" style={{ color: "#946A17" }}>அலர்ஜி எச்சரிக்கை</h3>
            </div>
            <div className="flex flex-wrap">{allergens.map((a, i) => <Chip key={i} tone="turmeric">{a}</Chip>)}</div>
          </div>
        )}

        {nutrition && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Flame size={15} color={CHILI} />
              <h3 className="body-f text-sm font-bold uppercase tracking-wide" style={{ color: CHILI }}>ஊட்டச்சத்து (100g-க்கு)</h3>
            </div>
            <div>
              <Nutrient label="கலோரி" value={nutrition.calories_kcal_per_100g} unit="kcal" />
              <Nutrient label="புரதம்" value={nutrition.protein_g} unit="g" />
              <Nutrient label="கொழுப்பு" value={nutrition.fat_g} unit="g" />
              <Nutrient label="சர்க்கரை" value={nutrition.sugar_g} unit="g" />
              <Nutrient label="கார்போஹைட்ரேட்" value={nutrition.carbs_g} unit="g" />
              <Nutrient label="உப்பு" value={nutrition.salt_g} unit="g" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.onerror = () => reject(new Error("read_failed"));
    r.readAsDataURL(file);
  });
}

function extractJson(text) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI பதிலில் JSON கிடைக்கல்: " + text.slice(0, 150));
  return JSON.parse(cleaned.slice(start, end + 1));
}

export default function App() {
  const [view, setView] = useState("browse"); // browse | scan
  const [mode, setMode] = useState("food");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);

  const [imgPreview, setImgPreview] = useState(null);
  const [scanStatus, setScanStatus] = useState("idle"); // idle | loading | done | error
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState("");

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
      const base64 = await fileToBase64(file);
      const mediaType = file.type || "image/jpeg";

      const prompt = `இது ஒரு இந்திய தயாரிப்பின் (உணவு அல்லது cosmetic) packet/label புகைப்படம். இதில் தெரியும் ingredients list, nutrition facts, brand பெயரை படித்து, கீழ்க்கண்ட shape-ல மட்டும் raw JSON கொடு (markdown fence வேண்டாம், commentary வேண்டாம்):
{
  "name": string,
  "brand": string,
  "ingredients": string,
  "chemicals": string[],
  "allergens": string[],
  "nutrition": { "calories_kcal_per_100g": number|null, "protein_g": number|null, "fat_g": number|null, "sugar_g": number|null, "carbs_g": number|null, "salt_g": number|null } | null
}
படத்தில் label தெளிவா தெரியலைனா: {"error": "படம் தெளிவா இல்ல, மறுபடியும் அருகில் இருந்து புகைப்படம் எடு"}`;

      // Calls our own backend route (api/scan.js) instead of Anthropic directly,
      // so the API key stays secret on the server and never reaches the browser.
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mediaType,
          base64,
          prompt,
        }),
      });

      if (!response.ok) {
        const t = await response.text();
        throw new Error(`API பிழை ${response.status}: ${t.slice(0, 200)}`);
      }

      const data = await response.json();
      const textOut = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
      if (!textOut) throw new Error("AI-யிடம் இருந்து பதில் காலியா வந்துச்சு");

      const parsed = extractJson(textOut);
      if (parsed.error) {
        setScanError(parsed.error);
        setScanStatus("error");
        return;
      }
      setScanResult(parsed);
      setScanStatus("done");
    } catch (err) {
      setScanError(err.message || String(err));
      setScanStatus("error");
    }
  };

  const resetScan = () => {
    setScanStatus("idle");
    setScanResult(null);
    setScanError("");
    setImgPreview(null);
  };

  return (
    <div className="min-h-screen w-full" style={{ background: PAPER, fontFamily: "'Georgia', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500&display=swap');
        .display { font-family: 'Fraunces', serif; }
        .body-f { font-family: 'Inter', sans-serif; }
        .mono-f { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <header className="px-5 pt-6 pb-5" style={{ background: INK }}>
        <div className="flex items-center gap-2 mb-4">
          <PackageSearch size={20} color={TURMERIC} />
          <span className="body-f text-xs tracking-[0.2em] uppercase" style={{ color: TURMERIC }}>லேபிள் திறந்து பாருங்க</span>
        </div>
        <h1 className="display text-3xl leading-tight" style={{ color: PAPER }}>என்ன சேர்த்திருக்காங்க?</h1>

        {/* view toggle */}
        <div className="flex gap-2 mt-5">
          <button
            onClick={() => { setView("browse"); resetScan(); }}
            className="body-f flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold flex-1 justify-center"
            style={{ background: view === "browse" ? TURMERIC : "transparent", color: view === "browse" ? INK : PAPER, border: `1px solid ${view === "browse" ? TURMERIC : "#4A5640"}` }}
          >
            <Search size={14} /> பட்டியலில் தேடு
          </button>
          <button
            onClick={() => setView("scan")}
            className="body-f flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold flex-1 justify-center"
            style={{ background: view === "scan" ? CHILI : "transparent", color: PAPER, border: `1px solid ${view === "scan" ? CHILI : "#4A5640"}` }}
          >
            <ScanLine size={14} /> லேபிள் ஸ்கேன்
          </button>
        </div>

        {view === "browse" && (
          <>
            <div className="flex gap-2 mt-4">
              {[{ id: "food", label: "உணவு பொருள்", icon: Flame }, { id: "cosmetic", label: "சோப் / பேஸ்ட்", icon: FlaskConical }].map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => { setMode(id); setSelected(null); setQuery(""); }}
                  className="body-f flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
                  style={{ background: mode === id ? TURMERIC : "transparent", color: mode === id ? INK : PAPER, border: `1px solid ${mode === id ? TURMERIC : "#4A5640"}` }}>
                  <Icon size={14} />{label}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-lg" style={{ background: PAPER }}>
              <Search size={16} color={INK} opacity={0.5} />
              <input value={query} onChange={(e) => { setQuery(e.target.value); setSelected(null); }}
                placeholder={mode === "food" ? "Parle-G, Maggi, Lay's..." : "Colgate, Dove, Lifebuoy..."}
                className="body-f flex-1 bg-transparent outline-none text-sm" style={{ color: INK }} />
            </div>
          </>
        )}
      </header>

      <main className="px-5 py-5 max-w-2xl mx-auto">
        {view === "browse" && !selected && (
          <>
            {results.length === 0 && (
              <div className="text-center py-10 body-f" style={{ color: INK, opacity: 0.6 }}>
                <p className="text-sm">இந்த பெயருக்கு தற்போதைக்கு பட்டியலில் தகவல் இல்ல.</p>
                <p className="text-xs mt-1 opacity-70">"லேபிள் ஸ்கேன்" tab-க்கு போய் பேக்கெட் புகைப்படம் எடுத்து பாருங்க.</p>
              </div>
            )}
            <div className="grid gap-3">
              {results.map((p) => (
                <button key={p.id} onClick={() => setSelected(p)} className="text-left flex items-center gap-3 p-3 rounded-xl transition-transform hover:scale-[1.01]" style={{ background: CARD, border: "1px solid #E3D9BB" }}>
                  <div className="w-12 h-12 rounded-md flex items-center justify-center shrink-0" style={{ background: PAPER }}>
                    {p.category === "food" ? <Flame size={18} color={CHILI} /> : <FlaskConical size={18} color={CURRY} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="display text-base leading-tight truncate" style={{ color: INK }}>{p.name}</p>
                    <p className="body-f text-xs mt-0.5 truncate" style={{ color: INK, opacity: 0.55 }}>{p.brand}</p>
                  </div>
                  {p.nutrition?.calories_kcal_per_100g && (
                    <div className="text-right shrink-0">
                      <p className="mono-f text-sm font-bold" style={{ color: CHILI }}>{p.nutrition.calories_kcal_per_100g}</p>
                      <p className="body-f text-[10px] opacity-50">kcal/100g</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {view === "browse" && selected && (
          <div>
            <button onClick={() => setSelected(null)} className="body-f flex items-center gap-1 text-xs font-semibold mb-4" style={{ color: INK, opacity: 0.6 }}>
              <ChevronLeft size={14} /> பட்டியலுக்கு திரும்பு
            </button>
            <DetailCard data={selected} />
          </div>
        )}

        {view === "scan" && (
          <div>
            {scanStatus === "idle" && (
              <div className="text-center py-10">
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className="flex flex-col items-center justify-center gap-2 py-8 rounded-2xl body-f cursor-pointer"
                    style={{ background: CARD, border: `2px dashed ${CHILI}` }}
                  >
                    <Camera size={28} color={CHILI} />
                    <span className="text-sm font-semibold text-center" style={{ color: INK }}>Camera-ஐ திற</span>
                    <input type="file" accept="image/*" capture="environment" className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0])} />
                  </label>
                  <label
                    className="flex flex-col items-center justify-center gap-2 py-8 rounded-2xl body-f cursor-pointer"
                    style={{ background: CARD, border: `2px dashed ${CURRY}` }}
                  >
                    <PackageSearch size={28} color={CURRY} />
                    <span className="text-sm font-semibold text-center" style={{ color: INK }}>Gallery-ல தேர்வு</span>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => handleFile(e.target.files?.[0])} />
                  </label>
                </div>
                <p className="body-f text-xs mt-4" style={{ color: INK, opacity: 0.5 }}>
                  label-ல உள்ள எழுத்துக்கள் தெளிவா தெரியுற மாதிரி, நல்ல வெளிச்சத்துல புகைப்படம் எடுங்க
                </p>
              </div>
            )}

            {(scanStatus === "loading" || scanStatus === "done" || scanStatus === "error") && imgPreview && (
              <div className="mb-4 relative">
                <img src={imgPreview} alt="scanned label" className="w-full max-h-56 object-cover rounded-xl" style={{ border: "1px solid #E3D9BB" }} />
                <button onClick={resetScan} className="absolute top-2 right-2 p-1.5 rounded-full" style={{ background: INK }}>
                  <X size={14} color={PAPER} />
                </button>
              </div>
            )}

            {scanStatus === "loading" && (
              <div className="flex flex-col items-center py-8 body-f" style={{ color: INK }}>
                <Loader2 className="animate-spin mb-2" />
                <p className="text-sm opacity-70">label படிக்குது...</p>
              </div>
            )}

            {scanStatus === "error" && (
              <div className="text-center py-6 body-f rounded-xl px-4" style={{ color: CHILI, background: CARD }}>
                <AlertTriangle className="mx-auto mb-2" />
                <p className="text-sm font-semibold">படிக்க முடியல</p>
                <p className="text-xs mt-2 opacity-70 break-words">{scanError}</p>
                <label className="body-f mt-3 inline-block px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer" style={{ background: CHILI, color: PAPER }}>
                  மறுபடியும் புகைப்படம் எடு
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                </label>
              </div>
            )}

            {scanStatus === "done" && scanResult && (
              <div>
                <DetailCard data={scanResult} sourceLabel="Scan செய்யப்பட்டது" />
                <button onClick={resetScan} className="body-f mt-4 w-full py-2.5 rounded-lg text-sm font-semibold" style={{ background: INK, color: PAPER }}>
                  இன்னொரு பொருளை ஸ்கேன் செய்
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="px-5 py-6 body-f text-[11px]" style={{ color: INK, opacity: 0.5 }}>
        <div className="flex items-start gap-1.5 max-w-2xl mx-auto">
          <Info size={13} className="shrink-0 mt-0.5" />
          <p>பட்டியல் தேடல் {DB.length} demo பொருட்களுக்கு offline-ஆ வேலை செய்யும். ஸ்கேன் feature AI vision மூலமா label-ஐ நேரடியா படிக்கும் — internet தேவை.</p>
        </div>
      </footer>
    </div>
  );
}
