'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Layout, Menu, Button, Typography, message } from 'antd';
import type { MenuProps } from 'antd';
import { AppstoreOutlined, TeamOutlined, LogoutOutlined } from '@ant-design/icons';
import { ToggleTheme } from '@/components/toggleTheme';
import { logoutService } from '@/services/authService';

const { Header, Content } = Layout;

const menuItems: MenuProps['items'] = [
  {
    key: '/cms/stock',
    icon: <AppstoreOutlined />,
    label: 'Stock',
  },
  {
    key: '/cms/userList',
    icon: <TeamOutlined />,
    label: 'User List',
  },
];

export default function CmsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const selectedKey = useMemo(() => {
    if (pathname.startsWith('/cms/userList')) {
      return '/cms/userList';
    }
    return '/cms/stock';
  }, [pathname]);

  const onMenuClick: MenuProps['onClick'] = ({ key }) => {
    router.push(key);
  };

  const onLogout = async () => {
    await logoutService();
    messageApi.success('已登出');
    router.replace('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {contextHolder}
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          paddingInline: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
          <Typography.Text style={{ color: '#fff', fontWeight: 600 }}>CMS</Typography.Text>
          <Menu
            mode="horizontal"
            theme="dark"
            selectedKeys={[selectedKey]}
            items={menuItems}
            onClick={onMenuClick}
            style={{ minWidth: 280, borderBottom: 0 }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ToggleTheme />
          <Button icon={<LogoutOutlined />} onClick={onLogout}>
            登出
          </Button>
        </div>
      </Header>

      <Content style={{ padding: 24 }}>{children}</Content>
    </Layout>
  );
}
