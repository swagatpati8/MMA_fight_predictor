import os
import joblib
import pandas as pd
from datetime import datetime
from flask import Blueprint, request, jsonify
from db_models.fighters import Fighters
from db_models import db

predict_bp = Blueprint('predict', __name__)

PRIME_AGE = 31.27
MODELS_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')

# Load models once when the app starts
model_outcome = joblib.load(os.path.join(MODELS_DIR, 'model_outcome.pkl'))
model_round   = joblib.load(os.path.join(MODELS_DIR, 'model_round.pkl'))
FEATURES      = joblib.load(os.path.join(MODELS_DIR, 'features.pkl'))


def build_features(f1, f2):
    """Compute feature difference vector from two Fighters objects."""
    current_year = datetime.now().year

    f1_age = current_year - f1.birth_year
    f2_age = current_year - f2.birth_year
    f1_age_dist = abs(f1_age - PRIME_AGE)
    f2_age_dist = abs(f2_age - PRIME_AGE)

    f1_total = f1.wins + f1.losses
    f2_total = f2.wins + f2.losses

    row = {
        'wins_diff':          (f1.wins / f1_total) - (f2.wins / f2_total),
        'losses_diff':        (f1.losses / f1_total) - (f2.losses / f2_total),
        'last5_diff':         f1.last5    - f2.last5,
        'SLpM_diff':          f1.slpm     - f2.slpm,
        'StrAcc_diff':        f1.stracc   - f2.stracc,
        'SApM_diff':          f1.sapm     - f2.sapm,
        'StrDef_diff':        f1.strdef   - f2.strdef,
        'TDAvg_diff':         f1.tdavg    - f2.tdavg,
        'TDAcc_diff':         f1.tdacc    - f2.tdacc,
        'TDDef_diff':         f1.tddef    - f2.tddef,
        'SubAvg_diff':        f1.subavg   - f2.subavg,
        'KDAvg_diff':         f1.kdavg    - f2.kdavg,
        'ranking_diff':       f1.ranking  - f2.ranking,
        'age_distance_diff':  f1_age_dist - f2_age_dist,
        'height_diff':        f1.height   - f2.height,
        'reach_diff':         f1.reach    - f2.reach,
    }
    return pd.DataFrame([row])[FEATURES]


@predict_bp.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    fighter1_name = data.get('fighter1')
    fighter2_name = data.get('fighter2')

    if not fighter1_name or not fighter2_name:
        return jsonify({'error': 'fighter1 and fighter2 are required'}), 400

    f1 = db.session.query(Fighters).filter(Fighters.name.ilike(fighter1_name)).first()
    f2 = db.session.query(Fighters).filter(Fighters.name.ilike(fighter2_name)).first()

    if not f1:
        return jsonify({'error': f'Fighter not found: {fighter1_name}'}), 404
    if not f2:
        return jsonify({'error': f'Fighter not found: {fighter2_name}'}), 404

    features_df = build_features(f1, f2)

    # Win probability for fighter1 (index 1 = class "1" = fighter1 wins)
    proba = model_outcome.predict_proba(features_df)[0]
    f1_win_prob = float(proba[1])
    predicted_winner = f1.name if f1_win_prob >= 0.5 else f2.name
    predicted_round  = int(model_round.predict(features_df)[0])

    # Feature weights — tells the frontend WHY
    weights = dict(zip(FEATURES, model_outcome.coef_[0].tolist()))

    return jsonify({
        'fighter1':          f1.name,
        'fighter2':          f2.name,
        'predicted_winner':  predicted_winner,
        'fighter1_win_prob': round(f1_win_prob * 100, 1),
        'fighter2_win_prob': round((1 - f1_win_prob) * 100, 1),
        'predicted_round':   predicted_round,
        'feature_weights':   weights,
    })


WEIGHT_CLASS_MAP = {
    'flyweight':        '125',
    'bantamweight':     '135',
    'featherweight':    '145',
    'lightweight':      '155',
    'welterweight':     '170',
    'middleweight':     '185',
    'lightheavyweight': '205',
    'heavyweight':      '265',
}

@predict_bp.route('/api/fighters', methods=['GET'])
def get_fighters():
    weight_class = request.args.get('weight_class')
    query = db.session.query(Fighters)
    if weight_class:
        db_weight_class = WEIGHT_CLASS_MAP.get(weight_class, weight_class)
        query = query.filter(Fighters.weight_class == db_weight_class)
    fighters = query.order_by(Fighters.ranking).all()
    return jsonify([{
        'id':         f.id,
        'name':       f.name,
        'record':     f'{f.wins}-{f.losses}-0',
        'wins':       f.wins,
        'losses':     f.losses,
        'last5':      f.last5,
        'slpm':       f.slpm,
        'strAcc':     f.stracc,
        'sapm':       f.sapm,
        'strDef':     f.strdef,
        'tdAvg':      f.tdavg,
        'tdAcc':      f.tdacc,
        'tdDef':      f.tddef,
        'subAvg':     f.subavg,
        'kdAvg':      f.kdavg,
        'ranking':    f.ranking,
        'height':     f.height,
        'reach':      f.reach,
        'weight_class': f.weight_class,
    } for f in fighters])
