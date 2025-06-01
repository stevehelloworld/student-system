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

describe('教師刪除補課安排 API', () => {
  let teacherToken: string;
  let studentToken: string;
  let teacher: User;
  let student: User;
  let course: Course;
  let session: Session;
  let leave: LeaveRequest;
  let makeUp: MakeUpSession;

  beforeEach(async () => {
    const userRepository = AppDataSource.getRepository(User);
    teacher = await userRepository.save({
      name: '補課教師',
      email: 'makeupteacher3@example.com',
      password: await bcrypt.hash('Test123!@#', 10),
      role: UserRole.TEACHER
    });
    student = await userRepository.save({
      name: '補課學生',
      email: 'makeupstudent3@example.com',
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
      name: '補課課程',
      description: '補課測試課程',
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
      title: '補課第一堂',
      description: '補課介紹',
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

  it('教師可刪除補課安排', async () => {
    const response = await request(app)
      .delete(`/api/make_up_sessions/${makeUp.id}`)
      .set('Authorization', `Bearer ${teacherToken}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    // 驗證資料已刪除
    const deleted = await AppDataSource.getRepository(MakeUpSession).findOne({ where: { id: makeUp.id } });
    expect(deleted).toBeNull();
  });

  it('非教師不可刪除補課安排', async () => {
    const response = await request(app)
      .delete(`/api/make_up_sessions/${makeUp.id}`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(response.status).toBe(403);
  });
}); 