import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app';

const prisma = new PrismaClient();
let adminToken: string;
let courseId: number;

beforeAll(async () => {
  // 建立 admin
  await prisma.user.create({
    data: {
      name: 'admin', email: 'admin2@example.com', passwordHash: await require('bcrypt').hash('admin123', 10), role: 'admin'
    }
  });
  // 登入
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin2@example.com', password: 'admin123' });
  adminToken = res.body.token;
  // 建立課程
  const course = await prisma.course.create({
    data: { name: '數學', level: '3', startDate: new Date('2025-06-01'), endDate: new Date('2025-08-01') }
  });
  courseId = course.id;
  // 建立課程場次
  await prisma.session.create({
    data: {
      courseId,
      sessionDate: new Date('2025-06-02'),
      startTime: '09:00',
      endTime: '10:00',
      content: '第一堂課'
    }
  });
});

afterAll(async () => {
  await prisma.enrollment.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe('Courses API', () => {
  it('GET /api/courses', async () => {
    const res = await request(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].name).toBe('數學');
  });

  it('GET /api/courses/:courseId/sessions', async () => {
    const res = await request(app)
      .get(`/api/courses/${courseId}/sessions`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].content).toBe('第一堂課');
  });
});
