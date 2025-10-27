from flask import Flask

from db_models import db

from db_models.fights import Fight
from db_models.fighters import Fighters 

from dotenv import load_dotenv
import os


# from routes.fighter_selector import fighter_selector_bp


# Load .env from project root
load_dotenv('/Users/ranjanpati/Documents/fight_predictor/.env')  # Adjust path as needed

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()  # Auto-create tables



# app.register_blueprint(fighter_selector_bp)

if __name__ == '__main__':
    app.run(debug=True)