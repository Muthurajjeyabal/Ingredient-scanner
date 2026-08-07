# என்ன சேர்த்திருக்காங்க? — Ingredient Scanner

இது ஒரு React வெப் ஆப் — இந்திய food/cosmetic பொருட்களின் ingredients, chemicals, nutrition தகவலை காட்டுகிறது. AI photo scan feature-க்கு Anthropic API key தேவை.

## Live website-ஆ போட (Tamil-ல படிகள்)

### 1. GitHub-ல code-ஐ upload பண்ணுங்க
1. github.com-ல ஒரு account create பண்ணுங்க (இல்லைனா login பண்ணுங்க)
2. "New repository" → பேர் கொடுங்க (எ.கா. `ingredient-scanner`) → Create
3. இந்த முழு folder-ஐயும் (இதுல இருக்குற எல்லா files/folders-ஐயும்) அந்த repo-வுக்கு upload பண்ணுங்க
   - Web browser-லேயே "uploading an existing file" மூலமா நேரடியா drag & drop பண்ணலாம்
   - அல்லது `git` தெரிஞ்சவங்க terminal-ல `git push` பண்ணலாம்

### 2. Anthropic API key வாங்குங்க
1. console.anthropic.com-க்கு போங்க → login/signup
2. "API Keys" section-ல ஒரு புது key create பண்ணுங்க
3. அதை copy பண்ணி வையுங்க (இது ஒரு தடவைதான் காமிக்கும்)
4. இந்த key-க்கு usage-படி billing (pay-as-you-go) இருக்கும் — console-ல credit சேர்க்கணும்

### 3. Vercel-ல live-ஆ போடுங்க (free)
1. vercel.com-க்கு போங்க → "Sign up with GitHub" (உங்க GitHub account-ஏ use பண்ணுங்க)
2. "Add New Project" → உங்க `ingredient-scanner` repo-வை தேர்ந்தெடுங்க → Import
3. Deploy பண்றதுக்கு முன்னாடி, "Environment Variables" section-ல ஒண்ணு சேருங்க:
   - Name: `ANTHROPIC_API_KEY`
   - Value: (step 2-ல வாங்கின key-ஐ paste பண்ணுங்க)
4. "Deploy" button அழுத்துங்க — 1-2 நிமிடத்துல live website URL கிடைக்கும் (எ.கா. `ingredient-scanner.vercel.app`)

### 4. Test பண்ணுங்க
அந்த URL-ஐ phone-ல திறந்து, "லேபிள் ஸ்கேன்" tab-க்கு போய் camera/gallery-ல இருந்து ஒரு packet photo upload பண்ணி பாருங்க. இப்போ இது ஒரு real website ஆனதால், camera முழுசா வேலை செய்யும்.

## Local-ஆ test பண்ண வேணும்னா
```
npm install
npm run dev
```
(local-ல scan feature வேலை செய்ய, root-ல `.env.local` file உருவாக்கி `ANTHROPIC_API_KEY=உங்க-key` சேர்க்கணும், பிறகு `vercel dev` பயன்படுத்தணும் — `npm run dev` மட்டும் backend function-ஐ run பண்ணாது.)

## கவனிக்க வேண்டியது
- "பட்டியலில் தேடு" — உடனே offline-ஆ வேலை செய்யும் (15 curated products)
- "லேபிள் ஸ்கேன்" — internet + API key + Vercel deploy தேவை
- API usage-க்கு Anthropic billing charge ஆகும் (per-image cost குறைவுதான், ஆனா track பண்ணிக்கிட்டு இருங்க)
