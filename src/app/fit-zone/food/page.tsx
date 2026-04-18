"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import PageWrapper from "@/components/layout/PageWrapper";
import Card from "@/components/ui/Card";
import { useStore } from "@/store/useStore";
import { foodData, MoodFood, Food, Recipe } from "@/data/foodData";
import {
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Brain,
  Droplets,
  Clock,
  Heart,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FoodByMoodPage() {
  const { currentEmotion } = useStore();
  const [selectedMood, setSelectedMood] = useState<string>(
    currentEmotion?.dominantEmotion || "Neutral",
  );

  const moodData = foodData.find((d) => d.mood === selectedMood) || foodData[0];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <PageWrapper>
        <header className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Food & Nutrition</h1>
          <p className="text-foreground/60 text-lg">
            Eat for your brain. Heal for your mind.
          </p>
        </header>

        {/* Mood Selector */}
        <div className="flex overflow-x-auto gap-4 mb-10 pb-4 custom-scrollbar">
          {["Happy", "Sad", "Anxious", "Tired", "Focused", "Neutral"].map(
            (mood) => (
              <button
                key={mood}
                onClick={() => setSelectedMood(mood)}
                className={`px-6 py-3 rounded-full font-bold text-sm transition-all whitespace-nowrap border ${
                  selectedMood === mood
                    ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                    : "bg-white/5 text-foreground/40 border-white/10 hover:bg-white/10"
                }`}
              >
                {mood}
              </button>
            ),
          )}
        </div>

        {/* AI Insight Card */}
        <Card className="mb-10 bg-linear-to-br from-orange-500/10 to-red-500/10 border-white/10 flex items-center justify-between p-8">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-orange-500 rounded-2xl shadow-xl text-white">
              <Sparkles size={32} />
            </div>
            <div>
              <p className="text-sm font-bold text-orange-400 mb-1 uppercase tracking-widest">
                Gravity AI Nutrition Insight
              </p>
              <h3 className="text-xl font-bold mb-2">
                "Focus on Magnesium-rich foods today to help calm your nervous
                system."
              </h3>
              <p className="text-sm text-foreground/40 flex items-center gap-2">
                <Brain size={14} /> Gut-Brain Connection: Strong | Focus:
                Serotonin Precursors
              </p>
            </div>
          </div>
          <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center gap-2">
            See My Meal Plan <ChevronRight size={18} />
          </button>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Recommended Foods */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 size={24} className="text-accent" /> Recommended
              Foods
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {moodData.recommended_foods.map((food, idx) => (
                <Card
                  key={food.name}
                  className="p-6 bg-white/5 border-white/10 hover:bg-white/10 transition-all group"
                >
                  <div className="flex gap-4">
                    <div className="text-4xl">{food.emoji}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-lg">{food.name}</h4>
                        <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full uppercase tracking-widest">
                          {food.howMuch}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/60 mb-4">
                        {food.benefit}
                      </p>
                      <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-foreground/40 leading-relaxed italic">
                        "{food.scienceBehind}"
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Foods to Avoid */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <AlertCircle size={24} className="text-red-400" /> Foods to Avoid
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {moodData.avoid_foods.map((food, idx) => (
                <Card
                  key={food.name}
                  className="p-6 bg-red-500/5 border-red-500/10 border-dashed"
                >
                  <h4 className="font-bold text-red-400 mb-1">{food.name}</h4>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    {food.reason}
                  </p>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-500/10 border-blue-500/20">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Droplets size={20} className="text-blue-500" /> Hydration Alert
              </h3>
              <p className="text-sm text-foreground/60 leading-relaxed">
                Dehydration can mimic symptoms of anxiety and fatigue. Aim for 3
                liters today. Try Tulsi-infused water for extra calm.
              </p>
            </Card>
          </div>
        </div>

        {/* Recipes Section */}
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <Heart size={28} className="text-rose-400" /> Mood-Boosting Recipes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {moodData.recipes.map((recipe, idx) => (
            <Card
              key={recipe.name}
              className="p-0 overflow-hidden bg-white/5 border-white/10 group h-full flex flex-col"
            >
              <div className="h-48 bg-linear-to-br from-orange-400/20 to-rose-400/20 relative flex items-center justify-center">
                <div className="text-8xl group-hover:scale-110 transition-transform duration-500">
                  {recipe.emoji}
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full text-xs font-bold text-white flex items-center gap-2">
                  <Clock size={14} /> {recipe.prepTime} Mins
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold mb-4">{recipe.name}</h3>
                <div className="flex-1 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                      Ingredients
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {recipe.ingredients.map((ing) => (
                        <span
                          key={ing}
                          className="px-2 py-1 bg-white/5 rounded-lg text-xs text-foreground/60"
                        >
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-2">
                      Steps
                    </h4>
                    <ol className="space-y-2">
                      {recipe.steps.map((step, i) => (
                        <li
                          key={i}
                          className="text-sm text-foreground/60 flex gap-3"
                        >
                          <span className="font-bold text-primary">
                            {i + 1}.
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-white/5">
                  <p className="text-xs font-bold text-rose-400 flex items-center gap-2 uppercase tracking-widest">
                    <TrendingUp size={14} /> Benefit: {recipe.moodBenefit}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </PageWrapper>
    </div>
  );
}
