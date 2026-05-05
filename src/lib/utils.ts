import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Emotion } from "@/types";
import { EmotionProfile, ActivityLog } from "@/store/useStore";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapToInternalEmotion(externalLabel: string): Emotion {
  const label = externalLabel.toLowerCase();

  // HuggingFace & Face-api mappings
  if (label.includes("joy") || label.includes("happy")) return "Happy";
  if (label.includes("sad")) return "Sad";
  if (label.includes("anger") || label.includes("angry")) return "Angry";
  if (
    label.includes("fear") ||
    label.includes("anxious") ||
    label.includes("fearful")
  )
    return "Anxious";
  if (label.includes("calm") || label.includes("peaceful")) return "Calm";

  return "Neutral";
}

// Analytics Functions
export function calculateMoodTrend(
  emotionHistory: EmotionProfile[],
  days: number = 7,
) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const recentEmotions = emotionHistory.filter((e) => e.timestamp > cutoff);

  if (recentEmotions.length === 0) return [];

  // Group by day
  const grouped: { [key: string]: EmotionProfile[] } = {};
  recentEmotions.forEach((emotion) => {
    const date = new Date(emotion.timestamp).toLocaleDateString();
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(emotion);
  });

  return Object.entries(grouped).map(([date, emotions]) => ({
    date,
    avgIntensity:
      emotions.reduce((sum, e) => sum + (e.intensity || 50), 0) /
      emotions.length,
    emotionCount: emotions.length,
    dominantEmotion: emotions[0].dominantEmotion,
    emotions: emotions.map((e) => e.dominantEmotion),
  }));
}

export function getEmotionStats(
  emotionHistory: EmotionProfile[],
  days: number = 30,
) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const recentEmotions = emotionHistory.filter((e) => e.timestamp > cutoff);

  if (recentEmotions.length === 0) {
    return {
      averageIntensity: 0,
      dominantEmotions: [],
      totalEntries: 0,
      emotionBreakdown: {},
    };
  }

  const emotionCounts: { [key: string]: number } = {};
  let totalIntensity = 0;

  recentEmotions.forEach((emotion) => {
    emotionCounts[emotion.dominantEmotion] =
      (emotionCounts[emotion.dominantEmotion] || 0) + 1;
    totalIntensity += emotion.intensity || 50;
  });

  const dominantEmotions = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([emotion]) => emotion);

  return {
    averageIntensity: Math.round(totalIntensity / recentEmotions.length),
    dominantEmotions,
    totalEntries: recentEmotions.length,
    emotionBreakdown: emotionCounts,
  };
}

// Activity Recommendations
export function getSmartRecommendations(
  emotion: Emotion,
): Array<{ type: string; name: string; description: string; icon: string }> {
  const recommendations: {
    [key: string]: Array<{
      type: string;
      name: string;
      description: string;
      icon: string;
    }>;
  } = {
    Happy: [
      {
        type: "music",
        name: "Uplifting Playlist",
        description: "Share your joy with energetic music",
        icon: "🎵",
      },
      {
        type: "yoga",
        name: "Vinyasa Flow",
        description: "Channel your happiness into movement",
        icon: "🧘",
      },
      {
        type: "food",
        name: "Healthy Celebration",
        description: "Nourish your body with nutritious food",
        icon: "🍎",
      },
    ],
    Sad: [
      {
        type: "music",
        name: "Uplifting Playlist",
        description: "Lift your mood with positive music",
        icon: "🎵",
      },
      {
        type: "mental",
        name: "Talk with ManoBot",
        description: "Share your feelings with our AI companion",
        icon: "💬",
      },
      {
        type: "yoga",
        name: "Restorative Yoga",
        description: "Gentle poses to soothe your mood",
        icon: "🧘",
      },
    ],
    Anxious: [
      {
        type: "breathing",
        name: "Breathing Exercises",
        description: "Calm your mind with guided breathing",
        icon: "🌬️",
      },
      {
        type: "yoga",
        name: "Yin Yoga",
        description: "Grounding poses for stability",
        icon: "🧘",
      },
      {
        type: "sleep",
        name: "Sleep Routine",
        description: "Establish a calming bedtime routine",
        icon: "😴",
      },
    ],
    Angry: [
      {
        type: "yoga",
        name: "Power Yoga",
        description: "Release tension through dynamic movement",
        icon: "🧘",
      },
      {
        type: "music",
        name: "Energetic Music",
        description: "Channel emotions into rhythm",
        icon: "🎵",
      },
      {
        type: "breathing",
        name: "Box Breathing",
        description: "4-4-4-4 breathing for calm",
        icon: "🌬️",
      },
    ],
    Calm: [
      {
        type: "music",
        name: "Ambient Music",
        description: "Maintain peace with soothing sounds",
        icon: "🎵",
      },
      {
        type: "yoga",
        name: "Meditation",
        description: "Deepen your state of calm",
        icon: "🧘",
      },
      {
        type: "journaling",
        name: "Gratitude Journal",
        description: "Reflect on positive moments",
        icon: "📔",
      },
    ],
    Neutral: [
      {
        type: "mental",
        name: "Daily Check-in",
        description: "Explore your emotions with ManoBot",
        icon: "💬",
      },
      {
        type: "yoga",
        name: "Balanced Flow",
        description: "Center yourself with gentle movement",
        icon: "🧘",
      },
      {
        type: "food",
        name: "Mindful Eating",
        description: "Connect with your nourishment",
        icon: "🍎",
      },
    ],
  };

  return recommendations[emotion] || recommendations["Neutral"];
}

