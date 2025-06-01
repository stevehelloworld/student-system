import request from 'supertest';
import { AppDataSource } from '../config/database';
import { app } from '../app';
import { User, UserRole } from '../models/User';
import { Course } from '../models/Course';
import { Session } from '../models/Session';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import '@jest/globals';

describe('請假功能測試', () => {
  let studentToken: string;
  let teacherToken: string;
  let student: User;
  let teacher: User;
  let course: Course;
  let session: Session;

  beforeEach(async () => {
    // 建立測試使用者
    const userRepository = AppDataSource.getRepository(User);
    teacher = await userRepository.save({
      name: '測試教師',
      email: 'teacher@example.com',
      password: await bcrypt.hash('Test123!@#', 10),
      role: UserRole.TEACHER
    });
    student = await userRepository.save({
      name: '測試學生',
      email: 'student@example.com',
      password: await bcrypt.hash('Test123!@#', 10),
      role: UserRole.STUDENT,
      grade: 10,
      school: '測試高中',
      parent_name: '測試家長',
      parent_phone: '0912345678'
    });
    teacherToken = jwt.sign(
      { id: teacher.id, role: teacher.role },
      process.env.JWT_SECRET || 'your-secret-key'
    );
    studentToken = jwt.sign(
      { id: student.id, role: student.role },
      process.env.JWT_SECRET || 'your-secret-key'
    );
    // 建立課程與場次
    const courseRepository = AppDataSource.getRepository(Course);
    course = await courseRepository.save({
      name: '測試課程',
      description: '這是一個測試課程',
      teacher_id: teacher.id,
      capacity: 20,
      start_date: new Date('2024-03-01'),
      end_date: new Date('2024-06-30'),
      schedule: '每週一 19:00-21:00',
      location: '線上課程',
      price: 5000
    });
    const sessionRepository = AppDataSource.getRepository(Session);
    session = await sessionRepository.save({
      title: '第一堂課',
      description: '課程介紹',
      session_date: new Date('2024-03-01'),
      start_time: '19:00',
      end_time: '21:00',
      location: '線上課程',
      course_id: course.id
    });
  });

  it('學生可以申請事假', async () => {
    const response = await request(app)
      .post(`/api/sessions/${session.id}/leave`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ type: '事假' });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('學生可以申請病假', async () => {
    const response = await request(app)
      .post(`/api/sessions/${session.id}/leave`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ type: '病假' });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('type 欄位驗證失敗', async () => {
    const response = await request(app)
      .post(`/api/sessions/${session.id}/leave`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ type: '隨便' });
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('未登入不可申請請假', async () => {
    const response = await request(app)
      .post(`/api/sessions/${session.id}/leave`)
      .send({ type: '事假' });
    expect(response.status).toBe(401);
  });

  it('教師不可申請請假', async () => {
    const response = await request(app)
      .post(`/api/sessions/${session.id}/leave`)
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ type: '事假' });
    expect(response.status).toBe(403);
  });
}); 