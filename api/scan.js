// Serverless function (Vercel). Runs on the server, so the API key
// never gets exposed to the browser. Deploys automatically as /api/scan.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "server_missing_api_key" });
  }

  const { mediaType, base64, prompt } = req.body || {};
  if (!mediaType || !base64 || !prompt) {
    return res.status(400).json({ error: "missing_fields" });
  }

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: mediaType, data: base64 } },
              { type: "text", text: prompt },
            ],
          },
        ],
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      return res.status(anthropicRes.status).json({ error: "anthropic_error", detail: data });
    }

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: "proxy_failed", detail: String(err) });
  }
}
