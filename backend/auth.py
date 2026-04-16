"""
用户认证模块
JWT + bcrypt 密码加密
"""

import jwt
import bcrypt
from datetime import datetime, timedelta
from functools import wraps
from flask import request, jsonify, current_app, g


def generate_password_hash(password):
    """生成密码哈希"""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')


def check_password(password, password_hash):
    """验证密码"""
    try:
        return bcrypt.checkpw(
            password.encode('utf-8'), 
            password_hash.encode('utf-8')
        )
    except Exception:
        return False


def generate_token(user_id, username):
    """生成 JWT Token"""
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': datetime.utcnow() + timedelta(days=7),
        'iat': datetime.utcnow()
    }
    token = jwt.encode(payload, current_app.config['SECRET_KEY'], algorithm='HS256')
    return token


def verify_token(token):
    """验证 JWT Token"""
    try:
        payload = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def login_required(f):
    """登录验证装饰器"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return jsonify({
                'code': 401,
                'message': '缺少认证信息'
            }), 401
        
        # 支持 "Bearer <token>" 格式
        parts = auth_header.split()
        if len(parts) != 2 or parts[0] != 'Bearer':
            return jsonify({
                'code': 401,
                'message': '认证格式错误'
            }), 401
        
        token = parts[1]
        payload = verify_token(token)
        
        if not payload:
            return jsonify({
                'code': 401,
                'message': 'Token 无效或已过期'
            }), 401
        
        # 将用户信息存入 g 对象
        g.user_id = payload['user_id']
        g.username = payload['username']
        
        return f(*args, **kwargs)
    
    return decorated_function
