from flask import Blueprint, request, jsonify
from models import (db, User, Role, Category, DifficultyLevel, Challenge,
                    ChallengeTag, ChallengeSolve, UserProgress, UserCategoryProgress)
from auth import token_required, admin_required, create_token
from sqlalchemy import func

api_bp = Blueprint('api', __name__)

# ---------- Аутентификация ----------
@api_bp.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Email and password required'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409
    user = User(
        email=data['email'],
        nickname=data.get('nickname', data['email'].split('@')[0]),
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        is_active=True, is_verified=False
    )
    user.set_password(data['password'])
    student_role = Role.query.filter_by(name='student').first()
    if student_role:
        user.roles.append(student_role)
    db.session.add(user)
    db.session.commit()
    token = create_token(user.id, [r.name for r in user.roles])
    return jsonify({'token': token, 'user': user_to_dict(user)}), 201

@api_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email', '')).first()
    if not user or not user.check_password(data.get('password', '')):
        return jsonify({'error': 'Invalid credentials'}), 401
    if user.deleted_at or not user.is_active:
        return jsonify({'error': 'Account disabled'}), 403
    token = create_token(user.id, [r.name for r in user.roles])
    return jsonify({'token': token, 'user': user_to_dict(user)}), 200

# ---------- Вспомогательные функции сериализации ----------
def user_to_dict(user):
    return {
        'id': user.id,
        'email': user.email,
        'nickname': user.nickname,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'avatar_url': user.avatar_url,
        'bio': user.bio,
        'total_xp': user.total_xp,
        'is_active': user.is_active,
        'is_verified': user.is_verified,
        'roles': [r.name for r in user.roles]
    }

def challenge_to_dict(challenge, include_flag=False):
    result = {
        'id': challenge.id,
        'title': challenge.title,
        'slug': challenge.slug,
        'description': challenge.description,
        'category': challenge.category.name,
        'category_display': challenge.category.display_name,
        'difficulty': challenge.difficulty.name,
        'difficulty_display': challenge.difficulty.display_name,
        'base_xp': challenge.base_xp,
        'hints': challenge.hints,
        'attachments': challenge.attachments,
        'tags': [{'name': t.name, 'color': t.color_hex} for t in challenge.tags],
        'solve_count': challenge.solve_count,
        'attempt_count': challenge.attempt_count,
        'author': challenge.author.nickname if challenge.author else 'Unknown',
        'status': challenge.status
    }
    if include_flag:
        result['flag_format'] = challenge.flag_format
    return result

# ---------- Публичные эндпоинты (без аутентификации) ----------

# Категории
@api_bp.route('/categories', methods=['GET'])
def get_categories():
    cats = Category.query.filter_by(is_active=True).order_by(Category.display_order).all()
    return jsonify([{
        'id': c.id, 'name': c.name, 'display_name': c.display_name,
        'color_hex': c.color_hex, 'display_order': c.display_order
    } for c in cats])

# Уровни сложности
@api_bp.route('/difficulties', methods=['GET'])
def get_difficulties():
    diffs = DifficultyLevel.query.order_by(DifficultyLevel.display_order).all()
    return jsonify([{
        'id': d.id, 'name': d.name, 'display_name': d.display_name,
        'xp_reward': d.xp_reward, 'display_order': d.display_order
    } for d in diffs])

# Теги
@api_bp.route('/tags', methods=['GET'])
def get_tags():
    tags = ChallengeTag.query.all()
    return jsonify([{'id': t.id, 'name': t.name, 'color_hex': t.color_hex} for t in tags])

# Список задач (пагинация, фильтры)
@api_bp.route('/challenges', methods=['GET'])
def get_challenges():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    category = request.args.get('category')
    difficulty = request.args.get('difficulty')
    tag = request.args.get('tag')
    status = request.args.get('status', 'published')  # по умолчанию только опубликованные

    query = Challenge.query
    if status:
        query = query.filter(Challenge.status == status)
    if category:
        query = query.join(Category).filter(Category.name == category)
    if difficulty:
        query = query.join(DifficultyLevel).filter(DifficultyLevel.name == difficulty)
    if tag:
        query = query.filter(Challenge.tags.any(ChallengeTag.name == tag))

    query = query.order_by(Challenge.id.desc())
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    challenges = pagination.items
    return jsonify({
        'challenges': [challenge_to_dict(c) for c in challenges],
        'total': pagination.total,
        'pages': pagination.pages,
        'current_page': page
    })

# Детальная информация о задаче
@api_bp.route('/challenges/<slug>', methods=['GET'])
def get_challenge(slug):
    challenge = Challenge.query.filter_by(slug=slug).first_or_404()
    if challenge.status != 'published':
        # Проверим авторизацию и права
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        try:
            data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            user = User.query.get(data['user_id'])
            is_admin = any(r.name == 'admin' for r in user.roles) if user else False
            if not is_admin:
                return jsonify({'error': 'Not found'}), 404
        except:
            return jsonify({'error': 'Not found'}), 404
    return jsonify(challenge_to_dict(challenge, include_flag=False))

