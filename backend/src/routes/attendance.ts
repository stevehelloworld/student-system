import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/attendance
router.get('/', authenticateToken, async (req, res) => {
  const { studentId } = req.query;
  let where: any = {};
  if (studentId) {
    where.studentId = Number(studentId);
  }
  const records = await prisma.attendanceRecord.findMany({
    where,
    include: {
      student: { select: { id: true, name: true, email: true, studentNo: true } },
      updatedBy: { select: { id: true, name: true } }
    }
  });
  res.json(records.map(r => ({
    id: r.id,
    student: r.student,
    status: r.status,
    note: r.note,
    updatedBy: r.updatedBy,
    updatedAt: r.updatedAt
  })));
});

// GET /api/attendance/:sessionId
router.get('/:sessionId', authenticateToken, async (req, res) => {
  const { sessionId } = req.params;
  const records = await prisma.attendanceRecord.findMany({
    where: { sessionId: Number(sessionId) },
    include: {
      student: { select: { id: true, name: true, email: true, studentNo: true } },
      updatedBy: { select: { id: true, name: true } }
    }
  });
  res.json(records.map(r => ({
    id: r.id,
    student: r.student,
    status: r.status,
    note: r.note,
    updatedBy: r.updatedBy,
    updatedAt: r.updatedAt
  })));
});

// POST /api/attendance/:sessionId 批次更新/新增出席紀錄（限 admin/teacher）
router.post('/:sessionId', authenticateToken, authorizeRoles('admin', 'teacher'), async (req: AuthRequest, res) => {
  const { sessionId } = req.params;
  const { records } = req.body; // [{studentId, status, note}]
  if (!Array.isArray(records)) return res.status(400).json({ error: 'records 欄位必須為陣列' });
  try {
    for (const rec of records) {
      await prisma.attendanceRecord.upsert({
        where: {
          sessionId_studentId: { sessionId: Number(sessionId), studentId: rec.studentId }
        },
        update: {
          status: rec.status,
          note: rec.note,
          updatedById: req.user.id
        },
        create: {
          sessionId: Number(sessionId),
          studentId: rec.studentId,
          status: rec.status,
          note: rec.note,
          updatedById: req.user.id
        }
      });
    }
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
