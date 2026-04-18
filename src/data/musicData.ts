export interface Playlist {
  id: string;
  title: string;
  genre: string;
  mood: string[];
  description: string;
  duration: number;
  coverColor: string;
  embedUrl: string;
  raga?: string;
}

export const musicData: Playlist[] = [
  {
    id: "1",
    title: "Morning Calm",
    genre: "Indian Classical",
    mood: ["Calm", "Happy"],
    description: "Serene Raga Bhairav to start your day with energy.",
    duration: 45,
    coverColor: "from-amber-400 to-orange-500",
    embedUrl: "https://www.youtube.com/embed/S_S7pWp1yLg",
    raga: "Raag Bhairav"
  },
  {
    id: "2",
    title: "Deep Focus",
    genre: "Lo-fi",
    mood: ["Focused", "Neutral"],
    description: "Chill beats for deep concentration and flow.",
    duration: 60,
    coverColor: "from-blue-500 to-indigo-600",
    embedUrl: "https://www.youtube.com/embed/5qap5aO4i9A"
  },
  {
    id: "3",
    title: "Evening Serenity",
    genre: "Indian Classical",
    mood: ["Calm", "Sad"],
    description: "Soothing Raga Yaman for reflection and peace.",
    duration: 50,
    coverColor: "from-indigo-400 to-purple-500",
    embedUrl: "https://www.youtube.com/embed/yW_R9_2M3_k",
    raga: "Raag Yaman"
  },
  {
    id: "4",
    title: "Joyful Beats",
    genre: "Bollywood",
    mood: ["Happy", "Energetic"],
    description: "Uplifting Bollywood hits to boost your mood.",
    duration: 35,
    coverColor: "from-pink-500 to-rose-600",
    embedUrl: "https://www.youtube.com/embed/hXh3o3p8c9k"
  },
  {
    id: "5",
    title: "Rainy Day Lo-fi",
    genre: "Lo-fi",
    mood: ["Sad", "Anxious"],
    description: "Melancholic beats for those rainy introspective days.",
    duration: 90,
    coverColor: "from-slate-600 to-blue-800",
    embedUrl: "https://www.youtube.com/embed/DWcUYxa6W6I"
  },
  {
    id: "6",
    title: "Stress Relief",
    genre: "Nature Sounds",
    mood: ["Anxious", "Calm"],
    description: "Gentle rain and forest sounds for relaxation.",
    duration: 120,
    coverColor: "from-emerald-400 to-teal-600",
    embedUrl: "https://www.youtube.com/embed/eKFTSSKCzWA"
  }
];
