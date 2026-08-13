// 認證相關的所有type定義

/**
 * 使用者資訊型別
 */
export interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * 登入請求
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 登入響應
 */
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenExpires?: string; // ISO string，token過期時間（可選）
  user: User;
}

/**
 * 刷新Token請求
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * 刷新Token響應
 */
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  tokenExpires?: string; // ISO string，token過期時間（可選）
}

/**
 * 認證狀態 (Zustand Store)
 */
export interface AuthState {
  // State
  accessToken: string | null;
  refreshToken: string | null;
  tokenExpires: string | null; // ISO string，token過期時間
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setTokens: (accessToken: string, refreshToken: string, tokenExpires?: string) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
  clearError: () => void;

  // Token檢查方法
  isTokenValid: (bufferTime?: number) => boolean;
  getRemainingTime: () => number;
}

/**
 * 認證Context (如果後續使用Context API)
 */
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
  error: string | null;
  clearError: () => void;
}
