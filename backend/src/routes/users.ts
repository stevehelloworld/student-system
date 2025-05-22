import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { authenticateToken, authorizeRoles, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/users/me
router.get('/me', authenticateToken, async (req: AuthRequest, res) => {
  if (!req.user) return res.status(401).json({ error: '未登入' });
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(404).json({ error: '找不到使用者' });
  const { id, name, role, email } = user;
  res.json({ id, name, role, email });
});

// GET /api/users
router.get('/', authenticateToken, authorizeRoles('admin', 'teacher'), async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true, name: true, role: true, email: true, grade: true, school: true, parentName: true, parentPhone: true, studentNo: true
    }
  });
  res.json(users);
});

// POST /api/users
router.post('/', authenticateToken, authorizeRoles('admin', 'teacher'), async (req, res) => {
  const { name, email, password, role, grade, school, parent_name, parent_phone, student_no, enroll_courses } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ error: '缺少必要欄位' });
  const hash = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        name, email, passwordHash: hash, role,
        grade, school,
        parentName: parent_name, parentPhone: parent_phone, studentNo: student_no,
        enrollments: enroll_courses && enroll_courses.length > 0 ? {
          create: enroll_courses.map((courseId: number) => ({ courseId }))
        } : undefined
      }
    });
    res.json({ success: true, id: user.id });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// PUT /api/users/:userId
router.put('/:userId', authenticateToken, authorizeRoles('admin', 'teacher'), async (req, res) => {
  const { name, email, grade, school, parent_name, parent_phone, student_no, enroll_courses } = req.body;
  const { userId } = req.params;
  try {
    const user = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        name, email, grade, school,
        parentName: parent_name, parentPhone: parent_phone, studentNo: student_no
      }
    });
    if (enroll_courses) {
      // 先刪除舊的，再新增
      await prisma.enrollment.deleteMany({ where: { studentId: Number(userId) } });
      await prisma.enrollment.createMany({ data: enroll_courses.map((courseId: number) => ({ studentId: Number(userId), courseId })) });
    }
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE /api/users/:userId
router.delete('/:userId', authenticateToken, authorizeRoles('admin', 'teacher'), async (req, res) => {
  const { userId } = req.params;
  try {
    await prisma.enrollment.deleteMany({ where: { studentId: Number(userId) } });
    await prisma.user.delete({ where: { id: Number(userId) } });
    res.json({ success: true });
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
