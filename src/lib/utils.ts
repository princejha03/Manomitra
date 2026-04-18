import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Emotion } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mapToInternalEmotion(externalLabel: string): Emotion {
  const label = externalLabel.toLowerCase();
  
  // HuggingFace & Face-api mappings
  if (label.includes("joy") || label.includes("happy")) return "Happy";
  if (label.includes("sad")) return "Sad";
  if (label.includes("anger") || label.includes("angry")) return "Angry";
  if (label.includes("fear") || label.includes("anxious") || label.includes("fearful")) return "Anxious";
  if (label.includes("calm") || label.includes("peaceful")) return "Calm";
  
  return "Neutral";
}
