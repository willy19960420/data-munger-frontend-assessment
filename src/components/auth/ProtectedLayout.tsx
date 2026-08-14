'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, usePathname } from 'next/navigation';
import { Spin } from 'antd';
import { refreshTokenService } from '@/services/authService';

const publicRoutes = ['/login'];

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { accessToken, refreshToken, hasHydrated, isTokenValid, logout } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const runAuthGuard = async () => {
      // 等待 Zustand persist 還原完成，避免刷新頁面時誤判為未登入
      if (!hasHydrated) {
        return;
      }

      const isPublicRoute = publicRoutes.includes(pathname);

      if (!accessToken) {
        if (isPublicRoute) {
          setIsLoading(false);
          return;
        }

        router.replace('/login');
        setIsLoading(false);
        return;
      }

      // token 有效，直接放行
      if (isTokenValid(30 * 1000)) {
        if (isPublicRoute) {
          router.replace('/');
          return;
        }

        setIsLoading(false);
        return;
      }

      // token 無效時，最多嘗試 refresh 一次
      try {
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        await refreshTokenService();

        if (isPublicRoute) {
          router.replace('/');
          return;
        }

        setIsLoading(false);
      } catch {
        logout();
        router.replace('/login');
        setIsLoading(false);
      }
    };

    runAuthGuard();
  }, [accessToken, refreshToken, hasHydrated, isTokenValid, logout, pathname, router]);

  if (isLoading) {
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