# Прогресс пользователя (публичный просмотр статистики)
@api_bp.route('/users/<int:user_id>/progress', methods=['GET'])
def get_user_progress(user_id):
    user = User.query.get_or_404(user_id)
    if user.deleted_at or not user.is_active:
        return jsonify({'error': 'User not found'}), 404
    progress = UserProgress.query.get(user_id)
    cat_progress = UserCategoryProgress.query.filter_by(user_id=user_id).all()
    return jsonify({
        'user_id': user.id,
        'nickname': user.nickname,
        'total_xp': progress.total_xp if progress else 0,
        'total_solves': progress.total_solves if progress else 0,
        'total_attempts': progress.total_attempts if progress else 0,
        'current_level': progress.current_level if progress else 'beginner',
        'category_progress': [{
            'category_id': cp.category_id,
            'category_name': cp.category.name,
            'solved_count': cp.solved_count,
            'total_in_category': cp.total_in_category,
            'category_xp': cp.category_xp,
            'progress_percent': cp.progress_percent
        } for cp in cat_progress]
    })

# ---------- Эндпоинты для авторизованных пользователей ----------

# Профиль текущего пользователя
@api_bp.route('/me', methods=['GET'])
@token_required
def get_me(current_user):
    return jsonify(user_to_dict(current_user))

# Попытка решить задачу (отправка флага)
@api_bp.route('/challenges/<slug>/solve', methods=['POST'])
@token_required
def submit_flag(current_user, slug):
    challenge = Challenge.query.filter_by(slug=slug, status='published').first_or_404()
    data = request.get_json()
    if not data or 'flag' not in data:
        return jsonify({'error': 'Flag is required'}), 400

    # Увеличиваем счётчик попыток
    challenge.attempt_count += 1

    # Проверяем, не решал ли уже
    existing_solve = ChallengeSolve.query.filter_by(user_id=current_user.id, challenge_id=challenge.id).first()
    if existing_solve:
        return jsonify({'error': 'Already solved'}), 409

    if not challenge.check_flag(data['flag']):
        db.session.commit()
        return jsonify({'correct': False, 'message': 'Incorrect flag'}), 200

    # Верный флаг
    xp_earned = challenge.base_xp  # можно модифицировать динамическим уменьшением
    solve = ChallengeSolve(user_id=current_user.id, challenge_id=challenge.id, xp_earned=xp_earned)
    db.session.add(solve)
    challenge.solve_count += 1

    # Обновляем прогресс пользователя
    progress = UserProgress.query.get(current_user.id)
    if not progress:
        progress = UserProgress(user_id=current_user.id)
        db.session.add(progress)
    progress.total_xp = (progress.total_xp or 0) + xp_earned
    progress.total_solves = (progress.total_solves or 0) + 1

    # Обновляем прогресс по категории
    cat_progress = UserCategoryProgress.query.filter_by(user_id=current_user.id, category_id=challenge.category_id).first()
    if not cat_progress:
        total_in_cat = Challenge.query.filter_by(category_id=challenge.category_id, status='published').count()
        cat_progress = UserCategoryProgress(
            user_id=current_user.id,
            category_id=challenge.category_id,
            total_in_category=total_in_cat
        )
        db.session.add(cat_progress)
    cat_progress.solved_count = (cat_progress.solved_count or 0) + 1
    cat_progress.category_xp = (cat_progress.category_xp or 0) + xp_earned
    if cat_progress.total_in_category > 0:
        cat_progress.progress_percent = round((cat_progress.solved_count / cat_progress.total_in_category) * 100, 2)

    db.session.commit()
    return jsonify({'correct': True, 'xp_earned': xp_earned, 'message': 'Congratulations!'}), 200

# ---------- Админские эндпоинты (пример) ----------
@api_bp.route('/admin/challenges', methods=['POST'])
@admin_required
def create_challenge(current_user):
    data = request.get_json()
    # Простая валидация
    required = ['title', 'slug', 'description', 'category_id', 'difficulty_id', 'flag']
    for field in required:
        if field not in data:
            return jsonify({'error': f'{field} is required'}), 400
    challenge = Challenge(
        title=data['title'],
        slug=data['slug'],
        description=data['description'],
        category_id=data['category_id'],
        difficulty_id=data['difficulty_id'],
        base_xp=data.get('base_xp', 100),
        author_id=current_user.id,
        status=data.get('status', 'draft'),
        hints=data.get('hints', []),
        attachments=data.get('attachments', [])
    )
    challenge.set_flag(data['flag'])
    if 'tags' in data:
        for tag_name in data['tags']:
            tag = ChallengeTag.query.filter_by(name=tag_name).first()
            if tag:
                challenge.tags.append(tag)
    db.session.add(challenge)
    db.session.commit()
    return jsonify(challenge_to_dict(challenge, include_flag=True)), 201