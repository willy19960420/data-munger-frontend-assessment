// src/services/api.ts
// 保留攔截器結構  未來擴增驗證需求方便
import axios from 'axios';

const token = process.env.NEXT_PUBLIC_TOKEN || '';

const api = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器 - 加入 Authorization
api.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 響應攔截器
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
