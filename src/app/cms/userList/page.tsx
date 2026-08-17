'use client';
import { useState } from 'react';

import type { UserListSearchParams } from '@/types/user';
import { Flex } from 'antd'
import QueryOptions from '@/components/UserList/QueryOptions';
import DataTable from '@/components/UserList/DetailTable';

const UserListPage = () => {
	const [searchParams, setSearchParams] =
		useState<UserListSearchParams>({});

	return (
		<Flex vertical gap={16} >
			<QueryOptions
				searchParams={searchParams}
				onSearch={setSearchParams}
			/>

			<DataTable
				searchParams={searchParams}
			/>
		</Flex>
	);
};

export default UserListPage;
