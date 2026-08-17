import { Table } from 'antd';

import type { UserListSearchParams } from '@/types/user';

import useTablePaginationParams from '@/hooks/useTablePaginationParams';

import { useQueryData } from './hooks/useQueryData';

interface DataTableProps {
	searchParams: UserListSearchParams;
}

const DataTable = ({
	searchParams,
}: DataTableProps) => {
	const {
		pagination,
		apiParams,
		handlePaginationChange,
	} = useTablePaginationParams<UserListSearchParams>(
		searchParams,
		{
			includePaginationWhenEmpty: true,
		},
	);

	const {
		data,
		isLoading,
	} = useQueryData(apiParams);

	return (
		<Table
			loading={isLoading}
			dataSource={data?.data ?? []}
			pagination={
				data?.pagination
					? {
							current: data.pagination.current_page,
							pageSize: data.pagination.per_page,
							total: data.pagination.total,
							onChange: handlePaginationChange,
						}
					: false
			}
		/>
	);
};

export default DataTable;