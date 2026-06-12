import { useState } from 'react';
import type { StockItem } from '@/types/stock';
import { useQuery } from '@tanstack/react-query';
import StockServices from '@/services/stockServices';
import dayjs from 'dayjs';

interface StockDetailParams {
  stock_id: string;
  start_date?: string;
  end_date?: string;
  dataset?: string;
}

interface StockPriceData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/**
 * 自定義 hook：獲取股票詳細數據（時間序列 K 線數據）
 */
export const useStockDetailData = () => {

  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['stockDetail', selectedStock?.stock_id],
    queryFn: async () => {
      const response = await StockServices.getStockDetailData({
        dataset: 'TaiwanStockMonthRevenue',
        data_id: selectedStock?.stock_id ?? '',
        start_date: dayjs().subtract(5, 'year').startOf('month').format('YYYY-MM-DD'),
      });

      if (response.msg !== 'success') {
        throw new Error(response.msg || 'Failed to fetch stock detail');
      }

      return (response.data as any[]) || [];
    },
    enabled: selectedStock !== null && !!selectedStock.stock_id,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 分鐘快取
  });

  

  return {
    selectedStock,
    setSelectedStock,

    data,
    rawData: data,
    isLoading,
    error: error as Error | null,
    isEmpty: !data || data.length === 0,
    refetch,
  };
};
