import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app';

const prisma = new PrismaClient();
let adminToken: string;
let courseId: number;
let sessionId: number;
let studentId: number;

beforeAll(async () => {
  // 確保測試用的 admin 和學生不存在，避免 unique constraint error
  await prisma.user.deleteMany({ where: { email: { in: ['admin4@example.com', 'stuB@example.com'] } } });
  // 建立 admin
  await prisma.user.create({
    data: {
      name: 'admin', email: 'admin4@example.com', passwordHash: await require('bcrypt').hash('admin123', 10), role: 'admin'
    }
  });
  // 建立學生
  const stu = await prisma.user.create({
    data: {
      name: '學生B', email: 'stuB@example.com', passwordHash: await require('bcrypt').hash('stu123', 10), role: 'student'
    }
  });
  studentId = stu.id;
  // 登入
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin4@example.com', password: 'admin123' });
  adminToken = res.body.token;
  // 建立課程
  const course = await prisma.course.create({
    data: { name: '科學', level: '2', startDate: new Date('2025-08-01'), endDate: new Date('2025-09-01') }
  });
  courseId = course.id;
  // 建立場次
  const session = await prisma.session.create({
    data: {
      courseId,
      sessionDate: new Date('2025-08-02'),
      startTime: '10:00',
      endTime: '11:00',
      content: '科學第一堂'
    }
  });
  sessionId = session.id;
  // 建立選課紀錄
  await prisma.enrollment.create({
    data: {
      courseId,
      studentId
    }
  });
});

afterAll(async () => {
  await prisma.attendanceRecord.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe('Attendance API', () => {
  it('POST /api/attendance/:sessionId 批次新增/更新出席', async () => {
    expect(sessionId).toBeDefined();
    expect(studentId).toBeDefined();
    const res = await request(app)
      .post(`/api/attendance/${sessionId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        records: [
          { studentId, status: '已到', note: '準時' }
        ]
      });
    if (res.status !== 200) {
      console.log('POST /api/attendance response:', res.body);
    }
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/attendance/:sessionId 查詢出席', async () => {
    expect(sessionId).toBeDefined();
    const res = await request(app)
      .get(`/api/attendance/${sessionId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].student).toBeDefined(); // 若 student 為 undefined，顯示錯誤
    expect(res.body[0].student.name).toBe('學生B');
    expect(res.body[0].status).toBe('已到');
    expect(res.body[0].note).toBe('準時');
  });
});
