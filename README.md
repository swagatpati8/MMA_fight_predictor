# MMA Fight Predictor

**Live App:** https://mma-fight-predictor-mauve.vercel.app

---

## Overview

MMA Fight Predictor is a full-stack web application that uses machine learning to predict the outcome of UFC fights. Select any two fighters, and the model will tell you who it thinks wins, with what probability, and in which round — along with a full head-to-head stat breakdown so you can see *why*.

---

## Data Collection

All fighter and fight data was manually scraped from **UFC.com**, including:

- Each fighter's individual stats page (striking accuracy, takedown accuracy, knockdown average, submission average, etc.)
- The official **UFC rankings page** per weight class
- Historical **fight results** including round finished and outcome

Fighter stats represent their career averages at the time of data collection. Rankings reflect the current official UFC rankings at the time of entry.

---

## Tech Stack

- **Frontend:** React 18 + TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Flask (Python), SQLAlchemy
- **Database:** PostgreSQL via Supabase
- **ML:** scikit-learn (Logistic Regression)
- **Deployed:** Vercel (frontend)

---

## Machine Learning Model

The prediction engine uses two **Logistic Regression** models trained on historical UFC fight data:

1. **Outcome model** — predicts who wins (fighter 1 or fighter 2)
2. **Round model** — predicts which round the fight ends

### Feature Engineering

Rather than feeding raw stats directly, the model computes **difference features** between the two fighters. For example, instead of "Fighter 1 striking accuracy = 60%", the model sees "Fighter 1 striking accuracy − Fighter 2 striking accuracy = +17%". This allows the model to learn which statistical edges matter most.

Features used:
- Win rate differential
- Last 5 fights win differential
- Striking stats: SLpM, striking accuracy, strikes absorbed per minute, striking defense
- Grappling stats: takedown average, takedown accuracy, takedown defense, submission average
- Knockdown average
- Ranking differential
- Age distance from prime (prime set at 31.27 years based on UFC data)
- Height and reach differential

### What the Model Weighted Most

Based on the trained coefficients, here is how the model currently ranks feature importance:

| Feature | Weight | Interpretation |
|---|---|---|
| Age distance from prime | -0.79 | Fighters closer to prime age (31.27) are favored |
| Takedown average diff | -0.76 | (currently inverted — see limitations) |
| Submission average diff | -0.65 | (currently inverted — see limitations) |
| Strikes absorbed per minute | +0.48 | Higher SApM for fighter 1 increases predicted win % |
| Last 5 wins | +0.32 | Recent form matters |
| Ranking differential | -0.21 | Higher-ranked fighters are favored |
| Knockdown average | +0.19 | Better finishing power is rewarded |

### Limitations

The model is currently trained on **22 fights**, which is too small a dataset to reliably learn from. Several feature weights are pointing in the wrong direction (e.g., better takedown average and submission average are currently penalizing fighters) — this is a known artifact of the small sample size where spurious correlations dominate. The model will improve significantly as more fight data is added.

---

## Roadmap / Future Improvements

- **More data** — bulk import historical UFC fight results to get to 200+ training examples, which should correct the inverted feature weights
- **Fight style clustering** — use unsupervised learning (k-means or DBSCAN) to label fighters by style (pressure striker, wrestler, counter-striker, submission artist) and encode stylistic matchup advantages as a feature
- **Better outcome encoding** — separate finish rate (KO%, submission%, decision%) from round prediction for cleaner signal
- **Stronger model** — upgrade from logistic regression to XGBoost or Random Forest to capture non-linear interactions between features
- **Per weight class models** — train separate models for each division since heavyweight and flyweight dynamics are very different
- **Prediction history page** — track past predictions and measure accuracy over time
- **User accounts + subscription model** — allow users to sign up and access predictions

---

## Contact

Have a suggestion, spotted an error, or want a specific fighter added to the database? Reach out:

**swagat.pati@rutgers.edu**

I'm open to all feedback and happy to add fighters on request.
