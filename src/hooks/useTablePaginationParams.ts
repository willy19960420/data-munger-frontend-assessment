import { useState, useMemo, useCallback, useEffect } from 'react';

export interface PaginationState {
	page: number;
	limit: number;
}

export interface UseTablePaginationOptions {
	includePaginationWhenEmpty?: boolean;
}

export type TableApiParams<TSearchParams extends object> =
	| (PaginationState & Partial<TSearchParams>)
	| Record<string, never>;

export interface UseTablePaginationParamsResult<
	TSearchParams extends object,
> {
	pagination: PaginationState;
	apiParams: TableApiParams<TSearchParams>;
	handlePaginationChange: (page: number, limit: number) => void;
	resetPagination: () => void;
}

/**
 * 管理表格查詢條件與分頁參數。
 *
 * searchParams 由呼叫端管理，
 * Hook 負責將 searchParams 與 pagination 組合成 apiParams。
 *
 * TSearchParams 可由呼叫端傳入具體型別，
 * 支援每個頁面不同的查詢欄位。
 */
export const useTablePaginationParams = <
	TSearchParams extends object = object,
>(
	searchParams: TSearchParams = {} as TSearchParams,
	options: UseTablePaginationOptions = {},
): UseTablePaginationParamsResult<TSearchParams> => {
	const {
		includePaginationWhenEmpty = false,
	} = options;

	const [pagination, setPagination] =
		useState<PaginationState>({
			page: 1,
			limit: 10,
		});

	/**
	 * 當 searchParams 改變時，
	 * 將 pagination 重置到第一頁。
	 *
	 * 注意：
	 * searchParams 是由 Page 管理的「已提交搜尋條件」，
	 * QueryOptions 只有在使用者按下 Search 時才會更新它。
	 */
	useEffect(() => {
		setPagination((prev) => {
			if (prev.page === 1) {
				return prev;
			}

			return {
				...prev,
				page: 1,
			};
		});
	}, [searchParams]);

	/**
	 * 將搜尋條件與分頁參數組合成 API Request Params。
	 */
	const apiParams = useMemo(() => {
		const hasSearchParams =
			Object.keys(searchParams).length > 0;

		/**
		 * 沒有搜尋條件，
		 * 且設定為不帶 pagination。
		 */
		if (
			!hasSearchParams &&
			!includePaginationWhenEmpty
		) {
			return {};
		}

		return {
			page: pagination.page,
			limit: pagination.limit,
			...searchParams,
		};
	}, [
		includePaginationWhenEmpty,
		pagination,
		searchParams,
	]);

	const handlePaginationChange = useCallback(
		(page: number, limit: number) => {
			setPagination({
				page,
				limit,
			});
		},
		[],
	);

	const resetPagination = useCallback(() => {
		setPagination((prev) => {
			if (prev.page === 1) {
				return prev;
			}

			return {
				...prev,
				page: 1,
			};
		});
	}, []);

	return {
		pagination,
		apiParams,
		handlePaginationChange,
		resetPagination,
	};
};

export default useTablePaginationParams;