import json
import random
import string
from datetime import datetime, timedelta

from flask import Blueprint, request, jsonify
from models import (db, User, Role, Category, DifficultyLevel, Challenge,
                    ChallengeTag, ChallengeSolve, UserProgress, UserCategoryProgress)
from auth import (google_auth, telegram_auth, generate_reset_token,
                  verify_reset_token, token_required, admin_required, create_token)

api_bp = Blueprint('api', __name__)

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

def get_user_progress_data(user_id):
    """Возвращает словарь с прогрессом пользователя (для внутреннего использования)."""
    user = User.query.get_or_404(user_id)
    if user.deleted_at or not user.is_active:
        return None
    progress = UserProgress.query.get(user_id)
    cat_progress = UserCategoryProgress.query.filter_by(user_id=user_id).all()
    return {
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
    }

# ---------- Публичные эндпоинты (без аутентификации) ----------
@api_bp.route('/categories', methods=['GET'])
def get_categories():
    cats = Category.query.filter_by(is_active=True).order_by(Category.display_order).all()
    return jsonify([{
        'id': c.id, 'name': c.name, 'display_name': c.display_name,
        'color_hex': c.color_hex, 'display_order': c.display_order
    } for c in cats])

@api_bp.route('/difficulties', methods=['GET'])
def get_difficulties():
    diffs = DifficultyLevel.query.order_by(DifficultyLevel.display_order).all()
    return jsonify([{
        'id': d.id, 'name': d.name, 'display_name': d.display_name,
        'xp_reward': d.xp_reward, 'display_order': d.display_order
    } for d in diffs])

@api_bp.route('/tags', methods=['GET'])
def get_tags():
    tags = ChallengeTag.query.all()
    return jsonify([{'id': t.id, 'name': t.name, 'color_hex': t.color_hex} for t in tags])

@api_bp.route('/challenges', methods=['GET'])
def get_challenges():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    category = request.args.get('category')
    difficulty = request.args.get('difficulty')
    tag = request.args.get('tag')
    status = request.args.get('status', 'published')

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

@api_bp.route('/challenges/<slug>', methods=['GET'])
def get_challenge(slug):
    challenge = Challenge.query.filter_by(slug=slug).first_or_404()
    if challenge.status != 'published':
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

@api_bp.route('/users/<int:user_id>/progress', methods=['GET'])
def get_user_progress(user_id):
    data = get_user_progress_data(user_id)
    if data is None:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(data)

# ---------- Аутентификация и профиль ----------
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

@api_bp.route('/auth/google', methods=['POST'])
def google_login():
    data = request.get_json()
    google_token = data.get('token')
    if not google_token:
        return jsonify({'error': 'Token required'}), 400
    profile = google_auth(google_token)
    if not profile:
        return jsonify({'error': 'Invalid Google token'}), 401
    user = User.query.filter_by(email=profile['email']).first()
    if not user:
        user = User(
            email=profile['email'],
            nickname=profile.get('name', profile['email'].split('@')[0]),
            first_name=profile.get('name', ''),
            is_active=True,
            is_verified=True
        )
        user.set_password(''.join(random.choices(string.ascii_letters, k=16)))
        student_role = Role.query.filter_by(name='student').first()
        if student_role:
            user.roles.append(student_role)
        user.google_id = profile.get('google_id')
        db.session.add(user)
        db.session.commit()
    else:
        user.google_id = profile.get('google_id')
        db.session.commit()
    token = create_token(user.id, [r.name for r in user.roles])
    return jsonify({'token': token, 'user': user_to_dict(user)}), 200

