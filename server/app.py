from flask import Flask
from config import Config
from models import db
from seed import seed_data
from routes.api import api_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)

    with app.app_context():
        db.create_all()  # создаём таблицы
        seed_data()      # наполняем начальными данными

    app.register_blueprint(api_bp, url_prefix='/api')
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)