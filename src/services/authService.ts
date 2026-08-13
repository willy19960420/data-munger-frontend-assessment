import api from './api';
import { useAuthStore } from '@/stores/authStore';
import type {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from '@/types/auth';
import { jwtDecode } from 'jwt-decode';

/**
 * 獲取token過期時間
 */
const getTokenExpires = (token: string): string | undefined => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    if (decoded?.exp) {
      // 將秒轉換為ISO字符串
      return new Date(decoded.exp * 1000).toISOString();
    }
  } catch (e) {
    console.error('Failed to decode token:', e);
  }
  return undefined;
};

// 登入
export const loginService = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', data);
  const { accessToken, refreshToken, tokenExpires, user } = response.data;

  // 如果後端沒有返回tokenExpires，嘗試從token decode
  const expiresTime = tokenExpires || getTokenExpires(accessToken);

  // 儲存到store
  useAuthStore.setState({
    accessToken,
    refreshToken,
    tokenExpires: expiresTime || null,
    user,
  });

  return response.data;
};

// 刷新token
export const refreshTokenService = async (): Promise<RefreshTokenResponse> => {
  const { refreshToken } = useAuthStore.getState();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
    refreshToken,
  });

  const { accessToken, refreshToken: newRefreshToken, tokenExpires } = response.data;

  // 如果後端沒有返回tokenExpires，嘗試從token decode
  const expiresTime = tokenExpires || getTokenExpires(accessToken);

  // 更新store中的tokens
  useAuthStore.setState({
    accessToken,
    refreshToken: newRefreshToken,
    tokenExpires: expiresTime || null,
  });

  return response.data;
};

// 登出
export const logoutService = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } finally {
    useAuthStore.setState({
      accessToken: null,
      refreshToken: null,
      tokenExpires: null,
      user: null,
    });
  }
};

// 獲取當前使用者資訊
export const getCurrentUserService = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
