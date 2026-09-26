import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, "..", "dist");

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "Cooking Smart API"
  });
});

app.post("/api/recipe", (req, res) => {
  const {
    ingredients = [],
    preferences = {}
  } = req.body || {};

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.status(400).json({
      error: "Please provide at least one ingredient."
    });
  }

  res.json({
    message: "API integration point ready.",
    ingredients,
    preferences
  });
});

app.use(express.static(distPath));

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.join(distPath, "index.html"));
  } else {
    next();
  }
});

const port = process.env.PORT || 3001;

app.listen(port, "0.0.0.0", () => {
  console.log(`Cooking Smart server running on port ${port}`);
});
