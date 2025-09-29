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
        throw new Error(`Chat API error ${response.status}: ${apiMessage}`);
      }
      return {
        success: true,
        message: data.message || "No response received",
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
