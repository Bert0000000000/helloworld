import { useState, useEffect } from 'react'
import { Layout, Typography, Card, Button, Space, message, theme } from 'antd'
import { RocketOutlined, CheckCircleOutlined, GlobalOutlined } from '@ant-design/icons'

const { Header, Content, Footer } = Layout
const { Title, Paragraph, Text } = Typography

function App() {
  const [greeting, setGreeting] = useState('Hello, World!')
  const [status, setStatus] = useState('loading')
  const { token } = theme.useToken()

  // 获取后端 API 数据
  useEffect(() => {
    fetch('http://localhost:5000/api/hello')
      .then(res => res.json())
      .then(data => {
        if (data.code === 200) {
          setGreeting(data.data.greeting)
          setStatus('success')
        }
      })
      .catch(err => {
        console.error('API 请求失败:', err)
        setStatus('error')
        message.error('后端服务未连接')
      })
  }, [])

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: token.colorPrimary,
        padding: '0 24px'
      }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          <RocketOutlined /> HelloWorld 应用
        </div>
      </Header>
      
      <Content style={{ padding: '48px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Card 
            style={{ marginBottom: '24px', textAlign: 'center' }}
            bordered={false}
          >
            <Title level={1} style={{ color: token.colorPrimary }}>
              {greeting}
            </Title>
            <Paragraph style={{ fontSize: '16px', color: '#666' }}>
              欢迎使用 HelloWorld 应用 - 这是西游团队的第一个项目
            </Paragraph>
            
            <Space size="large" style={{ marginTop: '24px' }}>
              <div>
                <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '24px' }} />
                <div style={{ marginTop: '8px' }}>
                  <Text type="secondary">状态</Text>
                  <div>{status === 'success' ? '✅ 运行中' : status === 'error' ? '❌ 未连接' : '⏳ 加载中'}</div>
                </div>
              </div>
              <div>
                <GlobalOutlined style={{ color: '#1890ff', fontSize: '24px' }} />
                <div style={{ marginTop: '8px' }}>
                  <Text type="secondary">版本</Text>
                  <div>v1.0.0</div>
                </div>
              </div>
            </Space>
          </Card>

          <Card title="项目信息" bordered={false}>
            <Paragraph>
              <Text strong>技术栈：</Text>
              <br />
              后端：Python + Flask
              <br />
              前端：React + Ant Design
              <br />
              版本控制：GitHub
            </Paragraph>
            <Paragraph>
              <Text strong>开发团队：</Text>
              <br />
              西游团队 - 猪八戒负责开发
            </Paragraph>
          </Card>

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button 
              type="primary" 
              size="large"
              onClick={() => message.success('🎉 功能正常！')}
            >
              测试按钮
            </Button>
          </div>
        </div>
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        HelloWorld 应用 ©2026 西游团队 Created by 猪八戒
      </Footer>
    </Layout>
  )
}

export default App
