import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, message, Typography, Divider, Space } from 'antd'
import { UserOutlined, LockOutlined, LoginOutlined, RocketOutlined } from '@ant-design/icons'

const { Title, Text, Link } = Typography

/**
 * 登录页面组件
 * 功能：
 * - 用户名/邮箱 + 密码登录
 * - 表单验证
 * - 错误处理
 * - 登录状态保持（localStorage）
 */
function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // 处理登录
  const onFinish = async (values) => {
    setLoading(true)
    
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })
      
      const data = await response.json()
      
      if (data.code === 200) {
        // 保存 token 到 localStorage
        localStorage.setItem('token', data.data.token)
        localStorage.setItem('user', JSON.stringify(data.data.user))
        
        message.success('🎉 登录成功！')
        
        // 延迟跳转到首页
        setTimeout(() => {
          navigate('/')
        }, 500)
      } else {
        message.error(data.message || '登录失败')
      }
    } catch (error) {
      console.error('登录请求失败:', error)
      message.error('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <Card
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
        bordered={false}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <RocketOutlined style={{ fontSize: '48px', color: '#667eea', marginBottom: '16px' }} />
          <Title level={2} style={{ margin: 0 }}>HelloWorld</Title>
          <Text type="secondary">用户登录</Text>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          size="large"
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '请输入用户名或邮箱' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名 / 邮箱"
              autoComplete="username"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度至少 6 位' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              autoComplete="current-password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<LoginOutlined />}
              size="large"
              block
              style={{ height: '48px', fontSize: '16px' }}
            >
              {loading ? '登录中...' : '登 录'}
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: '24px 0' }}>
          <Text type="secondary">其他选项</Text>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Space split={<Divider type="vertical" />}>
            <Link href="#" onClick={(e) => {
              e.preventDefault()
              message.info('注册功能开发中...')
            }}>
              注册账号
            </Link>
            <Link href="#" onClick={(e) => {
              e.preventDefault()
              message.info('找回密码功能开发中...')
            }}>
              忘记密码
            </Link>
          </Space>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            演示账号：admin / 123456
          </Text>
        </div>
      </Card>
    </div>
  )
}

export default Login
