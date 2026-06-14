---
name: Project Roadmap & Future Features
description: Planned features and architectural ideas for the MMA fight predictor
type: project
---

## Gemini API Integration (next major feature)
After ML model runs a prediction, call Gemini API from Flask backend to generate a natural language explanation of WHY the model picked the winner. Send: feature diffs, model weights, winner, confidence %. Gemini returns a 2-3 sentence human-readable analysis. Frontend gets one combined response. ~30 lines of Python in the predict route.

Also planned: Gemini writes the "notes" field for future predictions automatically.

## Fight Data Strategy
User records every fight they watch going forward into the DB. No rush — accuracy improves naturally over time. Currently 26 fights, need 160-320 for reliable logistic regression with 16 features. Model is biased toward KDAvg_diff (weight 0.92 vs ~0.2 for everything else).

## Round-by-Round Stats (future)
Scrape per-round stats from UFC stats pages (KD, sig str, TD, ctrl time per round). Don't use as ML features — too many dimensions. Instead, store in DB and pass to Gemini as context so it can reason about how a fight might play out stylistically.

## Unsupervised Learning / Fighter Similarity
Use clustering to find fighters with similar styles (e.g. Strickland vs Whittaker as similar strikers). Then use how Khamzat did against similar fighters to inform predictions. Useful context for Gemini explanations.

## Predictions Page
- Past Predictions: model's historical calls vs actual results
- Future Predictions: upcoming fights user plans to bet on, with manual pick + optional model pick

**Why:** track record builds credibility and helps user evaluate when to trust the model vs override it.
