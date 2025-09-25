const OPENROUTER_API_KEY =
  import.meta.env.VITE_OPENROUTER_API_KEY ||
  "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";
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_DEFAULT_MODEL =
  import.meta.env.VITE_OPENROUTER_MODEL || "openai/gpt-4o-mini"; // fast + strong

if (!OPENROUTER_API_KEY) {
  throw new Error("Missing OpenRouter API key. Please check your .env file.");
}

export const openRouterAPI = {
  sendMessage: async (messages, model = OPENROUTER_DEFAULT_MODEL) => {
    try {
      let response = await fetch(OPENROUTER_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "AI Career Guidance System",
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.2, // more accurate
          max_tokens: 500, // faster responses
          stream: false,
        }),
      });

      // Quick retry for transient errors
      if (!response.ok && (response.status === 429 || response.status >= 500)) {
        await new Promise((r) => setTimeout(r, 600));
        response = await fetch(OPENROUTER_API_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": window.location.origin,
            "X-Title": "AI Career Guidance System",
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
        throw new Error(
          `OpenRouter API error ${response.status}: ${apiMessage}`
        );
      }
      return {
        success: true,
        message: data.choices[0]?.message?.content || "No response received",
        usage: data.usage,
      };
    } catch (error) {
      console.error("OpenRouter API Error:", error);
      return {
        success: false,
        error: error.message,
      };
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
