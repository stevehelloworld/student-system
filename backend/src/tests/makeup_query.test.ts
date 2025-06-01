import request from 'supertest';
import { AppDataSource } from '../config/database';
import { app } from '../app';
import { User, UserRole } from '../models/User';
import { Course } from '../models/Course';
import { Session } from '../models/Session';
import { LeaveRequest, LeaveType, LeaveStatus } from '../models/LeaveRequest';
import { MakeUpSession } from '../models/MakeUpSession';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import '@jest/globals';

describe('學生查詢補課安排 API', () => {
  let studentToken: string;
  let teacherToken: string;
  let student: User;
  let teacher: User;
  let course: Course;
  let session: Session;
  let leave: LeaveRequest;
  let makeUp: MakeUpSession;

  beforeEach(async () => {
    const userRepository = AppDataSource.getRepository(User);
    teacher = await userRepository.save({
      name: '測試教師',
      email: 'teacher2@example.com',
      password: await bcrypt.hash('Test123!@#', 10),
      role: UserRole.TEACHER
    });
    student = await userRepository.save({
      name: '測試學生',
      email: 'student2@example.com',
      password: await bcrypt.hash('Test123!@#', 10),
      role: UserRole.STUDENT
    });
    teacherToken = jwt.sign(
      { id: teacher.id, role: teacher.role },
      process.env.JWT_SECRET || 'your-secret-key'
    );
    studentToken = jwt.sign(
      { id: student.id, role: student.role },
      process.env.JWT_SECRET || 'your-secret-key'
    );
    // 建立課程、場次、請假、補課
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
    const leaveRepo = AppDataSource.getRepository(LeaveRequest);
    leave = await leaveRepo.save({
      session_id: session.id,
      student_id: student.id,
      type: LeaveType.PERSONAL,
      status: LeaveStatus.ACTIVE,
      created_by: student.id
    });
    const makeUpRepo = AppDataSource.getRepository(MakeUpSession);
    makeUp = await makeUpRepo.save({
      leave_request_id: leave.id,
      make_up_date: '2024-03-10',
      start_time: '19:00',
      end_time: '21:00',
      created_by: teacher.id
    });
  });

  it('學生可查詢自己的補課安排', async () => {
    const response = await request(app)
      .get('/api/users/me/make_up_sessions')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThanOrEqual(1);
    expect(response.body[0]).toHaveProperty('make_up_session_id');
    expect(response.body[0]).toHaveProperty('original_session_id');
    expect(response.body[0]).toHaveProperty('make_up_date');
    expect(response.body[0]).toHaveProperty('attendance_status');
  });

  it('未登入不可查詢補課安排', async () => {
    const response = await request(app)
      .get('/api/users/me/make_up_sessions');
    expect(response.status).toBe(401);
  });

  it('無補課資料時回傳空陣列', async () => {
    // 先清空 make_up_sessions
    await AppDataSource.getRepository(MakeUpSession).clear();
    const response = await request(app)
      .get('/api/users/me/make_up_sessions')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  it('補課出席狀態正確顯示', async () => {
    // 先由教師標記補課出席
    await request(app)
      .put(`/api/make_up_sessions/${makeUp.id}/attendance`)
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({ attendance_status: 'PRESENT' });
    // 學生查詢
    const response = await request(app)
      .get('/api/users/me/make_up_sessions')
      .set('Authorization', `Bearer ${studentToken}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].attendance_status).toBe('PRESENT');
  });
}); 