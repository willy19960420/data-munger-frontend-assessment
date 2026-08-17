import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Avatar, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import type {
	GetUserListResponse,
  User,
	UserListRequest,
} from '@/types/user';

import apiService from '@/services/apiServices';

const toDisplayValue = (value?: string | number | null) => {
  if (value === null || value === undefined) {
    return '-';
  }

  if (typeof value === 'string' && value.trim() === '') {
    return '-';
  }

  return value;
};

const formatDateTime = (value?: string | null) => {
  const displayValue = toDisplayValue(value);

  if (displayValue === '-') {
    return '-';
  }

  const parsed = dayjs(String(displayValue));
  if (!parsed.isValid()) {
    return '-';
  }

  return parsed.format('YYYY-MM-DD HH:mm:ss');
};

export const useQueryData = (
	params: UserListRequest,
) => {

  const {
    data: tableData,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery<GetUserListResponse, Error>({
    queryKey: ['user-list', params],
    queryFn: () => apiService.user.getUserList(params),
  });

  const columns = useMemo<ColumnsType<User>>(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (value: number | null | undefined) => toDisplayValue(value),
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (value: string | null | undefined) => toDisplayValue(value),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        render: (value: string | null | undefined) => toDisplayValue(value),
      },
      {
        title: 'Avatar',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (value: string | null | undefined, record: User) => {
          const avatarUrl = typeof value === 'string' ? value.trim() : '';

          if (!avatarUrl) {
            return '-';
          }

          const fallbackText =
            typeof record.name === 'string' && record.name.trim()
              ? record.name.trim().charAt(0).toUpperCase()
              : 'U';

          return React.createElement(
            Avatar,
            {
              src: avatarUrl,
              alt: record.name || 'avatar',
            },
            fallbackText,
          );
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (value: User['status'] | null | undefined) => {
          if (!value) {
            return '-';
          }

          const color = value === 'active' ? 'success' : 'default';
          return React.createElement(Tag, { color }, value);
        },
      },
      {
        title: 'Created At',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (value: string | null | undefined) => formatDateTime(value),
      },
    ],
    [],
  );

	return {
    data: tableData,
    columns,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  };
};