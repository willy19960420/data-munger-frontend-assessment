'use client';

import { useEffect, useMemo, useState } from 'react';
import { Flex, Select, Spin, Alert } from 'antd';
import type { StockItem } from '@/types/stock';
import { useStockInfo } from './hooks/useStockInfo';

const MAX_VISIBLE_OPTIONS = 100;

interface SearchBarProps {
  onSelect: (stock: StockItem) => void;
}

export const SearchBar = ({ onSelect }: SearchBarProps) => {
  const { isLoading, error, stockOptions: options } = useStockInfo();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText.trim().toLowerCase());
    }, 250);

    return () => clearTimeout(timer);
  }, [searchText]);

  const filteredOptions = useMemo(() => {
    if (!debouncedSearchText) {
      return options.slice(0, MAX_VISIBLE_OPTIONS);
    }

    if (debouncedSearchText.length < 2) {
      return [];
    }

    return options
      .filter((option) => {
        const label = option.label.toString().toLowerCase();
        const description = option.description.toString().toLowerCase();
        return label.includes(debouncedSearchText) || description.includes(debouncedSearchText);
      })
      .slice(0, MAX_VISIBLE_OPTIONS);
  }, [options, debouncedSearchText]);

  const handleSelectChange = (value: string) => {
    const selectedOption = options.find((opt) => opt.value === value);
    if (selectedOption?.data) {
      onSelect(selectedOption.data);
    }
    setSearchText('');
    setDebouncedSearchText('');
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setSearchText('');
      setDebouncedSearchText('');
    }
  };

  return (
    <Flex vertical align="center" justify="center" gap="16px" style={{ padding: '20px' }}>
      {error && (
        <Alert title="載入失敗，請稍後重試" type="error" style={{ marginBottom: '16px' }} />
      )}
      <Select
        placeholder="搜尋股票名稱或代碼..."
        virtual
        filterOption={false}
        options={filteredOptions}
        onSearch={setSearchText}
        onChange={handleSelectChange}
        onOpenChange={handleOpenChange}
        size="large"
        loading={isLoading}
        notFoundContent={
          isLoading ? (
            <Spin />
          ) : debouncedSearchText && debouncedSearchText.length < 2 ? (
            '請至少輸入 2 個字'
          ) : (
            '找不到股票'
          )
        }
        optionLabelProp="label"
        showSearch
        style={{ width: '100%', maxWidth: '400px' }}
      />
    </Flex>
  );
};
