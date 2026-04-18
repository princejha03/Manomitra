export interface Food {
  name: string;
  emoji: string;
  benefit: string;
  howMuch: string;
  howToEat: string;
  scienceBehind: string;
}

export interface Recipe {
  name: string;
  ingredients: string[];
  steps: string[];
  moodBenefit: string;
  prepTime: number;
  emoji: string;
}

export interface MoodFood {
  mood: string;
  recommended_foods: Food[];
  avoid_foods: { name: string, reason: string }[];
  recipes: Recipe[];
}

export const foodData: MoodFood[] = [
  {
    mood: "Anxious",
    recommended_foods: [
      {
        name: "Turmeric Milk (Haldi Doodh)",
        emoji: "🥛",
        benefit: "Reduces inflammation and calms the mind",
        howMuch: "1 cup daily",
        howToEat: "Warm before bed",
        scienceBehind: "Curcumin in turmeric has neuroprotective properties and can help regulate neurotransmitters."
      },
      {
        name: "Tulsi Tea",
        emoji: "☕",
        benefit: "Adaptogenic herb for stress",
        howMuch: "1-2 cups",
        howToEat: "Steep fresh leaves in hot water",
        scienceBehind: "Holy Basil helps normalize cortisol levels and promotes mental clarity."
      }
    ],
    avoid_foods: [
      { name: "Caffeine", reason: "Increases heart rate and can trigger anxiety spikes." },
      { name: "High Sugar Snacks", reason: "Causes blood sugar crashes that mimic anxiety symptoms." }
    ],
    recipes: [
      {
        name: "Golden Turmeric Latte",
        ingredients: ["1 cup Milk", "1/2 tsp Turmeric", "Pinch of Black Pepper", "1/2 tsp Honey"],
        steps: ["Heat milk in a saucepan", "Whisk in turmeric and pepper", "Simmer for 2 mins", "Add honey and serve"],
        moodBenefit: "Promotes deep relaxation and sleep",
        prepTime: 5,
        emoji: "✨"
      }
    ]
  },
  {
    mood: "Sad",
    recommended_foods: [
      {
        name: "Amla (Indian Gooseberry)",
        emoji: "🟢",
        benefit: "High Vitamin C for serotonin",
        howMuch: "1 fruit daily",
        howToEat: "Fresh, juice, or as murabba",
        scienceBehind: "Vitamin C is a cofactor in the synthesis of serotonin and dopamine."
      },
      {
        name: "Walnuts (Akhrot)",
        emoji: "🥜",
        benefit: "Omega-3 for brain health",
        howMuch: "4-5 kernels",
        howToEat: "Soaked overnight",
        scienceBehind: "Rich in DHA, which supports cognitive function and mood regulation."
      }
    ],
    avoid_foods: [
      { name: "Alcohol", reason: "A depressant that can worsen low mood over time." },
      { name: "Processed Meat", reason: "Associated with higher risk of depression." }
    ],
    recipes: [
      {
        name: "Omega-3 Energy Bowl",
        ingredients: ["1 cup Yogurt", "5 Walnuts", "1 tsp Flax seeds", "1/2 cup Berries"],
        steps: ["Whisk yogurt until smooth", "Top with walnuts and seeds", "Add fresh berries", "Drizzle with honey"],
        moodBenefit: "Uplifts mood and provides sustained energy",
        prepTime: 5,
        emoji: "🌈"
      }
    ]
  }
];
