import api from './api';
import { useAuthStore } from '@/stores/authStore';
import type { LoginRequest, LoginResponse, RefreshTokenResponse } from '@/types/auth';
import { jwtDecode } from 'jwt-decode';

const LOGIN_API_URL =
  'https://lbbj5pioquwxdexqmcnwaxrpce0lcoqx.lambda-url.ap-southeast-1.on.aws/';

type ApiLoginSuccessResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: {
    username: string;
    role: string;
  };
};

type ApiErrorResponse = {
  message?: string;
  code?: number;
};

const toApiErrorMessage = (error: any): string => {
  const payload = error?.response?.data as ApiErrorResponse | undefined;
  const message = payload?.message || error?.message || '登入失敗';

  // 依需求：code 只有 415 會有，存在時帶上方便前端顯示/除錯
  if (payload?.code) {
    return `${message} (code: ${payload.code})`;
  }

  return message;
};

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
  let response;

  try {
    response = await api.post<ApiLoginSuccessResponse>(`${LOGIN_API_URL}/auth/refresh`, data);
  } catch (error: any) {
    throw new Error(toApiErrorMessage(error));
  }

  const { access_token, refresh_token, expires_in, user } = response.data;

  const tokenExpires = new Date(Date.now() + expires_in * 1000).toISOString();
  const normalizedResponse: LoginResponse = {
    accessToken: access_token,
    refreshToken: refresh_token,
    tokenExpires,
    user,
  };

  // 如果後端沒有返回tokenExpires，嘗試從token decode
  const expiresTime =
    normalizedResponse.tokenExpires || getTokenExpires(normalizedResponse.accessToken);

  // 儲存到store
  useAuthStore.setState({
    accessToken: normalizedResponse.accessToken,
    refreshToken: normalizedResponse.refreshToken,
    tokenExpires: expiresTime || null,
    user: normalizedResponse.user,
  });

  return normalizedResponse;
};

// 刷新token
export const refreshTokenService = async (): Promise<RefreshTokenResponse> => {
  const { refreshToken } = useAuthStore.getState();

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await api.post(`${LOGIN_API_URL}/auth/refresh`, {
    refreshToken,
  });

  const data = response.data as
    | RefreshTokenResponse
    | {
        access_token?: string;
        refresh_token?: string;
        expires_in?: number;
      };

  const accessToken = 'accessToken' in data ? data.accessToken : data.access_token;
  const newRefreshToken = 'refreshToken' in data ? data.refreshToken : data.refresh_token;
  const expiresIn = 'expires_in' in data ? data.expires_in : undefined;
  const tokenExpires =
    'tokenExpires' in data
      ? data.tokenExpires
      : expiresIn
        ? new Date(Date.now() + expiresIn * 1000).toISOString()
        : undefined;

  if (!accessToken || !newRefreshToken) {
    throw new Error('Invalid refresh token response');
  }

  // 如果後端沒有返回tokenExpires，嘗試從token decode
  const expiresTime = tokenExpires || getTokenExpires(accessToken);

  // 更新store中的tokens
  useAuthStore.setState({
    accessToken,
    refreshToken: newRefreshToken,
    tokenExpires: expiresTime || null,
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    tokenExpires,
  };
};

// 登出
export const logoutService = async (): Promise<void> => {
  useAuthStore.setState({
    accessToken: null,
    refreshToken: null,
    tokenExpires: null,
    user: null,
  });
};

// 獲取使用者列表
export const getUserListService = async () => {
  const response = await api.get('/api/users');
  return response.data;
};
