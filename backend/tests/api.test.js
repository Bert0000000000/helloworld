/**
 * API 单元测试
 * 测试 /api 路由的所有端点
 */

const request = require('supertest');
const app = require('../server');

describe('API 端点测试', () => {
  
  describe('GET /api/hello', () => {
    it('应该返回成功的问候语', async () => {
      const response = await request(app).get('/api/hello');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Hello, World! 🌍');
      expect(response.body.from).toBe('Express Backend');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('GET /api/greeting/:name', () => {
    it('应该返回个性化问候语', async () => {
      const response = await request(app).get('/api/greeting/孙悟空');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('孙悟空');
      expect(response.body.name).toBe('孙悟空');
    });

    it('应该处理带空格的 name', async () => {
      const response = await request(app).get('/api/greeting/%20 猪八戒%20');
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('猪八戒');
    });

    it('应该拒绝空的 name 参数', async () => {
      const response = await request(app).get('/api/greeting/');
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('应该拒绝超长的 name 参数', async () => {
      const longName = 'a'.repeat(51);
      const response = await request(app).get(`/api/greeting/${longName}`);
      
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/info', () => {
    it('应该返回应用信息', async () => {
      const response = await request(app).get('/api/info');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.app).toBe('HelloWorld App');
      expect(response.body.version).toBe('1.0.0');
      expect(response.body.stack.frontend).toBe('React + Ant Design');
      expect(response.body.stack.backend).toBe('Node.js + Express');
      expect(response.body.endpoints).toBeDefined();
      expect(Array.isArray(response.body.endpoints)).toBe(true);
    });
  });

  describe('GET /health', () => {
    it('应该返回健康状态', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('ok');
      expect(response.body.message).toBe('Backend is running!');
      expect(response.body.uptime).toBeDefined();
    });
  });

  describe('404 处理', () => {
    it('应该处理不存在的 API 路由', async () => {
      const response = await request(app).get('/api/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('应该处理不存在的路由', async () => {
      const response = await request(app).get('/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
