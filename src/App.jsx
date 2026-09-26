import { useMemo, useState } from "react";
import {
  ChefHat, Home, Search, Bookmark, Sparkles, Plus, X, Clock3,
  ArrowLeft, Trash2, Heart, Menu, Utensils, CheckCircle2
} from "lucide-react";
import { categories, recipes } from "./data";
import { generateRecipe } from "./recipeEngine";
import { deleteRecipe, getSavedRecipes, saveRecipe } from "./storage";

const screens = { HOME: "home", INGREDIENTS: "ingredients", RECIPE: "recipe", SAVED: "saved" };

function App() {
  const [screen, setScreen] = useState(screens.HOME);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [preferences, setPreferences] = useState({
    cuisine: "Any", mealType: "Any", dietary: "No Preference", cookingTime: "Any"
  });
  const [currentRecipe, setCurrentRecipe] = useState(null);
  const [saved, setSaved] = useState(getSavedRecipes);
  const [notice, setNotice] = useState("");

  const showNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 2200);
  };

  const filteredRecipes = useMemo(() => {
    const q = query.toLowerCase().trim();
    return recipes.filter(r => {
      const categoryMatch = category === "All" || r.category === category || (category === "Vegetarian" && !r.name.toLowerCase().includes("chicken"));
      const searchMatch = !q || [r.name, r.cuisine, r.category, ...r.ingredients].join(" ").toLowerCase().includes(q);
      return categoryMatch && searchMatch;
    });
  }, [query, category]);

  const addIngredient = () => {
    const value = ingredientInput.trim();
    if (!value) return;
    if (!ingredients.some(x => x.toLowerCase() === value.toLowerCase())) {
      setIngredients([...ingredients, value]);
    }
    setIngredientInput("");
  };

  const removeIngredient = (value) => setIngredients(ingredients.filter(x => x !== value));

  const createRecipe = () => {
    if (!ingredients.length) {
      showNotice("Please add at least one ingredient.");
      return;
    }
    try {
      setCurrentRecipe(generateRecipe(ingredients, preferences));
      setScreen(screens.RECIPE);
    } catch (e) {
      showNotice(e.message);
    }
  };

  const saveCurrent = () => {
    if (!currentRecipe) return;
    const next = saveRecipe(currentRecipe);
    setSaved(next);
    showNotice("Recipe saved to your collection.");
  };

  const openSaved = (recipe) => {
    setCurrentRecipe(recipe);
    setScreen(screens.RECIPE);
  };

  const removeSaved = (id) => {
    const next = deleteRecipe(id);
    setSaved(next);
    showNotice("Recipe removed.");
  };

  const go = (next) => {
    setScreen(next);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => go(screens.HOME)} aria-label="Cooking Smart home">
          <span className="brand-mark"><ChefHat size={24} /></span>
          <span><strong>Cooking Smart</strong><small>Your ingredients. Your recipe.</small></span>
        </button>

        <nav className="desktop-nav" aria-label="Primary navigation">
          <button className={screen === screens.HOME ? "active" : ""} onClick={() => go(screens.HOME)}><Home size={17}/>Home</button>
          <button className={screen === screens.INGREDIENTS ? "active" : ""} onClick={() => go(screens.INGREDIENTS)}><Sparkles size={17}/>Generate</button>
          <button className={screen === screens.SAVED ? "active" : ""} onClick={() => go(screens.SAVED)}><Bookmark size={17}/>Saved</button>
        </nav>

        <button className="menu-button" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Open navigation"><Menu /></button>
      </header>

      {mobileMenu && (
        <div className="mobile-menu">
          <button onClick={() => go(screens.HOME)}><Home/> Home</button>
          <button onClick={() => go(screens.INGREDIENTS)}><Sparkles/> Generate Recipe</button>
          <button onClick={() => go(screens.SAVED)}><Bookmark/> Saved Recipes</button>
        </div>
      )}

      {notice && <div className="toast"><CheckCircle2 size={18}/>{notice}</div>}

      <main>
        {screen === screens.HOME && (
          <HomeScreen
            query={query} setQuery={setQuery}
            category={category} setCategory={setCategory}
            filteredRecipes={filteredRecipes}
            onGenerate={() => go(screens.INGREDIENTS)}
            onOpenRecipe={openSaved}
            onCategory={setCategory}
          />
        )}

        {screen === screens.INGREDIENTS && (
          <IngredientScreen
            ingredients={ingredients}
            ingredientInput={ingredientInput}
            setIngredientInput={setIngredientInput}
            addIngredient={addIngredient}
            removeIngredient={removeIngredient}
            preferences={preferences}
            setPreferences={setPreferences}
            onGenerate={createRecipe}
            onHome={() => go(screens.HOME)}
          />
        )}

        {screen === screens.RECIPE && (
          <RecipeScreen
            recipe={currentRecipe}
            saved={saved.some(r => r.name === currentRecipe?.name)}
            onSave={saveCurrent}
            onGenerateAnother={() => go(screens.INGREDIENTS)}
            onIngredients={() => go(screens.INGREDIENTS)}
            onHome={() => go(screens.HOME)}
          />
        )}

        {screen === screens.SAVED && (
          <SavedScreen
            saved={saved}
            onOpen={openSaved}
            onDelete={removeSaved}
            onGenerate={() => go(screens.INGREDIENTS)}
            onHome={() => go(screens.HOME)}
          />
        )}
      </main>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <button className={screen === screens.HOME ? "active" : ""} onClick={() => go(screens.HOME)}><Home/><span>Home</span></button>
        <button className={screen === screens.INGREDIENTS ? "active" : ""} onClick={() => go(screens.INGREDIENTS)}><Sparkles/><span>Generate</span></button>
        <button className={screen === screens.SAVED ? "active" : ""} onClick={() => go(screens.SAVED)}><Bookmark/><span>Saved</span></button>
      </nav>
    </div>
  );
}