@api_bp.route('/auth/telegram', methods=['POST'])
def telegram_login():
    data = request.get_json()
    tg_data = data.get('telegram_data')
    if not tg_data:
        return jsonify({'error': 'Telegram data required'}), 400
    profile = telegram_auth(tg_data)
    if not profile:
        return jsonify({'error': 'Invalid Telegram data'}), 401
    user = User.query.filter(User.bio.contains(str(profile['id']))).first()
    if not user:
        user = User(
            email=f"tg_{profile['id']}@telegram.local",
            nickname=profile.get('username', f"tg_{profile['id']}"),
            is_active=True,
            is_verified=True
        )
        user.set_password(''.join(random.choices(string.ascii_letters, k=16)))
        student_role = Role.query.filter_by(name='student').first()
        if student_role:
            user.roles.append(student_role)
        user.telegram_id = profile['id']
        db.session.add(user)
        db.session.commit()
    else:
        user.telegram_id = profile['id']
        db.session.commit()
    token = create_token(user.id, [r.name for r in user.roles])
    return jsonify({'token': token, 'user': user_to_dict(user)}), 200

@api_bp.route('/auth/forgot-password', methods=['POST'])
def forgot_password():
    email = request.get_json().get('email')
    user = User.query.filter_by(email=email).first()
    if user:
        token = generate_reset_token(user.id)
        # send_reset_email(user.email, token)  # заглушка
        return jsonify({'message': 'If email exists, reset link sent'}), 200
    return jsonify({'message': 'If email exists, reset link sent'}), 200

@api_bp.route('/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')
    user = verify_reset_token(token)
    if not user:
        return jsonify({'error': 'Invalid or expired token'}), 400
    user.set_password(new_password)
    user.update_meta('reset_token', None)
    user.update_meta('reset_token_exp', None)
    db.session.commit()
    return jsonify({'message': 'Password updated'}), 200

@api_bp.route('/me', methods=['GET'])
@token_required
def get_me(current_user):
    return jsonify(user_to_dict(current_user))

@api_bp.route('/me', methods=['PUT'])
@token_required
def update_profile(current_user):
    data = request.get_json()
    allowed = ['first_name', 'last_name', 'nickname', 'avatar_url', 'bio_text']
    for field in allowed:
        if field in data:
            if field == 'bio_text':
                current_user.bio = data['bio_text']
            else:
                setattr(current_user, field, data[field])
    db.session.commit()
    return jsonify(user_to_dict(current_user))

@api_bp.route('/me/change-password', methods=['PUT'])
@token_required
def change_password(current_user):
    data = request.get_json()
    if not current_user.check_password(data.get('old_password')):
        return jsonify({'error': 'Invalid old password'}), 400
    current_user.set_password(data['new_password'])
    db.session.commit()
    return jsonify({'message': 'Password changed'})

# ---------- Решение задач ----------
@api_bp.route('/challenges/<slug>/solve', methods=['POST'])
@token_required
def submit_flag(current_user, slug):
    challenge = Challenge.query.filter_by(slug=slug, status='published').first_or_404()
    data = request.get_json()
    if not data or 'flag' not in data:
        return jsonify({'error': 'Flag is required'}), 400

    challenge.attempt_count += 1
    existing_solve = ChallengeSolve.query.filter_by(user_id=current_user.id, challenge_id=challenge.id).first()
    if existing_solve:
        return jsonify({'error': 'Already solved'}), 409

    if not challenge.check_flag(data['flag']):
        db.session.commit()
        return jsonify({'correct': False, 'message': 'Incorrect flag'}), 200

    xp_earned = challenge.base_xp
    solve = ChallengeSolve(user_id=current_user.id, challenge_id=challenge.id, xp_earned=xp_earned)
    db.session.add(solve)
    challenge.solve_count += 1

    progress = UserProgress.query.get(current_user.id)
    if not progress:
        progress = UserProgress(user_id=current_user.id)
        db.session.add(progress)
    progress.total_xp = (progress.total_xp or 0) + xp_earned
    progress.total_solves = (progress.total_solves or 0) + 1

    cat_progress = UserCategoryProgress.query.filter_by(user_id=current_user.id, category_id=challenge.category_id).first()
    if not cat_progress:
        total_in_cat = Challenge.query.filter_by(category_id=challenge.category_id, status='published').count()
        cat_progress = UserCategoryProgress(user_id=current_user.id, category_id=challenge.category_id, total_in_category=total_in_cat)
        db.session.add(cat_progress)
    cat_progress.solved_count = (cat_progress.solved_count or 0) + 1
    cat_progress.category_xp = (cat_progress.category_xp or 0) + xp_earned
    if cat_progress.total_in_category > 0:
        cat_progress.progress_percent = round((cat_progress.solved_count / cat_progress.total_in_category) * 100, 2)

    db.session.commit()
    return jsonify({'correct': True, 'xp_earned': xp_earned, 'message': 'Congratulations!'}), 200

