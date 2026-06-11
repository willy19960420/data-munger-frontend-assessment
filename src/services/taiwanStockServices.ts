import api from './api';
import type { StockInfoResponse } from '@/types/stock';

/**
 * 獲取台灣股票信息
 */
export async function getTaiwanStockInfo(): Promise<StockInfoResponse> {
  try {
    const response = await api.get<StockInfoResponse>(
      'https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockInfo'
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Taiwan stock info:', error);
    throw error;
  }
}

/**
 * 獲取特定股票的詳細信息
 */
export async function getStockDetailData(
  params: Record<string, string | number>
): Promise<StockInfoResponse> {
  try {
    const response = await api.get<StockInfoResponse>(
      'https://api.finmindtrade.com/api/v4/data',
      { params }
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch stock data:', error);
    throw error;
  }
}
