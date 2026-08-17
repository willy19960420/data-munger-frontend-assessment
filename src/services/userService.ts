import api from './api';

import type {
	GetUserListResponse,
	UserListRequest,
} from '@/types/user';
import { USER_LOGIN_API_URL } from './constants';

export const UserService = {
  /**
   * 獲取User的詳細信息
   */
  async getUserList(params: UserListRequest): Promise<GetUserListResponse> {
    try {
      const response = await api.get<GetUserListResponse>(
        `${USER_LOGIN_API_URL}/api/users`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default UserService;