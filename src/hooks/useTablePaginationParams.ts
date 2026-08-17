import { useState, useMemo, useCallback, useEffect, useRef } from 'react';

type SearchParams = Record<string, unknown>;

export interface PaginationState {
	page: number;
	limit: number;
}

export interface UseTablePaginationOptions {
	includePaginationWhenEmpty?: boolean;
}

export type TableApiParams<TSearchParams extends SearchParams> =
	| (PaginationState & Partial<TSearchParams>)
	| PaginationState
	| Record<string, never>;

export interface UseTablePaginationParamsResult<
	TSearchParams extends SearchParams,
> {
	pagination: PaginationState;
	apiParams: TableApiParams<TSearchParams>;
	searchVersion: number;
	handlePaginationChange: (page: number, limit: number) => void;
	resetPagination: () => void;
	handleSearchParamsChange: () => void;
}

/**
 * 管理表格查詢條件與分頁參數。
 * TSearchParams 可由呼叫端傳入具體型別，支援每個頁面不同的查詢欄位。
 */
export const useTablePaginationParams = <
	TSearchParams extends SearchParams = SearchParams,
>(
	searchParams: TSearchParams = {} as TSearchParams,
	options: UseTablePaginationOptions = {}
): UseTablePaginationParamsResult<TSearchParams> => {
	const { includePaginationWhenEmpty = false } = options;

	const [pagination, setPagination] = useState<PaginationState>({
		page: 1,
		limit: 10,
	});
	const [searchVersion, setSearchVersion] = useState(0);
	const isFirstRender = useRef(true);
	const prevSearchParamsContent = useRef<string | null>(null);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			prevSearchParamsContent.current = JSON.stringify(searchParams);
			return;
		}

		const currentContent = JSON.stringify(searchParams);
		const isSameContent = currentContent === prevSearchParamsContent.current;
		prevSearchParamsContent.current = currentContent;

		setPagination((prev) => (prev.page === 1 ? prev : { ...prev, page: 1 }));

		if (isSameContent && (currentContent !== '{}' || includePaginationWhenEmpty)) {
			setSearchVersion((prev) => prev + 1);
		}
	}, [includePaginationWhenEmpty, searchParams]);

	const apiParams = useMemo(() => {
		if (Object.keys(searchParams).length === 0) {
			if (!includePaginationWhenEmpty) {
				return {};
			}

			return {
				page: pagination.page,
				limit: pagination.limit,
			};
		}

		return {
			page: pagination.page,
			limit: pagination.limit,
			...searchParams,
		};
	}, [includePaginationWhenEmpty, pagination, searchParams]) as TableApiParams<TSearchParams>;

	const handlePaginationChange = useCallback((page: number, limit: number) => {
		setPagination((prev) => ({
			...prev,
			page,
			limit,
		}));
	}, []);

	const resetPagination = useCallback(() => {
		setPagination((prev) => ({
			...prev,
			page: 1,
		}));
	}, []);

	const handleSearchParamsChange = useCallback(() => {
		resetPagination();
	}, [resetPagination]);

	return {
		pagination,
		apiParams,
		searchVersion,
		handlePaginationChange,
		resetPagination,
		handleSearchParamsChange,
	};
};

export default useTablePaginationParams;
