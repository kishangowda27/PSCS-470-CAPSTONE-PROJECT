// Minimal OpenRouter key test
const API_KEY = process.env.VITE_OPENROUTER_API_KEY;
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
  if (!API_KEY) {
    console.error(
      "Missing VITE_OPENROUTER_API_KEY. Set it in your .env and retry."
    );
    process.exit(1);
  }
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
    if (res.status === 401 || res.status === 403) {
      console.error(
        "Auth failed. Verify your OpenRouter key is valid and has model access."
      );
      process.exit(1);
    }
  } catch (e) {
    console.error("request failed:", e.message);
  }
}

main();
