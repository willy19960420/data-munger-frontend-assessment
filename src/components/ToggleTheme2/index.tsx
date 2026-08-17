'use client';

import { Button } from 'antd';
import { SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useThemeStore } from '@/stores/themeStore';

export const ToggleTheme = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <Button
      type="text"
      icon={isDark ? <SunOutlined /> : <MoonOutlined />}
      onClick={toggleTheme}
      size="large"
      title={isDark ? '切換為亮色模式' : '切換為暗色模式'}
      aria-label="toggle theme"
    />
  );
};
