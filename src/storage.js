const KEY = "cooking-smart-saved-recipes";

export function getSavedRecipes() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveRecipe(recipe) {
  const current = getSavedRecipes();
  const exists = current.some(r => r.name === recipe.name);
  if (exists) return current;
  const next = [{ ...recipe, savedAt: new Date().toISOString() }, ...current];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function deleteRecipe(id) {
  const next = getSavedRecipes().filter(r => r.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearSavedRecipes() {
  localStorage.removeItem(KEY);
  return [];
}
