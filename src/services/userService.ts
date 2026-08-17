import api from './api';
import type {
  StockInfoResponse,
  StockMonthRevenueParams,
  StockDetailResponse,
} from '@/types/stock';

export const UserService = {
  /**
   * 獲取User的詳細信息
   */
  async getUserList(params: StockMonthRevenueParams): Promise<StockDetailResponse> {
    try {
      const response = await api.get<StockDetailResponse>(
        '',
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default UserService;
