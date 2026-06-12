// 台灣股票数据类型定义
export interface StockItem {
  industry_category: string;  // 產業類別，如：電子零組件業
  stock_id: string;           // 股票代碼
  stock_name: string;         // 股票名稱
  type: 'tpex' | 'twse';      // 交易所類型（OTC 或 上市）
  date: string;               // 日期 (YYYY-MM-DD 格式)
}

export interface ApiResponse<T = StockItem[]> {
  msg: string;                // 返回信息，如："success"
  status: number;             // HTTP 狀態碼
  data: T;                    // 實際數據
}

// 具體的股票信息 API 響應類型
export type StockInfoResponse = ApiResponse<StockItem[]>;

// 股票詳細數據請求參數
export interface StockMonthRevenueParams {
  data_id: string;      // 股票代碼（必需）
  start_date?: string;   // 開始日期（可選）
  end_date?: string;     // 結束日期（可選）
}

export interface StockMonthRevenueItem {
  date: string;         // 日期 (YYYY-MM-DD 格式)
  stock_id: string;     // 股票代碼
  country: string;      // 國家，如：Taiwan
  revenue: number;      // 營收
  revenue_month: number; // 營收月份
  revenue_year: number;  // 營收年份
  create_time: string;   // 資料創建時間
}

export type StockDetailResponse = ApiResponse<StockMonthRevenueItem[]>;
