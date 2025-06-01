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

describe('學生取消請假功能測試', () => {
  let studentToken: string;
  let otherStudentToken: string;
  let student: User;
  let otherStudent: User;
  let course: Course;
  let session: Session;
  let leave: LeaveRequest;

  beforeEach(async () => {
    // 建立測試使用者
    const userRepository = AppDataSource.getRepository(User);
    student = await userRepository.save({
      name: '測試學生',
      email: 'student@example.com',
      password: await bcrypt.hash('Test123!@#', 10),
      role: UserRole.STUDENT
    });
    otherStudent = await userRepository.save({
      name: '其他學生',
      email: 'other@student.com',
      password: await bcrypt.hash('Test123!@#', 10),
      role: UserRole.STUDENT
    });
    studentToken = jwt.sign(
      { id: student.id, role: student.role },
      process.env.JWT_SECRET || 'your-secret-key'
    );
    otherStudentToken = jwt.sign(
      { id: otherStudent.id, role: otherStudent.role },
      process.env.JWT_SECRET || 'your-secret-key'
    );
    // 建立課程與場次
    const courseRepository = AppDataSource.getRepository(Course);
    course = await courseRepository.save({
      name: '測試課程',
      description: '這是一個測試課程',
      teacher_id: 1,
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

  it('學生可以取消自己的請假', async () => {
    const response = await request(app)
      .delete(`/api/leave_requests/${leave.id}`)
      .set('Authorization', `Bearer ${studentToken}`);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    // 檢查資料庫
    const leaveRepo = AppDataSource.getRepository(LeaveRequest);
    const updated = await leaveRepo.findOne({ where: { id: leave.id } });
    expect(updated?.status).toBe(LeaveStatus.CANCELLED);
    expect(updated?.cancelled_at).toBeTruthy();
  });

  it('學生不能取消他人的請假', async () => {
    const response = await request(app)
      .delete(`/api/leave_requests/${leave.id}`)
      .set('Authorization', `Bearer ${otherStudentToken}`);
    expect(response.status).toBe(403);
  });

  it('未登入不可取消請假', async () => {
    const response = await request(app)
      .delete(`/api/leave_requests/${leave.id}`);
    expect(response.status).toBe(401);
  });
}); 