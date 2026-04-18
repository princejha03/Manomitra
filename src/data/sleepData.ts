export interface SleepLog {
  id: string;
  date: string;
  bedtime: string;
  waketime: string;
  quality: number; // 1-5
  disturbances: number;
  moodBefore: string;
  moodAfter: string;
}

export const sleepHistory: SleepLog[] = [
  { id: "1", date: "2026-04-10", bedtime: "23:00", waketime: "07:00", quality: 4, disturbances: 1, moodBefore: "Neutral", moodAfter: "Happy" },
  { id: "2", date: "2026-04-11", bedtime: "23:30", waketime: "07:30", quality: 3, disturbances: 2, moodBefore: "Anxious", moodAfter: "Tired" },
  { id: "3", date: "2026-04-12", bedtime: "22:45", waketime: "06:45", quality: 5, disturbances: 0, moodBefore: "Calm", moodAfter: "Excellent" },
  { id: "4", date: "2026-04-13", bedtime: "00:15", waketime: "08:15", quality: 2, disturbances: 3, moodBefore: "Stressed", moodAfter: "Low" },
];

export const sleepHygieneTips = [
  "Keep your room temperature between 18-20°C.",
  "No screens 1 hour before bed to reduce blue light.",
  "Same wake time every day, even on weekends.",
  "No caffeine after 2 PM.",
  "Finish your evening meal 2-3 hours before bed."
];
