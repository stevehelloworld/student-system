# 資料庫設計文件（DB_SCHEMA）

本文件說明學生出勤系統的主要資料表結構，建議使用關聯式資料庫（如 PostgreSQL、MySQL）。

---

## 主要資料表

### 1. users（使用者）
| 欄位         | 型態         | 說明         |
|--------------|--------------|--------------|
| id           | int (PK)     | 使用者ID     |
| name         | varchar      | 姓名         |
| role         | enum         | 角色（admin/teacher/student）|
| email        | varchar      | 電子郵件     |
| password_hash| varchar      | 密碼雜湊     |
| grade        | int/null     | 年級（學生專用）|
| school       | varchar/null | 學校名稱（學生專用）|
| parent_name  | varchar/null | 家長姓名（學生專用）|
| parent_phone | varchar/null | 家長電話（學生專用）|
| student_no   | varchar/null | 學號（學生專用）|
| created_at   | timestamp    | 建立時間     |

### 2. courses（課程）
| 欄位         | 型態         | 說明         |
|--------------|--------------|--------------|
| id           | int (PK)     | 課程ID       |
| name         | varchar      | 課程/班級名稱（可自訂）     |
| level        | varchar/null | 班級等級（如L1、L2…，可為null）|
| start_date   | date         | 課程起始日期 |
| end_date     | date         | 課程結束日期 |
| created_at   | timestamp    | 建立時間     |

### 3. enrollments（選課）
| 欄位         | 型態         | 說明         |
|--------------|--------------|--------------|
| id           | int (PK)     | 編號         |
| course_id    | int (FK)     | 課程ID       |
| student_id   | int (FK)     | 學生ID       |

### 4. sessions（上課場次）
| 欄位         | 型態         | 說明         |
|--------------|--------------|--------------|
| id           | int (PK)     | 場次ID       |
| course_id    | int (FK)     | 課程ID       |
| session_date | date         | 上課日期     |
| start_time   | time         | 開始時間     |
| end_time     | time         | 結束時間     |
| teacher_id   | int (FK)     | 當次授課教師ID |
| content      | text         | 當次課程內容 |

### 5. attendance_records（出勤紀錄）
| 欄位         | 型態         | 說明         |
|--------------|--------------|--------------|
| id           | int (PK)     | 編號         |
| session_id   | int (FK)     | 場次ID       |
| student_id   | int (FK)     | 學生ID       |
| status       | enum         | 狀態（已到/缺課/請假/補課）|
| note         | varchar      | 備註         |
| updated_by   | int (FK)     | 操作者ID     |
| updated_at   | timestamp    | 更新時間     |

### 6. leave_requests（請假申請）
| 欄位         | 型態         | 說明         |
|--------------|--------------|--------------|
| id           | int (PK)     | 編號         |
| session_id   | int (FK)     | 場次ID       |
| student_id   | int (FK)     | 學生ID       |
| type         | enum         | 事假/病假    |
| status       | enum         | active/cancelled |
| created_at   | timestamp    | 申請時間     |
| cancelled_at | timestamp    | 取消時間     |
| created_by   | int (FK)     | 發起人ID（學生/老師）|

### 7. make_up_sessions（補課安排）
| 欄位         | 型態         | 說明         |
|--------------|--------------|--------------|
| id           | int (PK)     | 編號         |
| original_session_id | int (FK) | 原請假場次ID |
| student_id   | int (FK)     | 學生ID       |
| make_up_date | date         | 補課日期     |
| start_time   | time         | 開始時間     |
| end_time     | time         | 結束時間     |
| attendance_status | enum      | 補課出席狀態（已到/缺課）|
| created_by   | int (FK)     | 安排人ID     |
| created_at   | timestamp    | 建立時間     |

### 8. student_performance（課堂學生表現）
| 欄位         | 型態         | 說明         |
|--------------|--------------|--------------|
| id           | int (PK)     | 編號         |
| session_id   | int (FK)     | 場次ID       |
| student_id   | int (FK)     | 學生ID       |
| performance  | text         | 學生課堂表現紀錄 |
| created_by   | int (FK)     | 評分者ID     |
| created_at   | timestamp    | 建立時間     |

---

## 關聯圖（ERD）
- courses 1:N enrollments（學生可跨期修課，enrollments 表設計允許同一學生多次選不同課程）
- sessions 1:N student_performance（每次課堂每位學生可有一筆表現紀錄）

- users 1:N courses
- users 1:N enrollments
- courses 1:N sessions
- sessions 1:N attendance_records
- sessions 1:N leave_requests
- leave_requests 1:N make_up_sessions
- users 1:N attendance_records (updated_by)
- users 1:N leave_requests (created_by)
- users 1:N make_up_sessions (created_by)
