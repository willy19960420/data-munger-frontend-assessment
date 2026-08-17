import { useCallback, useEffect } from 'react';
import { Form } from 'antd';

import type { UserListSearchParams } from '@/types/user';

interface UseQueryOptionsParams {
	searchParams: UserListSearchParams;
	onSearch: (params: UserListSearchParams) => void;
}

export const useQueryOptions = ({
	searchParams,
	onSearch,
}: UseQueryOptionsParams) => {
	const [form] = Form.useForm<UserListSearchParams>();

	useEffect(() => {
		form.setFieldsValue(searchParams);
	}, [form, searchParams]);

	const handleSearch = useCallback(() => {
		const values = form.getFieldsValue();

		const params: UserListSearchParams = {
			...(values.name?.trim() && {
				name: values.name.trim(),
			}),
			...(values.email?.trim() && {
				email: values.email.trim(),
			}),
			...(values.status && {
				status: values.status,
			}),
		};

		onSearch(params);
	}, [form, onSearch]);

	const handleReset = useCallback(() => {
		form.resetFields();
		onSearch({});
	}, [form, onSearch]);

	return {
		form,
		handleSearch,
		handleReset,
	};
};