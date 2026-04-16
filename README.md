# HelloWorld App 🌍

一个全栈 HelloWorld 示例应用，展示前后端分离架构的最佳实践。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.18-green)](https://expressjs.com/)

## 📋 目录

- [功能特性](#-功能特性)
- [技术栈](#-技术栈)
- [项目结构](#-项目结构)
- [快速开始](#-快速开始)
- [API 文档](#-api-文档)
- [测试](#-测试)
- [部署](#-部署)
- [开发说明](#-开发说明)
- [贡献](#-贡献)
- [许可证](#-许可证)

---

## ✨ 功能特性

- ✅ 前后端分离架构
- ✅ RESTful API 设计
- ✅ 响应式 UI 界面
- ✅ 完整的错误处理
- ✅ 请求日志记录
- ✅ 健康检查端点
- ✅ 单元测试覆盖 > 80%
- ✅ 详细文档

---

## 🛠 技术栈

### 前端
| 技术 | 版本 | 说明 |
|------|------|------|
| React | 18.2 | UI 框架 |
| Ant Design | 5.x | UI 组件库 |
| Axios | 1.6 | HTTP 客户端 |
| Jest | - | 测试框架 |

### 后端
| 技术 | 版本 | 说明 |
|------|------|------|
| Node.js | LTS | 运行环境 |
| Express | 4.18 | Web 框架 |
| CORS | 2.8 | 跨域支持 |
| Jest | 29.x | 测试框架 |
| Supertest | 6.x | API 测试 |

---

## 📁 项目结构

```
HelloWorld/
├── backend/              # 后端服务
│   ├── server.js         # Express 服务器入口
│   ├── routes/
│   │   └── api.js        # API 路由定义
│   ├── tests/            # 后端测试
│   │   └── api.test.js   # API 单元测试
│   ├── package.json      # 后端依赖配置
│   └── coverage/         # 测试覆盖率报告
│
├── frontend/             # 前端应用
│   ├── public/
│   │   └── index.html    # HTML 模板
│   ├── src/
│   │   ├── index.js      # React 入口
│   │   ├── App.js        # 主应用组件
│   │   ├── App.css       # 样式文件
│   │   └── __tests__/    # 前端测试
│   │       └── App.test.js
│   └── package.json      # 前端依赖配置
│
├── docs/                 # 文档
│   ├── API.md            # API 文档
│   └── ARCHITECTURE.md   # 架构文档
│
├── .gitignore            # Git 忽略配置
├── LICENSE               # MIT 许可证
└── README.md             # 项目说明
```

---

## 🚀 快速开始

### 环境要求
- Node.js >= 16.x
- npm >= 8.x

### 1. 克隆项目

```bash
git clone https://github.com/Bert0000000000/helloworld.git
cd helloworld
```

### 2. 启动后端服务

```bash
cd backend
npm install
npm start
```

后端将在 `http://localhost:3001` 启动

**开发模式 (自动重载):**
```bash
npm run dev
```

### 3. 启动前端应用 (新终端)

```bash
cd frontend
npm install
npm start
```

前端将在 `http://localhost:3000` 启动

### 4. 访问应用

打开浏览器访问：`http://localhost:3000`

---

## 📖 API 文档

### 端点列表

| 端点 | 方法 | 描述 |
|------|------|------|
| `/health` | GET | 健康检查 |
| `/api/hello` | GET | 返回问候语 |
| `/api/greeting/:name` | GET | 返回个性化问候 |
| `/api/info` | GET | 返回应用信息 |

### 使用示例

**cURL:**
```bash
# 健康检查
curl http://localhost:3001/health

# 获取问候语
curl http://localhost:3001/api/hello

# 获取个性化问候
curl http://localhost:3001/api/greeting/猪八戒
```

**JavaScript:**
```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

// 获取问候语
const response = await axios.get(`${API_BASE}/hello`);
console.log(response.data);
```

📄 **详细 API 文档:** [docs/API.md](docs/API.md)

---

## 🧪 测试

### 后端测试

```bash
cd backend
npm install
npm test              # 运行测试
npm run test:coverage # 生成覆盖率报告
```

### 前端测试

```bash
cd frontend
npm install
npm test              # 运行测试
```

### 覆盖率要求
- 语句覆盖率：> 80%
- 分支覆盖率：> 80%
- 函数覆盖率：> 80%
- 行覆盖率：> 80%

---

## 📦 部署

### 开发环境
```bash
# 后端
cd backend && npm run dev

# 前端 (新终端)
cd frontend && npm start
```

### 生产环境

**方案 A: 分离部署**
- 前端：Vercel / Netlify
- 后端：Heroku / Railway / AWS

**方案 B: 统一部署**
```bash
# 构建前端
cd frontend && npm run build

# 配置 Express 静态文件服务
# 启动服务
cd backend && npm start
```

📄 **详细部署指南:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## 💡 开发说明

### 代码规范
- 遵循 ESLint 配置
- 使用 Prettier 格式化代码
- 有意义的变量和函数命名

### 提交规范
```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试相关
chore: 构建/工具
```

### 添加新功能
1. 创建功能分支：`git checkout -b feature/xxx`
2. 开发并测试
3. 提交代码：`git commit -m "feat: xxx"`
4. 推送分支：`git push origin feature/xxx`
5. 创建 Pull Request

---

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

---

## 👨‍💻 作者

**猪八戒** - RD&QA

西游团队 © 2024

---

## 📞 联系方式

- 项目仓库：https://github.com/Bert0000000000/helloworld
- 问题反馈：GitHub Issues

---

_感谢使用 HelloWorld App! 🎉_