function HomeScreen({ query, setQuery, category, setCategory, filteredRecipes, onGenerate, onOpenRecipe }) {
  const featured = recipes[2];
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={15}/> SMART COOKING</span>
          <h1>Turn what you have into something <em>delicious.</em></h1>
          <p>Tell us what is in your kitchen and Cooking Smart will create a recipe around it.</p>
          <button className="primary-button large" onClick={onGenerate}><Sparkles size={18}/> Create My Recipe</button>
        </div>
        <div className="hero-art">
          <div className="plate">🍲</div>
          <span className="floating-chip chip-one">Fresh & easy</span>
          <span className="floating-chip chip-two">AI-ready</span>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading"><div><span className="eyebrow">DISCOVER</span><h2>Find your next favourite</h2></div></div>
        <div className="search-box">
          <Search size={20}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search recipes, ingredients or cuisine..." />
          {query && <button onClick={() => setQuery("")}><X/></button>}
        </div>
        <div className="category-row">
          <button className={category === "All" ? "category active" : "category"} onClick={() => setCategory("All")}>All</button>
          {categories.map(c => <button key={c} className={category === c ? "category active" : "category"} onClick={() => setCategory(c)}>{c}</button>)}
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading"><div><span className="eyebrow">FEATURED</span><h2>Tonight's inspiration</h2></div></div>
        <div className="featured-card">
          <div className="food-visual large-food">{featured.image}</div>
          <div className="featured-copy">
            <span className="pill">{featured.cuisine}</span>
            <h3>{featured.name}</h3>
            <p>{featured.description}</p>
            <div className="meta"><span><Clock3/> {featured.time} min</span><span><Utensils/> {featured.difficulty}</span></div>
            <button className="secondary-button" onClick={() => onOpenRecipe(featured)}>View Recipe <ArrowLeft className="rotate-180"/></button>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading"><div><span className="eyebrow">CATALOGUE</span><h2>What are you craving?</h2></div></div>
        {filteredRecipes.length ? (
          <div className="recipe-grid">
            {filteredRecipes.map(r => (
              <article className="recipe-card" key={r.id}>
                <div className="food-visual">{r.image}</div>
                <div className="card-body">
                  <span className="pill">{r.category}</span>
                  <h3>{r.name}</h3>
                  <p>{r.description}</p>
                  <div className="meta"><span><Clock3/> {r.time} min</span><span>{r.difficulty}</span></div>
                  <button className="text-button" onClick={() => onOpenRecipe(r)}>View recipe →</button>
                </div>
              </article>
            ))}
          </div>
        ) : <div className="empty-state"><Search/><h3>No recipes found</h3><p>Try another ingredient, cuisine or category.</p></div>}
      </section>
    </>
  );
}

function IngredientScreen({ ingredients, ingredientInput, setIngredientInput, addIngredient, removeIngredient, preferences, setPreferences, onGenerate, onHome }) {
  const update = (key, value) => setPreferences({ ...preferences, [key]: value });
  return (
    <section className="form-page">
      <div className="page-intro">
        <button className="back-button" onClick={onHome}><ArrowLeft/> Home</button>
        <span className="eyebrow"><Sparkles size={15}/> YOUR KITCHEN</span>
        <h1>What do you have in your kitchen?</h1>
        <p>Give us a few ingredients and we'll turn them into a delicious idea.</p>
      </div>

      <div className="form-layout">
        <div className="panel ingredient-panel">
          <label className="field-label">Your ingredients</label>
          <div className="ingredient-input">
            <input value={ingredientInput} onChange={e => setIngredientInput(e.target.value)} onKeyDown={e => e.key === "Enter" && addIngredient()} placeholder="e.g. tomato, potato, onion" />
            <button onClick={addIngredient}><Plus/> Add</button>
          </div>
          <div className="ingredient-chips">
            {ingredients.map(i => <span className="ingredient-chip" key={i}>{i}<button onClick={() => removeIngredient(i)} aria-label={`Remove ${i}`}><X/></button></span>)}
          </div>
          {!ingredients.length && <div className="helper">Add at least one ingredient. You can press Enter after typing.</div>}

          <div className="preference-grid">
            <Select label="Cuisine" value={preferences.cuisine} onChange={v => update("cuisine", v)} options={["Any","Indian","Italian","Chinese","Mexican","Continental"]}/>
            <Select label="Meal Type" value={preferences.mealType} onChange={v => update("mealType", v)} options={["Any","Breakfast","Lunch","Dinner","Snack","Dessert"]}/>
            <Select label="Dietary Preference" value={preferences.dietary} onChange={v => update("dietary", v)} options={["No Preference","Vegetarian","Vegan","High Protein","Low Carb","Healthy"]}/>
            <Select label="Cooking Time" value={preferences.cookingTime} onChange={v => update("cookingTime", v)} options={["Any","Under 15 minutes","15–30 minutes","30–60 minutes"]}/>
          </div>

          <button className="primary-button large full" onClick={onGenerate}><Sparkles/> Generate My Recipe</button>
        </div>

        <aside className="tips-card">
          <div className="tip-icon">💡</div>
          <h3>Smart cooking tip</h3>
          <p>You don't need every ingredient. Start with 2–4 main ingredients and let the recipe engine fill in the basics.</p>
        </aside>
      </div>
    </section>
  );
}

