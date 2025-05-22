import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/courses
router.get('/', authenticateToken, async (req, res) => {
  const courses = await prisma.course.findMany({
    include: {
      enrollments: { select: { studentId: true } }
    }
  });
  res.json(courses.map(c => ({
    id: c.id,
    name: c.name,
    level: c.level,
    start_date: c.startDate,
    end_date: c.endDate,
    students: c.enrollments.map(e => e.studentId)
  })));
});

// GET /api/courses/:courseId/sessions
router.get('/:courseId/sessions', authenticateToken, async (req, res) => {
  const { courseId } = req.params;
  const sessions = await prisma.session.findMany({
    where: { courseId: Number(courseId) },
    select: {
      id: true, sessionDate: true, startTime: true, endTime: true, teacherId: true, content: true
    },
    orderBy: { sessionDate: 'asc' }
  });
  res.json(sessions.map(s => ({
    id: s.id,
    session_date: s.sessionDate,
    start_time: s.startTime,
    end_time: s.endTime,
    teacher_id: s.teacherId,
    content: s.content
  })));
});

// POST /api/courses
router.post('/', authenticateToken, authorizeRoles('admin', 'teacher'), async (req, res) => {
  const { name, level, start_date, end_date } = req.body;
  if (!name || !level || !start_date || !end_date) {
    return res.status(400).json({ error: '缺少必要欄位' });
  }
  try {
    const course = await prisma.course.create({
      data: {
        name,
        level,
        startDate: new Date(start_date),
        endDate: new Date(end_date),
      },
    });
    res.json({ success: true, id: course.id });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
