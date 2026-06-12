# Data Munger Frontend Assessment

## 📌 Introduction

台灣股票搜尋應用，基於 Next.js 和 React 構建。用戶可以搜尋台灣股票信息、查看股票詳情和圖表展示。

### 核心特性

* ✅ **類型安全** — 完整的 TypeScript 類型定義
* ✅ **性能優化** — React.memo + TanStack Query 智能快取
* ✅ **容器組件模式** — 清晰的數據流和組件職責分離
* ✅ **主題支持** — 亮/暗模式切換，Zustand 狀態管理
* ✅ **響應式設計** — Ant Design 提供一致的 UI
* ✅ **實時搜尋** — 搜尋框支持股票名稱和代碼搜索

---

## 🏗️ 架構設計

### 數據流
```
SearchBar (useQuery 獲取)
    ↓
StockDashboard (容器組件，管理 selectedStock)
    ↓
StockTable + StockChart (React.memo 展示組件)
```

### 關鍵設計決策

| 特性 | 實現 | 說明 |
|-----|------|------|
| **數據獲取** | TanStack Query | 5 分鐘快取，自動重試 3 次 |
| **性能優化** | React.memo | 子組件只在 prop 改變時重新渲染 |
| **狀態管理** | Zustand + persist | 主題狀態持久化到 localStorage |
| **API 通信** | Axios | 集中攔截器管理，Token 認證 |

---

## 📁 文件夾結構

```
src/
├── app/
│   ├── page.tsx              # 主頁（Server Component）
│   ├── layout.tsx            # 根佈局
│   └── globals.css
├── components/stocks/
│   ├── SearchBar/            # 搜尋組件（useQuery 數據獲取）
│   ├── StockDashboard/       # 容器組件（狀態管理）
│   ├── StockTable/           # 表格展示（React.memo）
│   └── StockChart/           # 圖表展示（React.memo）
├── services/
│   ├── api.ts                # Axios 實例 + 攔截器
│   └── stockServices.ts # 股票 API 服務（Server 端 fetch）
├── stores/
│   └── themeStore.ts         # Zustand 主題狀態
├── types/
│   └── stock.ts              # 股票相關類型定義
└── providers/
    └── index.tsx             # QueryClient + ConfigProvider
```

---

## 🔧 Tech Stack

### 核心
* **Next.js 16** — React 框架
* **React 19** — UI 庫
* **TypeScript** — 類型安全

### UI & 樣式
* **Ant Design 6** — 企業級 UI 組件庫
* **CSS Variables** — 主題色管理

### 數據管理
* **TanStack Query** — 服務器狀態管理（快取、同步）
* **Zustand** — 客戶端狀態（主題）
* **Axios** — HTTP 客戶端

### 可視化
* **Recharts** — 圖表庫（預留）

### 工具
* **Day.js** — 日期處理

---

## 🚀 快速開始

### 安裝依賴
```bash
npm install
```

### 啟動開發伺服器
```bash
npm run dev
```

打開：`http://localhost:3000`

### 生產環境構建
```bash
npm run build
npm run start
```

---

## 📝 類型定義

核心類型已在 `src/types/stock.ts` 中定義：

```typescript
export interface StockItem {
  industry_category: string;  // 產業類別
  stock_id: string;           // 股票代碼
  stock_name: string;         // 股票名稱
  type: 'tpex' | 'twse';      // 交易所類型
  date: string;               // 日期
}

export interface ApiResponse<T = StockItem[]> {
  msg: string;                // 返回信息
  status: number;             // HTTP 狀態碼
  data: T;                    // 實際數據
}
```

---

## 🔌 API 集成

### 數據源
- **API**: FinMind Trade API
- **Endpoint**: `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockInfo`

### 數據獲取策略
- **SSR 頁面** → 使用 `fetch` 一次初始化（已移除，改用 Client 端）
- **Client 組件** → 使用 `axios` + `useQuery` 進行智能快取

---

## 🎨 主題系統

主題由 Zustand 管理，支持亮/暗模式：

```typescript
useThemeStore.getState().toggleTheme()  // 切換主題
useThemeStore.getState().setTheme('light')  // 設置特定主題
```

主題配置在 `src/providers/index.tsx` 中，Ant Design 自動應用。

---

## 🔍 性能優化

1. **TanStack Query 快取**
   - 5 分鐘內無需重新請求
   - 自動重試失敗請求

2. **React.memo**
   - `StockTable` 和 `StockChart` 只在股票改變時重新渲染
   - 避免不必要的渲染

3. **useCallback**
   - `SearchBar` 的 `fetchStockInfo` 固定引用，避免每次 render 重新創建

---

## 📦 依賴清單

| 包名 | 版本 | 用途 |
|-----|------|------|
| next | 16.2.9 | React 框架 |
| react | 19.2.4 | UI 庫 |
| antd | 6.4.3 | UI 組件 |
| @tanstack/react-query | 5.101.0 | 數據狀態管理 |
| zustand | 5.0.14 | 客戶端狀態 |
| axios | 1.17.0 | HTTP 客戶端 |
| recharts | 3.8.1 | 圖表庫 |
| dayjs | 1.11.21 | 日期工具 |

---
