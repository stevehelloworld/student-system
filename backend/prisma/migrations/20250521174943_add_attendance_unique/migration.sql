/*
  Warnings:

  - A unique constraint covering the columns `[sessionId,studentId]` on the table `AttendanceRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AttendanceRecord_sessionId_studentId_key" ON "AttendanceRecord"("sessionId", "studentId");
