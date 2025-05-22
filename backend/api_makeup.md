# 補課 (MakeUpSession) API 文件

## 權限
- 除查詢學生自己補課外，僅 admin/teacher 可操作

## 建立補課
- **POST** `/api/makeup`
- 權限：admin, teacher
- Body:
```json
{
  "originalSessionId": 1,
  "studentId": 2,
  "makeUpDate": "2025-09-20",
  "startTime": "14:00",
  "endTime": "15:00",
  "content": "補課說明",
  "leaveRequestId": 3 // 選填
}
```
- 回應：`{ success: true, id: <makeupId> }`

---

## 查詢所有補課
- **GET** `/api/makeup`
- 權限：admin, teacher
- 回傳：補課陣列，每筆包含 student、originalSession、createdBy、leaveRequest

---

## 查詢某學生補課
- **GET** `/api/makeup/student/:studentId`
- 權限：admin, teacher, student(本人)
- 回傳：補課陣列（同上）

---

## 編輯補課
- **PUT** `/api/makeup/:makeupId`
- 權限：admin, teacher
- Body: 可傳 makeUpDate, startTime, endTime, attendanceStatus, content
- 回應：`{ success: true }`

---

## 刪除補課
- **DELETE** `/api/makeup/:makeupId`
- 權限：admin, teacher
- 回應：`{ success: true }`

---

## 資料結構範例
```json
{
  "id": 1,
  "originalSessionId": 1,
  "studentId": 2,
  "makeUpDate": "2025-09-20T00:00:00.000Z",
  "startTime": "14:00",
  "endTime": "15:00",
  "attendanceStatus": "未簽到",
  "content": "補課說明",
  "createdById": 3,
  "createdAt": "2025-05-22T01:55:33.000Z",
  "leaveRequestId": 4,
  "student": { "id": 2, "name": "補課學生", "email": "makeup-student@example.com", "studentNo": null },
  "originalSession": { ... },
  "createdBy": { "id": 3, "name": "補課管理員" },
  "leaveRequest": { ... }
}
```

---

## 備註
- 欄位 `attendanceStatus` 預設 "未簽到"，可被老師/管理員更新。
- 欄位 `content` 為補課說明。
- 欄位 `leaveRequestId` 可選，若有對應請假紀錄可關聯。
