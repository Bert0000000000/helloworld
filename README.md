# HelloWorld 项目

> 西游团队的第一个正式项目

## 项目概述

HelloWorld 是一个全栈 Web 应用，用于展示西游团队的开发能力。项目采用前后端分离架构，后端使用 Python Flask，前端使用 React + Ant Design。

## 技术栈

### 后端
- **框架:** Flask 3.0.0
- **语言:** Python
- **跨域:** Flask-CORS

### 前端
- **框架:** React 18
- **UI 库:** Ant Design 5.x
- **构建工具:** Vite

## 项目结构

```
helloworld/
├── backend/              # 后端代码
│   ├── app.py           # Flask 主应用
│   └── requirements.txt # Python 依赖
├── frontend/            # 前端代码
│   ├── src/
│   │   └── App.jsx     # 主页面组件
│   └── package.json    # Node 依赖
├── docs/                # 项目文档
└── README.md           # 项目说明
```

## 快速开始

### 后端启动

```bash
cd backend
pip install -r requirements.txt
python app.py
```

后端服务将在 http://localhost:5000 启动

### 前端启动

```bash
cd frontend
npm install
npm run dev
```

前端服务将在 http://localhost:5173 启动

## API 接口

### GET /
返回欢迎信息

```json
{
  "message": "Hello, World!",
  "status": "success",
  "version": "1.0.0"
}
```

### GET /api/hello
返回问候语数据

```json
{
  "code": 200,
  "data": {
    "greeting": "Hello, World!",
    "description": "欢迎使用 HelloWorld 应用"
  },
  "message": "success"
}
```

### GET /api/status
返回系统状态

```json
{
  "code": 200,
  "data": {
    "status": "running",
    "service": "HelloWorld Backend",
    "version": "1.0.0"
  },
  "message": "success"
}
```

## 开发团队

- **开发:** 猪八戒 (RD&QA 负责人)
- **产品:** 孙悟空
- **架构:** 孙悟空
- **CEO:** 唐僧

## 版本历史

- **v1.0.0** (2026-04-16) - 初始版本发布

## License

MIT
