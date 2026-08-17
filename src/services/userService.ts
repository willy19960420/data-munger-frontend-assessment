import api from './api';

import type {
	GetUserListResponse,
	UserListRequest,
} from '@/types/user';

const defaultPath = 'https://lbbj5pioquwxdexqmcnwaxrpce0lcoqx.lambda-url.ap-southeast-1.on.aws';

export const UserService = {
  /**
   * 獲取User的詳細信息
   */
  async getUserList(params: UserListRequest): Promise<GetUserListResponse> {
    try {
      const response = await api.get<GetUserListResponse>(
        `${defaultPath}/api/users`,
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default UserService;