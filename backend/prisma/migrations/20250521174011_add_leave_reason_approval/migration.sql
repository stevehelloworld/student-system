/*
  Warnings:

  - You are about to drop the column `cancelledAt` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `LeaveRequest` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `LeaveRequest` table. All the data in the column will be lost.
  - Added the required column `reason` to the `LeaveRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LeaveRequest" DROP CONSTRAINT "LeaveRequest_createdById_fkey";

-- DropIndex
DROP INDEX "AttendanceRecord_sessionId_studentId_key";

-- AlterTable
ALTER TABLE "LeaveRequest" DROP COLUMN "cancelledAt",
DROP COLUMN "createdById",
DROP COLUMN "type",
ADD COLUMN     "approvedAt" TIMESTAMP(3),
ADD COLUMN     "approvedById" INTEGER,
ADD COLUMN     "reason" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
