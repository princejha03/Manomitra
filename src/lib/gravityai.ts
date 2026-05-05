const GRAVITY_AI_API_KEY = process.env.NEXT_PUBLIC_GRAVITY_AI_API_KEY;

export async function analyzeMultimodalEmotion(data: any) {
  try {
    // Check if API key is available and not placeholder
    if (
      !GRAVITY_AI_API_KEY ||
      GRAVITY_AI_API_KEY.includes("your_api_key_here")
    ) {
      // Return mock response for demo purposes
      return {
        fused_emotion: "balanced",
        confidence: 0.75,
        modalities_used: ["text", "face", "voice"],
        overall_wellbeing: 72,
      };
    }

    // This is a placeholder for Gravity AI multimodal fusion endpoint
    const response = await fetch(
      "https://api.gravity-ai.com/v1/models/emotion-fusion/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GRAVITY_AI_API_KEY}`,
        },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error(`Gravity AI API error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Gravity AI Fusion Error:", error);
    // Return fallback mock response
    return {
      fused_emotion: "neutral",
      confidence: 0.6,
      modalities_used: ["text"],
      overall_wellbeing: 65,
    };
  }
}

export async function analyzeTextGravity(text: string) {
  try {
    // Check if API key is available and not placeholder
    if (
      !GRAVITY_AI_API_KEY ||
      GRAVITY_AI_API_KEY.includes("your_api_key_here")
    ) {
      // Return mock response for demo purposes
      return {
        wellbeing_score: Math.floor(Math.random() * 30) + 60, // Random score between 60-90
        emotional_state: "balanced",
        recommendations: [
          "Practice mindfulness",
          "Stay hydrated",
          "Get adequate sleep",
        ],
      };
    }

    const response = await fetch(
      "https://api.gravity-ai.com/v1/models/text-emotion/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GRAVITY_AI_API_KEY}`,
        },
        body: JSON.stringify({ text, context: "mental_wellness" }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gravity AI API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Gravity AI Text Error:", error);
    // Return fallback mock response
    return {
      wellbeing_score: 70,
      emotional_state: "neutral",
      recommendations: [
        "Take deep breaths",
        "Practice self-care",
        "Connect with loved ones",
      ],
    };
  }
}

export async function analyzeFaceGravity(imageBase64: string) {
  try {
    // Check if API key is available and not placeholder
    if (
      !GRAVITY_AI_API_KEY ||
      GRAVITY_AI_API_KEY.includes("your_api_key_here")
    ) {
      // Return mock response for demo purposes
      return {
        dominant_emotion: "happy",
        confidence: 0.85,
        wellbeing_score: 82,
        facial_features: {
          smile_intensity: 0.8,
          eye_contact: 0.9,
          facial_tension: 0.2,
        },
      };
    }

    const response = await fetch(
      "https://api.gravity-ai.com/v1/models/face-emotion/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GRAVITY_AI_API_KEY}`,
        },
        body: JSON.stringify({ image: imageBase64, modality: "face" }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gravity AI API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Gravity AI Face Error:", error);
    // Return fallback mock response
    return {
      dominant_emotion: "neutral",
      confidence: 0.7,
      facial_features: {
        smile_intensity: 0.5,
        eye_contact: 0.8,
        facial_tension: 0.3,
      },
    };
  }
}

// Smart voice emotion analysis based on audio features
function analyzeVoiceFeaturesForEmotion(features: any) {
  const {
    volume = 50,
    pitch = 150,
    speechRate = 120,
    rms = 0.1,
    maxAmp = 0.3,
    transcription = "",
    duration = 10,
  } = features;

  // Analyze voice characteristics
  const isHighEnergy = volume > 70 || speechRate > 150;
  const isLowEnergy = volume < 40 || speechRate < 100;
  const isHighPitch = pitch > 200;
  const isLowPitch = pitch < 120;
  const isStable = maxAmp < 0.4;
  const isVaried = rms > 0.15;

  // Analyze transcription sentiment
  let sentimentScore = 0;
  let hasEmotionalWords = false;

  const positiveWords = [
    "happy",
    "great",
    "wonderful",
    "excited",
    "love",
    "amazing",
    "fantastic",
    "awesome",
  ];
  const negativeWords = [
    "sad",
    "angry",
    "frustrated",
    "disappointed",
    "hate",
    "terrible",
    "awful",
    "scared",
  ];
  const calmWords = [
    "peaceful",
    "relaxed",
    "calm",
    "serene",
    "quiet",
    "still",
    "meditative",
  ];

  const lowerTranscript = transcription.toLowerCase();

  positiveWords.forEach((word) => {
    if (lowerTranscript.includes(word)) {
      sentimentScore += 2;
      hasEmotionalWords = true;
    }
  });

  negativeWords.forEach((word) => {
    if (lowerTranscript.includes(word)) {
      sentimentScore -= 2;
      hasEmotionalWords = true;
    }
  });

  calmWords.forEach((word) => {
    if (lowerTranscript.includes(word)) {
      sentimentScore += 1;
      hasEmotionalWords = true;
    }
  });

  // Determine emotion based on features
  let dominantEmotion = "Neutral";
  let confidenceScore = 0.6;
  let stressScore = 40;
  let energyLevel = 55;
  let wellbeingIndex = 72;
  let vocalPatterns = ["Balanced", "Measured"];

  // High energy + positive sentiment = Happy
  if (isHighEnergy && sentimentScore >= 2) {
    dominantEmotion = "Happy";
    confidenceScore = 0.85;
    stressScore = 15;
    energyLevel = 80;
    wellbeingIndex = 85;
    vocalPatterns = ["Energetic", "Uplifting", "Bright"];
  }
  // High energy + negative sentiment = Angry
  else if (isHighEnergy && sentimentScore <= -2) {
    dominantEmotion = "Angry";
    confidenceScore = 0.82;
    stressScore = 75;
    energyLevel = 85;
    wellbeingIndex = 35;
    vocalPatterns = ["Intense", "Sharp", "Aggressive"];
  }
  // Low energy + negative sentiment = Sad
  else if (isLowEnergy && sentimentScore <= -2) {
    dominantEmotion = "Sad";
    confidenceScore = 0.78;
    stressScore = 55;
    energyLevel = 30;
    wellbeingIndex = 45;
    vocalPatterns = ["Slow", "Soft", "Melancholic"];
  }
  // Low energy + positive/neutral = Calm/Peaceful
  else if (isLowEnergy && sentimentScore >= 0) {
    dominantEmotion = "Calm";
    confidenceScore = 0.8;
    stressScore = 20;
    energyLevel = 40;
    wellbeingIndex = 78;
    vocalPatterns = ["Steady", "Warm", "Peaceful"];
  }
  // High pitch variation + high energy = Surprised/Excited
  else if (isHighPitch && isVaried && isHighEnergy) {
    dominantEmotion = "Surprise";
    confidenceScore = 0.75;
    stressScore = 35;
    energyLevel = 75;
    wellbeingIndex = 70;
    vocalPatterns = ["Dynamic", "Varied", "Expressive"];
  }
  // Stable, low variation = Neutral
  else if (isStable && !hasEmotionalWords) {
    dominantEmotion = "Neutral";
    confidenceScore = 0.72;
    stressScore = 40;
    energyLevel = 55;
    wellbeingIndex = 65;
    vocalPatterns = ["Measured", "Balanced"];
  }
  // Default to neutral with adjusted confidence
  else {
    dominantEmotion = "Neutral";
    confidenceScore = 0.65;
    energyLevel = Math.round(volume);
  }

  return {
    dominant_emotion: dominantEmotion,
    confidence: confidenceScore,
    stress_score: stressScore,
    energy_level: energyLevel,
    wellbeing_index: wellbeingIndex,
    vocal_patterns: vocalPatterns,
    voice_features: {
      pitch_variation: isVaried ? 0.8 : isStable ? 0.3 : 0.5,
      speech_rate: Math.min(1, speechRate / 200),
      volume_stability: isStable ? 0.8 : 0.5,
    },
  };
}

export async function analyzeVoiceGravity(features: any) {
  try {
    // Check if API key is available and not placeholder
    if (
      !GRAVITY_AI_API_KEY ||
      GRAVITY_AI_API_KEY.includes("your_api_key_here")
    ) {
      // Use intelligent mock analysis based on actual audio features
      return analyzeVoiceFeaturesForEmotion(features);
    }

    const response = await fetch(
      "https://api.gravity-ai.com/v1/models/voice-emotion/predict",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GRAVITY_AI_API_KEY}`,
        },
        body: JSON.stringify({ ...features, modality: "voice" }),
      },
    );

    if (!response.ok) {
      throw new Error(`Gravity AI API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Gravity AI Voice Error:", error);
    // Use intelligent fallback analysis
    return analyzeVoiceFeaturesForEmotion(features);
  }
}
