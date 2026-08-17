import { useMemo } from 'react';
import type { StockMonthRevenueItem, UseRevenueSeriesResult } from '@/types/stock';

const DISPLAY_MONTH_COUNT = 60;

const getMonthKey = (item: StockMonthRevenueItem) =>
  `${item.revenue_year}-${String(item.revenue_month).padStart(2, '0')}`;

const getPreviousYearMonthKey = (monthKey: string) => {
  const [year, month] = monthKey.split('-');
  return `${Number(year) - 1}-${month}`;
};

export const useRevenueSeries = (
  stockMonthRevenue: StockMonthRevenueItem[] = []
): UseRevenueSeriesResult => {
  const series = useMemo(() => {
    const sortedData = [...stockMonthRevenue].sort((a, b) => {
      if (a.revenue_year !== b.revenue_year) {
        return a.revenue_year - b.revenue_year;
      }
      if (a.revenue_month !== b.revenue_month) {
        return a.revenue_month - b.revenue_month;
      }
      return a.date.localeCompare(b.date);
    });

    const monthRevenueMap = new Map<string, number>();
    sortedData.forEach((item) => {
      monthRevenueMap.set(getMonthKey(item), item.revenue);
    });

    return Array.from(monthRevenueMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-DISPLAY_MONTH_COUNT)
      .map(([monthKey, revenue]) => {
        const previousRevenue = monthRevenueMap.get(getPreviousYearMonthKey(monthKey));
        const yoy =
          previousRevenue === undefined || previousRevenue === 0
            ? null
            : ((revenue - previousRevenue) / previousRevenue) * 100;

        return {
          monthKey,
          revenue,
          yoy,
        };
      });
  }, [stockMonthRevenue]);

  return { series };
};
