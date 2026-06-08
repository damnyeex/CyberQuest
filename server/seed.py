from models import db, Role, User, Category, DifficultyLevel, Challenge, ChallengeTag
from datetime import datetime

def seed_data():
    # Создаём роли, если их нет
    roles = ['student', 'teacher', 'admin']
    for role_name in roles:
        if not Role.query.filter_by(name=role_name).first():
            db.session.add(Role(name=role_name, description=f'{role_name} role'))
    db.session.commit()

    # Категории
    categories = [
        {'name': 'web_security', 'display_name': 'Web Security', 'color_hex': '#FF5733'},
        {'name': 'cryptography', 'display_name': 'Cryptography', 'color_hex': '#33FF57'},
        {'name': 'forensics', 'display_name': 'Forensics', 'color_hex': '#3357FF'},
        {'name': 'reverse', 'display_name': 'Reverse Engineering', 'color_hex': '#FF33F5'},
        {'name': 'pwn', 'display_name': 'Binary Exploitation', 'color_hex': '#F5FF33'},
    ]
    for cat in categories:
        if not Category.query.filter_by(name=cat['name']).first():
            db.session.add(Category(**cat))
    db.session.commit()

    # Уровни сложности
    difficulties = [
        {'name': 'beginner', 'display_name': 'Beginner', 'xp_reward': 100, 'display_order': 1},
        {'name': 'intermediate', 'display_name': 'Intermediate', 'xp_reward': 300, 'display_order': 2},
        {'name': 'expert', 'display_name': 'Expert', 'xp_reward': 500, 'display_order': 3},
    ]
    for diff in difficulties:
        if not DifficultyLevel.query.filter_by(name=diff['name']).first():
            db.session.add(DifficultyLevel(**diff))
    db.session.commit()

    # Теги
    tags = ['sql-injection', 'xss', 'csrf', 'aes', 'rsa', 'buffer-overflow']
    for tag_name in tags:
        if not ChallengeTag.query.filter_by(name=tag_name).first():
            db.session.add(ChallengeTag(name=tag_name, color_hex='#888888'))
    db.session.commit()

    # Пользователь-админ и обычный пользователь для тестов
    admin_role = Role.query.filter_by(name='admin').first()
    student_role = Role.query.filter_by(name='student').first()
    if not User.query.filter_by(email='admin@ctf.local').first():
        admin = User(
            email='admin@ctf.local',
            nickname='admin',
            first_name='Admin',
            last_name='User',
            is_active=True,
            is_verified=True,
            total_xp=9999
        )
        admin.set_password('admin123')
        admin.roles.append(admin_role)
        db.session.add(admin)

    if not User.query.filter_by(email='student@ctf.local').first():
        student = User(
            email='student@ctf.local',
            nickname='student',
            first_name='Student',
            last_name='User',
            is_active=True,
            is_verified=True
        )
        student.set_password('student123')
        student.roles.append(student_role)
        db.session.add(student)

    db.session.commit()

    # Пример задачи
    web_cat = Category.query.filter_by(name='web_security').first()
    beg_diff = DifficultyLevel.query.filter_by(name='beginner').first()
    admin_user = User.query.filter_by(email='admin@ctf.local').first()
    if not Challenge.query.filter_by(slug='test-sql-injection').first():
        challenge = Challenge(
            title='SQL Injection Login Bypass',
            slug='test-sql-injection',
            description='Find a way to login as admin without password.',
            category_id=web_cat.id,
            difficulty_id=beg_diff.id,
            flag_hash='',
            base_xp=100,
            author_id=admin_user.id,
            status='published',
            hints=[{'text': 'Try SQL injection in the password field', 'cost': 0}],
            attachments=[{'name': 'source.zip', 'url': '/files/source.zip'}]
        )
        challenge.set_flag('CyberQuest{sql_bypass_123}')
        tag = ChallengeTag.query.filter_by(name='sql-injection').first()
        if tag:
            challenge.tags.append(tag)
        db.session.add(challenge)
        db.session.commit()