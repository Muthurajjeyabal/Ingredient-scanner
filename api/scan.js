// Serverless function (Vercel). Runs on the server, so the API key
// never gets exposed to the browser. Deploys automatically as /api/scan.
// Uses Google Gemini's free API tier (no credit card required) instead of Anthropic.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    // Diagnostic: list env var NAMES containing "GEMINI" or "API" (never values)
    // so we can see if the variable exists under a slightly different name.
    const relatedKeys = Object.keys(process.env).filter(
      (k) => k.toUpperCase().includes("GEMINI") || k.toUpperCase().includes("API")
    );
    return res.status(500).json({ error: "server_missing_api_key", relatedKeys });
  }

  const { mediaType, base64, prompt } = req.body || {};
  if (!mediaType || !base64 || !prompt) {
    return res.status(400).json({ error: "missing_fields" });
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { inline_data: { mime_type: mediaType, data: base64 } },
                { text: prompt },
              ],
            },
          ],
        }),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      return res.status(geminiRes.status).json({ error: "gemini_error", detail: data });
    }

    // Reshape Gemini's response into the same { content: [{type:"text", text}] }
    // shape the frontend already expects (originally written for Anthropic),
    // so App.jsx doesn't need to change.
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("\n") || "";

    return res.status(200).json({ content: [{ type: "text", text }] });
  } catch (err) {
    return res.status(500).json({ error: "proxy_failed", detail: String(err) });
  }
}
