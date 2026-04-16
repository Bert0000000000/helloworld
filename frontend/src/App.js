import React, { useState, useEffect } from 'react';
import { Layout, Typography, Card, Button, Space, message, Spin, Divider } from 'antd';
import { HelloOutlined, GlobalOutlined, RocketOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Header, Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const API_BASE_URL = 'http://localhost:3001/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [helloData, setHelloData] = useState(null);
  const [greetingData, setGreetingData] = useState(null);
  const [infoData, setInfoData] = useState(null);

  // 调用 Hello API
  const fetchHello = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/hello`);
      setHelloData(response.data);
      message.success('成功获取问候语！');
    } catch (error) {
      message.error('获取失败，请检查后端服务是否运行');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 调用个性化问候 API
  const fetchGreeting = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/greeting/猪八戒`);
      setGreetingData(response.data);
      message.success('成功获取个性化问候！');
    } catch (error) {
      message.error('获取失败，请检查后端服务是否运行');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 调用应用信息 API
  const fetchInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/info`);
      setInfoData(response.data);
      message.success('成功获取应用信息！');
    } catch (error) {
      message.error('获取失败，请检查后端服务是否运行');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: '#001529',
        padding: '0 24px'
      }}>
        <Space>
          <GlobalOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            HelloWorld App
          </Title>
        </Space>
      </Header>
      
      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <Card 
          title={<Space><HelloOutlined />欢迎使用 HelloWorld 应用</Space>}
          style={{ maxWidth: 800, margin: '0 auto' }}
          bordered={false}
        >
          <Paragraph>
            这是一个全栈 HelloWorld 示例应用，展示前后端分离架构。
          </Paragraph>
          
          <Divider />
          
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            <Space>
              <Button 
                type="primary" 
                icon={<RocketOutlined />}
                onClick={fetchHello}
                loading={loading}
              >
                获取问候语
              </Button>
              
              <Button 
                onClick={fetchGreeting}
                loading={loading}
              >
                获取个性化问候
              </Button>
              
              <Button 
                onClick={fetchInfo}
                loading={loading}
              >
                查看应用信息
              </Button>
            </Space>

            {loading && <Spin tip="加载中..." />}

            {helloData && (
              <Card type="inner" title="📬 API 响应 - Hello" size="small">
                <Text code>{JSON.stringify(helloData, null, 2)}</Text>
              </Card>
            )}

            {greetingData && (
              <Card type="inner" title="🎯 API 响应 - 个性化问候" size="small">
                <Text code>{JSON.stringify(greetingData, null, 2)}</Text>
              </Card>
            )}

            {infoData && (
              <Card type="inner" title="ℹ️ API 响应 - 应用信息" size="small">
                <Text code>{JSON.stringify(infoData, null, 2)}</Text>
              </Card>
            )}
          </Space>

          <Divider />
          
          <Paragraph>
            <Text type="secondary">
              💡 提示：请先启动后端服务 (端口 3001)，再点击按钮测试 API
            </Text>
          </Paragraph>
        </Card>
      </Content>
    </Layout>
  );
}

export default App;