function Select({ label, value, onChange, options }) {
  return <label className="select-field"><span>{label}</span><select value={value} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o}>{o}</option>)}</select></label>;
}

function RecipeScreen({ recipe, saved, onSave, onGenerateAnother, onIngredients, onHome }) {
  if (!recipe) return <section className="empty-state page-empty"><ChefHat/><h2>No recipe yet</h2><p>Start by adding ingredients.</p><button className="primary-button" onClick={onIngredients}>Generate a Recipe</button></section>;
  return (
    <section className="recipe-page">
      <div className="recipe-header">
        <button className="back-button" onClick={onIngredients}><ArrowLeft/> Ingredients</button>
        <span className="eyebrow"><Sparkles size={15}/> YOUR SMART RECIPE</span>
        <h1>{recipe.name}</h1>
        <p>{recipe.description}</p>
        <div className="recipe-meta">
          <span><Clock3/> Prep {recipe.prepTime || 10} min</span>
          <span><Clock3/> Cook {recipe.time} min</span>
          <span>⚡ {recipe.difficulty}</span>
          <span>🍽 4 servings</span>
        </div>
      </div>

      <div className="recipe-content">
        <div className="recipe-hero-visual">{recipe.image || "🍲"}</div>
        <div className="recipe-section">
          <div className="section-heading"><div><span className="eyebrow">WHAT YOU NEED</span><h2>Ingredients</h2></div></div>
          <ul className="ingredient-list">{recipe.ingredients.map((i, idx) => <li key={idx}><span>✓</span>{i}</li>)}</ul>
        </div>
        <div className="recipe-section">
          <div className="section-heading"><div><span className="eyebrow">HOW TO COOK</span><h2>Step by step</h2></div></div>
          <ol className="steps">{recipe.steps.map((s, idx) => <li key={idx}><span>{idx + 1}</span><p>{s}</p></li>)}</ol>
        </div>
      </div>

      <div className="recipe-actions">
        <button className={saved ? "saved-button" : "primary-button"} onClick={onSave} disabled={saved}><Heart fill={saved ? "currentColor" : "none"}/> {saved ? "Saved" : "Save Recipe"}</button>
        <button className="secondary-button" onClick={onGenerateAnother}><Sparkles/> Generate Another</button>
        <button className="secondary-button" onClick={onHome}><Home/> Home</button>
      </div>
    </section>
  );
}

function SavedScreen({ saved, onOpen, onDelete, onGenerate, onHome }) {
  return (
    <section className="content-section saved-page">
      <div className="page-intro compact">
        <span className="eyebrow"><Bookmark size={15}/> YOUR COLLECTION</span>
        <h1>My saved recipes</h1>
        <p>Your personal collection, stored safely in this browser.</p>
      </div>
      {saved.length ? (
        <div className="recipe-grid">
          {saved.map(r => (
            <article className="recipe-card" key={r.id}>
              <div className="food-visual">{r.image || "🍲"}</div>
              <div className="card-body">
                <span className="pill">{r.cuisine || "Recipe"}</span>
                <h3>{r.name}</h3>
                <p>{r.description}</p>
                <div className="meta"><span><Clock3/> {r.time} min</span><span>{r.difficulty}</span></div>
                <div className="card-actions">
                  <button className="text-button" onClick={() => onOpen(r)}>View recipe →</button>
                  <button className="icon-button danger" onClick={() => onDelete(r.id)} aria-label={`Delete ${r.name}`}><Trash2/></button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Bookmark/>
          <h2>Your recipe collection is empty.</h2>
          <p>Save a recipe and it will appear here even after you close the browser.</p>
          <div className="empty-actions">
            <button className="primary-button" onClick={onGenerate}><Sparkles/> Create Your First Recipe</button>
            <button className="secondary-button" onClick={onHome}><Home/> Home</button>
          </div>
        </div>
      )}
    </section>
  );
}

export default App;
