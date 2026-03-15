from flask import Flask
from flask_cors import CORS

from db_models import db

from db_models.fights import Fight
from db_models.fighters import Fighters 

from dotenv import load_dotenv
import os


from routes.predict import predict_bp

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()  # Auto-create tables



app.register_blueprint(predict_bp)

if __name__ == '__main__':
    app.run(debug=True, port=5001)