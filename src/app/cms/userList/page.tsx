'use client';
import { useState } from 'react';

import type { UserListSearchParams } from '@/types/user';

import QueryOptions from '@/components/UserList/QueryOptions';
import DataTable from '@/components/UserList/DetailTable';

const UserListPage = () => {
	const [searchParams, setSearchParams] =
		useState<UserListSearchParams>({});

	return (
		<>
			<QueryOptions
				searchParams={searchParams}
				onSearch={setSearchParams}
			/>

			<DataTable
				searchParams={searchParams}
			/>
		</>
	);
};

export default UserListPage;
