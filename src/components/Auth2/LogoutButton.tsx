'use client';

import { useAuthStore } from '@/stores/authStore';
import { logoutService } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { Button, message } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

export function LogoutButton() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [messageApi, contextHolder] = message.useMessage();

  const handleLogout = async () => {
    try {
      await logoutService();
      logout();
      messageApi.success('登出成功');
      router.push('/login');
    } catch (err: any) {
      messageApi.error(err.message || '登出失敗');
    }
  };

  return (
    <>
      {contextHolder}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>{user?.username}</span>
        <Button type="primary" danger icon={<LogoutOutlined />} onClick={handleLogout}>
          登出
        </Button>
      </div>
    </>
  );
}
