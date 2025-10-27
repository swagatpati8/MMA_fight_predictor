from db_models import db


class Fight(db.Model):
    __tablename__ = 'fights'  # Explicit table name for Supabase

    id = db.Column(db.Integer, primary_key=True)
    fighter1 = db.Column(db.String(100), nullable=False)  # Name of fighter 1
    fighter2 = db.Column(db.String(100), nullable=False)  # Name of fighter 2
    fight_year = db.Column(db.Integer, nullable=False)   # Year of the fight
    fighter1_wins = db.Column(db.Integer)                # Total wins for fighter 1
    fighter2_wins = db.Column(db.Integer)                # Total wins for fighter 2
    fighter1_losses = db.Column(db.Integer)              # Total losses for fighter 1
    fighter2_losses = db.Column(db.Integer)              # Total losses for fighter 2
    fighter1_last5 = db.Column(db.Float)               # Wins in last 5 fights for fighter 1
    fighter2_last5 = db.Column(db.Float)               # Wins in last 5 fights for fighter 2
    fighter1_SLpM = db.Column(db.Float)                  # Strikes Landed per Minute for fighter 1
    fighter2_SLpM = db.Column(db.Float)                  # Strikes Landed per Minute for fighter 2
    fighter1_StrAcc = db.Column(db.Float)                # Strike Accuracy (%) for fighter 1
    fighter2_StrAcc = db.Column(db.Float)                # Strike Accuracy (%) for fighter 2
    fighter1_SApM = db.Column(db.Float)                  # Strikes Absorbed per Minute for fighter 1
    fighter2_SApM = db.Column(db.Float)                  # Strikes Absorbed per Minute for fighter 2
    fighter1_StrDef = db.Column(db.Float)                # Strike Defense (%) for fighter 1
    fighter2_StrDef = db.Column(db.Float)                # Strike Defense (%) for fighter 2
    fighter1_TDAvg = db.Column(db.Float)                 # Takedown Average for fighter 1
    fighter2_TDAvg = db.Column(db.Float)                 # Takedown Average for fighter 2
    fighter1_TDAcc = db.Column(db.Float)                 # Takedown Accuracy (%) for fighter 1
    fighter2_TDAcc = db.Column(db.Float)                 # Takedown Accuracy (%) for fighter 2
    fighter1_TDDef = db.Column(db.Float)                 # Takedown Defense (%) for fighter 1
    fighter2_TDDef = db.Column(db.Float)                 # Takedown Defense (%) for fighter 2
    fighter1_SubAvg = db.Column(db.Float)                # Submission Average for fighter 1
    fighter2_SubAvg = db.Column(db.Float)                # Submission Average for fighter 2
    fighter1_KDAvg = db.Column(db.Float)                 # Knockdown Average for fighter 1
    fighter2_KDAvg = db.Column(db.Float)                 # Knockdown Average for fighter 2
    fighter1_ranking = db.Column(db.Integer)             # Current ranking of fighter 1
    fighter2_ranking = db.Column(db.Integer)             # Current ranking of fighter 2
    fighter1_birth_year = db.Column(db.Integer)          # Birth year of fighter 1
    fighter2_birth_year = db.Column(db.Integer)          # Birth year of fighter 2
    fighter1_height = db.Column(db.Float)                # Height (m) of fighter 1
    fighter2_height = db.Column(db.Float)                # Height (m) of fighter 2
    fighter1_reach = db.Column(db.Float)                 # Reach (cm) of fighter 1
    fighter2_reach = db.Column(db.Float)                 # Reach (cm) of fighter 2
    weight_class = db.Column(db.String(50))              # Weight class (e.g., "185")
    round_finished = db.Column(db.Integer)               # Round fight ended
    fight_rounds = db.Column(db.Integer)                 # Total rounds fought
    outcome = db.Column(db.Integer)                      # Outcome (0 = undecided, 1 = fighter1 win, 2 = fighter2 win)
