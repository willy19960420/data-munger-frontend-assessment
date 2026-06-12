import { useState } from 'react';
import type { StockItem, StockMonthRevenueParams, StockMonthRevenueItem } from '@/types/stock';
import { useQuery } from '@tanstack/react-query';
import StockServices from '@/services/stockServices';
import dayjs from 'dayjs';

/**
 * 自定義 hook：獲取股票詳細數據（時間序列 K 線數據）
 */
export const useStockMonthRevenueData = () => {
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);

  const { data:stockMonthRevenue, isLoading, error, refetch } = useQuery({
    queryKey: ['stockDetail', selectedStock?.stock_id],
    queryFn: async () => {
      const params: StockMonthRevenueParams = {
        data_id: selectedStock?.stock_id ?? '',
        start_date: dayjs().subtract(6, 'year').startOf('month').format('YYYY-MM-DD'),
      };

      const response = await StockServices.getStockMonthRevenue(params);

      if (response.msg !== 'success') {
        throw new Error(response.msg || 'Failed to fetch stock detail');
      }

      return response.data;
    },
    enabled: selectedStock !== null && !!selectedStock.stock_id,
  });

  return {
    selectedStock,
    setSelectedStock,
    stockMonthRevenue: (stockMonthRevenue || []) as StockMonthRevenueItem[],
    isLoading,
    error: error as Error | null,
    isEmpty: !stockMonthRevenue || stockMonthRevenue.length === 0,
    refetch,
  };
};
