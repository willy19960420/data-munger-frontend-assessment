# Data Munger Frontend Assessment

## 📌 Introduction

台灣股票月營收分析應用，提供股票搜尋、年增率計算、混合圖表展示與詳細數據表。基於 Next.js 16 + React 19 + TypeScript 構建，整合 JWT 認證系統。

### 核心特性

- ✅ **JWT 認證系統** — Token + Refresh Token 機制、自動刷新、路由保護
- ✅ **登入頁面** — 簡潔設計、亮暗主題切換、表單驗證
- ✅ **路由保護** — 自動重定向、token 過期處理、登出功能
- ✅ **股票搜尋** — 虛擬滾動、250ms 防抖、實時篩選優化
- ✅ **月營收分析** — 6 年歷史數據、5 年顯示窗口（60 個月）
- ✅ **YoY 計算** — 年增率百分比 (當月-去年同月)/去年同月×100
- ✅ **混合圖表** — Bar（營收 千元）+ Line（年增率 %）雙軸展示
- ✅ **詳細表格** — 橫向滾動、自動聚焦最新月份
- ✅ **主題支持** — 亮/暗模式動態切換，支援 Ant Design tokens
- ✅ **性能優化** — React.memo、共用 hooks、虛擬列表、請求快取

---

## 🏗️ 架構設計

### 認證流程（跨域方案）

```
登入頁面 (username + password)
    ↓
authService.login() → 儲存 tokens 到 authStore (Zustand + localStorage)
    ↓
ProtectedLayout (Client-side 路由保護)
  ├→ 等待 hasHydrated（避免刷新瞬間誤判）
  ├→ 檢查 localStorage 中的 accessToken
    ├→ 未登入 → 重定向到 /login
  ├→ token 無效 → 先 refresh 一次
  ├→ refresh 失敗 → 清空狀態並重定向到 /login
    └→ 已登入訪問 /login → 重定向到 /cms/stock
    ↓
Axios 請求攔截器（每次 API 請求）
  ├→ 排除 stock API（不加 Bearer）
  ├→ 排除公開 auth API（/auth、/auth/refresh）
    ├→ 從 authStore 讀取 token
    ├→ 加入 Authorization: Bearer {token} header
    ├→ 檢查 token 是否快過期（30秒前預檢）
    ├→ 如已過期/即將過期 → 呼叫 refresh API
    ├→ 更新 token → 重試原請求
    └→ 401 錯誤 → 自動登出 → 重定向到 /login
```

**為什麼用 localStorage 而不是 Cookie？**

- 前後端跨域（不同域名）
- localStorage 簡化跨域配置
- ProtectedLayout 提供 Client-side 路由保護
- Axios 攔截器自動附加 Authorization header

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

| 特性             | 實現                           | 說明                                           |
| ---------------- | ------------------------------ | ---------------------------------------------- |
| **Token 管理**   | Zustand + localStorage         | 持久化儲存、自動同步、JWT 解析                 |
| **Token 刷新**   | Axios 請求攔截器               | 30 秒前預檢、自動刷新、failedQueue 防重複請求  |
| **刷新上限**     | ProtectedLayout + `_retry`     | 進頁 refresh 最多一次；401 重試最多一次        |
| **攔截器排除**   | URL 白名單                     | Stock API/公開 auth API 不走 Bearer 與 refresh |
| **路由保護**     | ProtectedLayout (Client)       | 檢查 token、自動重定向、公開路由白名單         |
| **YoY 計算**     | useRevenueSeries (shared hook) | 6 年→5 年、年增率百分比、null-safe             |
| **數據獲取**     | useStockMonthRevenueData       | 6 年 lookback: `dayjs().subtract(6,'year')`    |
| **搜尋優化**     | useStockInfo                   | 250ms 防抖、虛擬滾動、最多 100 結果            |
| **圖表**         | ComposedChart + hide prop      | Bar 營收+Line 年增率、toggle 不重算            |
| **表格**         | useTableData                   | series 轉 columns、自動滾至最新月份            |
| **主題**         | theme.useToken()               | colorTextSecondary、colorBorder 無 hardcode    |
| **程式碼格式化** | Prettier                       | 統一風格、自動格式化                           |

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
│   ├── page.tsx              # 首頁重定向到 /cms/stock
│   ├── layout.tsx            # 根佈局
│   ├── globals.css
│   └── login/
│       └── page.tsx          # 登入頁面
│   └── cms/
│       ├── layout.tsx        # CMS 頂部選單版面（Stock/UserList）
│       ├── stock/
│       │   └── page.tsx      # 股票儀表板頁面
│       └── userList/
│           └── page.tsx      # 使用者列表頁面
├── components/
│   ├── auth/
│   │   ├── ProtectedLayout.tsx   # 路由保護組件
│   │   └── LogoutButton.tsx      # 登出按鈕
│   ├── stocks/
│   │   ├── hooks/
│   │   │   └── useRevenueSeries.ts       # ✨ 核心：6年→5年窗口 + YoY計算
│   │   ├── SearchBar/
│   │   │   ├── hooks/
│   │   │   │   └── useStockInfo.ts      # 搜尋數據獲取 + 防抖邏輯
│   │   │   └── index.tsx                # 虛擬列表 + 防抖搜尋框
│   │   ├── StockDashboard/
│   │   │   ├── hooks/
│   │   │   │   └── useStockMonthRevenueData.ts  # 6年月營收資料抓取
│   │   │   └── index.tsx                       # 容器組件
│   │   ├── StockChart/
│   │   │   └── index.tsx                # Bar + Line 混合圖表、toggle控制
│   │   └── StockTable/
│   │       ├── hooks/
│   │       │   └── useTableData.ts      # Series → 表格 columns/rows 轉換
│   │       └── index.tsx                # 橫向滾動表格、自動聚焦最新
│   └── toggleTheme/
│       └── index.tsx         # 主題切換按鈕組件
├── services/
│   ├── api.ts                # Axios 實例 + 攔截器（含 token refresh）
│   ├── apiServices.ts        # API 通用服務
│   ├── authService.ts        # 認證 API（login、refresh、users、local logout）
│   └── stockServices.ts      # 股票 API (getStockMonthRevenue)
├── stores/
│   ├── authStore.ts          # Zustand 認證狀態管理（token + user）
│   └── themeStore.ts         # Zustand 主題狀態管理
├── types/
│   ├── auth.ts               # 認證類型（User、LoginRequest、AuthState）
│   ├── stock.ts              # 核心類型 (StockItem, RevenueSeriesItem, etc)
│   └── index.ts              # 統一導出
├── hooks/
│   └── useAuth.ts            # 認證 hook（login、logout）
└── providers/
    └── index.tsx             # QueryClient + Ant ConfigProvider + ProtectedLayout