// Activity effectiveness analysis
export function analyzeActivityEffectiveness(
  activityLogs: ActivityLog[],
  emotionHistory: EmotionProfile[],
) {
  if (activityLogs.length === 0) return null;

  const activityTypes: {
    [key: string]: { ratings: number[]; count: number; avgDuration: number };
  } = {};

  activityLogs.forEach((log) => {
    if (!activityTypes[log.activityType]) {
      activityTypes[log.activityType] = {
        ratings: [],
        count: 0,
        avgDuration: 0,
      };
    }
    activityTypes[log.activityType].ratings.push(log.rating);
    activityTypes[log.activityType].count += 1;
    activityTypes[log.activityType].avgDuration += log.duration;
  });

  const effectiveness = Object.entries(activityTypes).map(([type, data]) => ({
    type,
    avgRating: data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length,
    avgDuration: Math.round(data.avgDuration / data.count),
    count: data.count,
    trend:
      data.ratings.length > 5
        ? data.ratings.slice(-5).reduce((a, b) => a + b, 0) / 5 -
          data.ratings.slice(0, 5).reduce((a, b) => a + b, 0) / 5
        : 0,
  }));

  return effectiveness.sort((a, b) => b.avgRating - a.avgRating);
}

// Mood pattern detection
export function detectMoodPatterns(emotionHistory: EmotionProfile[]) {
  if (emotionHistory.length < 7) return null;

  const patterns = {
    bestTime: detectBestTime(emotionHistory),
    worstTime: detectWorstTime(emotionHistory),
    triggers: detectPossibleTriggers(emotionHistory),
  };

  return patterns;
}

function detectBestTime(emotionHistory: EmotionProfile[]) {
  const hourlyStats: { [key: number]: { sum: number; count: number } } = {};

  emotionHistory.forEach((emotion) => {
    const hour = new Date(emotion.timestamp).getHours();
    if (!hourlyStats[hour]) hourlyStats[hour] = { sum: 0, count: 0 };
    hourlyStats[hour].sum += emotion.intensity || 50;
    hourlyStats[hour].count += 1;
  });

  let bestHour = 0;
  let bestScore = 0;

  Object.entries(hourlyStats).forEach(([hour, data]) => {
    const avg = data.sum / data.count;
    if (avg > bestScore) {
      bestScore = avg;
      bestHour = parseInt(hour);
    }
  });

  return `${bestHour}:00 - ${(bestHour + 1) % 24}:00`;
}

function detectWorstTime(emotionHistory: EmotionProfile[]) {
  const hourlyStats: { [key: number]: { sum: number; count: number } } = {};

  emotionHistory.forEach((emotion) => {
    const hour = new Date(emotion.timestamp).getHours();
    if (!hourlyStats[hour]) hourlyStats[hour] = { sum: 0, count: 0 };
    hourlyStats[hour].sum += emotion.intensity || 50;
    hourlyStats[hour].count += 1;
  });

  let worstHour = 0;
  let worstScore = 100;

  Object.entries(hourlyStats).forEach(([hour, data]) => {
    const avg = data.sum / data.count;
    if (avg < worstScore) {
      worstScore = avg;
      worstHour = parseInt(hour);
    }
  });

  return `${worstHour}:00 - ${(worstHour + 1) % 24}:00`;
}

