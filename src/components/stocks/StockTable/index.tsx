'use client';

import { useEffect, useRef } from 'react';
import { Table, Button } from 'antd';
import type { StockMonthRevenueItem } from '@/types/stock';
import { useTableData } from './hooks/useTableData';

interface StockTableProps {
  stockMonthRevenue?: StockMonthRevenueItem[];
}

export const StockTable = ({
  stockMonthRevenue = [],
}: StockTableProps) => {
  const { columns, dataSource } = useTableData(stockMonthRevenue);
  const tableWrapperRef = useRef<HTMLDivElement>(null);
  const hasAutoScrolledRef = useRef(false);
  const latestColumnKey = String(columns[columns.length - 1]?.key ?? '');

  useEffect(() => {
    hasAutoScrolledRef.current = false;
  }, [latestColumnKey]);

  useEffect(() => {
    if (hasAutoScrolledRef.current) {
      return;
    }

    if (columns.length <= 1) {
      return;
    }

    const tableWrapper = tableWrapperRef.current;
    if (!tableWrapper) {
      return;
    }

    const getScrollContainer = () =>
      tableWrapper.querySelector<HTMLDivElement>('.ant-table-content') ||
      tableWrapper.querySelector<HTMLDivElement>('.ant-table-body');

    let rafId = 0;
    let nestedRafId = 0;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    rafId = requestAnimationFrame(() => {
      nestedRafId = requestAnimationFrame(() => {
        const scrollContainer = getScrollContainer();
        if (!scrollContainer) {
          return;
        }

        scrollContainer.scrollLeft = scrollContainer.scrollWidth;
        hasAutoScrolledRef.current = true;

        // Retry once after paint in case table width is still expanding.
        timeoutId = setTimeout(() => {
          const retryContainer = getScrollContainer();
          if (!retryContainer) {
            return;
          }
          retryContainer.scrollLeft = retryContainer.scrollWidth;
        }, 0);
      });
    });

    return () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (nestedRafId) {
        cancelAnimationFrame(nestedRafId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [columns.length]);

  return (
    <div ref={tableWrapperRef} style={{ marginTop: '20px' }}>
      <Button type="primary"
        style={{ 
          marginBottom: '16px', 
          padding: '10px 16px',
          cursor: 'default',
        }}
      >詳細數據</Button>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        pagination={false}
        scroll={{ x: 'max-content' }}
        size="small"
      />
    </div>
  );
};

StockTable.displayName = 'StockTable';