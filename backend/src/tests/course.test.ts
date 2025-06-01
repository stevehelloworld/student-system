import request from 'supertest';
import { AppDataSource } from '../config/database';
import { app } from '../app';
import { User, UserRole } from '../models/User';
import { Course } from '../models/Course';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import '@jest/globals';

describe('課程功能測試', () => {
  let teacherToken: string;
  let studentToken: string;
  let teacher: User;
  let student: User;
  let course: Course;

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

    // 生成 JWT token
    teacherToken = jwt.sign(
      { id: teacher.id, role: teacher.role },
      process.env.JWT_SECRET || 'your-secret-key'
    );

    studentToken = jwt.sign(
      { id: student.id, role: student.role },
      process.env.JWT_SECRET || 'your-secret-key'
    );

    // 建立測試課程
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
  });

  describe('建立課程', () => {
    it('教師可以建立課程', async () => {
      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          name: '新課程',
          description: '這是一個新課程',
          capacity: 20,
          start_date: new Date('2024-03-01'),
          end_date: new Date('2024-06-30'),
          schedule: '每週一 19:00-21:00',
          location: '線上課程',
          price: 5000
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.course).toHaveProperty('id');
    });

    it('學生不能建立課程', async () => {
      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          name: '新課程',
          description: '這是一個新課程',
          capacity: 20,
          start_date: new Date('2024-03-01'),
          end_date: new Date('2024-06-30'),
          schedule: '每週一 19:00-21:00',
          location: '線上課程',
          price: 5000
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });

    it('缺少必要欄位應該建立失敗', async () => {
      const response = await request(app)
        .post('/api/courses')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          name: '新課程',
          description: '這是一個新課程'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('查詢課程', () => {
    it('可以查詢所有課程', async () => {
      const response = await request(app)
        .get('/api/courses')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.courses).toBeInstanceOf(Array);
    });

    it('可以查詢單一課程', async () => {
      const response = await request(app)
        .get(`/api/courses/${course.id}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.course.id).toBe(course.id);
    });

    it('查詢不存在的課程應該失敗', async () => {
      const response = await request(app)
        .get('/api/courses/999')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('更新課程', () => {
    it('教師可以更新自己的課程', async () => {
      const response = await request(app)
        .put(`/api/courses/${course.id}`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          name: '更新後的課程',
          description: '這是更新後的課程',
          capacity: 20,
          start_date: new Date('2024-03-01'),
          end_date: new Date('2024-06-30'),
          schedule: '每週一 19:00-21:00',
          location: '線上課程',
          price: 5000
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.course.name).toBe('更新後的課程');
    });

    it('教師不能更新其他教師的課程', async () => {
      // 建立另一個教師
      const otherTeacher = await AppDataSource.getRepository(User).save({
        name: '其他教師',
        email: 'other.teacher@example.com',
        password: await bcrypt.hash('Test123!@#', 10),
        role: UserRole.TEACHER
      });

      const otherTeacherToken = jwt.sign(
        { id: otherTeacher.id, role: otherTeacher.role },
        process.env.JWT_SECRET || 'your-secret-key'
      );

      const response = await request(app)
        .put(`/api/courses/${course.id}`)
        .set('Authorization', `Bearer ${otherTeacherToken}`)
        .send({
          name: '更新後的課程',
          description: '這是更新後的課程',
          capacity: 20,
          start_date: new Date('2024-03-01'),
          end_date: new Date('2024-06-30'),
          schedule: '每週一 19:00-21:00',
          location: '線上課程',
          price: 5000
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('刪除課程', () => {
    it('教師可以刪除自己的課程', async () => {
      const response = await request(app)
        .delete(`/api/courses/${course.id}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('message');
    });

    it('教師不能刪除其他教師的課程', async () => {
      // 建立另一個教師
      const otherTeacher = await AppDataSource.getRepository(User).save({
        name: '其他教師',
        email: 'other.teacher@example.com',
        password: await bcrypt.hash('Test123!@#', 10),
        role: UserRole.TEACHER
      });

      const otherTeacherToken = jwt.sign(
        { id: otherTeacher.id, role: otherTeacher.role },
        process.env.JWT_SECRET || 'your-secret-key'
      );

      const response = await request(app)
        .delete(`/api/courses/${course.id}`)
        .set('Authorization', `Bearer ${otherTeacherToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 