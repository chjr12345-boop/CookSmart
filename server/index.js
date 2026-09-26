import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "Cooking Smart API" });
});

app.post("/api/recipe", (req, res) => {
  const { ingredients = [], preferences = {} } = req.body || {};
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({ error: "Please provide at least one ingredient." });
  }

  // Version 1 keeps recipe generation local in the browser.
  // This endpoint is a clean future integration point for an AI provider.
  res.json({
    message: "API integration point ready.",
    ingredients,
    preferences
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Cooking Smart API running at http://localhost:${port}`));