```

---

## 🔧 Tech Stack

| 層級         | 技術           | 版本    |
| ------------ | -------------- | ------- |
| **框架**     | Next.js        | 16.3.0  |
| **UI 庫**    | React          | 19.2.4  |
| **語言**     | TypeScript     | 5       |
| **UI 組件**  | Ant Design     | 6.4.3   |
| **圖表**     | Recharts       | 3.8.1   |
| **狀態管理** | Zustand        | 5.0.14  |
| **數據管理** | TanStack Query | 5.101.0 |
| **HTTP**     | Axios          | 1.17.0  |
| **日期**     | Day.js         | 1.11.21 |
| **JWT**      | jwt-decode     | 4.0.0   |
| **格式化**   | Prettier       | 3.8.4   |

---

## 🚀 快速開始

### 安裝

```bash
npm install
```

### 環境變數

.env.development || .env.production

| 變數                  | 說明              | 必填                                   |
| --------------------- | ----------------- | -------------------------------------- |
| `NEXT_PUBLIC_TOKEN`   | FinMind API Token | 否（不填仍可使用，免費配額有限）       |
| `NEXT_PUBLIC_API_URL` | 後端 API 基礎 URL | 是（refresh 與 /api/users 等後端 API） |

Token 申請：[https://finmindtrade.com/](https://finmindtrade.com/)

### 開發

```bash
npm run dev
# 打開 http://localhost:3000
# 首次訪問會重定向到 /login
```

### 構建

```bash
npm run build
npm run start
```

### 格式化程式碼

```bash
npm run format
```

---

## 📝 核心類型

### 認證相關

| 類型              | 說明                                                      |
| ----------------- | --------------------------------------------------------- |
| **User**          | 使用者資訊（username、role）                              |
| **LoginRequest**  | 登入請求（username、password）                            |
| **LoginResponse** | 登入回應（accessToken、refreshToken、tokenExpires、user） |
| **AuthState**     | 認證狀態（tokens、user、loading、error、方法）            |

### 股票相關

| 類型                      | 說明                                         |
| ------------------------- | -------------------------------------------- |
| **StockItem**             | 股票基本資訊（代碼、名稱、產業、交易所）     |
| **StockMonthRevenueItem** | 月營收數據（日期、營收、revenue_year/month） |
| **RevenueSeriesItem**     | 處理後系列（monthKey、revenue、yoy）         |

查看 [src/types/auth.ts](src/types/auth.ts) 和 [src/types/stock.ts](src/types/stock.ts) 了解完整定義。

---

## 🔌 API

### 認證 API

| 功能               | 方法                                | 說明                                     |
| ------------------ | ----------------------------------- | ---------------------------------------- |
| **登入**           | `authService.loginService()`        | 使用者登入，返回 tokens 和 user          |
| **刷新 Token**     | `authService.refreshTokenService()` | 刷新 accessToken                         |
| **取得使用者列表** | `authService.getUserListService()`  | 取得 `/api/users` 受保護資料             |
| **登出（本地）**   | `authService.logoutService()`       | 清空 token/user 並回登入頁（不呼叫 API） |

登入端點：

`POST https://lbbj5pioquwxdexqmcnwaxrpce0lcoqx.lambda-url.ap-southeast-1.on.aws/auth`

