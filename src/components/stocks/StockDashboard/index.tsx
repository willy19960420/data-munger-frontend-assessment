'use client';

import { SearchBar } from '@/components/stocks/SearchBar';
import { StockTable } from '@/components/stocks/StockTable';
import { StockChart } from '@/components/stocks/StockChart';
import { ToggleTheme } from '@/components/toggleTheme';

import { useStockDetailData } from './hooks/useStockDetailData';
import { Divider } from 'antd';

export const StockDashboard = () => {

  const { selectedStock, setSelectedStock, data, isLoading, error } = useStockDetailData();

  return (
    <div style={{ minHeight: '100vh', padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
        }}
      >
        <div>
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '600' }}>
            台灣股票查詢
          </h1>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.65 }}>
            搜尋並查看股票資訊
          </p>
        </div>
        <ToggleTheme />
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <SearchBar onSelect={setSelectedStock} />
        <Divider />


        {/* {selectedStock && (
          <div style={{ marginTop: '30px' }}>
            <h2>{selectedStock.stock_name} ({selectedStock.stock_id})</h2>
            <StockTable stock={selectedStock} />
            <StockChart stock={selectedStock} />
          </div>
        )} */}
      </div>
    </div>
  );
};
