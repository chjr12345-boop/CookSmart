# Cooking Smart

A four-screen, mobile-first recipe discovery and ingredient-to-recipe MVP built with React, Vite, JavaScript, CSS and a small Node.js/Express API foundation.

## Four primary screens

1. Home
2. Ingredient Input
3. Generated Recipe
4. Saved Recipes

Search results and viewing a saved recipe remain within these four primary screens.

## Features

- Responsive mobile and desktop UI
- Recipe catalogue and search
- Ingredient chips with add/remove
- Cuisine, meal, diet and cooking-time preferences
- Local recipe generation engine
- Save/delete recipes using LocalStorage
- Persistent navigation
- Future AI API integration point
- Node.js/Express API foundation

## Requirements

Use a current LTS version of Node.js.

## Run

```bash
npm install
npm run dev
```

Then open the Vite URL shown in the terminal, normally:

http://localhost:5173

The API runs on:

http://localhost:3001

## Production build

```bash
npm run build
npm run preview
```

## Architecture

Browser:
React UI → local recipe engine → LocalStorage

Future:
React UI → Node.js API → AI provider/database/authentication

## Notes

Version 1 intentionally does not require a paid AI API. The local recipe engine keeps the application fully usable while preserving a clean integration point for a future AI service.
