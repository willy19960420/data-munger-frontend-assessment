import { useMemo } from 'react';
import type { StockMonthRevenueItem, StockTableColumn, StockTableRow, UseTableDataResult } from '@/types/stock';

const getMonthKey = (item: StockMonthRevenueItem) => `${item.revenue_year}-${String(item.revenue_month).padStart(2, '0')}`;
const DISPLAY_MONTH_COUNT = 60;

const getPreviousYearMonthKey = (monthKey: string) => {
	const [year, month] = monthKey.split('-');
	return `${Number(year) - 1}-${month}`;
};

export const useTableData = (stockMonthRevenue: StockMonthRevenueItem[] = []): UseTableDataResult => {
	return useMemo(() => {
		const sortedData = [...stockMonthRevenue].sort((a, b) => {
			if (a.revenue_year !== b.revenue_year) {
				return a.revenue_year - b.revenue_year;
			}
			if (a.revenue_month !== b.revenue_month) {
				return a.revenue_month - b.revenue_month;
			}
			return a.date.localeCompare(b.date);
		});

		// Use month as unique key. If duplicate month exists, keep the latest revenue value.
		const monthRevenueMap = new Map<string, number>();
		sortedData.forEach((item) => {
			monthRevenueMap.set(getMonthKey(item), item.revenue);
		});

		const monthlyData = Array.from(monthRevenueMap.entries())
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([monthKey, revenue]) => ({ monthKey, revenue }));

		const displayData = monthlyData.slice(-DISPLAY_MONTH_COUNT);

		const columns: StockTableColumn[] = [
			{
				title: '年度月份',
				dataIndex: 'name',
				key: 'name',
				fixed: 'left',
			},
			...displayData.map((item) => {
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

		displayData.forEach((item) => {
			revenueRow[item.monthKey] = item.revenue.toLocaleString('zh-TW', {
				maximumFractionDigits: 0,
			});

			const previousYearMonthKey = getPreviousYearMonthKey(item.monthKey);
			const previousRevenue = monthRevenueMap.get(previousYearMonthKey);

			if (previousRevenue === undefined || previousRevenue === 0) {
				yoyRow[item.monthKey] = '-';
				return;
			}

			const yoy = ((item.revenue - previousRevenue) / previousRevenue) * 100;
			yoyRow[item.monthKey] = `${yoy.toFixed(2)}%`;
		});

		return {
			columns,
			dataSource: [revenueRow, yoyRow],
		};
	}, [stockMonthRevenue]);

};