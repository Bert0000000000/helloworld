import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout, Typography, Card, Button, Space, message, theme, Avatar, Row, Col, Tag, Dropdown } from 'antd'
import { RocketOutlined, CheckCircleOutlined, GlobalOutlined, TeamOutlined, CodeOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons'

import Login from './pages/Login'

const { Header, Content, Footer } = Layout
const { Title, Paragraph, Text } = Typography

// 团队成员数据
const teamMembers = [
  {
    name: '唐僧',
    role: 'CEO',
    emoji: '🧙‍♂️',
    color: '#722ed1',
    description: '西游记创始人/领导者'
  },
  {
    name: '孙悟空',
    role: '架构师｜PM',
    emoji: '🐵',
    color: '#fa8c16',
    description: '产品规划 + 架构设计'
  },
  {
    name: '猪八戒',
    role: '开发&测试',
    emoji: '🐷',
    color: '#f56a6a',
    description: '全栈开发 + 质量保障'
  },
  {
    name: '沙和尚',
    role: '运营',
    emoji: '🐴',
    color: '#13c2c2',
    description: '运维监控 + 数据管理'
  },
  {
    name: '白龙马',
    role: 'GTM',
    emoji: '🐴',
    color: '#52c41a',
    description: '市场增长 + 用户运营'
  }
]

// 打字机动画 Hook
function useTypewriter(text, speed = 100, startDelay = 500) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    let index = 0
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1))
          index++
        } else {
          setIsComplete(true)
          clearInterval(interval)
        }
      }, speed)
      return () => clearInterval(interval)
    }, startDelay)

    return () => clearTimeout(timeout)
  }, [text, speed, startDelay])

  return { displayedText, isComplete }
}

// 受保护的路由组件
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// 主页面组件
function HomePage() {
  const [greeting, setGreeting] = useState('')
  const [status, setStatus] = useState('loading')
  const [user, setUser] = useState(null)
  const { token } = theme.useToken()

  // 打字机动画
  const { displayedText, isComplete } = useTypewriter('Hello, World!', 150, 300)

  // 获取用户信息
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

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
      })
  }, [])

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    message.success('已退出登录')
  }

  // 用户菜单
  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout
    }
  ]

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        background: token.colorPrimary,
        padding: '0 24px'
      }}>
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          <RocketOutlined /> HelloWorld 应用
        </div>
        <Space>
          <Tag color="blue">v1.1.0</Tag>
          <Tag color="green">
            <CheckCircleOutlined /> 运行中
          </Tag>
          {user && (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Space style={{ color: 'white', cursor: 'pointer' }}>
                <Avatar size="small" icon={<UserOutlined />} />
                <Text style={{ color: 'white' }}>{user.username}</Text>
              </Space>
            </Dropdown>
          )}
        </Space>
      </Header>
      
      <Content style={{ padding: '48px 24px', background: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* 欢迎区域 */}
          <Card 
            style={{ marginBottom: '24px', textAlign: 'center' }}
            bordered={false}
            size="large"
          >
            <Title level={1} style={{ color: token.colorPrimary, minHeight: '60px' }}>
              {displayedText}
              <span style={{ 
                animation: 'blink 1s infinite',
                marginLeft: '2px'
              }}>|</span>
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
                  <div>v1.1.0 (登录功能)</div>
                </div>
              </div>
              <div>
                <CodeOutlined style={{ color: '#722ed1', fontSize: '24px' }} />
                <div style={{ marginTop: '8px' }}>
                  <Text type="secondary">技术栈</Text>
                  <div>React + Flask + JWT</div>
                </div>
              </div>
            </Space>
          </Card>

          {/* 团队成员列表 */}
          <Card 
            title={<><TeamOutlined /> 西游团队成员</>} 
            bordered={false}
            size="large"
            style={{ marginBottom: '24px' }}
          >
            <Row gutter={[24, 24]}>
              {teamMembers.map((member, index) => (
                <Col xs={24} sm={12} md={8} lg={4} key={index}>
                  <Card 
                    hoverable
                    style={{ textAlign: 'center', height: '100%' }}
                    onMouseEnter={() => message.info(`${member.name} - ${member.description}`)}
                  >
                    <div style={{ padding: '16px 0' }}>
                      <Avatar 
                        size={80} 
                        style={{ 
                          backgroundColor: member.color,
                          fontSize: '32px',
                          marginBottom: '16px'
                        }}
                      >
                        {member.emoji}
                      </Avatar>
                      <Title level={4} style={{ margin: '8px 0' }}>
                        {member.emoji} {member.name}
                      </Title>
                      <Tag color={member.color} style={{ marginBottom: '8px' }}>
                        {member.role}
                      </Tag>
                      <Paragraph 
                        style={{ 
                          fontSize: '13px', 
                          color: '#666',
                          margin: 0
                        }}
                      >
                        {member.description}
                      </Paragraph>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* 项目信息 */}
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Card title="技术栈" bordered={false}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Tag color="blue">后端</Tag>
                    <Text> Python + Flask + SQLAlchemy</Text>
                  </div>
                  <div>
                    <Tag color="cyan">前端</Tag>
                    <Text> React 18 + Ant Design 5.x</Text>
                  </div>
                  <div>
                    <Tag color="green">认证</Tag>
                    <Text> JWT + bcrypt</Text>
                  </div>
                  <div>
                    <Tag color="orange">数据库</Tag>
                    <Text> SQLite</Text>
                  </div>
                </Space>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="项目链接" bordered={false}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Button 
                    type="primary" 
                    href="https://github.com/Bert0000000000/helloworld"
                    target="_blank"
                    icon={<GlobalOutlined />}
                    block
                  >
                    GitHub 仓库
                  </Button>
                  <Button 
                    href="https://feishu.cn/docx/GLa3dIPXDoCNTKxxyibcYizBn6c"
                    target="_blank"
                    block
                  >
                    飞书文档
                  </Button>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* 测试按钮 */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button 
              type="primary" 
              size="large"
              onClick={() => message.success('🎉 功能正常！登录功能已集成！')}
              style={{ padding: '0 48px' }}
            >
              测试按钮 - 点击验证
            </Button>
          </div>
        </div>
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        HelloWorld 应用 ©2026 西游团队 | Created by <Text strong>🐷 猪八戒</Text>
      </Footer>

      {/* 打字机光标动画 */}
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </Layout>
  )
}

// 主应用组件
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
