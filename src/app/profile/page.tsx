"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import Card from "@/components/ui/Card";
import {
  User,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Brain,
  Settings,
  Music,
  Utensils,
  Activity,
  Bell,
} from "lucide-react";

type ProfileFormData = {
  name: string;
  age: number;
  gender: string;
  avatarColor: string;
  usualMood: string;
  interests: string[];
  musicGenre: string;
  dietary: string;
  intensity: string;
  notifications: boolean;
};

const steps = [
  { id: 1, title: "Basic Info", icon: User },
  { id: 2, title: "Mental Health", icon: Brain },
  { id: 3, title: "Preferences", icon: Settings },
  { id: 4, title: "Complete", icon: CheckCircle2 },
];

export default function ProfileSetup() {
  const [step, setStep] = useState(1);
  const router = useRouter();
  const { setUser } = useStore();
  const { register, handleSubmit, watch, setValue } =
    useForm<ProfileFormData>();

  const onSubmit = (data: ProfileFormData) => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }

    // Final Step
    const userProfile = {
      name: data.name,
      age: data.age,
      gender: data.gender,
      avatarColor: data.avatarColor,
      usualMood: data.usualMood,
      interests: data.interests,
      preferences: {
        musicGenre: data.musicGenre,
        dietary: data.dietary,
        intensity: data.intensity,
        notifications: data.notifications,
      },
    };

    setUser(userProfile);
    router.push("/dashboard");
  };

  const prevStep = () => setStep(step - 1);

  const colors = [
    "#6C63FF",
    "#48CAE4",
    "#95D5B2",
    "#FFB347",
    "#FF6B6B",
    "#6495ED",
  ];

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        {/* Progress Bar */}
        <div className="flex justify-between mb-8">
          {steps.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  step >= s.id
                    ? "bg-primary text-white"
                    : "bg-card text-foreground/40"
                }`}
              >
                <s.icon size={20} />
              </div>
              <span
                className={`text-xs font-medium ${step >= s.id ? "text-primary" : "text-foreground/40"}`}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-8">
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">
                      Let's start with the basics
                    </h2>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        What should we call you?
                      </label>
                      <input
                        {...register("name", { required: true })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Your Name"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Age
                        </label>
                        <input
                          {...register("age", {
                            required: true,
                            min: 13,
                            max: 99,
                          })}
                          type="number"
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none"
                          placeholder="25"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Gender
                        </label>
                        <select
                          {...register("gender")}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none appearance-none"
                        >
                          <option value="male" className="bg-card text-foreground">Male</option>
                          <option value="female" className="bg-card text-foreground">Female</option>
                          <option value="non-binary" className="bg-card text-foreground">Non-binary</option>
                          <option value="prefer-not-to-say" className="bg-card text-foreground">
                            Prefer not to say
                          </option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Pick your avatar color
                      </label>
                      <div className="flex gap-3">
                        {colors.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setValue("avatarColor", c)}
                            className={`w-8 h-8 rounded-full border-2 ${watch("avatarColor") === c ? "border-white" : "border-transparent"}`}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                      <input type="hidden" {...register("avatarColor")} />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">
                      How are you feeling lately?
                    </h2>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        How do you usually feel?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          "Mostly Calm",
                          "Often Anxious",
                          "Frequently Sad",
                          "It Varies",
                        ].map((mood) => (
                          <label
                            key={mood}
                            className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all"
                          >
                            <input
                              type="radio"
                              value={mood}
                              {...register("usualMood")}
                              className="hidden"
                            />
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${watch("usualMood") === mood ? "bg-primary border-primary" : "border-white/20"}`}
                            />
                            <span className="text-sm">{mood}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        What brings you to ManoMitra?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          "Stress Management",
                          "Better Sleep",
                          "Emotional Support",
                          "General Wellness",
                          "Just Exploring",
                        ].map((interest) => (
                          <label
                            key={interest}
                            className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all"
                          >
                            <input
                              type="checkbox"
                              value={interest}
                              {...register("interests")}
                              className="hidden"
                            />
                            <div
                              className={`w-4 h-4 rounded border-2 ${(watch("interests") || []).includes(interest) ? "bg-secondary border-secondary" : "border-white/20"}`}
                            />
                            <span className="text-sm">{interest}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold mb-4">
                      Personalize your experience
                    </h2>
                    <div>
                      <label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Music size={16} /> Preferred Music
                      </label>
                      <select
                        {...register("musicGenre")}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none appearance-none"
                      >
                        <option value="Indian Classical" className="bg-card text-foreground">
                          Indian Classical
                        </option>
                        <option value="Lo-fi / Chill" className="bg-card text-foreground">Lo-fi / Chill</option>
                        <option value="Bollywood Chill" className="bg-card text-foreground">Bollywood Chill</option>
                        <option value="Nature Sounds" className="bg-card text-foreground">Nature Sounds</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Utensils size={16} /> Diet
                        </label>
                        <select
                          {...register("dietary")}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none appearance-none"
                        >
                          <option value="Vegetarian" className="bg-card text-foreground">Vegetarian</option>
                          <option value="Non-veg" className="bg-card text-foreground">Non-veg</option>
                          <option value="Vegan" className="bg-card text-foreground">Vegan</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 flex items-center gap-2">
                          <Activity size={16} /> Activity Level
                        </label>
                        <select
                          {...register("intensity")}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:ring-2 focus:ring-primary outline-none appearance-none"
                        >
                          <option value="Light" className="bg-card text-foreground">Light</option>
                          <option value="Moderate" className="bg-card text-foreground">Moderate</option>
                          <option value="Intense" className="bg-card text-foreground">Intense</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <Bell className="text-secondary" />
                        <div>
                          <p className="font-medium">Enable Notifications</p>
                          <p className="text-xs text-foreground/40">
                            Daily reminders for mindfulness
                          </p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        {...register("notifications")}
                        className="toggle-checkbox"
                      />
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="text-center space-y-6 py-8">
                    <div className="flex justify-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 20,
                        }}
                      >
                        <CheckCircle2 className="w-24 h-24 text-accent" />
                      </motion.div>
                    </div>
                    <h2 className="text-3xl font-bold">You're all set!</h2>
                    <p className="text-foreground/60">
                      Welcome to ManoMitra, {watch("name")}! 🌸 We're excited to
                      accompany you on your wellness journey.
                    </p>
                  </div>
                )}

                <div className="mt-10 flex justify-between">
                  {step > 1 && step < 4 && (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl hover:bg-white/5 transition-all font-medium"
                    >
                      <ChevronLeft size={20} /> Back
                    </button>
                  )}
                  <div className="ml-auto">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold shadow-lg shadow-primary/20"
                    >
                      {step === 4 ? "Go to Dashboard" : "Continue"}{" "}
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </form>
      </div>
    </main>
  );
}
