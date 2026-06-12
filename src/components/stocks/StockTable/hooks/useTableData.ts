import { useMemo } from 'react';
import type { StockMonthRevenueItem, StockTableColumn, StockTableRow, UseTableDataResult } from '@/types/stock';
import { useRevenueSeries } from '@/components/stocks/hooks/useRevenueSeries';

export const useTableData = (stockMonthRevenue: StockMonthRevenueItem[] = []): UseTableDataResult => {
	const { series } = useRevenueSeries(stockMonthRevenue);

	return useMemo(() => {
		const columns: StockTableColumn[] = [
			{
				title: '年度月份',
				dataIndex: 'name',
				key: 'name',
				fixed: 'left',
			},
			...series.map((item) => {
				return {
					title: item.monthKey.replace('-', ''),
					dataIndex: item.monthKey,
					key: item.monthKey,
				};
			}),
		];

		const revenueRow: StockTableRow = {
			key: 'revenue',
			name: '每月營收',
		};

		const yoyRow: StockTableRow = {
			key: 'yoy',
			name: '單月營收年增率 (%)',
		};

		series.forEach((item) => {
			revenueRow[item.monthKey] = item.revenue.toLocaleString('zh-TW', {
				maximumFractionDigits: 0,
			});

			if (item.yoy === null) {
				yoyRow[item.monthKey] = '-';
				return;
			}
			yoyRow[item.monthKey] = `${item.yoy.toFixed(2)}%`;
		});

		return {
			columns,
			dataSource: [revenueRow, yoyRow],
		};
	}, [series]);

};