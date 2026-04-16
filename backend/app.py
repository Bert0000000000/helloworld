"""
HelloWorld 后端应用
使用 Flask 框架提供 API 服务
"""

import os
from flask import Flask, jsonify, request, g
from flask_cors import CORS
from models import db, User
from auth import generate_password_hash, check_password, generate_token, verify_token, login_required

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 配置
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'helloworld-secret-key-2026')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///helloworld.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# 初始化数据库
db.init_app(app)

# 创建数据库表
with app.app_context():
    db.create_all()


@app.route('/')
def index():
    """根路径"""
    return jsonify({
        'message': 'Hello, World!',
        'status': 'success',
        'version': '1.0.0'
    })


@app.route('/api/hello')
def hello():
    """Hello API 接口"""
    return jsonify({
        'code': 200,
        'data': {
            'greeting': 'Hello, World!',
            'description': '欢迎使用 HelloWorld 应用'
        },
        'message': 'success'
    })


@app.route('/api/status')
def status():
    """系统状态接口"""
    return jsonify({
        'code': 200,
        'data': {
            'status': 'running',
            'service': 'HelloWorld Backend',
            'version': '1.0.0'
        },
        'message': 'success'
    })


# ==================== 用户认证接口 ====================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """用户注册"""
    data = request.get_json()
    
    if not data:
        return jsonify({
            'code': 400,
            'message': '请求数据为空'
        }), 400
    
    username = data.get('username', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')
    
    # 参数验证
    if not username:
        return jsonify({
            'code': 400,
            'message': '用户名不能为空'
        }), 400
    
    if not email or '@' not in email:
        return jsonify({
            'code': 400,
            'message': '请输入有效的邮箱地址'
        }), 400
    
    if not password or len(password) < 6:
        return jsonify({
            'code': 400,
            'message': '密码长度至少 6 位'
        }), 400
    
    # 检查用户是否已存在
    if User.query.filter_by(username=username).first():
        return jsonify({
            'code': 400,
            'message': '用户名已被注册'
        }), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({
            'code': 400,
            'message': '邮箱已被注册'
        }), 400
    
    # 创建用户
    user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password)
    )
    
    try:
        db.session.add(user)
        db.session.commit()
        
        # 生成 token
        token = generate_token(user.id, user.username)
        
        return jsonify({
            'code': 200,
            'data': {
                'user': user.to_dict(),
                'token': token
            },
            'message': '注册成功'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'code': 500,
            'message': f'注册失败：{str(e)}'
        }), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    """用户登录"""
    data = request.get_json()
    
    if not data:
        return jsonify({
            'code': 400,
            'message': '请求数据为空'
        }), 400
    
    username = data.get('username', '').strip()
    password = data.get('password', '')
    
    # 参数验证
    if not username:
        return jsonify({
            'code': 400,
            'message': '请输入用户名或邮箱'
        }), 400
    
    if not password:
        return jsonify({
            'code': 400,
            'message': '请输入密码'
        }), 400
    
    # 查找用户（支持用户名或邮箱登录）
    user = User.query.filter(
        (User.username == username) | (User.email == username)
    ).first()
    
    if not user:
        return jsonify({
            'code': 401,
            'message': '用户不存在'
        }), 401
    
    if not user.is_active:
        return jsonify({
            'code': 401,
            'message': '账号已被禁用'
        }), 401
    
    # 验证密码
    if not check_password(password, user.password_hash):
        return jsonify({
            'code': 401,
            'message': '密码错误'
        }), 401
    
    # 生成 token
    token = generate_token(user.id, user.username)
    
    return jsonify({
        'code': 200,
        'data': {
            'user': user.to_dict(),
            'token': token
        },
        'message': '登录成功'
    }), 200


@app.route('/api/auth/profile', methods=['GET'])
@login_required
def get_profile():
    """获取当前用户信息"""
    user = User.query.get(g.user_id)
    
    if not user:
        return jsonify({
            'code': 404,
            'message': '用户不存在'
        }), 404
    
    return jsonify({
        'code': 200,
        'data': user.to_dict(),
        'message': 'success'
    }), 200


@app.route('/api/auth/verify', methods=['POST'])
def verify_token_api():
    """验证 Token 有效性"""
    data = request.get_json()
    token = data.get('token') if data else None
    
    if not token:
        auth_header = request.headers.get('Authorization')
        if auth_header:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
    
    if not token:
        return jsonify({
            'code': 400,
            'message': '缺少 Token'
        }), 400
    
    payload = verify_token(token)
    
    if payload:
        return jsonify({
            'code': 200,
            'data': {
                'valid': True,
                'user_id': payload['user_id'],
                'username': payload['username']
            },
            'message': 'Token 有效'
        }), 200
    else:
        return jsonify({
            'code': 401,
            'data': {'valid': False},
            'message': 'Token 无效或已过期'
        }), 401


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
