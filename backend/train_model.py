"""
Run this script manually from the backend/ directory whenever you want to retrain:
    python train_model.py

It pulls fight data from Supabase, trains two logistic regression models
(outcome + round), and saves them to backend/models/.
"""

import os
import joblib
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sklearn.linear_model import LogisticRegression

# ── Load DB connection ────────────────────────────────────────────────────────
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
DATABASE_URL = os.getenv('DATABASE_URL')
engine = create_engine(DATABASE_URL)

# ── Pull fight data from Supabase ─────────────────────────────────────────────
print("Fetching fights from database...")
with engine.connect() as conn:
    df = pd.read_sql(text("SELECT * FROM fights WHERE outcome IN (0, 1)"), conn)

print(f"Loaded {len(df)} fights.")

# ── Feature Engineering (same as your Colab code) ────────────────────────────
prime_age = 31.27

df['wins_diff'] = (
    df['fighter1_wins'] / (df['fighter1_wins'] + df['fighter1_losses']) -
    df['fighter2_wins'] / (df['fighter2_wins'] + df['fighter2_losses'])
)
df['losses_diff'] = (
    df['fighter1_losses'] / (df['fighter1_wins'] + df['fighter1_losses']) -
    df['fighter2_losses'] / (df['fighter2_wins'] + df['fighter2_losses'])
)
df['last5_diff']    = df['fighter1_last5']   - df['fighter2_last5']
df['SLpM_diff']     = df['fighter1_SLpM']    - df['fighter2_SLpM']
df['StrAcc_diff']   = df['fighter1_StrAcc']  - df['fighter2_StrAcc']
df['SApM_diff']     = df['fighter1_SApM']    - df['fighter2_SApM']
df['StrDef_diff']   = df['fighter1_StrDef']  - df['fighter2_StrDef']
df['TDAvg_diff']    = df['fighter1_TDAvg']   - df['fighter2_TDAvg']
df['TDAcc_diff']    = df['fighter1_TDAcc']   - df['fighter2_TDAcc']
df['TDDef_diff']    = df['fighter1_TDDef']   - df['fighter2_TDDef']
df['SubAvg_diff']   = df['fighter1_SubAvg']  - df['fighter2_SubAvg']
df['KDAvg_diff']    = df['fighter1_KDAvg']   - df['fighter2_KDAvg']
df['ranking_diff']  = df['fighter1_ranking'] - df['fighter2_ranking']

df['fighter1_age']          = df['fight_year'] - df['fighter1_birth_year']
df['fighter2_age']          = df['fight_year'] - df['fighter2_birth_year']
df['fighter1_age_distance'] = abs(df['fighter1_age'] - prime_age)
df['fighter2_age_distance'] = abs(df['fighter2_age'] - prime_age)
df['age_distance_diff']     = df['fighter1_age_distance'] - df['fighter2_age_distance']

df['height_diff'] = df['fighter1_height'] - df['fighter2_height']
df['reach_diff']  = df['fighter1_reach']  - df['fighter2_reach']

FEATURES = [
    'wins_diff', 'losses_diff', 'last5_diff',
    'SLpM_diff', 'StrAcc_diff', 'SApM_diff', 'StrDef_diff',
    'TDAvg_diff', 'TDAcc_diff', 'TDDef_diff',
    'SubAvg_diff', 'KDAvg_diff', 'ranking_diff',
    'age_distance_diff', 'height_diff', 'reach_diff',
]

X = df[FEATURES]

# outcome: 1 = fighter1 wins, 0 = fighter1 loses
y_outcome = df['outcome'].astype(int)
y_round   = df['round_finished']

# ── Model 1: Outcome (who wins) ───────────────────────────────────────────────
print("\n── Outcome Model ──")
print(f"Training on all {len(X)} fights (dataset too small to split)")
model_outcome = LogisticRegression(max_iter=1000)
model_outcome.fit(X, y_outcome)

# Feature weights — useful for showing WHY the model picked a winner
weights = pd.DataFrame({
    'feature': FEATURES,
    'weight': model_outcome.coef_[0]
}).sort_values('weight', key=abs, ascending=False)
print("\nTop feature weights:")
print(weights.to_string(index=False))

# ── Model 2: Round ────────────────────────────────────────────────────────────
print("\n── Round Model ──")
print(f"Training on all {len(X)} fights (dataset too small to split)")
model_round = LogisticRegression(max_iter=1000)
model_round.fit(X, y_round)

# ── Save models ───────────────────────────────────────────────────────────────
os.makedirs(os.path.join(os.path.dirname(__file__), 'models'), exist_ok=True)
models_dir = os.path.join(os.path.dirname(__file__), 'models')

joblib.dump(model_outcome, os.path.join(models_dir, 'model_outcome.pkl'))
joblib.dump(model_round,   os.path.join(models_dir, 'model_round.pkl'))
joblib.dump(FEATURES,      os.path.join(models_dir, 'features.pkl'))

print(f"\nModels saved to {models_dir}/")
print("Done. Run this script again after adding new fights.")