# ---------- Подписка ----------
@api_bp.route('/me/subscription', methods=['GET'])
@token_required
def get_subscription(current_user):
    return jsonify(current_user.subscription)

@api_bp.route('/me/subscription/buy', methods=['POST'])
@token_required
def buy_subscription(current_user):
    plan = request.get_json().get('plan', 'monthly')
    expiry = (datetime.utcnow() + timedelta(days=30)).isoformat()
    current_user.subscription = {'plan': plan, 'expires_at': expiry, 'active': True}
    db.session.commit()
    return jsonify({'message': 'Subscription activated', 'subscription': current_user.subscription})

# ---------- Команды ----------
TEAM_CATEGORY = 'team'

def get_team_category():
    cat = Category.query.filter_by(name=TEAM_CATEGORY).first()
    if not cat:
        cat = Category(name=TEAM_CATEGORY, display_name='Teams', is_active=True)
        db.session.add(cat)
        db.session.commit()
    return cat

@api_bp.route('/teams', methods=['POST'])
@token_required
def create_team(current_user):
    data = request.get_json()
    team_name = data.get('name')
    if not team_name:
        return jsonify({'error': 'Team name required'}), 400
    team_cat = get_team_category()
    team_challenge = Challenge(
        title=team_name,
        slug=f"team-{team_name.lower().replace(' ', '-')}-{random.randint(1000,9999)}",
        description=f"Team {team_name}",
        category_id=team_cat.id,
        difficulty_id=1,
        flag_hash='',
        base_xp=0,
        status='published',
        hints={'members': [current_user.id], 'captain': current_user.id},
        author_id=current_user.id
    )
    team_challenge.set_flag('none')
    db.session.add(team_challenge)
    current_user.update_meta('team_id', team_challenge.id)
    db.session.commit()
    return jsonify({'team_id': team_challenge.id, 'name': team_name}), 201

@api_bp.route('/teams/join/<int:team_id>', methods=['POST'])
@token_required
def join_team(current_user, team_id):
    team = Challenge.query.get(team_id)
    if not team or team.category.name != TEAM_CATEGORY:
        return jsonify({'error': 'Team not found'}), 404
    hints = team.hints or {}
    members = hints.get('members', [])
    if current_user.id in members:
        return jsonify({'error': 'Already a member'}), 400
    members.append(current_user.id)
    hints['members'] = members
    team.hints = hints
    current_user.update_meta('team_id', team.id)
    db.session.commit()
    return jsonify({'message': 'Joined team', 'members': members})

# ---------- Дуэли ----------
DUEL_CATEGORY = 'duel'

def get_duel_category():
    cat = Category.query.filter_by(name=DUEL_CATEGORY).first()
    if not cat:
        cat = Category(name=DUEL_CATEGORY, display_name='Duels', is_active=True)
        db.session.add(cat)
        db.session.commit()
    return cat

