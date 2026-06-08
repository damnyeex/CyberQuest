import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-ctf-key'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'postgresql://postgres:fulful89@localhost:5432/ctf_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'