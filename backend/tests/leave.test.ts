import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app';

const prisma = new PrismaClient();
let studentToken: string;
let adminToken: string;
let courseId: number;
let sessionId: number;
let leaveId: number;

beforeAll(async () => {
  // 建立 admin
  await prisma.user.create({
    data: {
      name: 'admin', email: 'admin5@example.com', passwordHash: await require('bcrypt').hash('admin123', 10), role: 'admin'
    }
  });
  // 建立學生
  await prisma.user.create({
    data: {
      name: '學生C', email: 'stuC@example.com', passwordHash: await require('bcrypt').hash('stu123', 10), role: 'student'
    }
  });
  // 登入
  const adminRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin5@example.com', password: 'admin123' });
  adminToken = adminRes.body.token;
  const stuRes = await request(app)
    .post('/api/auth/login')
    .send({ email: 'stuC@example.com', password: 'stu123' });
  studentToken = stuRes.body.token;
  // 建立課程
  const course = await prisma.course.create({
    data: { name: '音樂', level: '1', startDate: new Date('2025-09-01'), endDate: new Date('2025-10-01') }
  });
  courseId = course.id;
  // 建立場次
  const session = await prisma.session.create({
    data: {
      courseId,
      sessionDate: new Date('2025-09-02'),
      startTime: '13:00',
      endTime: '14:00',
      content: '音樂第一堂'
    }
  });
  sessionId = session.id;
});

afterAll(async () => {
  await prisma.leaveRequest.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe('Leave API', () => {
  it('POST /api/leave/:sessionId 學生請假申請', async () => {
    const res = await request(app)
      .post(`/api/leave/${sessionId}`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ reason: '感冒' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    leaveId = res.body.id;
  });

  it('GET /api/leave/:sessionId 查詢請假紀錄', async () => {
    const res = await request(app)
      .get(`/api/leave/${sessionId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].reason).toBe('感冒');
    expect(res.body[0].status).toBe('pending');
  });

  it('PUT /api/leave/:leaveId 審核請假', async () => {
    const res = await request(app)
      .put(`/api/leave/${leaveId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'approved' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
