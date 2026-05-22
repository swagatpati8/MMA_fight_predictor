from flask import Blueprint, request, jsonify
from db_models.fighters import Fighters
from db_models import db

fighter_selector_bp = Blueprint('fighter_selector', __name__)

@fighter_selector_bp.route('/api/fighters', methods=['GET'])
def get_fighters():
    try:
        weight_class = request.args.get('weight_class')
        query = db.session.query(Fighters)
        if weight_class:
            query = query.filter(Fighters.weight_class == weight_class)
        fighters = query.order_by(Fighters.ranking).all()
        return jsonify([{
            'id': f.id,
            'name': f.name,
            'wins': f.wins,
            'losses': f.losses,
            'last5': f.last5,
            'slpm': f.slpm,
            'stracc': f.stracc,
            'sapm': f.sapm,
            'strdef': f.strdef,
            'tdavg': f.tdavg,
            'tdacc': f.tdacc,
            'tddef': f.tddef,
            'subavg': f.subavg,
            'kdavg': f.kdavg,
            'ranking': f.ranking,
            'birth_year': f.birth_year,
            'height': f.height,
            'reach': f.reach,
            'weight_class': f.weight_class,
        } for f in fighters])
    except Exception as e:
        return jsonify({'error': str(e)}), 500
