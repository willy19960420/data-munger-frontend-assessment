'use client';

import { memo, useMemo, useState } from 'react';
import { Button, Flex, theme } from 'antd';
import type { StockMonthRevenueItem } from '@/types/stock';
import { useRevenueSeries } from '@/components/Stocks/hooks/useRevenueSeries';
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Line,
} from 'recharts';

interface StockChartProps {
  stockMonthRevenue?: StockMonthRevenueItem[];
}

const formatRevenue = (value: number) =>
  value.toLocaleString('zh-TW', { maximumFractionDigits: 0 });

const formatYoy = (value: number | null) => (value === null ? '-' : `${value.toFixed(2)}%`);

const PILL_STYLE: React.CSSProperties = {
  borderRadius: '3px',
  padding: '8px 16px',
  fontSize: '13px',
  fontWeight: 600,
  lineHeight: 1,
};

export const StockChart = memo(
  ({ stockMonthRevenue = [] }: StockChartProps) => {
    const { token } = theme.useToken();
    const { series } = useRevenueSeries(stockMonthRevenue);
    const [showRevenue, setShowRevenue] = useState(true);
    const [showYoy, setShowYoy] = useState(true);

    const chartData = useMemo(
      () =>
        series.map((item) => ({
          month: item.monthKey,
          revenue: item.revenue,
          yoy: item.yoy,
        })),
      [series]
    );

    const leftAxisDomain = useMemo<[number, number]>(() => {
      if (chartData.length === 0) {
        return [0, 100];
      }

      const maxRevenue = Math.max(...chartData.map((item) => item.revenue));
      return [0, Math.ceil(maxRevenue * 1.1)];
    }, [chartData]);

    const rightAxisDomain = useMemo<[number, number]>(() => {
      const yoyValues = chartData
        .map((item) => item.yoy)
        .filter((value): value is number => typeof value === 'number');

      if (yoyValues.length === 0) {
        return [0, 10];
      }

      const min = Math.min(...yoyValues);
      const max = Math.max(...yoyValues);
      const padding = Math.max((max - min) * 0.08, 0.5);
      return [Math.floor(min - padding), Math.ceil(max + padding)];
    }, [chartData]);

    return (
      <div style={{ marginTop: '20px' }}>
        <Flex align="center" justify="space-between" style={{ marginBottom: '10px' }}>
          <Button type="primary" style={PILL_STYLE}>
            每月營收
          </Button>

          <Flex align="center" gap={12}>
            <Flex
              align="center"
              gap={6}
              style={{ cursor: 'pointer', opacity: showRevenue ? 1 : 0.45 }}
              onClick={() => setShowRevenue((prev) => !prev)}
            >
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  background: '#f1c232',
                  display: 'inline-block',
                }}
              />
              <span style={{ color: token.colorTextSecondary }}>每月營收</span>
            </Flex>

            <Flex
              align="center"
              gap={6}
              style={{ cursor: 'pointer', opacity: showYoy ? 1 : 0.45 }}
              onClick={() => setShowYoy((prev) => !prev)}
            >
              <span
                style={{
                  width: '10px',
                  height: '2px',
                  background: '#d9534f',
                  display: 'inline-block',
                }}
              />
              <span style={{ color: token.colorTextSecondary }}>單月營收年增率 (%)</span>
            </Flex>
          </Flex>

          <Button type="primary" style={PILL_STYLE}>
            近 5 年
          </Button>
        </Flex>

        <div
          style={{
            width: '100%',
            height: '450px',
            position: 'relative',
            border: `1px solid ${token.colorBorder}`,
            borderRadius: '6px',
            padding: '10px 8px 2px',
            background: 'transparent',
            display: 'flex',
            minWidth: 0,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '8px',
              left: '42px',
              fontSize: '12px',
              color: token.colorTextSecondary,
              pointerEvents: 'none',
            }}
          >
            千元
          </div>
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '14px',
              fontSize: '12px',
              color: token.colorTextSecondary,
              pointerEvents: 'none',
            }}
          >
            %
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <ResponsiveContainer width="100%" height={420}>
              <ComposedChart data={chartData} margin={{ top: 26, right: 30, left: 18, bottom: 10 }}>
                <CartesianGrid stroke={token.colorBorder} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickFormatter={(value: string) => value.slice(0, 4)}
                  interval={11}
                  minTickGap={24}
                  tick={{ fill: token.colorTextSecondary, fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value: number) => formatRevenue(value)}
                  width={102}
                  domain={leftAxisDomain}
                  tick={{ fill: token.colorTextSecondary, fontSize: 12 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value: number) => `${value.toFixed(0)}%`}
                  width={62}
                  domain={rightAxisDomain}
                  tick={{ fill: token.colorTextSecondary, fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const numericValue = typeof value === 'number' ? value : null;

                    if (name === '每月營收') {
                      return [formatRevenue(numericValue ?? 0), '每月營收'];
                    }

                    return [formatYoy(numericValue), '單月營收年增率 (%)'];
                  }}
                  labelFormatter={(label) => `月份：${label}`}
                  contentStyle={{
                    backgroundColor: token.colorBgElevated,
                    border: `1px solid ${token.colorBorder}`,
                    color: token.colorText,
                    borderRadius: '4px',
                  }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  name="每月營收"
                  fill="#f1c232"
                  barSize={8}
                  hide={!showRevenue}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="yoy"
                  name="單月營收年增率 (%)"
                  stroke="#d9534f"
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                  isAnimationActive={false}
                  hide={!showYoy}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.stockMonthRevenue === nextProps.stockMonthRevenue;
  }
);

StockChart.displayName = 'StockChart';
