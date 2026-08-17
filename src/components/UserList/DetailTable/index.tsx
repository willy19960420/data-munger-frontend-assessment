import { Table, Empty, Button } from 'antd';

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
		columns,
		isLoading,
    isError,
    error,
    refetch,
	} = useQueryData(apiParams);


  if (isError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <Empty
          description={error?.message || '載入失敗，請稍後重試'}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button type="primary" onClick={() => refetch()}>
          重試
        </Button>
      </div>
    );
  }

	return (
		<Table
      rowKey={(record) => record.id}
			columns={columns}
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