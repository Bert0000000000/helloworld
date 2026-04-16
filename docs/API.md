# HelloWorld API 文档

## 概述

HelloWorld API 提供简单的问候服务，包含基础问候、个性化问候和应用信息查询功能。

**Base URL:** `http://localhost:3001`

**API 版本:** 1.0.0

---

## 端点列表

### 1. 健康检查

**端点:** `GET /health`

**描述:** 检查后端服务运行状态

**请求参数:** 无

**响应示例:**
```json
{
  "status": "ok",
  "message": "Backend is running!",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 123.456
}
```

**状态码:**
- `200` - 服务正常运行

---

### 2. 获取问候语

**端点:** `GET /api/hello`

**描述:** 返回标准问候语

**请求参数:** 无

**响应示例:**
```json
{
  "success": true,
  "message": "Hello, World! 🌍",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "from": "Express Backend"
}
```

**状态码:**
- `200` - 成功

---

### 3. 获取个性化问候

**端点:** `GET /api/greeting/:name`

**描述:** 根据提供的名称返回个性化问候语

**请求参数:**

| 参数 | 类型 | 位置 | 必填 | 说明 |
|------|------|------|------|------|
| name | string | path | 是 | 用户名，最大长度 50 字符 |

**请求示例:**
```
GET /api/greeting/孙悟空
```

**成功响应示例:**
```json
{
  "success": true,
  "message": "Hello, 孙悟空! 欢迎使用 HelloWorld 应用 🎉",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "name": "孙悟空"
}
```

**错误响应示例:**
```json
{
  "success": false,
  "error": "ApiError",
  "message": "name 参数不能为空",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**状态码:**
- `200` - 成功
- `400` - 请求参数错误（name 为空或超长）

---

### 4. 获取应用信息

**端点:** `GET /api/info`

**描述:** 返回应用详细信息和可用端点列表

**请求参数:** 无

**响应示例:**
```json
{
  "success": true,
  "app": "HelloWorld App",
  "version": "1.0.0",
  "stack": {
    "frontend": "React + Ant Design",
    "backend": "Node.js + Express"
  },
  "endpoints": [
    {
      "path": "/api/hello",
      "method": "GET",
      "description": "返回问候语"
    },
    {
      "path": "/api/greeting/:name",
      "method": "GET",
      "description": "返回个性化问候"
    },
    {
      "path": "/api/info",
      "method": "GET",
      "description": "返回应用信息"
    },
    {
      "path": "/health",
      "method": "GET",
      "description": "健康检查"
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**状态码:**
- `200` - 成功

---

## 错误处理

所有错误响应遵循统一格式：

```json
{
  "success": false,
  "error": "错误类型",
  "message": "错误描述",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**常见错误码:**

| 状态码 | 错误类型 | 说明 |
|--------|----------|------|
| 400 | ApiError | 请求参数错误 |
| 404 | ApiError | 资源不存在 |
| 500 | Internal Server Error | 服务器内部错误 |

---

## 使用示例

### cURL

```bash
# 健康检查
curl http://localhost:3001/health

# 获取问候语
curl http://localhost:3001/api/hello

# 获取个性化问候
curl http://localhost:3001/api/greeting/猪八戒

# 获取应用信息
curl http://localhost:3001/api/info
```

### JavaScript (Fetch)

```javascript
// 获取问候语
fetch('http://localhost:3001/api/hello')
  .then(response => response.json())
  .then(data => console.log(data));

// 获取个性化问候
fetch('http://localhost:3001/api/greeting/孙悟空')
  .then(response => response.json())
  .then(data => console.log(data));
```

### JavaScript (Axios)

```javascript
import axios from 'axios';

const API_BASE = 'http://localhost:3001/api';

// 获取问候语
const hello = await axios.get(`${API_BASE}/hello`);

// 获取个性化问候
const greeting = await axios.get(`${API_BASE}/greeting/猪八戒`);

// 获取应用信息
const info = await axios.get(`${API_BASE}/info`);
```

---

## 更新日志

### v1.0.0 (2024-01-01)
- 初始版本发布
- 实现基础问候 API
- 实现个性化问候 API
- 实现应用信息查询 API
- 添加健康检查端点
- 添加错误处理和日志记录

---

## 联系支持

如有问题，请联系：
- 开发者：猪八戒 (RD&QA)
- 项目仓库：https://github.com/Bert0000000000/helloworld
