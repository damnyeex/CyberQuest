from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from seed import seed_data
from routes.api import api_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Инициализация базы данных
    db.init_app(app)

    # Настройка CORS (аналог вашего Express)
    CORS(app,
        origins=["http://localhost:3000"],
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=[
            "Content-Type",
            "Authorization",
            "X-Entity-ID",
            "X-Entity-Type",
        ],
        expose_headers=["Content-Type", "Authorization"],
        max_age=3600                       # кеширование preflight на 1 час
    )

    with app.app_context():
        db.create_all()
        seed_data()

    app.register_blueprint(api_bp, url_prefix='/api')
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)