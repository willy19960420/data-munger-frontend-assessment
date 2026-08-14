'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Alert, Card, Empty, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { getUserListService } from '@/services/authService';

type UserRow = Record<string, unknown> & { key: string };

const toUserRows = (payload: unknown): UserRow[] => {
  const source = payload as { data?: unknown; users?: unknown };

  const list = Array.isArray(payload)
    ? payload
    : Array.isArray(source?.data)
      ? source.data
      : Array.isArray(source?.users)
        ? source.users
        : [];

  return list.map((item, index) => {
    const row = typeof item === 'object' && item !== null ? (item as Record<string, unknown>) : {};
    return {
      key: String(row.id ?? row.userId ?? row.username ?? index),
      ...row,
    };
  });
};

export default function UserListPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['userList'],
    queryFn: getUserListService,
  });

  const rows = useMemo(() => toUserRows(data), [data]);

  const columns: ColumnsType<UserRow> = useMemo(() => {
    if (!rows.length) {
      return [];
    }

    return Object.keys(rows[0])
      .filter((key) => key !== 'key')
      .map((key) => ({
        title: key,
        dataIndex: key,
        key,
        render: (value: unknown) =>
          typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value ?? ''),
      }));
  }, [rows]);

  return (
    <Card>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        User List
      </Typography.Title>

      {error ? (
        <Alert
          type="error"
          title="載入使用者清單失敗"
          description={(error as Error).message}
          showIcon
        />
      ) : rows.length === 0 && !isLoading ? (
        <Empty description="沒有使用者資料" />
      ) : (
        <Table<UserRow>
          rowKey="key"
          loading={isLoading}
          columns={columns}
          dataSource={rows}
          scroll={{ x: true }}
          pagination={{ pageSize: 10 }}
        />
      )}
    </Card>
  );
}
