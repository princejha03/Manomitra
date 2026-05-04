// Mental wellness resources and recommendations
import { Emotion } from "@/types";

export const journalPrompts = {
  Happy: [
    "What made you smile today?",
    "Who brought joy into your life recently?",
    "What accomplishment are you proud of?",
    "When did you feel truly alive?",
    "What small moment brightened your day?",
  ],
  Sad: [
    "What's one thing that would help right now?",
    "Who can you reach out to?",
    "What's one small step toward feeling better?",
    "What do you need from yourself right now?",
    "What gave you comfort before?",
  ],
  Anxious: [
    "What specific worry can you let go of?",
    "What's one thing you can control right now?",
    "Who supports you?",
    "What grounding technique helps you?",
    "What would your calmer self say?",
  ],
  Angry: [
    "What needs to be said?",
    "What boundary needs to be set?",
    "What deeper feeling is underneath?",
    "What action could channel this energy?",
    "What would compassion look like here?",
  ],
  Calm: [
    "What brought you this peace?",
    "How can you preserve this feeling?",
    "What are you grateful for?",
    "What does self-care look like today?",
    "How can you share this calm with others?",
  ],
  Neutral: [
    "What are you curious about?",
    "What would make today special?",
    "What balance do you need?",
    "What small joy could you create?",
    "What intention do you set?",
  ],
};

export const copingStrategies = {
  Happy: [
    {
      name: "Share Your Joy",
      description: "Tell someone close to you what's making you happy",
    },
    {
      name: "Capture the Moment",
      description: "Take a photo or write about this feeling",
    },
    {
      name: "Spread Kindness",
      description: "Do something nice for someone else",
    },
    {
      name: "Celebrate",
      description: "Do something you enjoy to honor this feeling",
    },
  ],
  Sad: [
    { name: "Connect", description: "Reach out to someone you trust" },
    {
      name: "Move Your Body",
      description: "Even a short walk can help shift your mood",
    },
    { name: "Create", description: "Express through art, music, or writing" },
    { name: "Self-Compassion", description: "Treat yourself with kindness" },
  ],
  Anxious: [
    { name: "Breathe", description: "Try the 4-7-8 breathing technique" },
    {
      name: "Ground Yourself",
      description: "Name 5 things you see, 4 you hear, 3 you feel",
    },
    { name: "Move", description: "Gentle yoga or stretching releases tension" },
    {
      name: "Write It Out",
      description: "Journal your worries and then release them",
    },
  ],
  Angry: [
    {
      name: "Physical Release",
      description: "Exercise, punch a pillow, or take a cold shower",
    },
    {
      name: "Express",
      description: "Write an unsent letter to express your feelings",
    },
    { name: "Pause", description: "Take space before responding" },
    {
      name: "Channel Energy",
      description: "Use the energy for something constructive",
    },
  ],
  Calm: [
    { name: "Meditate", description: "Deepen your state of peace" },
    { name: "Reflect", description: "Journaling or journaling prompts" },
    { name: "Extend Compassion", description: "Offer presence to others" },
    { name: "Maintain", description: "Note what helped you stay calm" },
  ],
  Neutral: [
    { name: "Explore", description: "Try something new or unfamiliar" },
    { name: "Reflect", description: "Understand what you need" },
    { name: "Set Intention", description: "Choose your emotional direction" },
    { name: "Balance", description: "Create stability and routine" },
  ],
};

export const affirmations = {
  Happy: [
    "I'm grateful for this joy and I'm sharing it with the world.",
    "My happiness is valid and beautiful.",
    "I deserve to feel this good.",
    "This joy reminds me of my strength.",
    "I'm creating more moments of happiness.",
  ],
  Sad: [
    "This sadness is temporary and will pass.",
    "I'm worthy of love and support.",
    "It's okay to not be okay right now.",
    "I'm stronger than I think.",
    "My struggles don't define me.",
  ],
  Anxious: [
    "I'm safe right now, in this moment.",
    "My worries don't control my actions.",
    "I have the strength to face my fears.",
    "I'm capable of handling uncertainty.",
    "Peace is possible for me.",
  ],
  Angry: [
    "My anger is valid, and I can express it constructively.",
    "I have the power to choose my response.",
    "I'm learning to set healthy boundaries.",
    "My feelings matter, and so do others'.",
    "I can turn this energy into positive change.",
  ],
  Calm: [
    "I'm at peace with myself.",
    "This calm strength is within me.",
    "I'm grounded and centered.",
    "My mind is clear and focused.",
    "I choose serenity in all situations.",
  ],
  Neutral: [
    "I'm open to understanding myself better.",
    "Balance brings me clarity.",
    "I'm comfortable with uncertainty.",
    "Growth happens in stillness.",
    "I'm exactly where I need to be.",
  ],
};

export const emergencyResources = {
  title: "Need Immediate Help?",
  resources: [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "Available 24/7. Call or text for support.",
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Trained counselors available via text.",
    },
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Substance abuse and mental health support.",
    },
    {
      name: "International Association for Suicide Prevention",
      website: "https://www.iasp.info/resources/Crisis_Centres/",
      description: "Global crisis resources by country.",
    },
  ],
};

export function getJournalPrompt(emotion: Emotion): string {
  const prompts = journalPrompts[emotion] || journalPrompts.Neutral;
  return prompts[Math.floor(Math.random() * prompts.length)];
}

export function getCopingStrategies(emotion: Emotion) {
  return copingStrategies[emotion] || copingStrategies.Neutral;
}

export function getAffirmation(emotion: Emotion): string {
  const affirmationList = affirmations[emotion] || affirmations.Neutral;
  return affirmationList[Math.floor(Math.random() * affirmationList.length)];
}
