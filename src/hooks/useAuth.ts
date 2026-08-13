'use client';

import { useAuthStore } from '@/stores/authStore';
import { loginService, logoutService } from '@/services/authService';
import type { LoginRequest } from '@/types/auth';

export const useAuth = () => {
  const { accessToken, user, isLoading, setLoading, setError, logout, clearError } = useAuthStore();

  const login = async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      clearError();
      await loginService(credentials);
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || '登入失敗';
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await logoutService();
      logout();
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || '登出失敗';
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!accessToken && !!user;

  return {
    accessToken,
    user,
    isLoading,
    isAuthenticated,
    login,
    logout: signOut,
    clearError,
  };
};
