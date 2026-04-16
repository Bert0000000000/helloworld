"""
HelloWorld 后端应用
使用 Flask 框架提供 API 服务
"""

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许跨域请求


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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
