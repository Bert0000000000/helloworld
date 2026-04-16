const express = require('express');
const router = express.Router();

// GET /api/hello - 返回问候语
router.get('/hello', (req, res) => {
  res.json({
    success: true,
    message: 'Hello, World! 🌍',
    timestamp: new Date().toISOString(),
    from: 'Express Backend'
  });
});

// GET /api/greeting/:name - 个性化问候
router.get('/greeting/:name', (req, res) => {
  const { name } = req.params;
  res.json({
    success: true,
    message: `Hello, ${name}! 欢迎使用 HelloWorld 应用 🎉`,
    timestamp: new Date().toISOString()
  });
});

// GET /api/info - 返回应用信息
router.get('/info', (req, res) => {
  res.json({
    success: true,
    app: 'HelloWorld App',
    version: '1.0.0',
    stack: {
      frontend: 'React + Ant Design',
      backend: 'Node.js + Express'
    }
  });
});

module.exports = router;
