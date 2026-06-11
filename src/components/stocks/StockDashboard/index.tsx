'use client'

import type { StockInfoResponse } from '@/types/stock';

interface StockDashboardProps {
  stockData: StockInfoResponse | null;
  error: string | null;
}

export const StockDashboard = () => {
  return (
    <div>
      <h1>Stock Dashboard</h1>
    </div>
  );
}
