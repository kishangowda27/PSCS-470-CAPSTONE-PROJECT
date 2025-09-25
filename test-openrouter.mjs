// Minimal OpenRouter key test
const API_KEY =
  process.env.VITE_OPENROUTER_API_KEY ||
  "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";
const url = "https://openrouter.ai/api/v1/chat/completions";

const body = {
  model: process.env.VITE_OPENROUTER_MODEL || "openai/gpt-4o-mini",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Say ok." },
  ],
  temperature: 0.1,
  max_tokens: 10,
};

async function main() {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "Key Test",
      },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    console.log("status:", res.status);
    console.log("response:", JSON.stringify(json));
  } catch (e) {
    console.error("request failed:", e.message);
  }
}

main();
