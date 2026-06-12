'use client';

import { memo } from 'react';
import type { StockItem } from '@/types/stock';

interface StockTableProps {
  stock: StockItem;
}

export const StockTable = memo(({ stock }: StockTableProps) => {
  return (
    <div style={{ marginTop: '20px' }}>
      <h3>股票詳細信息</h3>
      <table style={{ border: '1px solid #ddd', borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>股票代碼</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{stock.stock_id}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>股票名稱</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{stock.stock_name}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>產業類別</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{stock.industry_category}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>交易所類型</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{stock.type.toUpperCase()}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>日期</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{stock.date}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}, (prevProps, nextProps) => {
  // 自定義比較：股票代碼相同則不重新渲染
  return prevProps.stock.stock_id === nextProps.stock.stock_id;
});

StockTable.displayName = 'StockTable';
