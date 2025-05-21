# API 規格文件（API_SPEC）

本文件說明學生出勤系統主要 RESTful API 端點，所有 API 皆回傳 JSON。

---

## 認證

### POST /api/auth/login
- 說明：使用者登入
- 輸入：{ email, password }
- 回傳：{ token }

---

## 使用者

### GET /api/users/me
- 說明：取得目前登入者資訊
- 回傳：{ id, name, role, email }

### GET /api/users
- 說明：Admin/Teacher 查詢所有使用者（需權限）
- 回傳：[{ id, name, role, email, grade, school, parent_name, parent_phone, student_no }]

### POST /api/users
- 說明：Admin/Teacher 新增學生
- 輸入：{ name, email, password, role, grade, school, parent_name, parent_phone, student_no, enroll_courses: [course_id, ...] }
- 回傳：{ success, id }

### PUT /api/users/:userId
- 說明：Admin/Teacher 編輯學生資料
- 輸入：{ name, email, grade, school, parent_name, parent_phone, student_no, enroll_courses }
- 回傳：{ success }

### DELETE /api/users/:userId
- 說明：Admin/Teacher 刪除學生
- 回傳：{ success }

---

## 課程與場次

### GET /api/courses
- 說明：查詢課程/班級列表（含等級、名稱、起訖日期、學生清單）
- 回傳：[{ id, name, teacher_id, level, start_date, end_date, students: [student_id, ...] }]

### GET /api/courses/:courseId/sessions
- 說明：查詢課程場次
- 回傳：[{ id, session_date, start_time, end_time, teacher_id, content }]

### PUT /api/sessions/:sessionId
- 說明：編輯單一場次資訊（如教師、課程內容、時間）
- 輸入：{ session_date, start_time, end_time, teacher_id, content }
- 回傳：{ success }

### GET /api/sessions/:sessionId/performance
- 說明：查詢該場次所有學生的表現紀錄
- 回傳：[{ student_id, performance }]

### PUT /api/sessions/:sessionId/performance/:studentId
- 說明：記錄/編輯單一學生於該場次的表現
- 輸入：{ performance }
- 回傳：{ success }

---

## 出勤紀錄

### GET /api/sessions/:sessionId/attendance
- 說明：查詢場次所有學生出勤紀錄（教師）
- 回傳：[{ student_id, status, note }]

### PUT /api/sessions/:sessionId/attendance/:studentId
- 說明：教師標記/更改學生出勤狀態
- 輸入：{ status, note }
- 回傳：{ success }

### GET /api/users/me/attendance
- 說明：學生查詢自己所有出勤紀錄
- 回傳：[{ session_id, course_id, status, note }]

---

## 請假

### POST /api/sessions/:sessionId/leave
- 說明：學生申請請假（事假/病假）
- 輸入：{ type } // 事假/病假
- 回傳：{ success }

### DELETE /api/leave_requests/:leaveId
- 說明：學生於期限內取消請假
- 回傳：{ success }

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
