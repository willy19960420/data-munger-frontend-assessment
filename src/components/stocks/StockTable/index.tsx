'use client';

import { memo } from 'react';
import { Table } from 'antd';
import type { TableColumnsType } from 'antd';
import type { StockMonthRevenueItem } from '@/types/stock';

interface StockTableProps {
  stockMonthRevenue?: StockMonthRevenueItem[];
}

export const StockTable = memo(
  ({ stockMonthRevenue = [] }: StockTableProps) => {
    const columns: TableColumnsType<StockMonthRevenueItem> = [
      {
        title: '年度月份',
        dataIndex: 'date',
        key: 'date',
        fixed: 'left',
        render: (text) => {
          const date = new Date(text);
          return `${date.getFullYear()}-${String(date.getMonth() + 1)}`;
        },
      },
      {
        title: '每月營收',
        dataIndex: 'revenue',
        key: 'revenue',
      }
    ];

    return (
      <div style={{ marginTop: '20px' }}>
        <h3>價格數據</h3>
        {/* <Table
          columns={columns}
          dataSource={stockMonthRevenue}
          rowKey="date"
          pagination={{
            pageSize: 10,
            total: stockMonthRevenue.length,
            showSizeChanger: true,
            showQuickJumper: true,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          scroll={{ x: 600 }}
          size="small"
        /> */}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.stockMonthRevenue?.length === nextProps.stockMonthRevenue?.length
    );
  }
);

StockTable.displayName = 'StockTable';
