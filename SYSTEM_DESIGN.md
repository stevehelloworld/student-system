# 系統設計文件（SYSTEM_DESIGN）

本文件說明學生出勤系統的架構、前後端分離設計與主要元件。

---

## 架構概覽

- 前端（Web & App）：React/Vue/Flutter 等框架，透過 RESTful API 與後端通訊。
- 後端：Node.js (Express)、Python (FastAPI/Django)、或其他支援 RESTful API 的框架。
- 資料庫：PostgreSQL/MySQL。
- API 授權：JWT Token 驗證。

---

## 前後端分離設計

- 前端僅負責 UI、資料顯示與 API 呼叫。
- 後端僅負責資料存取、業務邏輯與 API 驗證。
- 支援多平台（Web、App）。

---

## 主要元件

### 前端
- 使用者登入/註冊
- 學生出勤查詢、請假、補課
- 教師標記出勤、補課安排、請假管理
- 行動裝置友善設計

### 後端
- 使用者管理（Admin/教師/學生）
- 課程/班級與等級管理（支援自訂與預設等級）
- 課程與場次管理
- 出勤紀錄管理
- 請假申請與取消
- 補課安排與出席紀錄
- 權限控管與 API 驗證

---

## 資料流程

1. 前端登入，取得 JWT Token。
2. 前端以 Token 呼叫 API 取得/更新資料。
3. 後端驗證 Token，執行資料存取與邏輯處理。
4. 回傳結果給前端顯示。

---

## APP 支援

- 所有功能皆以 API 提供，方便行動裝置（iOS/Android）開發。
- 推薦使用 Flutter/React Native 實作 APP。

---

## 安全性

- 所有敏感操作需驗證 JWT Token。
- 重要資料（如密碼）需加密儲存。
- API 請求皆須經過權限檢查。
