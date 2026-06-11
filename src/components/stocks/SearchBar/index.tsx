'use client'

import type { StockInfoResponse } from '@/types/stock';

interface StockDashboardProps {
  stockData: StockInfoResponse | null;
  error: string | null;
}

export const SearchBar = () => {
  return (
    <div>
      <h1>Stock Bar</h1>
    </div>
  );
}
