"""
Usage:
    python explain_prediction.py "quillan salkilld" "beneil dariush"
"""

import sys
import os
import joblib
import pandas as pd
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
engine = create_engine(os.getenv('DATABASE_URL'))

model = joblib.load(os.path.join(os.path.dirname(__file__), 'models/model_outcome.pkl'))
FEATURES = joblib.load(os.path.join(os.path.dirname(__file__), 'models/features.pkl'))

FIGHT_YEAR = 2025
PRIME_AGE = 31.27

def get_fighter(name):
    with engine.connect() as conn:
        row = conn.execute(
            text("SELECT * FROM fighters WHERE LOWER(name) = LOWER(:name)"),
            {"name": name}
        ).fetchone()
    if row is None:
        print(f"Fighter not found: {name}")
        sys.exit(1)
    return dict(row._mapping)

def compute_features(f1, f2):
    row = {}
    row['wins_diff']    = f1['wins']/(f1['wins']+f1['losses']) - f2['wins']/(f2['wins']+f2['losses'])
    row['losses_diff']  = f1['losses']/(f1['wins']+f1['losses']) - f2['losses']/(f2['wins']+f2['losses'])
    row['last5_diff']   = f1['last5'] - f2['last5']
    row['SLpM_diff']    = f1['slpm'] - f2['slpm']
    row['StrAcc_diff']  = f1['stracc'] - f2['stracc']
    row['SApM_diff']    = f1['sapm'] - f2['sapm']
    row['StrDef_diff']  = f1['strdef'] - f2['strdef']
    row['TDAvg_diff']   = f1['tdavg'] - f2['tdavg']
    row['TDAcc_diff']   = f1['tdacc'] - f2['tdacc']
    row['TDDef_diff']   = f1['tddef'] - f2['tddef']
    row['SubAvg_diff']  = f1['subavg'] - f2['subavg']
    row['KDAvg_diff']   = f1['kdavg'] - f2['kdavg']
    row['ranking_diff'] = f1['ranking'] - f2['ranking']
    f1_age = FIGHT_YEAR - f1['birth_year']
    f2_age = FIGHT_YEAR - f2['birth_year']
    row['age_distance_diff'] = abs(f1_age - PRIME_AGE) - abs(f2_age - PRIME_AGE)
    row['height_diff']  = f1['height'] - f2['height']
    row['reach_diff']   = f1['reach'] - f2['reach']
    row['five_rd_dec_wins_diff'] = (f1.get('five_rd_dec_wins') or 0) - (f2.get('five_rd_dec_wins') or 0)
    return row

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print('Usage: python explain_prediction.py "fighter 1 name" "fighter 2 name"')
        sys.exit(1)

    f1 = get_fighter(sys.argv[1])
    f2 = get_fighter(sys.argv[2])

    row = compute_features(f1, f2)
    X = pd.DataFrame([row])[FEATURES]

    prob = model.predict_proba(X)[0]
    pred = model.predict(X)[0]
    winner = f1['name'].title() if pred == 1 else f2['name'].title()

    print()
    print(f"  {f1['name'].title()} vs {f2['name'].title()}")
    print(f"  Prediction : {winner.upper()}")
    print(f"  {f1['name'].title()} win prob : {prob[1]*100:.1f}%")
    print(f"  {f2['name'].title()} win prob : {prob[0]*100:.1f}%")
    print()

    weights = dict(zip(FEATURES, model.coef_[0]))
    contributions = []
    for f in FEATURES:
        val = X[f].values[0]
        contrib = val * weights[f]
        favors = f1['name'].title() if contrib > 0 else f2['name'].title()
        contributions.append((f, abs(contrib), contrib, favors))

    contributions.sort(key=lambda x: x[1], reverse=True)

    col1, col2, col3 = 20, 18, 14
    border = f"  ┼{'─'*(col1+2)}┼{'─'*(col2+2)}┼{'─'*(col3+2)}┼"
    print(f"  ┌{'─'*(col1+2)}┬{'─'*(col2+2)}┬{'─'*(col3+2)}┐")
    print(f"  │ {'Feature':<{col1}} │ {'Abs Contribution':>{col2}} │ {'Favors':>{col3}} │")
    print(border)
    for feat, abs_c, raw_c, favors in contributions:
        print(f"  │ {feat:<{col1}} │ {abs_c:>{col2}.4f} │ {favors:>{col3}} │")
        print(border)
    print()
