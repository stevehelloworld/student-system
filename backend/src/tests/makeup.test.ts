import request from 'supertest';
import { AppDataSource } from '../config/database';
import { app } from '../app';
import { User, UserRole } from '../models/User';
import { Course } from '../models/Course';
import { Session } from '../models/Session';
import { LeaveRequest, LeaveType, LeaveStatus } from '../models/LeaveRequest';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import '@jest/globals';

describe('補課安排功能測試', () => {
  let teacherToken: string;
  let studentToken: string;
  let teacher: User;
  let student: User;
  let course: Course;
  let session: Session;
  let leave: LeaveRequest;

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
    // 建立請假紀錄
    const leaveRepo = AppDataSource.getRepository(LeaveRequest);
    leave = await leaveRepo.save({
      session_id: session.id,
      student_id: student.id,
      type: LeaveType.PERSONAL,
      status: LeaveStatus.ACTIVE,
      created_by: student.id
    });
  });

  it('教師可針對請假安排補課', async () => {
    const response = await request(app)
      .post(`/api/leave_requests/${leave.id}/make_up`)
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({
        make_up_date: '2024-03-10',
        start_time: '19:00',
        end_time: '21:00'
      });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.make_up_session_id).toBeDefined();
  });

  it('非教師不可安排補課', async () => {
    const response = await request(app)
      .post(`/api/leave_requests/${leave.id}/make_up`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        make_up_date: '2024-03-10',
        start_time: '19:00',
        end_time: '21:00'
      });
    expect(response.status).toBe(403);
  });

  it('欄位驗證失敗', async () => {
    const response = await request(app)
      .post(`/api/leave_requests/${leave.id}/make_up`)
      .set('Authorization', `Bearer ${teacherToken}`)
      .send({
        make_up_date: '',
        start_time: '',
        end_time: ''
      });
    expect(response.status).toBe(400);
  });
}); 