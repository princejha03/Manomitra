import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Emotion, UserProfile, EmotionProfile, Message, Todo } from '../types';

interface State {
  user: UserProfile | null;
  currentEmotion: EmotionProfile | null;
  emotionHistory: EmotionProfile[];
  chatHistory: Message[];
  todos: Todo[];
  streak: number;
  isDarkMode: boolean;
  
  setUser: (user: UserProfile) => void;
  setCurrentEmotion: (emotion: EmotionProfile) => void;
  addEmotionToHistory: (emotion: EmotionProfile) => void;
  addChatMessage: (message: Message) => void;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setStreak: (streak: number) => void;
  toggleDarkMode: () => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      user: null,
      currentEmotion: null,
      emotionHistory: [],
      chatHistory: [],
      todos: [],
      streak: 0,
      isDarkMode: false,

      setUser: (user) => set({ user }),
      setCurrentEmotion: (currentEmotion) => set({ currentEmotion }),
      addEmotionToHistory: (emotion) => set((state) => ({ 
        emotionHistory: [...state.emotionHistory, emotion] 
      })),
      addChatMessage: (message) => set((state) => ({ 
        chatHistory: [...state.chatHistory, message] 
      })),
      addTodo: (text) => set((state) => ({
        todos: [...state.todos, {
          id: Math.random().toString(36).substr(2, 9),
          text,
          completed: false,
          createdAt: Date.now()
        }]
      })),
      toggleTodo: (id) => set((state) => ({
        todos: state.todos.map(todo => 
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        )
      })),
      deleteTodo: (id) => set((state) => ({
        todos: state.todos.filter(todo => todo.id !== id)
      })),
      setStreak: (streak) => set({ streak }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'manomitra-storage',
    }
  )
);
