import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';
import { refreshTokenService } from './authService';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 用來追蹤是否正在刷新token
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// 請求攔截器 - 檢查token有效性並加入Authorization
api.interceptors.request.use(
  async (config) => {
    const { accessToken, isTokenValid, getRemainingTime } = useAuthStore.getState();

    // 如果沒有token，直接通過
    if (!accessToken) {
      return config;
    }

    // 檢查token是否有效（30秒緩衝）
    if (!isTokenValid(30 * 1000)) {
      // Token無效或即將過期，嘗試刷新
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { accessToken: newToken } = await refreshTokenService();
          processQueue(null, newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (err) {
          processQueue(err, null);
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else {
        // 正在刷新中，加入隊列等待
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              config.headers.Authorization = `Bearer ${token}`;
              resolve(config);
            },
            reject,
          });
        });
      }
    } else {
      // Token有效，加入header
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 響應攔截器 - 處理401錯誤（以防萬一）
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 如果不是401或已經重試過，直接拋出錯誤
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // 標記為已重試
    originalRequest._retry = true;

    // 如果正在刷新token
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    // 開始刷新token
    isRefreshing = true;

    try {
      const { accessToken } = await refreshTokenService();
      processQueue(null, accessToken);

      // 用新token重試原始請求
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);

      // token刷新失敗，登出使用者
      useAuthStore.setState({
        accessToken: null,
        refreshToken: null,
        tokenExpires: null,
        user: null,
      });

      // 導向登入頁
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