@api_bp.route('/duels', methods=['POST'])
@token_required
def create_duel(current_user):
    data = request.get_json()
    opponent_id = data.get('opponent_id')
    task_slug = data.get('task_slug')
    opponent = User.query.get(opponent_id)
    challenge = Challenge.query.filter_by(slug=task_slug, status='published').first()
    if not opponent or not challenge:
        return jsonify({'error': 'Invalid opponent or task'}), 400
    duel_cat = get_duel_category()
    duel_challenge = Challenge(
        title=f"Duel {current_user.nickname} vs {opponent.nickname}",
        slug=f"duel-{current_user.id}-{opponent.id}-{challenge.id}",
        description='Duel',
        category_id=duel_cat.id,
        difficulty_id=1,
        flag_hash='',
        base_xp=0,
        status='published',
        hints={'player1': current_user.id, 'player2': opponent.id, 'task_slug': task_slug, 'winner': None},
        author_id=current_user.id
    )
    duel_challenge.set_flag('none')
    db.session.add(duel_challenge)
    db.session.commit()
    return jsonify({'duel_id': duel_challenge.id}), 201

# ---------- Форум ----------
FORUM_CATEGORY = 'forum'

def get_forum_category():
    cat = Category.query.filter_by(name=FORUM_CATEGORY).first()
    if not cat:
        cat = Category(name=FORUM_CATEGORY, display_name='Forum', is_active=True)
        db.session.add(cat)
        db.session.commit()
    return cat

@api_bp.route('/forum/topics', methods=['POST'])
@token_required
def create_topic(current_user):
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    if not title or not content:
        return jsonify({'error': 'Title and content required'}), 400
    forum_cat = get_forum_category()
    topic = Challenge(
        title=title,
        slug=f"topic-{random.randint(10000,99999)}",
        description=content,
        category_id=forum_cat.id,
        difficulty_id=1,
        flag_hash='',
        base_xp=0,
        status='published',
        hints={'posts': [{'author_id': current_user.id, 'content': content, 'created_at': datetime.utcnow().isoformat()}]},
        author_id=current_user.id
    )
    topic.set_flag('none')
    db.session.add(topic)
    db.session.commit()
    return jsonify({'topic_id': topic.id, 'slug': topic.slug}), 201

@api_bp.route('/forum/topics/<slug>/posts', methods=['POST'])
@token_required
def add_post(current_user, slug):
    topic = Challenge.query.filter_by(slug=slug).first_or_404()
    if topic.category.name != FORUM_CATEGORY:
        return jsonify({'error': 'Not a forum topic'}), 400
    content = request.get_json().get('content')
    hints = topic.hints or {}
    posts = hints.get('posts', [])
    posts.append({'author_id': current_user.id, 'content': content, 'created_at': datetime.utcnow().isoformat()})
    hints['posts'] = posts
    topic.hints = hints
    db.session.commit()
    return jsonify({'posts': posts})

# ---------- Учительские функции ----------
@api_bp.route('/teacher/groups', methods=['POST'])
@token_required
def create_group(current_user):
    if 'teacher' not in [r.name for r in current_user.roles]:
        return jsonify({'error': 'Teacher access required'}), 403
    data = request.get_json()
    group_name = data.get('name')
    group_cat = Category(
        name=f"group_{current_user.id}_{random.randint(100,999)}",
        display_name=group_name,
        is_active=True
    )
    db.session.add(group_cat)
    db.session.commit()
    return jsonify({'group_id': group_cat.id, 'name': group_cat.display_name}), 201

@api_bp.route('/teacher/groups/<int:group_id>/add_student', methods=['POST'])
@token_required
def add_student_to_group(current_user, group_id):
    if 'teacher' not in [r.name for r in current_user.roles]:
        return jsonify({'error': 'Teacher access required'}), 403
    group = Category.query.get(group_id)
    if not group or not group.name.startswith(f"group_{current_user.id}_"):
        return jsonify({'error': 'Group not found or not owned'}), 403
    student_id = request.get_json().get('student_id')
    student = User.query.get(student_id)
    if not student:
        return jsonify({'error': 'Student not found'}), 404
    groups = student.get_meta_key('teacher_groups', [])
    if group_id not in groups:
        groups.append(group_id)
    student.update_meta('teacher_groups', groups)
    db.session.commit()
    return jsonify({'message': 'Student added to group'})

