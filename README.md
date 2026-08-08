# என்ன சேர்த்திருக்காங்க? — Ingredient Scanner

இது ஒரு React வெப் ஆப் — இந்திய food/cosmetic பொருட்களின் ingredients, chemicals, nutrition தகவலை காட்டுகிறது. AI photo scan feature-க்கு Google Gemini API key தேவை (இது credit card இல்லாம free-ஆ கிடைக்கும்).

## Live website-ஆ போட (Tamil-ல படிகள்)

### 1. GitHub-ல code-ஐ upload பண்ணுங்க
1. github.com-ல ஒரு account create பண்ணுங்க (இல்லைனா login பண்ணுங்க)
2. "New repository" → பேர் கொடுங்க (எ.கா. `ingredient-scanner`) → Create
3. இந்த முழு folder-ஐயும் (இதுல இருக்குற எல்லா files/folders-ஐயும்) அந்த repo-வுக்கு upload பண்ணுங்க

### 2. Google Gemini API key வாங்குங்க (free, credit card வேண்டாம்)
1. aistudio.google.com-க்கு போங்க → உங்க Gmail account-ஏ use பண்ணி login பண்ணுங்க
2. "Get API key" → "Create API key" தட்டுங்க
3. புது Google Cloud project create பண்ண சொன்னா, "ingredient-scanner" இப்படி ஒரு பேர் கொடுங்க
4. Key create ஆகும் (`AIzaSy...` இப்படி ஆரம்பிக்கும்) — அதை copy பண்ணி வையுங்க. Chat-ல/பொது இடத்துல இதை share பண்ண வேண்டாம்.
5. இது free tier — நாளைக்கு 1,500 requests வரை free, credit card தேவையில்ல

### 3. Vercel-ல live-ஆ போடுங்க (free)
1. vercel.com-க்கு போங்க → "Sign up with GitHub"
2. "Add New Project" → உங்க `ingredient-scanner` repo-வை தேர்ந்தெடுங்க → Import
3. Deploy பண்றதுக்கு முன்னாடி, "Environment Variables" section-ல ஒண்ணு சேருங்க:
   - Name: `GEMINI_API_KEY`
   - Value: (step 2-ல வாங்கின key-ஐ paste பண்ணுங்க)
4. "Deploy" button அழுத்துங்க — 1-2 நிமிடத்துல live website URL கிடைக்கும்

### 4. Test பண்ணுங்க
அந்த URL-ஐ phone-ல திறந்து, "லேபிள் ஸ்கேன்" tab-க்கு போய் packet photo upload பண்ணி பாருங்க. Real website ஆனதால் camera முழுசா வேலை செய்யும்.

## கவனிக்க வேண்டியது
- "பட்டியலில் தேடு" — உடனே offline-ஆ வேலை செய்யும் (15 curated products)
- "லேபிள் ஸ்கேன்" — internet + Gemini API key + Vercel deploy தேவை
- Gemini free tier நாளைக்கு 1,500 requests வரை போதும் — சாதாரண personal use-க்கு billing தேவைப்படாது
- API key-ஐ ஒருபோதும் code-ல நேரடியா type பண்ணாதீங்க — Vercel Environment Variable-ல மட்டும் வையுங்க
