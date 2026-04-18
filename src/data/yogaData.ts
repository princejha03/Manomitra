export interface Pose {
  name: string;
  sanskrit: string;
  duration: number; // in seconds
  description: string;
  benefit: string;
  breathingCue: string;
  imageUrl: string;
}

export interface YogaSequence {
  id: string;
  title: string;
  mood: string[];
  duration: number; // in minutes
  intensity: "light" | "moderate" | "strong";
  poses: Pose[];
}

export const yogaData: YogaSequence[] = [
  {
    id: "grounding-sequence",
    title: "Grounding Energy",
    mood: ["Anxious", "Stressed"],
    duration: 12,
    intensity: "light",
    poses: [
      {
        name: "Child's Pose",
        sanskrit: "Balasana",
        duration: 120,
        description: "A resting pose that centers, calms, and soothes the mind.",
        benefit: "Reduces stress and anxiety",
        breathingCue: "Deep belly breaths, feeling the back expand",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400"
      },
      {
        name: "Legs Up The Wall",
        sanskrit: "Viparita Karani",
        duration: 180,
        description: "A gentle restorative pose that allows the blood to flow back to the heart.",
        benefit: "Calms the nervous system",
        breathingCue: "Long, slow exhales",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400"
      },
      {
        name: "Corpse Pose",
        sanskrit: "Savasana",
        duration: 300,
        description: "Total relaxation and integration of the practice.",
        benefit: "Deep mental rest",
        breathingCue: "Natural, effortless breath",
        imageUrl: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=400"
      }
    ]
  },
  {
    id: "heart-opening",
    title: "Heart Opening Flow",
    mood: ["Sad", "Low"],
    duration: 10,
    intensity: "moderate",
    poses: [
      {
        name: "Mountain Pose",
        sanskrit: "Tadasana",
        duration: 60,
        description: "The foundation of all standing poses.",
        benefit: "Improves posture and focus",
        breathingCue: "Inhale to lengthen the spine",
        imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=400"
      },
      {
        name: "Camel Pose",
        sanskrit: "Ustrasana",
        duration: 120,
        description: "A deep backbend that opens the chest.",
        benefit: "Boosts energy and confidence",
        breathingCue: "Breathe into the chest space",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400"
      },
      {
        name: "Bridge Pose",
        sanskrit: "Setu Bandha Sarvangasana",
        duration: 120,
        description: "Strengthens the back and opens the heart.",
        benefit: "Relieves mild depression",
        breathingCue: "Deep, rhythmic breathing",
        imageUrl: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80&w=400"
      }
    ]
  }
];
