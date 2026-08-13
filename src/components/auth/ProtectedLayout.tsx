'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { Spin } from 'antd';

const publicRoutes = ['/login'];

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 檢查是否在公開路由上
    const isPublicRoute = publicRoutes.includes(pathname);

    if (!isPublicRoute && !accessToken) {
      // 無token且不在公開路由，導向登入
      router.push('/login');
    } else if (isPublicRoute && accessToken) {
      // 已登入且在登入頁面，導向首頁
      router.push('/');
    } else {
      // 認證狀態正常
      setIsLoading(false);
    }
  }, [accessToken, pathname, router]);

  if (isLoading && !publicRoutes.includes(pathname)) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return <>{children}</>;
}
