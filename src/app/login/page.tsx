'use client';

import { useRouter } from 'next/navigation';
import { Form, Flex, Input, Button, message, Typography, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { loginService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import type { LoginRequest } from '@/types/auth';
import { ToggleTheme } from '@/components/ToggleTheme';

const { Title } = Typography;

export default function LoginPage() {
  const [form] = Form.useForm();
  const router = useRouter();
  const { isLoading, setLoading, setError } = useAuthStore();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);
      await loginService(values);
      messageApi.success('登入成功');
      setTimeout(() => router.push('/cms/stock'), 500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || '登入失敗';
      setError(errorMsg);
      messageApi.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {/* 主題切換按鈕 */}
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
          <ToggleTheme />
        </div>

        <Flex
          style={{
            minHeight: '100vh',
          }}
        >
          {/* 左側品牌 */}
          <Flex
            vertical
            align="center"
            justify="center"
            style={{
              flex: 1,
            }}
          >
            <Title level={1} style={{ marginBottom: 8 }}>
              A simple content management
              <br />
              system for the web.
            </Title>

            <Typography.Text type="secondary">Built with React & Ant Design</Typography.Text>
          </Flex>

          {/* 右側登入 */}
          <Flex
            align="center"
            justify="center"
            style={{
              width: 480,
              padding: 24,
            }}
          >
            <Card style={{ width: '100%' }}>
              <Title level={3} style={{ marginBottom: 8 }}>
                登入
              </Title>

              <Typography.Text type="secondary">請輸入您的帳號資訊</Typography.Text>

              <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
                size="large"
                style={{ marginTop: 32 }}
              >
                <Form.Item
                  label="帳號"
                  name="username"
                  rules={[{ required: true, message: '請輸入帳號' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="請輸入帳號" />
                </Form.Item>

                <Form.Item
                  label="密碼"
                  name="password"
                  rules={[{ required: true, message: '請輸入密碼' }]}
                >
                  <Input.Password prefix={<LockOutlined />} placeholder="請輸入密碼" />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0 }}>
                  <Button type="primary" htmlType="submit" block loading={isLoading}>
                    登入
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Flex>
        </Flex>
      </div>
    </>
  );
}
