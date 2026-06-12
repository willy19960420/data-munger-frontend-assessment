'use client';

import { Flex, Select, Spin, Alert } from 'antd';
import type { StockItem } from '@/types/stock';
import { useStockInfo } from './hooks/useStockInfo';

interface SearchBarProps {
  onSelect: (stock: StockItem) => void;
}

export const SearchBar = ({ onSelect }: SearchBarProps) => {
  const { data, isLoading, error, stockOptions: options } = useStockInfo();

  const handleSelectChange = (value: string) => {
    const selectedOption = options.find((opt) => opt.value === value);
    if (selectedOption?.data) {
      onSelect(selectedOption.data);
    }
  };

  return (
    <Flex vertical align="center" justify="center" gap="16px" style={{ padding: '20px' }}>

      {/* {error && <Alert title="載入失敗，請稍後重試" type="error" style={{ marginBottom: '16px' }} />} */}
      <Select
        placeholder="搜尋股票名稱或代碼..."
        filterOption={(input, option) => {
          const label = option?.label?.toString().toLowerCase() || '';
          const desc = option?.description?.toString().toLowerCase() || '';
          return label.includes(input.toLowerCase()) || desc.includes(input.toLowerCase());
        }}
        options={options}
        onChange={handleSelectChange}
        size="large"
        loading={isLoading}
        notFoundContent={isLoading ? <Spin /> : '找不到股票'}
        optionLabelProp="label"
        showSearch
        style={{ width: '100%', maxWidth: '400px' }}
      />
    </Flex>
  );
};