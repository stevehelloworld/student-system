# API 規格文件（API_SPEC）

本文件說明學生出勤系統主要 RESTful API 端點，所有 API 皆回傳 JSON。

---

## 認證

### POST /api/auth/login
- 說明：使用者登入
- 輸入：{ email, password }
- 回傳：{ token }

#### 測試案例摘要
- 登入成功（正確 email/password，回傳 JWT token）
- 登入失敗（錯誤 email/password，回傳 401）
- 缺少 email 或 password，回傳 400

> 實際測試案例可見於 users.test.ts、其他 beforeAll 登入流程

---

## 使用者

### GET /api/users/me
- 說明：取得目前登入者資訊
- 回傳：{ id, name, role, email }

#### 測試案例摘要
- 正確 token 可取得個人資訊（200）
- 未帶 token 或 token 無效，回傳 401

### GET /api/users
- 說明：Admin/Teacher 查詢所有使用者（需權限）
- 回傳：[{ id, name, role, email, grade, school, parent_name, parent_phone, student_no }]

#### 測試案例摘要
- Admin/Teacher 可查詢所有學生（200，回傳學生清單）
- 權限不足（非 admin/teacher），回傳 403

### POST /api/users
- 說明：Admin/Teacher 新增學生
- 輸入：{ name, email, password, role, grade, school, parent_name, parent_phone, student_no, enroll_courses: [course_id, ...] }
- 回傳：{ success, id }

#### 測試案例摘要
- Admin/Teacher 可新增學生（200，回傳 success, id）
- 欄位缺漏（如缺 name、email、password、role），回傳 400
- 權限不足（非 admin/teacher），回傳 403

### PUT /api/users/:userId
- 說明：Admin/Teacher 編輯學生資料
- 輸入：{ name, email, grade, school, parent_name, parent_phone, student_no, enroll_courses }
- 回傳：{ success }

#### 測試案例摘要
- Admin/Teacher 可編輯學生資料（200，回傳 success）
- 欄位缺漏或 userId 不存在，回傳 400/404
- 權限不足（非 admin/teacher），回傳 403

### DELETE /api/users/:userId
- 說明：Admin/Teacher 刪除學生
- 回傳：{ success }

#### 測試案例摘要
- Admin/Teacher 可刪除學生（200，回傳 success）
- 權限不足（非 admin/teacher），回傳 403
- userId 不存在，回傳 404

---

## 課程與場次

### GET /api/courses
- 說明：查詢課程/班級列表（含等級、名稱、起訖日期、學生清單）
- 回傳：[{ id, name, teacher_id, level, start_date, end_date, students: [student_id, ...] }]

#### 測試案例摘要
- 登入後可查詢課程列表（200，回傳課程資料）
- 權限不足或未登入，回傳 401/403

### GET /api/courses/:courseId/sessions
- 說明：查詢課程場次
- 回傳：[{ id, session_date, start_time, end_time, teacher_id, content }]

#### 測試案例摘要
- 登入後可查詢課程場次（200，回傳場次資料）
- 權限不足或未登入，回傳 401/403
- courseId 不存在，回傳空陣列

### PUT /api/sessions/:sessionId
- 說明：編輯單一場次資訊（如教師、課程內容、時間）
- 輸入：{ session_date, start_time, end_time, teacher_id, content }
- 回傳：{ success }

#### 測試案例摘要
- Admin/Teacher 可編輯場次（200，回傳 success）
- 欄位缺漏或 sessionId 不存在，回傳 400/404
- 權限不足（非 admin/teacher），回傳 403

### GET /api/sessions/:sessionId/performance
- 說明：查詢該場次所有學生的表現紀錄
- 回傳：[{ student_id, performance }]

#### 測試案例摘要
- 登入後可查詢場次表現（200，回傳表現資料）
- 權限不足或未登入，回傳 401/403
- sessionId 不存在，回傳空陣列

### PUT /api/sessions/:sessionId/performance/:studentId
- 說明：記錄/編輯單一學生於該場次的表現
- 輸入：{ performance }
- 回傳：{ success }

#### 測試案例摘要
- Admin/Teacher 可編輯學生表現（200，回傳 success）
- 欄位缺漏或 sessionId/studentId 不存在，回傳 400/404
- 權限不足（非 admin/teacher），回傳 403

---

## 出勤紀錄

### GET /api/sessions/:sessionId/attendance
- 說明：查詢場次所有學生出勤紀錄（教師）
- 回傳：[{ student_id, status, note }]

#### 測試案例摘要
- 登入後可查詢出勤紀錄（200，回傳出勤資料）
- 權限不足或未登入，回傳 401/403
- sessionId 不存在，回傳空陣列

### PUT /api/sessions/:sessionId/attendance/:studentId
- 說明：教師標記/更改學生出勤狀態
- 輸入：{ status, note }
- 回傳：{ success }

#### 測試案例摘要
- Admin/Teacher 可標記/更改學生出勤（200，回傳 success）
- 欄位缺漏或 sessionId/studentId 不存在，回傳 400/404
- 權限不足（非 admin/teacher），回傳 403

### GET /api/users/me/attendance
- 說明：學生查詢自己所有出勤紀錄
- 回傳：[{ session_id, course_id, status, note }]

#### 測試案例摘要
- 學生可查詢自己出勤紀錄（200，回傳出勤資料）
- 權限不足或未登入，回傳 401/403

---

## 請假

### POST /api/sessions/:sessionId/leave
- 說明：學生申請請假（事假/病假）
- 輸入：{ type } // 事假/病假
- 回傳：{ success }

#### 測試案例摘要
- 學生可申請請假（200，回傳 success）
- 欄位缺漏（如缺 type），回傳 400
- 權限不足（非 student），回傳 403

### DELETE /api/leave_requests/:leaveId
- 說明：學生於期限內取消請假
- 回傳：{ success }

#### 測試案例摘要
- 學生可取消請假（200，回傳 success）
- 權限不足（非 student），回傳 403
- leaveId 不存在，回傳 404

### PUT /api/sessions/:sessionId/leave/:studentId
- 說明：教師登記/更改學生請假
- 輸入：{ type }
- 回傳：{ success }

---

## 補課

### POST /api/leave_requests/:leaveId/make_up
- 說明：教師安排補課
- 輸入：{ make_up_date, start_time, end_time }
- 回傳：{ success, make_up_session_id }

### PUT /api/make_up_sessions/:makeUpSessionId/attendance
- 說明：教師記錄補課出席狀態
- 輸入：{ attendance_status }
- 回傳：{ success }

### GET /api/users/me/make_up_sessions
- 說明：學生查詢自己的補課安排與出席狀態
- 回傳：[{ make_up_session_id, original_session_id, make_up_date, attendance_status }]

---

## 其他

### GET /api/reports/attendance
- 說明：教師匯出出勤報表
- 輸入：{ course_id, date_range }
- 回傳：CSV 或 JSON
