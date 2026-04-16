const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

// 日志中间件 - 记录每个请求
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  console.log(`[${timestamp}] ${method} ${url}`);
  next();
});

// 中间件
app.use(cors());
app.use(express.json());

// 请求体大小限制
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// API 路由
app.use('/api', apiRoutes);

// 健康检查端点
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Backend is running!',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 404 处理
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `无法找到资源：${req.method} ${req.url}`,
    timestamp: new Date().toISOString()
  });
});

// 全局错误处理
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] 错误：`, err.message);
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message,
    timestamp
  });
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('收到 SIGTERM 信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在关闭服务器...');
  process.exit(0);
});

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`🚀 后端服务已启动：http://localhost:${PORT}`);
  console.log(`📡 API 端点：http://localhost:${PORT}/api`);
  console.log(`🏥 健康检查：http://localhost:${PORT}/health`);
});

// 错误处理
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ 端口 ${PORT} 已被占用，请检查是否有其他服务正在运行`);
  } else {
    console.error('❌ 服务器启动失败:', err.message);
  }
  process.exit(1);
});

module.exports = app;
