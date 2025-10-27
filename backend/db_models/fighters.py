from db_models import db


class Fighters(db.Model):
    __tablename__ = 'fighters'  

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)  # Name of fighter 2
    wins = db.Column(db.Integer)                # Total wins for fighter 1
    losses = db.Column(db.Integer)              # Total losses for fighter 1
    last5 = db.Column(db.Float)               # Wins in last 5 fights for fighter 2
    slpm = db.Column(db.Float)                  # Strikes Landed per Minute for fighter 2
    stracc = db.Column(db.Float)                # Strike Accuracy (%) for fighter 2
    sapm = db.Column(db.Float)                  # Strikes Absorbed per Minute for fighter 2
    strdef = db.Column(db.Float)                         # Strike Defense (%) for fighter 2
    tdavg = db.Column(db.Float)                 # Takedown Average for fighter 1
    tdacc = db.Column(db.Float)                 # Takedown Accuracy (%) for fighter 2
    tddef = db.Column(db.Float)                 # Takedown Defense (%) for fighter 1
    subavg = db.Column(db.Float)                # Submission Average for fighter 1
    kdavg = db.Column(db.Float)                 # Knockdown Average for fighter 1
    ranking = db.Column(db.Integer)             # Current ranking of fighter 1
    birth_year = db.Column(db.Integer)          # Birth year of fighter 1
    height = db.Column(db.Float)                # Height (m) of fighter 1
    reach = db.Column(db.Integer)                 # Reach (cm) of fighter 1
    weight_class = db.Column(db.String(50))              # Weight class (e.g., "185")