@api_bp.route('/teacher/groups/<int:group_id>/assign-task', methods=['POST'])
@token_required
def assign_task_to_group(current_user, group_id):
    if 'teacher' not in [r.name for r in current_user.roles]:
        return jsonify({'error': 'Teacher access required'}), 403
    group = Category.query.get(group_id)
    if not group or not group.name.startswith(f"group_{current_user.id}_"):
        return jsonify({'error': 'Group not found or not owned'}), 403
    data = request.get_json()
    task_slug = data.get('task_slug')
    deadline = data.get('deadline')
    group.description = json.dumps({'task_slug': task_slug, 'deadline': deadline})
    db.session.commit()
    return jsonify({'message': 'Task assigned'})

@api_bp.route('/teacher/students/<int:student_id>/progress', methods=['GET'])
@token_required
def teacher_view_student_progress(current_user, student_id):
    if 'teacher' not in [r.name for r in current_user.roles] and 'admin' not in [r.name for r in current_user.roles]:
        return jsonify({'error': 'Access denied'}), 403
    student = User.query.get_or_404(student_id)
    teacher_groups = student.get_meta_key('teacher_groups', [])
    if not any(Category.query.get(g) and Category.query.get(g).name.startswith(f"group_{current_user.id}_") for g in teacher_groups):
        return jsonify({'error': 'Not in your group'}), 403
    data = get_user_progress_data(student_id)
    return jsonify(data)

# ---------- Административные функции ----------
@api_bp.route('/admin/users', methods=['GET'])
@admin_required
def admin_list_users(current_user):
    page = request.args.get('page', 1, type=int)
    per_page = 20
    users = User.query.filter(User.deleted_at == None).paginate(page=page, per_page=per_page)
    return jsonify({
        'users': [user_to_dict(u) for u in users.items],
        'total': users.total,
        'pages': users.pages
    })

@api_bp.route('/admin/users/<int:user_id>', methods=['PUT'])
@admin_required
def admin_update_user(current_user, user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    if 'roles' in data:
        user.roles = []
        for r_name in data['roles']:
            role = Role.query.filter_by(name=r_name).first()
            if role:
                user.roles.append(role)
    if 'is_active' in data:
        user.is_active = data['is_active']
    if 'is_verified' in data:
        user.is_verified = data['is_verified']
    if 'delete' in data and data['delete']:
        user.deleted_at = datetime.utcnow()
    db.session.commit()
    return jsonify(user_to_dict(user))

@api_bp.route('/admin/users/<int:user_id>/xp', methods=['PUT'])
@admin_required
def admin_adjust_xp(current_user, user_id):
    delta = request.get_json().get('delta', 0)
    user = User.query.get_or_404(user_id)
    user.total_xp += delta
    progress = UserProgress.query.get(user_id)
    if progress:
        progress.total_xp = user.total_xp
    db.session.commit()
    return jsonify({'new_xp': user.total_xp})

@api_bp.route('/admin/challenges/<int:challenge_id>', methods=['DELETE'])
@admin_required
def admin_delete_challenge(current_user, challenge_id):
    challenge = Challenge.query.get_or_404(challenge_id)
    db.session.delete(challenge)
    db.session.commit()
    return jsonify({'message': 'Deleted'})

@api_bp.route('/admin/logs', methods=['GET'])
@admin_required
def admin_logs(current_user):
    return jsonify({'logs': ['Action 1', 'Action 2']})

@api_bp.route('/admin/backup', methods=['POST'])
@admin_required
def admin_backup(current_user):
    return jsonify({'message': 'Backup started'})

@api_bp.route('/admin/security/policies', methods=['PUT'])
@admin_required
def update_security_policies(current_user):
    return jsonify({'message': 'Policies updated'})