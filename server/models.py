import json
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import UniqueConstraint, Index
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class Role(db.Model):
    __tablename__ = 'roles'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)  # student, teacher, admin
    description = db.Column(db.Text)

    users = db.relationship('User', secondary='user_roles', back_populates='roles')

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    nickname = db.Column(db.String(100), unique=True)
    avatar_url = db.Column(db.Text)
    bio = db.Column(db.Text)
    total_xp = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)
    is_verified = db.Column(db.Boolean, default=False)
    deleted_at = db.Column(db.DateTime, nullable=True)
    failed_login_attempts = db.Column(db.Integer, default=0)
    locked_until = db.Column(db.DateTime, nullable=True)

    roles = db.relationship('Role', secondary='user_roles', back_populates='users')
    solves = db.relationship('ChallengeSolve', back_populates='user')
    progress = db.relationship('UserProgress', back_populates='user', uselist=False)
    category_progress = db.relationship('UserCategoryProgress', back_populates='user')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    # Работа с JSON-биографией для хранения доп.данных
    def get_meta(self):
        try:
            return json.loads(self.bio) if self.bio else {}
        except:
            return {}

    def set_meta(self, data):
        self.bio = json.dumps(data)

    def update_meta(self, key, value):
        meta = self.get_meta()
        meta[key] = value
        self.set_meta(meta)

    def get_meta_key(self, key, default=None):
        return self.get_meta().get(key, default)

    # OAuth-идентификаторы
    @property
    def google_id(self):
        return self.get_meta_key('google_id')
    @google_id.setter
    def google_id(self, val):
        self.update_meta('google_id', val)

    @property
    def telegram_id(self):
        return self.get_meta_key('telegram_id')
    @telegram_id.setter
    def telegram_id(self, val):
        self.update_meta('telegram_id', val)

    # Подписка
    @property
    def subscription(self):
        return self.get_meta_key('subscription', {})
    @subscription.setter
    def subscription(self, val):
        self.update_meta('subscription', val)

    # MFA-секрет
    @property
    def mfa_secret(self):
        return self.get_meta_key('mfa_secret')
    @mfa_secret.setter
    def mfa_secret(self, val):
        self.update_meta('mfa_secret', val)

class UserRole(db.Model):
    __tablename__ = 'user_roles'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    role_id = db.Column(db.Integer, db.ForeignKey('roles.id', ondelete='CASCADE'), primary_key=True)

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    display_name = db.Column(db.String(255))
    color_hex = db.Column(db.String(7), default='#000000')
    display_order = db.Column(db.Integer, default=0)
    is_active = db.Column(db.Boolean, default=True)

    challenges = db.relationship('Challenge', back_populates='category')
    category_progress = db.relationship('UserCategoryProgress', back_populates='category')

class DifficultyLevel(db.Model):
    __tablename__ = 'difficulty_levels'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    display_name = db.Column(db.String(255))
    xp_reward = db.Column(db.Integer, default=0)
    display_order = db.Column(db.Integer, default=0)

    challenges = db.relationship('Challenge', back_populates='difficulty')

class Challenge(db.Model):
    __tablename__ = 'challenges'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    difficulty_id = db.Column(db.Integer, db.ForeignKey('difficulty_levels.id'), nullable=False)
    flag_hash = db.Column(db.String(255), nullable=False)  # bcrypt hash флага
    flag_format = db.Column(db.String(100), default='CyberQuest{%s}')
    hints = db.Column(JSONB, default=lambda: [])  # список подсказок
    attachments = db.Column(JSONB, default=lambda: [])  # список URL/имён файлов
    base_xp = db.Column(db.Integer, default=0)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    status = db.Column(db.String(20), default='draft')  # draft, published, archived
    solve_count = db.Column(db.Integer, default=0)
    attempt_count = db.Column(db.Integer, default=0)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=True)

    course = db.relationship('Course', back_populates='challenges')

    category = db.relationship('Category', back_populates='challenges')
    difficulty = db.relationship('DifficultyLevel', back_populates='challenges')
    author = db.relationship('User', backref='authored_challenges')
    tags = db.relationship('ChallengeTag', secondary='challenge_tag_relations', back_populates='challenges')
    solves = db.relationship('ChallengeSolve', back_populates='challenge')

    def set_flag(self, raw_flag):
        self.flag_hash = generate_password_hash(raw_flag)

    def check_flag(self, raw_flag):
        return check_password_hash(self.flag_hash, raw_flag)

class ChallengeTag(db.Model):
    __tablename__ = 'challenge_tags'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    color_hex = db.Column(db.String(7), default='#000000')

    challenges = db.relationship('Challenge', secondary='challenge_tag_relations', back_populates='tags')

class ChallengeTagRelation(db.Model):
    __tablename__ = 'challenge_tag_relations'
    challenge_id = db.Column(db.Integer, db.ForeignKey('challenges.id', ondelete='CASCADE'), primary_key=True)
    tag_id = db.Column(db.Integer, db.ForeignKey('challenge_tags.id', ondelete='CASCADE'), primary_key=True)

class ChallengeSolve(db.Model):
    __tablename__ = 'challenge_solves'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    challenge_id = db.Column(db.Integer, db.ForeignKey('challenges.id'), primary_key=True)
    xp_earned = db.Column(db.Integer, default=0)
    solved_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    user = db.relationship('User', back_populates='solves')
    challenge = db.relationship('Challenge', back_populates='solves')

    __table_args__ = (UniqueConstraint('user_id', 'challenge_id'),)

class UserProgress(db.Model):
    __tablename__ = 'user_progress'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    total_xp = db.Column(db.Integer, default=0)
    total_solves = db.Column(db.Integer, default=0)
    total_attempts = db.Column(db.Integer, default=0)
    challenges_available = db.Column(db.Integer, default=0)
    current_level = db.Column(db.String(50), default='beginner')

    user = db.relationship('User', back_populates='progress')

class UserCategoryProgress(db.Model):
    __tablename__ = 'user_category_progress'
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), primary_key=True)
    solved_count = db.Column(db.Integer, default=0)
    total_in_category = db.Column(db.Integer, default=0)
    category_xp = db.Column(db.Integer, default=0)
    progress_percent = db.Column(db.Float, default=0.0)

    user = db.relationship('User', back_populates='category_progress')
    category = db.relationship('Category', back_populates='category_progress')

    __table_args__ = (UniqueConstraint('user_id', 'category_id'),)


class Course(db.Model):
    __tablename__ = 'courses'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(255), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)
    difficulty_id = db.Column(db.Integer, db.ForeignKey('difficulty_levels.id'))
    icon = db.Column(db.String(100), default='FaCode')  # название иконки для фронта
    is_published = db.Column(db.Boolean, default=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=True)

    category = db.relationship('Category')
    difficulty = db.relationship('DifficultyLevel')
    challenges = db.relationship('Challenge', back_populates='course')