import api from './api';
import type { StockInfoResponse, StockDetailParams, StockDetailResponse } from '@/types/stock';

export const StockServices = {
  /**
   * 獲取台灣股票信息
   */
  async getTaiwanStockInfo(): Promise<StockInfoResponse> {
    try {
      const response = await api.get<StockInfoResponse>(
        'https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockInfo'
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch Taiwan stock info:', error);
      throw error;
    }
  },

  /**
   * 獲取特定股票的詳細信息
   */
  async getStockDetailData(params: StockDetailParams): Promise<StockDetailResponse> {
    try {
      const response = await api.get<StockDetailResponse>(
        'https://api.finmindtrade.com/api/v4/data',
        { params }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default StockServices;
