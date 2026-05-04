import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Emotion, UserProfile, EmotionProfile, Message, Todo } from "../types";

export interface ActivityLog {
  id: string;
  activityType:
    | "music"
    | "yoga"
    | "food"
    | "sleep"
    | "mental"
    | "journaling"
    | "breathing";
  activityName: string;
  duration: number; // in minutes
  rating: number; // 1-5
  mood?: Emotion;
  feedback?: string;
  startTime: number;
  endTime: number;
}

interface State {
  user: UserProfile | null;
  currentEmotion: EmotionProfile | null;
  emotionHistory: EmotionProfile[];
  chatHistory: Message[];
  todos: Todo[];
  activityLogs: ActivityLog[];
  streak: number;
  isDarkMode: boolean;
  longestStreak: number;
  totalActivitiesCompleted: number;

  setUser: (user: UserProfile) => void;
  setCurrentEmotion: (emotion: EmotionProfile) => void;
  addEmotionToHistory: (emotion: EmotionProfile) => void;
  addChatMessage: (message: Message) => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  addActivityLog: (activity: Omit<ActivityLog, "id">) => void;
  getActivityLogs: (type?: string, days?: number) => ActivityLog[];
  setStreak: (streak: number) => void;
  updateStreak: (increase: boolean) => void;
  toggleDarkMode: () => void;
  clearOldEmotionHistory: () => void;
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      user: null,
      currentEmotion: null,
      emotionHistory: [],
      chatHistory: [],
      todos: [],
      activityLogs: [],
      streak: 0,
      longestStreak: 0,
      isDarkMode: false,
      totalActivitiesCompleted: 0,

      setUser: (user) => set({ user }),
      setCurrentEmotion: (currentEmotion) => set({ currentEmotion }),
      addEmotionToHistory: (emotion) =>
        set((state) => {
          const updated = [...state.emotionHistory, emotion];
          // Keep only last 365 days of history
          const thirtyDaysAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
          const filtered = updated.filter((e) => e.timestamp > thirtyDaysAgo);
          return { emotionHistory: filtered };
        }),
      addChatMessage: (message) =>
        set((state) => {
          const updated = [...state.chatHistory, message];
          // Keep only last 500 messages
          return { chatHistory: updated.slice(-500) };
        }),
      addTodo: (text) =>
        set((state) => ({
          todos: [
            ...state.todos,
            {
              id: Math.random().toString(36).substr(2, 9),
              text,
              completed: false,
              createdAt: Date.now(),
            },
          ],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
          ),
        })),
      deleteTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      addActivityLog: (activity) =>
        set((state) => ({
          activityLogs: [
            ...state.activityLogs,
            {
              id: Math.random().toString(36).substr(2, 9),
              ...activity,
            },
          ],
          totalActivitiesCompleted: state.totalActivitiesCompleted + 1,
        })),
      getActivityLogs: (type?: string, days?: number) => {
        const state = get();
        let logs = state.activityLogs;

        if (type) {
          logs = logs.filter((log) => log.activityType === type);
        }

        if (days) {
          const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
          logs = logs.filter((log) => log.startTime > cutoff);
        }

        return logs.sort((a, b) => b.startTime - a.startTime);
      },
      setStreak: (streak) => set({ streak }),
      updateStreak: (increase) =>
        set((state) => {
          const newStreak = increase ? state.streak + 1 : 0;
          const newLongest = Math.max(state.longestStreak, newStreak);
          return { streak: newStreak, longestStreak: newLongest };
        }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      clearOldEmotionHistory: () =>
        set((state) => {
          const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
          return {
            emotionHistory: state.emotionHistory.filter(
              (e) => e.timestamp > thirtyDaysAgo,
            ),
          };
        }),
    }),
    {
      name: "manomitra-storage",
    },
  ),
);
