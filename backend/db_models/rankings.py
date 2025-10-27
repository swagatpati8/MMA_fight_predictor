from db_models import db

class Rankings(db.Model):
    __tablename__ = 'rankings'

    ranking = db.Column(db.Integer, primary_key=True)
    flyweight = db.Column(db.String(100))          # Top fighter in Flyweight
    bantamweight = db.Column(db.String(100))       # Top fighter in Bantamweight
    featherweight = db.Column(db.String(100))      # Top fighter in Featherweight
    lightweight = db.Column(db.String(100))        # Top fighter in Lightweight
    welterweight = db.Column(db.String(100))       # Top fighter in Welterweight
    middleweight = db.Column(db.String(100))       # Top fighter in Middleweight
    light_heavyweight = db.Column(db.String(100))  # Top fighter in Light Heavyweight
    heavyweight = db.Column(db.String(100))          