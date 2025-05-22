import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from '../src/app';

const prisma = new PrismaClient();
let adminToken: string;

beforeAll(async () => {
  // 建立一個 admin 帳號
  await prisma.user.create({
    data: {
      name: 'admin', email: 'admin@example.com', passwordHash: await require('bcrypt').hash('admin123', 10), role: 'admin'
    }
  });
  // 登入取得 token
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@example.com', password: 'admin123' });
  adminToken = res.body.token;
});

afterAll(async () => {
  await prisma.user.deleteMany({});
  await prisma.$disconnect();
});

describe('User API', () => {
  it('GET /api/users/me', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('admin@example.com');
  });

  it('POST /api/users 新增學生', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: '學生A', email: 'stuA@example.com', password: 'stu123', role: 'student',
        grade: 3, school: 'XX國小', parent_name: '家長A', parent_phone: '0911111111', student_no: 'S001', enroll_courses: []
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('GET /api/users 查詢所有學生', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find((u: any) => u.email === 'stuA@example.com')).toBeTruthy();
  });
});
