// Vercel Serverless Function: Proxies chat requests to OpenRouter securely
// Expects process.env.OPENROUTER_API_KEY and optional process.env.OPENROUTER_MODEL

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: { message: "Method Not Allowed" } });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const defaultModel = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

  if (!apiKey) {
    return res
      .status(500)
      .json({ error: { message: "Missing OPENROUTER_API_KEY on server" } });
  }

  try {
    const vercelHost = process.env.VERCEL_URL; // e.g. my-app.vercel.app
    const inferredOrigin = vercelHost ? `https://${vercelHost}` : undefined;
    const referer =
      inferredOrigin ||
      req.headers?.origin ||
      `https://${req.headers?.host || "vercel.app"}`;
    // Vercel may pass body as a string; parse if needed
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res
          .status(400)
          .json({ error: { message: "Invalid JSON in request body" } });
      }
    }

    const { messages, model } = body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ error: { message: "Missing messages array in request body" } });
    }

    let response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": referer,
        "X-Title": "AI Career Guidance System",
      },
      body: JSON.stringify({
        model: model || defaultModel,
        messages,
        temperature: 0.2,
        max_tokens: 500,
        stream: false,
      }),
    });

    // Quick retry for rate limit or server errors
    if (!response.ok && (response.status === 429 || response.status >= 500)) {
      await new Promise((r) => setTimeout(r, 600));
      response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": referer,
          "X-Title": "AI Career Guidance System",
        },
        body: JSON.stringify({
          model: model || defaultModel,
          messages,
          temperature: 0.2,
          max_tokens: 500,
          stream: false,
        }),
      });
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const apiMessage = data?.error?.message || data?.message || data;
      const status = response.status || 500;
      const message =
        status === 401 || status === 403
          ? `OpenRouter authentication failed (${status}). Check OPENROUTER_API_KEY permissions. Details: ${apiMessage}`
          : `OpenRouter API error ${status}: ${apiMessage}`;
      console.error("Chat API error:", { status, apiMessage });
      return res.status(status).json({ error: { message } });
    }

    return res.status(200).json({
      message: data.choices?.[0]?.message?.content || "No response received",
      usage: data.usage,
      model: data.model,
      provider: data.provider,
    });
  } catch (error) {
    console.error("Chat API unhandled error:", error);
    return res.status(500).json({ error: { message: error.message } });
  }
};
