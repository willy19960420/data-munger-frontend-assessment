import { Button, Form, Input, Select, Space } from 'antd';

import type { UserListSearchParams } from '@/types/user';

import { useQueryOptions } from './hooks/useQueryOptions';

interface QueryOptionsProps {
	searchParams: UserListSearchParams;
	onSearch: (params: UserListSearchParams) => void;
}

const QueryOptions = ({
	searchParams,
	onSearch,
}: QueryOptionsProps) => {
	const {
		form,
		handleSearch,
		handleReset,
	} = useQueryOptions({
		searchParams,
		onSearch,
	});

	return (
		<Form
			form={form}
			layout="inline"
			onFinish={handleSearch}
		>
			<Form.Item name="name">
				<Input
					placeholder="Name"
					allowClear
				/>
			</Form.Item>

			<Form.Item name="email">
				<Input
					placeholder="Email"
					allowClear
				/>
			</Form.Item>

			<Form.Item name="status">
				<Select
					placeholder="Status"
					allowClear
					style={{ width: 140 }}
					options={[
						{
							label: 'Active',
							value: 'active',
						},
						{
							label: 'Inactive',
							value: 'inactive',
						},
					]}
				/>
			</Form.Item>

			<Form.Item>
				<Space>
					<Button
						type="primary"
						htmlType="submit"
					>
						Search
					</Button>

					<Button onClick={handleReset}>
						Reset
					</Button>
				</Space>
			</Form.Item>
		</Form>
	);
};

export default QueryOptions;