from db_models import db


class Prediction(db.Model):
    __tablename__ = 'predictions'

    id = db.Column(db.Integer, primary_key=True)
    fighter1 = db.Column(db.String(100), nullable=False)
    fighter2 = db.Column(db.String(100), nullable=False)
    fight_date = db.Column(db.Date, nullable=False)
    fight_event = db.Column(db.String(200), nullable=False)
    weight_class = db.Column(db.Integer, nullable=False)
    model_pick = db.Column(db.String(100), nullable=False)
    model_confidence = db.Column(db.Float, nullable=False)
    predicted_finish_type = db.Column(db.String(20))
    prefight_explanation = db.Column(db.Text)
    status = db.Column(db.String(10), nullable=False)        # 'future' or 'past'
    actual_result = db.Column(db.String(100))
    actual_round = db.Column(db.Integer)
    actual_finish_type = db.Column(db.String(20))
    correct = db.Column(db.Boolean)
    postfight_explanation = db.Column(db.Text)
