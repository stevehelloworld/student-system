import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app';

const prisma = new PrismaClient();
let adminToken: string;
let studentId: number;
let originalSessionId: number;
let makeUpId: number;

beforeAll(async () => {
  // 建立 admin
  await prisma.user.deleteMany({ where: { email: { in: ['makeup-admin@example.com', 'makeup-student@example.com'] } } });
  await prisma.user.create({
    data: {
      name: '補課管理員', email: 'makeup-admin@example.com', passwordHash: await require('bcrypt').hash('admin123', 10), role: 'admin'
    }
  });
  const stu = await prisma.user.create({
    data: {
      name: '補課學生', email: 'makeup-student@example.com', passwordHash: await require('bcrypt').hash('stu123', 10), role: 'student'
    }
  });
  studentId = stu.id;
  // 登入
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'makeup-admin@example.com', password: 'admin123' });
  adminToken = res.body.token;
  // 建立課程與場次
  const course = await prisma.course.create({
    data: { name: '補課課程', level: '1', startDate: new Date('2025-09-01'), endDate: new Date('2025-09-30') }
  });
  const session = await prisma.session.create({
    data: {
      courseId: course.id,
      sessionDate: new Date('2025-09-10'),
      startTime: '10:00',
      endTime: '11:00',
      content: '原始課堂'
    }
  });
  originalSessionId = session.id;
});

afterAll(async () => {
  await prisma.makeUpSession.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe('MakeUpSession API', () => {
  it('POST /api/makeup 建立補課', async () => {
    const res = await request(app)
      .post('/api/makeup')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        originalSessionId,
        studentId,
        makeUpDate: '2025-09-20',
        startTime: '14:00',
        endTime: '15:00',
        content: '補課說明'
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    makeUpId = res.body.id;
  });

  it('GET /api/makeup 查詢所有補課', async () => {
    const res = await request(app)
      .get('/api/makeup')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].content).toBe('補課說明');
  });

  it('GET /api/makeup/student/:studentId 查詢學生補課', async () => {
    const res = await request(app)
      .get(`/api/makeup/student/${studentId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].student.id).toBe(studentId);
  });

  it('PUT /api/makeup/:makeupId 編輯補課', async () => {
    const res = await request(app)
      .put(`/api/makeup/${makeUpId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ content: '補課說明-修改', attendanceStatus: '已到' });
    expect(res.status).toBe(200);
    const updated = await prisma.makeUpSession.findUnique({ where: { id: makeUpId } });
    expect(updated?.content).toBe('補課說明-修改');
    expect(updated?.attendanceStatus).toBe('已到');
  });

  it('DELETE /api/makeup/:makeupId 刪除補課', async () => {
    const res = await request(app)
      .delete(`/api/makeup/${makeUpId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    const deleted = await prisma.makeUpSession.findUnique({ where: { id: makeUpId } });
    expect(deleted).toBeNull();
  });
});
