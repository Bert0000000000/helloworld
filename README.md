# HelloWorld App 🌍

一个全栈 HelloWorld 示例应用，展示前后端分离架构。

## 技术栈

### 前端
- React 18
- Ant Design 5
- Axios

### 后端
- Node.js
- Express
- CORS

## 项目结构

```
HelloWorld/
├── backend/              # 后端服务
│   ├── package.json      # 后端依赖配置
│   ├── server.js         # Express 服务器入口
│   └── routes/
│       └── api.js        # API 路由定义
├── frontend/             # 前端应用
│   ├── package.json      # 前端依赖配置
│   ├── public/
│   │   └── index.html    # HTML 模板
│   └── src/
│       ├── index.js      # React 入口
│       ├── App.js        # 主应用组件
│       └── App.css       # 样式文件
├── .gitignore            # Git 忽略配置
└── README.md             # 项目说明
```

## 快速开始

### 1. 启动后端服务

```bash
cd backend
npm install
npm start
```

后端将在 `http://localhost:3001` 启动

### 2. 启动前端应用（新终端）

```bash
cd frontend
npm install
npm start
```

前端将在 `http://localhost:3000` 启动

### 3. 访问应用

打开浏览器访问：`http://localhost:3000`

## API 端点

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/hello` | GET | 返回问候语 |
| `/api/greeting/:name` | GET | 返回个性化问候 |
| `/api/info` | GET | 返回应用信息 |
| `/health` | GET | 健康检查 |

## 开发说明

- 后端端口：3001
- 前端端口：3000
- 前端通过 Axios 调用后端 API
- 使用 Ant Design 组件库构建 UI

## 作者

🐷 猪八戒 - RD&QA

## License

MIT
