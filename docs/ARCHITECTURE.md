# HelloWorld 技术架构文档

## 1. 系统概述

HelloWorld 是一个全栈示例应用，用于演示前后端分离架构的最佳实践。

### 1.1 项目目标
- 展示 React + Node.js 全栈开发流程
- 实践 RESTful API 设计规范
- 实现完整的测试覆盖
- 提供清晰的文档和代码结构

### 1.2 技术选型

| 层级 | 技术 | 版本 | 选择理由 |
|------|------|------|----------|
| 前端框架 | React | 18.2 | 组件化、生态丰富 |
| UI 库 | Ant Design | 5.x | 企业级 UI 组件 |
| HTTP 客户端 | Axios | 1.6 | 简洁的 API、拦截器支持 |
| 后端框架 | Express | 4.18 | 轻量、灵活、中间件生态 |
| 测试框架 | Jest | 29.x | 功能完善、覆盖率报告 |
| API 测试 | Supertest | 6.x | Express 应用测试标准 |

---

## 2. 系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                      用户浏览器                          │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP/HTTPS
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    前端服务 (Port 3000)                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  React 应用                                        │  │
│  │  ├─ Components (UI 组件)                           │  │
│  │  ├─ Services (API 调用)                            │  │
│  │  └─ State Management (本地状态)                    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │ Axios HTTP Requests
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   后端服务 (Port 3001)                   │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Express Server                                    │  │
│  │  ├─ Middleware (CORS, JSON, Logger)               │  │
│  │  ├─ Routes (API 端点)                              │  │
│  │  ├─ Error Handlers                                │  │
│  │  └─ Health Check                                  │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 目录结构

```
HelloWorld/
├── backend/                    # 后端服务
│   ├── server.js              # Express 服务器入口
│   ├── routes/
│   │   └── api.js             # API 路由定义
│   ├── tests/                 # 后端测试
│   │   └── api.test.js        # API 单元测试
│   ├── package.json           # 后端依赖配置
│   └── coverage/              # 测试覆盖率报告 (生成)
│
├── frontend/                   # 前端应用
│   ├── public/
│   │   └── index.html         # HTML 模板
│   ├── src/
│   │   ├── index.js           # React 入口
│   │   ├── App.js             # 主应用组件
│   │   ├── App.css            # 样式文件
│   │   └── __tests__/         # 前端测试
│   │       └── App.test.js    # 组件测试
│   ├── package.json           # 前端依赖配置
│   └── build/                 # 构建输出 (生成)
│
├── docs/                       # 文档
│   ├── API.md                 # API 文档
│   └── ARCHITECTURE.md        # 架构文档 (本文件)
│
├── .gitignore                 # Git 忽略配置
├── LICENSE                    # 开源协议
└── README.md                  # 项目说明
```

---

## 3. 核心模块设计

### 3.1 后端模块

#### 3.1.1 Server (server.js)

**职责:**
- 创建 Express 应用实例
- 配置中间件 (CORS, JSON 解析，日志)
- 注册路由
- 错误处理
- 健康检查
- 优雅关闭

**关键代码流程:**
```
请求 → 日志中间件 → CORS → JSON 解析 → 路由匹配 → 响应/错误
```

#### 3.1.2 API 路由 (routes/api.js)

**端点:**
- `GET /hello` - 标准问候
- `GET /greeting/:name` - 个性化问候
- `GET /info` - 应用信息

**设计原则:**
- 参数验证
- 统一响应格式
- 错误集中处理

### 3.2 前端模块

#### 3.2.1 App 组件 (src/App.js)

**职责:**
- 渲染 UI 界面
- 处理用户交互
- 调用后端 API
- 显示响应数据

**状态管理:**
- `loading` - 加载状态
- `helloData` - 问候语数据
- `greetingData` - 个性化问候数据
- `infoData` - 应用信息数据

---

## 4. 数据流

### 4.1 用户操作流程

```
用户点击按钮
    ↓
触发 fetchHello/fetchGreeting/fetchInfo
    ↓
设置 loading = true
    ↓
Axios 发送 HTTP 请求
    ↓
后端处理请求
    ↓
返回 JSON 响应
    ↓
更新对应 state
    ↓
设置 loading = false
    ↓
显示响应数据
```

### 4.2 API 响应格式

**成功响应:**
```json
{
  "success": true,
  "message": "...",
  "timestamp": "ISO8601",
  ...其他数据
}
```

**错误响应:**
```json
{
  "success": false,
  "error": "错误类型",
  "message": "错误描述",
  "timestamp": "ISO8601"
}
```

---

## 5. 测试策略

### 5.1 后端测试

**测试框架:** Jest + Supertest

**测试覆盖:**
- API 端点功能测试
- 参数验证测试
- 错误处理测试
- 404 处理测试

**运行测试:**
```bash
cd backend
npm install
npm test
```

**覆盖率要求:** > 80%

### 5.2 前端测试

**测试框架:** Jest + React Testing Library

**测试覆盖:**
- 组件渲染测试
- 用户交互测试
- API 调用测试
- 错误处理测试

**运行测试:**
```bash
cd frontend
npm install
npm test
```

---

## 6. 部署方案

### 6.1 开发环境

```bash
# 启动后端
cd backend
npm install
npm run dev

# 启动前端 (新终端)
cd frontend
npm install
npm start
```

### 6.2 生产环境

**方案 A: 分离部署**
- 前端：部署到 CDN/静态托管 (Vercel, Netlify)
- 后端：部署到云服务器 (Heroku, Railway, AWS)

**方案 B: 统一部署**
```bash
# 构建前端
cd frontend
npm run build

# 配置 Express 静态文件服务
# 将 build 目录作为静态资源

# 启动服务
cd backend
npm start
```

### 6.3 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| PORT | 后端服务端口 | 3001 |
| NODE_ENV | 运行环境 | development |

---

## 7. 安全考虑

### 7.1 已实现
- CORS 配置
- 请求体大小限制
- 输入参数验证
- 错误信息不泄露敏感数据

### 7.2 建议增强
- HTTPS 强制
- 速率限制
- API 认证 (如需要)
- 日志审计

---

## 8. 性能优化

### 8.1 前端
- 组件懒加载
- 图片优化
- 缓存策略

### 8.2 后端
- 响应缓存
- 数据库连接池 (如需要)
- 日志异步写入

---

## 9. 扩展方向

### 9.1 功能扩展
- [ ] 用户认证系统
- [ ] 数据库集成
- [ ] WebSocket 实时通信
- [ ] 文件上传功能

### 9.2 技术升级
- [ ] TypeScript 迁移
- [ ] GraphQL API
- [ ] 微服务架构
- [ ] Docker 容器化

---

## 10. 维护说明

### 10.1 代码规范
- 遵循 ESLint 配置
- 统一代码格式 (Prettier)
- 有意义的提交信息

### 10.2 版本管理
- 语义化版本 (SemVer)
- CHANGELOG 维护
- Git Branch 策略

---

## 附录

### A. 依赖版本

**后端:**
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "jest": "^29.7.0",
  "supertest": "^6.3.3"
}
```

**前端:**
```json
{
  "react": "^18.2.0",
  "antd": "^5.12.0",
  "axios": "^1.6.2"
}
```

### B. 相关资源
- [Express 官方文档](https://expressjs.com/)
- [React 官方文档](https://react.dev/)
- [Ant Design](https://ant.design/)
- [Jest 测试框架](https://jestjs.io/)

---

**文档版本:** 1.0.0
**最后更新:** 2024-01-01
**维护者:** 猪八戒 (RD&QA)
