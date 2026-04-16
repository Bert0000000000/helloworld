const express = require('express');
const router = express.Router();

// 自定义错误类
class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// GET /api/hello - 返回问候语
router.get('/hello', (req, res, next) => {
  try {
    const responseData = {
      success: true,
      message: 'Hello, World! 🌍',
      timestamp: new Date().toISOString(),
      from: 'Express Backend'
    };
    console.log('[API] /hello 请求成功');
    res.json(responseData);
  } catch (error) {
    next(error);
  }
});

// GET /api/greeting/:name - 个性化问候
router.get('/greeting/:name', (req, res, next) => {
  try {
    const { name } = req.params;
    
    // 验证 name 参数
    if (!name || name.trim() === '') {
      throw new ApiError('name 参数不能为空', 400);
    }
    
    if (name.length > 50) {
      throw new ApiError('name 参数长度不能超过 50 个字符', 400);
    }
    
    const responseData = {
      success: true,
      message: `Hello, ${name.trim()}! 欢迎使用 HelloWorld 应用 🎉`,
      timestamp: new Date().toISOString(),
      name: name.trim()
    };
    console.log(`[API] /greeting/${name.trim()} 请求成功`);
    res.json(responseData);
  } catch (error) {
    next(error);
  }
});

// GET /api/info - 返回应用信息
router.get('/info', (req, res, next) => {
  try {
    const responseData = {
      success: true,
      app: 'HelloWorld App',
      version: '1.0.0',
      stack: {
        frontend: 'React + Ant Design',
        backend: 'Node.js + Express'
      },
      endpoints: [
        { path: '/api/hello', method: 'GET', description: '返回问候语' },
        { path: '/api/greeting/:name', method: 'GET', description: '返回个性化问候' },
        { path: '/api/info', method: 'GET', description: '返回应用信息' },
        { path: '/health', method: 'GET', description: '健康检查' }
      ],
      timestamp: new Date().toISOString()
    };
    console.log('[API] /info 请求成功');
    res.json(responseData);
  } catch (error) {
    next(error);
  }
});

// 404 处理 - API 路由未找到
router.use((req, res, next) => {
  next(new ApiError(`API 端点不存在：${req.method} ${req.url}`, 404));
});

module.exports = router;
