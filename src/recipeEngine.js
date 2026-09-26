import { recipes } from "./data";

const has = (items, word) => items.some((x) => x.toLowerCase().includes(word));

export function generateRecipe(ingredients, preferences = {}) {
  const items = ingredients.map((x) => x.trim().toLowerCase()).filter(Boolean);
  if (!items.length) throw new Error("Please add at least one ingredient.");

  let base;
  if (has(items, "potato") && has(items, "tomato")) base = recipes.find(r => r.name === "Tomato Rice");
  else if (has(items, "rice") && (has(items, "vegetable") || has(items, "carrot") || has(items, "beans") || has(items, "peas"))) base = recipes.find(r => r.name === "Vegetable Biryani");
  else if (has(items, "bread")) base = recipes.find(r => r.name === "Vegetable Sandwich");
  else if (has(items, "paneer")) base = recipes.find(r => r.name === "Paneer Butter Masala");
  else base = {
    name: `${preferences.cuisine && preferences.cuisine !== "Any" ? preferences.cuisine + " " : ""}Smart Kitchen Bowl`,
    cuisine: preferences.cuisine || "Any",
    category: preferences.mealType || "Any",
    time: preferences.cookingTime === "Under 15 minutes" ? 15 : 30,
    difficulty: "Easy",
    image: "🍲",
    description: "A flexible recipe created around the ingredients you already have.",
    ingredients: items.map(x => x.replace(/\b\w/g, c => c.toUpperCase())),
    steps: [
      "Wash and prepare all ingredients.",
      "Heat a little cooking oil in a pan.",
      "Add aromatics and cook until fragrant.",
      "Add the main ingredients and season to taste.",
      "Cook until everything is tender and well combined.",
      "Taste, adjust seasoning and serve warm."
    ]
  };

  return {
    ...base,
    id: `generated-${Date.now()}`,
    ingredients: Array.from(new Set([...base.ingredients, ...ingredients])).map(x => x.replace(/\b\w/g, c => c.toUpperCase())),
    preferences,
    prepTime: 10,
    totalTime: (base.time || 30) + 10
  };
}

// Future AI integration point:
// export async function generateRecipeWithAI(ingredients, preferences) { ... }
