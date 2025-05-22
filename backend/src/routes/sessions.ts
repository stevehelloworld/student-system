import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/sessions/:sessionId
router.get('/:sessionId', authenticateToken, async (req, res) => {
  const { sessionId } = req.params;
  const session = await prisma.session.findUnique({
    where: { id: Number(sessionId) },
    include: {
      course: true,
      teacher: true,
      attendanceRecords: true,
      performances: true
    }
  });
  if (!session) return res.status(404).json({ error: '找不到場次' });
  res.json(session);
});

// POST /api/sessions 新增課程場次（限 admin/teacher）
router.post('/', authenticateToken, authorizeRoles('admin', 'teacher'), async (req, res) => {
  const { courseId, sessionDate, startTime, endTime, teacherId, content } = req.body;
  if (!courseId || !sessionDate || !startTime || !endTime) return res.status(400).json({ error: '缺少必要欄位' });
  try {
    const session = await prisma.session.create({
      data: { courseId, sessionDate: new Date(sessionDate), startTime, endTime, teacherId, content }
    });
    res.json({ success: true, id: session.id });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
