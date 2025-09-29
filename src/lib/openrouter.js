// Frontend client now calls our secure serverless route instead of OpenRouter directly
const INTERNAL_CHAT_API = "/api/chat";
const OPENROUTER_DEFAULT_MODEL =
  import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-4o-mini"; // fast + strong

export const openRouterAPI = {
  sendMessage: async (messages, model = OPENROUTER_DEFAULT_MODEL) => {
    try {
      let response = await fetch(INTERNAL_CHAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages }),
      });

      // Quick retry for transient errors
      if (!response.ok && (response.status === 429 || response.status >= 500)) {
        await new Promise((r) => setTimeout(r, 600));
        response = await fetch(INTERNAL_CHAT_API, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, messages }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        const apiMessage =
          data?.error?.message || data?.message || JSON.stringify(data);
        // If local dev server doesn't serve /api (e.g., Vite), fall back to direct OpenRouter call
        if (isLocalDev()) {
          console.warn(
            "/api/chat unavailable or failing locally; falling back to direct OpenRouter call"
          );
          return await directOpenRouterCall(messages, model);
        }
        throw new Error(`Chat API error ${response.status}: ${apiMessage}`);
      }
      return {
        success: true,
        message: data.message || "No response received",
        usage: data.usage,
      };
    } catch (error) {
      // Network or parsing error; try local fallback in dev
      if (isLocalDev()) {
        console.warn(
          "/api/chat request failed; attempting direct OpenRouter fallback:",
          error?.message
        );
        try {
          return await directOpenRouterCall(messages, model);
        } catch (fallbackError) {
          console.error("Direct OpenRouter fallback failed:", fallbackError);
        }
      }
      console.error("OpenRouter API Error:", error);
      return { success: false, error: error.message };
    }
  },

  generateCareerAdvice: async (userProfile, question) => {
    const systemPrompt = `You are an expert AI career advisor. You help professionals navigate their career journey with personalized guidance, skill recommendations, and strategic advice.

User Profile:
- Name: ${userProfile.name || "User"}
- Current Title: ${userProfile.title || "Not specified"}
- Location: ${userProfile.location || "Not specified"}
- Interests: ${userProfile.interests?.join(", ") || "Not specified"}
- Bio: ${userProfile.bio || "Not specified"}

Provide helpful, actionable career advice that is:
1. Personalized to their background and goals
2. Practical and implementable
3. Encouraging and supportive
4. Based on current industry trends
5. Specific with concrete next steps

Keep responses concise but comprehensive, around 200-300 words.`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: question },
    ];

    return await openRouterAPI.sendMessage(messages);
  },
};

// Local dev fallback: call OpenRouter directly from the browser using VITE_OPENROUTER_API_KEY
async function directOpenRouterCall(messages, model) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing VITE_OPENROUTER_API_KEY for local fallback.");
  }
  const url = "https://openrouter.ai/api/v1/chat/completions";
  let response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": window.location.origin,
      "X-Title": "AI Career Guidance System (Local)",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.2,
      max_tokens: 500,
      stream: false,
    }),
  });

  if (!response.ok && (response.status === 429 || response.status >= 500)) {
    await new Promise((r) => setTimeout(r, 600));
    response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": window.location.origin,
        "X-Title": "AI Career Guidance System (Local)",
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.2,
        max_tokens: 500,
        stream: false,
      }),
    });
  }

  const data = await response.json();
  if (!response.ok) {
    const apiMessage =
      data?.error?.message || data?.message || JSON.stringify(data);
    if (response.status === 401 || response.status === 403) {
      throw new Error(
        `OpenRouter auth failed in local fallback (${response.status}). Check VITE_OPENROUTER_API_KEY. Details: ${apiMessage}`
      );
    }
    throw new Error(
      `OpenRouter fallback error ${response.status}: ${apiMessage}`
    );
  }

  return {
    success: true,
    message: data.choices?.[0]?.message?.content || "No response received",
    usage: data.usage,
  };
}

function isLocalDev() {
  if (typeof window === "undefined") return false;
  const host = window.location?.hostname || "";
  return /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(host);
}
