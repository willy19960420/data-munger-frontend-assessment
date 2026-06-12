'use client';

import { memo } from 'react';
import type { StockItem } from '@/types/stock';

interface StockChartProps {
  stock: StockItem;
}

export const StockChart = memo(({ stock }: StockChartProps) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <h3>圖表（股票 ID: {stock.stock_id}）</h3>
      <div
        style={{
          border: '1px solid #ddd',
          padding: '20px',
          height: '300px',
          backgroundColor: '#f9f9f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
        }}
      >
        圖表元件（待實作）
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // 自定義比較：股票代碼相同則不重新渲染
  return prevProps.stock.stock_id === nextProps.stock.stock_id;
});

StockChart.displayName = 'StockChart';
