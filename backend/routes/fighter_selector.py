from flask import Blueprint, request, jsonify
from db_models.fighters import Fighters
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

@fighter_selector_bp.route('/api/select_fighters/<weight_class>', methods=['POST'])
def get_fighters():
    try:
        fighters = db.session.query(Fighters).filter_by(weight_class=weight_class).all()
        fighters_data = [{
            'name' : fighter.name
        }]