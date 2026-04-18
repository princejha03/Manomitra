export type Emotion = 'Happy' | 'Sad' | 'Angry' | 'Anxious' | 'Calm' | 'Neutral';

export interface UserProfile {
  name: string;
  age: number;
  gender: string;
  avatarColor: string;
  usualMood: string;
  interests: string[];
  preferences: {
    musicGenre: string;
    dietary: string;
    intensity: string;
    notifications: boolean;
  };
}

export interface EmotionScore {
  label: Emotion;
  score: number;
}

export interface EmotionProfile {
  dominantEmotion: Emotion;
  intensity: number;
  wellbeingIndex: number;
  scores: Record<Emotion, number>;
  timestamp: number;
}

export interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: number;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}
