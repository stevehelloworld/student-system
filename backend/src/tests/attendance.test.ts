import request from 'supertest';
import { AppDataSource } from '../config/database';
import { app } from '../app';
import { User, UserRole } from '../models/User';
import { Course } from '../models/Course';
import { Session } from '../models/Session';
import { AttendanceRecord, AttendanceStatus } from '../models/AttendanceRecord';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import '@jest/globals';

describe('出勤記錄功能測試', () => {
  let teacherToken: string;
  let studentToken: string;
  let teacher: User;
  let student: User;
  let course: Course;
  let session: Session;
  let attendance: AttendanceRecord;

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

    // 建立測試課程單元
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

    // 建立測試出勤記錄
    const attendanceRepository = AppDataSource.getRepository(AttendanceRecord);
    attendance = await attendanceRepository.save({
      session_id: session.id,
      student_id: student.id,
      status: AttendanceStatus.PRESENT,
      check_in_time: new Date('2024-03-01T19:00:00'),
      check_out_time: new Date('2024-03-01T21:00:00')
    });
  });

  describe('建立出勤記錄', () => {
    it('教師可以建立出勤記錄', async () => {
      const response = await request(app)
        .post('/api/attendances')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          session_id: session.id,
          student_id: student.id,
          attendance_status: 'PRESENT',
          check_in_time: '2024-03-01T19:00:00.000Z',
          check_out_time: '2024-03-01T21:00:00.000Z',
          test_field: 'hello'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.attendances).toHaveLength(1);
      expect(response.body.data.attendances[0]).toHaveProperty('id');
      expect(response.body.data.attendances[0].attendance_status).toBe('PRESENT');
    });

    it('學生不能建立出勤記錄', async () => {
      const response = await request(app)
        .post('/api/attendances')
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          session_id: session.id,
          student_id: student.id,
          attendance_status: 'PRESENT',
          check_in_time: '2024-03-01T19:00:00.000Z',
          check_out_time: '2024-03-01T21:00:00.000Z'
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });

    it('缺少必要欄位應該建立失敗', async () => {
      const response = await request(app)
        .post('/api/attendances')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          session_id: session.id,
          student_id: student.id
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('查詢出勤記錄', () => {
    it('可以查詢所有出勤記錄', async () => {
      const response = await request(app)
        .get('/api/attendances')
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.attendances).toBeInstanceOf(Array);
    });

    it('可以查詢單一出勤記錄', async () => {
      const response = await request(app)
        .get(`/api/attendances/${attendance.id}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.attendances).toHaveLength(1);
      expect(response.body.data.attendances[0].id).toBe(attendance.id);
    });

    it('可以查詢課程單元的所有出勤記錄', async () => {
      const response = await request(app)
        .get(`/api/attendances/session/${session.id}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.attendances).toBeInstanceOf(Array);
    });

    it('可以查詢學生的所有出勤記錄', async () => {
      const response = await request(app)
        .get(`/api/attendances/student/${student.id}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.attendances).toBeInstanceOf(Array);
    });
  });

  describe('更新出勤記錄', () => {
    it('教師可以更新出勤記錄', async () => {
      const response = await request(app)
        .put(`/api/attendances/${attendance.id}`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          attendance_status: AttendanceStatus.LATE,
          note: '遲到 15 分鐘'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.attendances).toHaveLength(1);
      expect(response.body.data.attendances[0].attendance_status).toBe(AttendanceStatus.LATE);
      expect(response.body.data.attendances[0].note).toBe('遲到 15 分鐘');
    });

    it('學生不能更新出勤記錄', async () => {
      const response = await request(app)
        .put(`/api/attendances/${attendance.id}`)
        .set('Authorization', `Bearer ${studentToken}`)
        .send({
          attendance_status: AttendanceStatus.LATE,
          note: '遲到 15 分鐘'
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('刪除出勤記錄', () => {
    it('教師可以刪除出勤記錄', async () => {
      const response = await request(app)
        .delete(`/api/attendances/${attendance.id}`)
        .set('Authorization', `Bearer ${teacherToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('學生不能刪除出勤記錄', async () => {
      const response = await request(app)
        .delete(`/api/attendances/${attendance.id}`)
        .set('Authorization', `Bearer ${studentToken}`);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });
}); 