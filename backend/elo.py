"""
Run manually from backend/: python elo.py
Computes Elo ratings for every fighter in the fight_log table, processed
in chronological order. Finishes get a small bonus over decisions, scaled
by round, using the same round-weighting as the last5 scoring system.
"""

import os
from collections import defaultdict
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
engine = create_engine(os.getenv('DATABASE_URL'))

with engine.connect() as conn:
    df = pd.read_sql(text("SELECT * FROM fight_log ORDER BY event_date ASC"), conn)

BASE_RATING = 1500
K = 40

ROUND_POINTS = {1: 6, 2: 5, 3: 4, 4: 3, 5: 2}
DECISION_METHODS = {'U-DEC', 'S-DEC', 'M-DEC', 'DEC'}


def mov_multiplier(method, round_):
    points = 1 if method in DECISION_METHODS else ROUND_POINTS.get(round_, 1)
    return 1 + 0.05 * (points - 1)


ratings = defaultdict(lambda: BASE_RATING)
peak = defaultdict(lambda: BASE_RATING)

for _, row in df.iterrows():
    winner = row['fighter1'] if row['outcome'] == 1 else row['fighter2']
    loser = row['fighter2'] if row['outcome'] == 1 else row['fighter1']

    Rw, Rl = ratings[winner], ratings[loser]
    expected_w = 1 / (1 + 10 ** ((Rl - Rw) / 400))
    k_adj = K * mov_multiplier(row['method'], row['round'])

    new_w = Rw + k_adj * (1 - expected_w)
    new_l = Rl - k_adj * (1 - expected_w)

    ratings[winner] = new_w
    ratings[loser] = new_l
    peak[winner] = max(peak[winner], new_w)
    peak[loser] = max(peak[loser], new_l)

print(f"{'Fighter':<25}{'Current Elo':>14}{'Peak Elo':>12}")
for name in sorted(ratings, key=lambda f: -peak[f]):
    print(f"{name:<25}{ratings[name]:>14.1f}{peak[name]:>12.1f}")
