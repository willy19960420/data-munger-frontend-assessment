import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/services/apiServices';


/**
 * 自定義 hook：獲取台灣股票資訊並去重
 */
export const useStockInfo = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['stockInfo'],
    queryFn: async () => {
      const response = await apiService.stock.getTaiwanStockInfo();
      if (response.msg !== 'success') {
        throw new Error(response.msg || 'Failed to fetch stock info');
      }
      return response.data;
    },
    select: (data) => {
      if (!data || !Array.isArray(data)) {
        return [];
      }
      const uniqueSet = new Set<string>();
      return data.filter((item) => {
        const key = `${item.stock_id}-${item.stock_name}`;
        if (uniqueSet.has(key)) {
          return false;
        }
        uniqueSet.add(key);
        return true;
      });
    },
    retry: 2,
  });

  const stockOptions = useMemo(() => {
    return (data || []).map((stock) => ({
      label: `${stock.stock_id} - ${stock.stock_name}`,
      value: stock.stock_id,
      data: stock,
      description: `${stock.type.toUpperCase()} | ${stock.industry_category}`,
    }));
  }, [data]);


  return { 
    data, 
    isLoading, 
    error,
    
    stockOptions,
  };
};
