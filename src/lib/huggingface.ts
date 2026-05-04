const HUGGINGFACE_API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;

// Sentiment keywords for better local analysis
const sentimentKeywords = {
  sadness: [
    "sad",
    "depressed",
    "unhappy",
    "miserable",
    "down",
    "devastated",
    "heartbroken",
    "lonely",
    "awful",
    "terrible",
    "horrible",
    "bad",
    "cry",
    "tears",
    "pain",
    "hurt",
    "suffer",
    "broken",
    "shattered",
    "lost",
    "empty",
    "hopeless",
    "worthless",
    "fail",
    "failure",
    "weak",
    "disappointed",
    "discouraged",
    "blue",
    "gloomy",
    "upset",
    "low",
    "moody",
    "melancholy",
    "sorrowful",
    "despondent",
    "forlorn",
    "disheartened",
    "dejected",
    "grief",
    "grieve",
    "mourning",
    "very sad",
    "so sad",
  ],
  anger: [
    "angry",
    "furious",
    "rage",
    "mad",
    "irritated",
    "annoyed",
    "frustrated",
    "pissed",
    "hate",
    "despise",
    "angry",
    "aggressive",
    "hostile",
    "bitter",
    "resentful",
    "enraged",
    "livid",
    "violent",
    "temper",
    "upset",
    "outraged",
  ],
  fear: [
    "afraid",
    "scared",
    "terrified",
    "anxious",
    "worried",
    "nervous",
    "panic",
    "phobia",
    "dread",
    "fear",
    "frightened",
    "horror",
    "alarmed",
    "apprehensive",
    "concerned",
    "anxious",
    "stressed",
    "tense",
    "uneasy",
    "terrifying",
  ],
  joy: [
    "happy",
    "joy",
    "joyful",
    "delighted",
    "excited",
    "great",
    "wonderful",
    "fantastic",
    "amazing",
    "awesome",
    "love",
    "adore",
    "perfect",
    "excellent",
    "thrilled",
    "blessed",
    "grateful",
    "thankful",
    "content",
    "cheerful",
    "smiling",
  ],
  surprise: [
    "surprised",
    "shocked",
    "amazed",
    "astonished",
    "wow",
    "unexpected",
    "bewildered",
    "stunned",
    "startled",
    "unbelievable",
    "incredible",
  ],
  disgust: [
    "disgusted",
    "disgusting",
    "gross",
    "yuck",
    "nasty",
    "repulsive",
    "vile",
    "revolting",
    "abhorrent",
    "hateful",
    "icky",
    "unpleasant",
  ],
  neutral: [
    "okay",
    "fine",
    "alright",
    "normal",
    "regular",
    "usual",
    "so-so",
    "meh",
  ],
};

function analyzeSentimentLocal(text: string) {
  const lowerText = text.toLowerCase();
  const scores: Record<string, number> = {
    joy: 0,
    sadness: 0,
    anger: 0,
    fear: 0,
    surprise: 0,
    disgust: 0,
    neutral: 0.1,
  };

  // Count keyword matches
  Object.entries(sentimentKeywords).forEach(([emotion, keywords]) => {
    keywords.forEach((keyword) => {
      // Match whole words only
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const matches = text.match(regex) || [];
      scores[emotion] += matches.length * 0.15;
    });
  });

  // Boost negation detection (e.g., "not happy" = more sadness/neutral)
  const negationRegex =
    /\b(not|don't|doesn't|didn't|can't|couldn't|won't|wouldn't|no|never)\b/gi;
  const negations = text.match(negationRegex) || [];
  if (negations.length > 0) {
    scores.joy *= 0.5;
    scores.sadness *= 1.5;
    scores.neutral += 0.1;
  }

  // Boost intensity for repeated characters (e.g., "sooooo sad")
  const repeatedChars = text.match(/(.)\1{2,}/g) || [];
  if (repeatedChars.length > 0) {
    const maxEmotion = Object.entries(scores).reduce((prev, current) =>
      prev[1] > current[1] ? prev : current,
    );
    scores[maxEmotion[0]] *= 1.3;
  }

  // Normalize scores to sum to 1
  const total = Object.values(scores).reduce((a, b) => a + b, 0.01);
  Object.keys(scores).forEach((emotion) => {
    scores[emotion] = Math.min(1, scores[emotion] / total);
  });

  // Convert to result format and sort by score
  return Object.entries(scores)
    .map(([label, score]) => ({ label, score }))
    .sort((a, b) => b.score - a.score);
}

export async function analyzeTextEmotion(text: string) {
  try {
    // Check if API key is available and not placeholder
    if (
      !HUGGINGFACE_API_KEY ||
      HUGGINGFACE_API_KEY.includes("your_api_key_here")
    ) {
      // Use local sentiment analysis
      return analyzeSentimentLocal(text);
    }

    const response = await fetch(
      "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
      {
        headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` },
        method: "POST",
        body: JSON.stringify({ inputs: text }),
      },
    );
    const result = await response.json();
    return result[0]; // Returns array of { label: string, score: number }
  } catch (error) {
    console.error("HuggingFace Analysis Error:", error);
    // Fallback to local analysis on API error
    return analyzeSentimentLocal(text);
  }
}
