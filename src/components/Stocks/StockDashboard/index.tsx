'use client';

import { SearchBar } from '@/components/Stocks/SearchBar';
import { StockTable } from '@/components/Stocks/StockTable';
import { StockChart } from '@/components/Stocks/StockChart';

import { useStockMonthRevenueData } from './hooks/useStockMonthRevenueData';
import { Divider, Spin, Empty, Button, Typography } from 'antd';

const { Title, Text } = Typography;

export const StockDashboard = () => {
  const { selectedStock, setSelectedStock, stockMonthRevenue, isLoading, isEmpty, error, refetch } =
    useStockMonthRevenueData();

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Empty description={'載入失敗，請稍後重試'} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        <Button type="primary" onClick={() => refetch()}>
          重試
        </Button>
      </div>
    );
  }

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
          <h1 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '600' }}>台灣股票查詢</h1>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.65 }}>搜尋並查看股票資訊</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <SearchBar onSelect={setSelectedStock} />
        <Divider />

        {isLoading ? (
          <Spin size="large" fullscreen />
        ) : isEmpty ? (
          <div style={{ padding: '40px 0', textAlign: 'center' }}>
            <Empty
              description={selectedStock ? '沒有找到相關數據' : '請先搜尋並選擇一支股票'}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '8px' }}>
              <Title level={4} style={{ margin: 0, display: 'inline' }}>
                {selectedStock?.stock_name}
              </Title>
              <Text type="secondary" style={{ marginLeft: '8px', fontSize: '16px' }}>
                ({selectedStock?.stock_id})
              </Text>
            </div>
            <StockChart stockMonthRevenue={stockMonthRevenue} />
            <StockTable stockMonthRevenue={stockMonthRevenue} />
          </>
        )}
      </div>
    </div>
  );
};
