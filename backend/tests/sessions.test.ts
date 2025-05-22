import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app';

const prisma = new PrismaClient();
let adminToken: string;
let courseId: number;
let sessionId: number;

beforeAll(async () => {
  // 建立 admin
  await prisma.user.create({
    data: {
      name: 'admin', email: 'admin3@example.com', passwordHash: await require('bcrypt').hash('admin123', 10), role: 'admin'
    }
  });
  // 登入
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin3@example.com', password: 'admin123' });
  adminToken = res.body.token;
  // 建立課程
  const course = await prisma.course.create({
    data: { name: '英文', level: '2', startDate: new Date('2025-07-01'), endDate: new Date('2025-09-01') }
  });
  courseId = course.id;
});

afterAll(async () => {
  await prisma.enrollment.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe('Sessions API', () => {
  it('POST /api/sessions 新增課程場次', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        courseId,
        sessionDate: '2025-07-02',
        startTime: '10:00',
        endTime: '11:00',
        content: '英文第一堂'
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    sessionId = res.body.id;
  });

  it('GET /api/sessions/:sessionId 查詢場次', async () => {
    const res = await request(app)
      .get(`/api/sessions/${sessionId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.content).toBe('英文第一堂');
    expect(res.body.courseId).toBe(courseId);
  });
});
