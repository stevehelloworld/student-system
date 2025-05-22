# 學生出勤系統後端

## 技術棧
- Node.js + Express + TypeScript
- Prisma ORM
- PostgreSQL
- JWT 驗證

## 啟動方式
1. 複製 `.env.example` 並改名為 `.env`，填入資料庫連線資訊與 JWT 密鑰
2. 安裝依賴：`npm install`
3. 初始化資料庫：`npx prisma migrate dev --name init`
4. 啟動開發伺服器：`npm run dev`

## 目錄結構
- `src/`：主要程式碼
- `prisma/`：Prisma schema
- `.env.example`：環境變數範例

## 主要 API 功能
- 使用者認證與管理（含學生欄位）
- 課程、場次、選課、學生表現等 CRUD API
- JWT 驗證

詳細 API 請參見專案根目錄 `API_SPEC.md` 文件。