登入請求 body：

```json
{
  "username": "string",
  "password": "string"
}
```

登入成功回傳（HTTP 200）：

```json
{
  "access_token": "string",
  "refresh_token": "string",
  "expires_in": 300,
  "user": {
    "username": "string",
    "role": "string"
  }
}
```

登入失敗回傳：

```json
{
  "message": "string",
  "code": 415
}
```

說明：

- 除了 200 以外都會有 `message`
- `code` 欄位只會在 415 狀態出現

### 股票 API

| 功能         | 方法                                                | 說明           |
| ------------ | --------------------------------------------------- | -------------- |
| **股票清單** | `stockServices.getStockInfo()`                      | 所有股票列表   |
| **月營收**   | `stockServices.getStockMonthRevenue(id, startDate)` | 6 年月營收數據 |

API 來源：

- 認證 API（登入）：**固定端點** `https://lbbj5pioquwxdexqmcnwaxrpce0lcoqx.lambda-url.ap-southeast-1.on.aws/auth`
- 認證 API（refresh/users）：**自定義後端**（由 NEXT_PUBLIC_API_URL 提供）
- 股票 API：**FinMind Trade API**

---

## 🎨 主題支持

支持亮/暗模式，由 Zustand 管理，在 `src/providers/index.tsx` 自動應用。

```typescript
useThemeStore.getState().toggleTheme();
```

---

## ⚡ 性能優化

| 最佳化               | 方案             | 效果                       |
| -------------------- | ---------------- | -------------------------- |
| **Token 預檢**       | 30 秒前檢查過期  | 避免請求中斷、提前刷新     |
| **Token 持久化**     | localStorage     | 刷新頁面保持登入狀態       |
| **請求隊列**         | failedQueue      | 防止 token 刷新時重複請求  |
| **虛擬滾動**         | SearchBar Select | 1000+ 選項無卡頓           |
| **防抖搜尋**         | 250ms debounce   | 降低 API 頻率              |
| **共用 hook**        | useRevenueSeries | 避免邏輯重複               |
| **React.memo**       | 展示組件         | 只在 prop 變化時重 render  |
| **useMemo**          | 計算 results     | 避免重複 domain 計算       |
| **React Query 快取** | TanStack Query   | 減少重複請求、智能快取管理 |

---

## 💡 設計決策

### 認證系統（跨域方案）

- **localStorage 而非 Cookie** — 前後端跨域，避免複雜的 CORS 和 SameSite 設定
- **Hydration 保護** — 先等 hasHydrated，再做登入判斷，避免 F5 後誤踢登入
- **Client-side 路由保護** — ProtectedLayout 檢查 localStorage token，自動重定向
- **刷新一次策略** — token 無效時先 refresh 一次，失敗才登出回登入
- **Authorization Header** — Axios 攔截器自動附加 `Authorization: Bearer {token}`
- **Token 預檢機制** — 請求前 30 秒檢查過期，主動刷新避免 401 錯誤
- **JWT 解析** — 使用 jwt-decode 解析 exp 欄位，準確計算過期時間
- **請求隊列** — Token 刷新期間，pending 請求放入 failedQueue 等待
- **攔截器排除策略** — Stock API 與公開 auth API 不套用 Bearer/refresh，避免循環刷新
- **Zustand 持久化** — persist 中介軟體自動同步 localStorage，跨頁面保持登入

### 股票系統

- **6 年抓取、5 年顯示** — YoY 需要前一年同月參考
- **Line connectNulls=false** — null 月份自然中斷，不插值
- **monthKey 用 revenue_year/month** — 準確對應營收月份（非公告日期）
- **useRevenueSeries 獨立** — 複雜邏輯+多次複用

### API 封裝與錯誤處理（分域 Adapter）

- **不強制統一後端格式** — Auth API 與 Stock API（FinMind）回傳結構不同，直接硬統一會提高耦合
- **在 Service 層做分域轉換** — 各自處理欄位映射與錯誤訊息（例如 auth 的 `access_token` → `accessToken`）
- **UI 層只依賴穩定型別** — 畫面不直接耦合後端原始 payload，降低 API 變動風險
- **錯誤訊息一致輸出** — 在各自服務內 normalize 成可顯示訊息，搭配通知與 Query error 呈現
- **可演進策略** — 未來若 API 收斂，再抽共用錯誤模型，不影響現有頁面

### 開發體驗

- **移除 ESLint** — 簡化配置，只保留 Prettier 格式化
- **統一 import** — types/index.ts 統一導出，簡化 import 路徑
