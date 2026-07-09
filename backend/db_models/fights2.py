from db_models import db


class Fight2(db.Model):
    __tablename__ = 'fights2'  # GOAT list data: fight outcomes weighted by opponent quality

    id = db.Column(db.Integer, primary_key=True)
    fighter1 = db.Column(db.String(100), nullable=False)
    fighter2 = db.Column(db.String(100), nullable=False)
    fighter1_ranking = db.Column(db.Integer)          # Fighter 1's ranking at time of fight
    fighter2_ranking = db.Column(db.Integer)          # Fighter 2's ranking at time of fight
    fighter1_last5 = db.Column(db.Float)              # Fighter 1's last5 score at time of fight
    fighter2_last5 = db.Column(db.Float)              # Fighter 2's last5 score at time of fight
    outcome = db.Column(db.Integer)                   # 1 = fighter1 won, 0 = fighter1 lost
