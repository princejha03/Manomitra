const HUGGINGFACE_API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;

export async function analyzeTextEmotion(text: string) {
  try {
    // Check if API key is available and not placeholder
    if (!HUGGINGFACE_API_KEY || HUGGINGFACE_API_KEY.includes("your_api_key_here")) {
      // Return mock response for demo purposes
      return [
        { label: "joy", score: 0.85 },
        { label: "neutral", score: 0.1 },
        { label: "sadness", score: 0.02 },
        { label: "anger", score: 0.01 },
        { label: "fear", score: 0.01 },
        { label: "surprise", score: 0.01 },
      ];
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
      {
        headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` },
        method: "POST",
        body: JSON.stringify({ inputs: text }),
      }
    );
    const result = await response.json();
    return result[0]; // Returns array of { label: string, score: number }
  } catch (error) {
    console.error("HuggingFace Analysis Error:", error);
    return null;
  }
}
