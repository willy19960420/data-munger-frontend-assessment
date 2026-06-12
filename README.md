# Data Munger Frontend Assessment

## 📌 Introduction

台灣股票月營收分析應用，提供股票搜尋、年增率計算、混合圖表展示與詳細數據表。基於 Next.js 16 + React 19 + TypeScript 構建。

### 核心特性

- ✅ **股票搜尋** — 虛擬滾動、250ms 防抖、實時篩選優化
- ✅ **月營收分析** — 6年歷史數據、5年顯示窗口（60個月）
- ✅ **YoY 計算** — 年增率百分比 (當月-去年同月)/去年同月×100
- ✅ **混合圖表** — Bar（營收 千元）+ Line（年增率 %）雙軸展示
- ✅ **詳細表格** — 橫向滾動、自動聚焦最新月份
- ✅ **主題支持** — 亮/暗模式動態切換，支援 Ant Design tokens
- ✅ **性能優化** — React.memo、共用 hooks、虛擬列表、請求快取

---

## 🏗️ 架構設計

### 數據流

```
SearchBar (虛擬列表 + 防抖)
    ↓ (選擇股票)
StockDashboard (useStockMonthRevenueData 6年資料)
    ↓ (傳遞 stockMonthRevenue)
useRevenueSeries (共用 hook: 6年→5年轉換、YoY計算)
    ↙              ↘
StockChart         StockTable
(Bar+Line 圖表)   (月份列 + 營收/YoY 行)
```

### 關鍵設計決策

| 特性         | 實現                           | 說明                                       |
| ------------ | ------------------------------ | ------------------------------------------ |
| **YoY計算**  | useRevenueSeries (shared hook) | 6年→5年、年增率百分比、null-safe           |
| **數據獲取** | useStockMonthRevenueData       | 6年lookback: `dayjs().subtract(6,'year')`  |
| **搜尋優化** | useStockInfo                   | 250ms 防抖、虛擬滾動、最多100結果          |
| **圖表**     | ComposedChart + hide prop      | Bar營收+Line年增率、toggle不重算           |
| **表格**     | useTableData                   | series轉columns、自動滾至最新月份          |
| **主題**     | theme.useToken()               | colorTextSecondary、colorBorder 無hardcode |

### Hooks 組織策略

```
stocks/hooks/
└── useRevenueSeries.ts          # 多組件共用 (StockChart + StockTable)

SearchBar/hooks/
└── useStockInfo.ts              # SearchBar 專用 (搜尋邏輯)

StockTable/hooks/
└── useTableData.ts              # StockTable 專用 (視圖映射)

StockDashboard/hooks/
└── useStockMonthRevenueData.ts  # Dashboard 專用 (資料抓取)

StockChart/
└── index.tsx                    # 無組件hook (用共用useRevenueSeries)
```

**組織原則：**

- 多組件共用 → `stocks/hooks/`
- 單組件專用 → `Component/hooks/`

---

## 📁 文件夾結構

```
src/
├── app/
│   ├── page.tsx              # 主頁（Server Component）
│   ├── layout.tsx            # 根佈局
│   └── globals.css
├── components/stocks/
│   ├── hooks/
│   │   └── useRevenueSeries.ts       # ✨ 核心：6年→5年窗口 + YoY計算
│   ├── SearchBar/
│   │   ├── hooks/
│   │   │   └── useStockInfo.ts      # 搜尋數據獲取 + 防抖邏輯
│   │   └── index.tsx                # 虛擬列表 + 防抖搜尋框
│   ├── StockDashboard/
│   │   ├── hooks/
│   │   │   └── useStockMonthRevenueData.ts  # 6年月營收資料抓取
│   │   └── index.tsx                       # 容器組件
│   ├── StockChart/
│   │   └── index.tsx                # Bar + Line 混合圖表、toggle控制
│   └── StockTable/
│       ├── hooks/
│       │   └── useTableData.ts      # Series → 表格 columns/rows 轉換
│       └── index.tsx                # 橫向滾動表格、自動聚焦最新
├── services/
│   ├── api.ts                # Axios 實例 + 攔截器
│   ├── apiServices.ts        # API 通用服務
│   └── stockServices.ts      # 股票 API (getStockMonthRevenue)
├── stores/
│   └── themeStore.ts         # Zustand 主題狀態管理
├── types/
│   └── stock.ts              # 核心類型 (StockItem, RevenueSeriesItem, etc)
├── providers/
│   └── index.tsx             # QueryClient + Ant ConfigProvider
└── toggleTheme/
    └── index.tsx             # 主題切換按鈕組件
```

---

## 🔧 Tech Stack

| 層級         | 技術           | 版本    |
| ------------ | -------------- | ------- |
| **框架**     | Next.js        | 16.2.9  |
| **UI庫**     | React          | 19.2.4  |
| **語言**     | TypeScript     | 5       |
| **UI組件**   | Ant Design     | 6.4.3   |
| **圖表**     | Recharts       | 3.8.1   |
| **狀態管理** | Zustand (主題) | 5.0.14  |
| **數據管理** | TanStack Query | 5.101.0 |
| **HTTP**     | Axios          | 1.17.0  |
| **日期**     | Day.js         | 1.11.21 |

---

## � 快速開始

### 安裝

```bash
npm install
```
### 環境變數

.env.development || .env.production

| 變數 | 說明 | 必填 |
|------|------|------|
| `NEXT_PUBLIC_TOKEN` | FinMind API Token | 否（不填仍可使用，免費配額有限） |

Token 申請：[https://finmindtrade.com/](https://finmindtrade.com/)
### 開發

```bash
npm run dev
# 打開 http://localhost:3000
```

### 構建

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

---

## 📝 核心類型

| 類型                      | 說明                                         |
| ------------------------- | -------------------------------------------- |
| **StockItem**             | 股票基本資訊（代碼、名稱、產業、交易所）     |
| **StockMonthRevenueItem** | 月營收數據（日期、營收、revenue_year/month） |
| **RevenueSeriesItem**     | 處理後系列（monthKey、revenue、yoy）         |

查看 [src/types/stock.ts](src/types/stock.ts) 了解完整定義。

---

## 🔌 API

| 功能         | 方法                                                | 說明          |
| ------------ | --------------------------------------------------- | ------------- |
| **股票清單** | `stockServices.getStockInfo()`                      | 所有股票列表  |
| **月營收**   | `stockServices.getStockMonthRevenue(id, startDate)` | 6年月營收數據 |

API 來源：**FinMind Trade API**

---

## 🎨 主題支持

支持亮/暗模式，由 Zustand 管理，在 `src/providers/index.tsx` 自動應用。

```typescript
useThemeStore.getState().toggleTheme();
```

---

## ⚡ 性能優化

| 最佳化         | 方案             | 效果                     |
| -------------- | ---------------- | ------------------------ |
| **虛擬滾動**   | SearchBar Select | 1000+ 選項無卡頓         |
| **防抖搜尋**   | 250ms debounce   | 降低 API 頻率            |
| **共用 hook**  | useRevenueSeries | 避免邏輯重複             |
| **React.memo** | 展示組件         | 只在 prop 變化時重render |
| **useMemo**    | 計算results      | 避免重複domain計算       |

---

## 💡 設計決策

- **6年抓取、5年顯示** — YoY需要前一年同月參考
- **Line connectNulls=false** — null月份自然中斷，不插值
- **monthKey用revenue_year/month** — 準確對應營收月份（非公告日期）
- **useRevenueSeries獨立** — 複雜邏輯+多次複用