function detectPossibleTriggers(emotionHistory: EmotionProfile[]) {
  const recentNegative = emotionHistory
    .filter((e) => ["Sad", "Anxious", "Angry"].includes(e.dominantEmotion))
    .slice(-5);

  if (recentNegative.length === 0) return [];

  // Placeholder for trigger detection
  return ["Try identifying common situations before low moods"];
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Transcript Analysis Functions
export interface TranscriptAnalysis {
  wordCount: number;
  characterCount: number;
  sentenceCount: number;
  averageWordsPerSentence: number;
  emotionalKeywords: string[];
  sentiment: "positive" | "negative" | "neutral";
  speakingRate: number; // words per minute
}

export function analyzeTranscript(
  transcript: string,
  durationSeconds: number = 10,
): TranscriptAnalysis {
  const trimmed = transcript.trim();

  // Basic metrics
  const words = trimmed.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;
  const characterCount = trimmed.length;
  const sentences = trimmed.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = sentences.length;
  const averageWordsPerSentence =
    sentenceCount > 0 ? Math.round((wordCount / sentenceCount) * 10) / 10 : 0;

  // Speaking rate
  const durationMinutes = Math.max(durationSeconds / 60, 0.1);
  const speakingRate = Math.round(wordCount / durationMinutes);

  // Emotional keywords
  const positiveKeywords = [
    "happy",
    "great",
    "good",
    "wonderful",
    "excellent",
    "amazing",
    "love",
    "excited",
    "beautiful",
    "perfect",
    "fantastic",
    "awesome",
  ];
  const negativeKeywords = [
    "sad",
    "bad",
    "terrible",
    "awful",
    "hate",
    "angry",
    "frustrated",
    "disappointed",
    "worried",
    "scared",
    "unhappy",
    "depressed",
  ];

  const lowerTranscript = trimmed.toLowerCase();
  const emotionalKeywords = [
    ...positiveKeywords.filter((kw) => lowerTranscript.includes(kw)),
    ...negativeKeywords.filter((kw) => lowerTranscript.includes(kw)),
  ];

  // Sentiment analysis
  let sentiment: "positive" | "negative" | "neutral" = "neutral";
  const positiveCount = positiveKeywords.filter((kw) =>
    lowerTranscript.includes(kw),
  ).length;
  const negativeCount = negativeKeywords.filter((kw) =>
    lowerTranscript.includes(kw),
  ).length;

  if (positiveCount > negativeCount && positiveCount > 0) {
    sentiment = "positive";
  } else if (negativeCount > positiveCount && negativeCount > 0) {
    sentiment = "negative";
  }

  return {
    wordCount,
    characterCount,
    sentenceCount,
    averageWordsPerSentence,
    emotionalKeywords: [...new Set(emotionalKeywords)],
    sentiment,
    speakingRate,
  };
}

export function getTranscriptInsights(analysis: TranscriptAnalysis): string[] {
  const insights: string[] = [];

  if (analysis.wordCount === 0) {
    return ["No words detected in transcript"];
  }

  if (analysis.speakingRate < 100) {
    insights.push(
      "🐢 Speaking at a slower pace - possibly reflective or careful",
    );
  } else if (analysis.speakingRate > 160) {
    insights.push("🚀 Speaking at a faster pace - possibly excited or anxious");
  }

  if (analysis.emotionalKeywords.length > 0) {
    insights.push(
      `😊 Emotional language detected: ${analysis.emotionalKeywords.slice(0, 2).join(", ")}`,
    );
  }

  if (analysis.sentiment === "positive") {
    insights.push("✨ Overall positive sentiment in your words");
  } else if (analysis.sentiment === "negative") {
    insights.push("💭 Some challenging emotions reflected in your speech");
  }

  if (analysis.averageWordsPerSentence > 15) {
    insights.push("📝 Complex sentence structure - thoughtful and articulate");
  } else if (analysis.averageWordsPerSentence < 8) {
    insights.push("💬 Shorter sentences - direct and concise communication");
  }

  return insights;
}
