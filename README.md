# Data Munger Frontend Assessment

台灣股票月營收分析與使用者列表的前端專案，使用 Next.js 16、React 19、TypeScript、Ant Design、TanStack Query、Zustand。

## 功能重點

- JWT 登入/刷新流程（logout 為前端本地登出）
- 路由保護（ProtectedLayout）
- Axios 攔截器自動附加 Bearer Token
- Token 過期前預檢與 refresh queue 防重複刷新
- 股票搜尋與月營收圖表（Recharts）
- User List 查詢與分頁
- User List 表格欄位完整顯示（含 Avatar）
- 欄位資料缺漏時統一顯示 `-`
- `created_at` 時間格式統一為 `YYYY-MM-DD HH:mm:ss`

## 技術棧

- Next.js 16.3.0
- React 19.2.4
- TypeScript 5
- Ant Design 6.4.3
- TanStack Query 5.101.0
- Axios 1.17.0
- Zustand 5.0.14
- Recharts 3.8.1
- Day.js 1.11.21

## 專案結構（目前，已對照實際檔案）

```text
src/
  app/
    cms/
      stock/page.tsx
      userList/page.tsx
    login/page.tsx
    layout.tsx
    page.tsx
  components/
    Auth/
      LogoutButton.tsx
      ProtectedLayout.tsx
    Stocks/
      hooks/useRevenueSeries.ts
      SearchBar/
      StockChart/
      StockDashboard/
      StockTable/
    ToggleTheme/
      index.tsx
    UserList/
      DetailTable/
      QueryOptions/
  hooks/
    useAuth.ts
    useTablePaginationParams.ts
  providers/
    index.tsx
  services/
    api.ts
    apiServices.ts
    authService.ts
    constants.ts
    stockServices.ts
    userService.ts
  stores/
    authStore.ts
    themeStore.ts
  types/
    auth.ts
    stock.ts
    user.ts
```

## 認證與請求流程（完整）

1. 使用者於 `/login` 送出帳密。
2. `loginService(data)` 呼叫 `POST /auth`，拿到 `access_token`、`refresh_token`、`expires_in`。
3. 前端將 token 正規化後寫入 `authStore`。
4. 進入 CMS 路由後，受保護請求由 `api.ts` 攔截器自動加上 `Authorization: Bearer ...`。
5. 若 token 即將過期，攔截器會先呼叫 `refreshTokenService()`。
6. refresh 成功後，更新 store 中 token，再重試原請求。
7. refresh 失敗或 401 無法恢復時，清空本地認證狀態並導回 `/login`。

補充：本專案沒有 `logout API`，登出是前端本地行為。

## API URL 策略（目前）

專案目前採用「完整 URL」策略。

- 各 service 直接呼叫完整 URL
- `api.ts` 不使用 `baseURL`
- `src/services/constants.ts` 統一定義：
  - `USER_LOGIN_API_URL`
  - `STOCK_API_URL`
  - `LOGIN_API_HOST`
  - `STOCK_API_HOST`

`LOGIN_API_HOST`、`STOCK_API_HOST` 用於攔截器中判斷哪些請求要略過 Bearer/refresh 流程。

## Service 對照

### Auth

- `loginService(data)`
- `refreshTokenService()`
- `logoutService()`

`logoutService()` 說明：
- 只清除 `authStore` 的 `accessToken`、`refreshToken`、`tokenExpires`、`user`
- 不會呼叫任何後端 API
- 實際導頁到 `/login` 的行為在 `src/app/cms/layout.tsx` 的 `onLogout` 中執行

來源檔案：`src/services/authService.ts`

### User

- `UserService.getUserList(params)`

來源檔案：`src/services/userService.ts`

### Stock

- `StockServices.getTaiwanStockInfo()`
- `StockServices.getStockMonthRevenue(params)`

來源檔案：`src/services/stockServices.ts`

### API Service 聚合

- `apiService.stock` -> `stockServices`（來自 `src/services/stockServices.ts`）
- `apiService.user` -> `UserService`（來自 `src/services/userService.ts`）

來源檔案：`src/services/apiServices.ts`

## User List 回傳格式（範例）

```json
{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice.johnson@example.com",
  "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  "status": "active",
  "created_at": "2024-01-15T08:30:00Z"
}
```

對應表格欄位：`id`、`name`、`email`、`avatar`、`status`、`created_at`。

## 環境變數

目前程式碼實際使用的公開環境變數：

- `NEXT_PUBLIC_TOKEN`（可選）
  - 供 FinMind API 使用

## 開發指令

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run format
```

## 備註

- 目前無 `middleware.ts`；路由保護由 `ProtectedLayout` 處理。
- Auth API 目前只有兩支：`POST /auth`、`POST /auth/refresh`。
- `logoutService()` 是 local-only，不是 API endpoint。
- 文件內容已依當前程式碼更新，若後續調整 API 結構，請同步更新本 README。

## Auth API 對照（以目前實作為準）

| 功能 | 方法 | 實作位置 | 備註 |
| --- | --- | --- | --- |
| Login | `POST ${USER_LOGIN_API_URL}/auth` | `src/services/authService.ts` -> `loginService` | 呼叫後端登入 |
| Refresh | `POST ${USER_LOGIN_API_URL}/auth/refresh` | `src/services/authService.ts` -> `refreshTokenService` | 使用 refresh token 換新 token |
| Logout | 無 API | `src/services/authService.ts` -> `logoutService` | 僅清本地狀態 |
