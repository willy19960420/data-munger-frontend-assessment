import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import type { AuthState, User } from '@/types/auth';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      tokenExpires: null, // ISO string
      user: null,
      hasHydrated: false,
      isLoading: false,
      error: null,

      setTokens: (accessToken, refreshToken, tokenExpires?: string) => {
        set({
          accessToken,
          refreshToken,
          tokenExpires: tokenExpires || null,
        });
      },

      setUser: (user: User | null) => set({ user }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      setHasHydrated: (hasHydrated) => set({ hasHydrated }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          tokenExpires: null,
          user: null,
          error: null,
        }),

      clearError: () => set({ error: null }),

      /**
       * 檢查token是否有效
       * @param bufferTime 緩衝時間（毫秒），預設30秒
       */
      isTokenValid: (bufferTime = 30 * 1000) => {
        const { accessToken, tokenExpires } = get();

        if (!accessToken) {
          return false;
        }

        // 如果有存儲的過期時間，直接使用
        if (tokenExpires) {
          const expiresTime = new Date(tokenExpires).getTime();
          const now = Date.now();
          return expiresTime > now + bufferTime;
        }

        // 否則嘗試decode JWT
        try {
          const decoded = jwtDecode<{ exp: number }>(accessToken);

          if (!decoded?.exp) {
            return false;
          }

          const expiresTime = decoded.exp * 1000; // 將秒轉換為毫秒
          const now = Date.now();

          return expiresTime > now + bufferTime;
        } catch (e) {
          console.error('Failed to decode token:', e);
          return false;
        }
      },

      /**
       * 獲取剩餘時間（毫秒）
       */
      getRemainingTime: () => {
        const { accessToken, tokenExpires } = get();

        if (!accessToken) {
          return 0;
        }

        if (tokenExpires) {
          const expiresTime = new Date(tokenExpires).getTime();
          return Math.max(0, expiresTime - Date.now());
        }

        try {
          const decoded = jwtDecode<{ exp: number }>(accessToken);
          if (!decoded?.exp) {
            return 0;
          }

          const expiresTime = decoded.exp * 1000;
          return Math.max(0, expiresTime - Date.now());
        } catch (e) {
          return 0;
        }
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      // 只持久化token和user，不持久化loading和error
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenExpires: state.tokenExpires,
        user: state.user,
      }),
    }
  )
);
