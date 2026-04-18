const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;

export async function chatWithManoBot(messages: any[], context: any) {
  try {
    // Check if API key is available and not placeholder
    if (!OPENAI_API_KEY || OPENAI_API_KEY.includes("your_api_key_here")) {
      // Return mock response for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      return { 
        role: "assistant", 
        content: "I'm here for you. It sounds like you're going through a lot, but remember that you're not alone. Would you like to try a breathing exercise or listen to some calming music?" 
      };
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `You are ManoBot, a compassionate, non-clinical mental wellness companion. You are warm, empathetic, and supportive. You never diagnose. You always validate feelings first before suggesting. You gently recommend professional help when appropriate.
            Current user emotion context: ${JSON.stringify(context.emotion)}.
            User profile: ${JSON.stringify(context.user)}.
            Keep responses concise (2-4 sentences), warm, and actionable.
            If crisis keywords detected, immediately provide helpline: iCall (9152987821), Vandrevala (1860-2662-345), AASRA (9820466627).`
          },
          ...messages
        ],
        stream: false, // For simplicity in this demo, but ideally stream
      }),
    });
    const result = await response.json();
    return result.choices[0].message;
  } catch (error) {
    console.error("OpenAI Chat Error:", error);
    return { role: "assistant", content: "I'm sorry, I'm having trouble connecting right now. But I'm here for you. 💜" };
  }
}
