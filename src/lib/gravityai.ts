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

export async function analyzeVoiceGravity(features: any) {
  try {
    // Check if API key is available and not placeholder
    if (
      !GRAVITY_AI_API_KEY ||
      GRAVITY_AI_API_KEY.includes("your_api_key_here")
    ) {
      // Return mock response for demo purposes
      return {
        dominant_emotion: "calm",
        confidence: 0.8,
        stress_score: 25,
        energy_level: 65,
        wellbeing_index: 78,
        voice_features: {
          pitch_variation: 0.6,
          speech_rate: 0.7,
          volume_stability: 0.8,
        },
      };
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
    // Return fallback mock response
    return {
      dominant_emotion: "neutral",
      confidence: 0.6,
      voice_features: {
        pitch_variation: 0.5,
        speech_rate: 0.6,
        volume_stability: 0.7,
      },
    };
  }
}
