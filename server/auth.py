import jwt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app
import random, string, datetime
from models import User, Role, ChallengeSolve   # используем ChallengeSolve для токенов сброса

def create_token(user_id, roles):
    payload = {
        'user_id': user_id,
        'roles': roles,
        'exp': datetime.utcnow() + timedelta(hours=24),
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user or current_user.deleted_at or not current_user.is_active:
                return jsonify({'error': 'User not found or inactive'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

def admin_required(f):
    @wraps(f)
    @token_required
    def decorated(current_user, *args, **kwargs):
        role_names = [role.name for role in current_user.roles]
        if 'admin' not in role_names:
            return jsonify({'error': 'Admin access required'}), 403
        return f(current_user, *args, **kwargs)
    return decorated


def generate_reset_token(user_id):
    """Создаёт и сохраняет токен сброса пароля в специальной записи ChallengeSolve."""
    token = ''.join(random.choices(string.ascii_letters + string.digits, k=32))
    # Используем фиктивную задачу с id=-1 (не должна существовать) как контейнер для токенов
    # Это костыль, но не добавляет таблиц
    # Реально надо было бы проверять FK, здесь опустим
    solve = ChallengeSolve(
        user_id=user_id,
        challenge_id=-1,            # специальный id для токенов
        xp_earned=0,
        solved_at=datetime.utcnow(),
        # токен сохраним в поле xp_earned? Нет, так нельзя. Используем user.bio для хранения токена.
    )
    # Вместо ChallengeSolve сохраним токен в био пользователя
    user = User.query.get(user_id)
    user.update_meta('reset_token', token)
    user.update_meta('reset_token_exp', (datetime.utcnow() + datetime.timedelta(hours=1)).isoformat())
    db.session.commit()
    return token

def verify_reset_token(token):
    """Проверяет токен и возвращает пользователя, если валиден."""
    # Ищем пользователя, у которого в meta.reset_token == token
    for user in User.query.filter(User.bio.contains(token)).all():
        meta = user.get_meta()
        if meta.get('reset_token') == token:
            exp = datetime.fromisoformat(meta.get('reset_token_exp'))
            if datetime.utcnow() < exp:
                return user
    return None

def google_auth(google_token):
    """Имитация проверки Google токена. В реальном проекте использовать google-auth."""
    # Заглушка: возвращает email
    # В production: idinfo = id_token.verify_oauth2_token(google_token, requests.Request(), CLIENT_ID)
    if google_token == 'valid_google_token':
        return {'email': 'google_user@example.com', 'name': 'Google User', 'google_id': '12345'}
    return None

def telegram_auth(telegram_data):
    """Имитация проверки данных Telegram Login Widget."""
    # Заглушка: возвращает данные
    if telegram_data.get('hash'):
        return {'id': telegram_data.get('id'), 'username': telegram_data.get('username')}
    return None