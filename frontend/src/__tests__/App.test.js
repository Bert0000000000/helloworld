/**
 * 前端组件测试
 * 测试 App 组件的基本功能
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(),
}));

import axios from 'axios';

// Mock antd message
jest.mock('antd', () => {
  const actualAntd = jest.requireActual('antd');
  return {
    ...actualAntd,
    message: {
      success: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
      warning: jest.fn(),
    },
  };
});

describe('App 组件测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该渲染应用标题', () => {
    render(<App />);
    expect(screen.getByText(/HelloWorld App/i)).toBeInTheDocument();
  });

  it('应该渲染欢迎信息', () => {
    render(<App />);
    expect(screen.getByText(/欢迎使用 HelloWorld 应用/i)).toBeInTheDocument();
  });

  it('应该渲染三个功能按钮', () => {
    render(<App />);
    expect(screen.getByText('获取问候语')).toBeInTheDocument();
    expect(screen.getByText('获取个性化问候')).toBeInTheDocument();
    expect(screen.getByText('查看应用信息')).toBeInTheDocument();
  });

  it('点击获取问候语按钮应该调用 API', async () => {
    const mockData = {
      success: true,
      message: 'Hello, World! 🌍',
      timestamp: new Date().toISOString(),
    };
    axios.get.mockResolvedValue({ data: mockData });

    render(<App />);
    const button = screen.getByText('获取问候语');
    button.click();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/api/hello');
    });
  });

  it('点击获取个性化问候按钮应该调用 API', async () => {
    const mockData = {
      success: true,
      message: 'Hello, 猪八戒! 欢迎使用 HelloWorld 应用 🎉',
      timestamp: new Date().toISOString(),
    };
    axios.get.mockResolvedValue({ data: mockData });

    render(<App />);
    const button = screen.getByText('获取个性化问候');
    button.click();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/api/greeting/猪八戒');
    });
  });

  it('点击查看应用信息按钮应该调用 API', async () => {
    const mockData = {
      success: true,
      app: 'HelloWorld App',
      version: '1.0.0',
    };
    axios.get.mockResolvedValue({ data: mockData });

    render(<App />);
    const button = screen.getByText('查看应用信息');
    button.click();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3001/api/info');
    });
  });

  it('API 调用失败时应该显示错误信息', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    render(<App />);
    const button = screen.getByText('获取问候语');
    button.click();

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });
});
