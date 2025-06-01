"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const database_1 = require("../config/database");
const app_1 = require("../app");
const User_1 = require("../models/User");
const Course_1 = require("../models/Course");
const Session_1 = require("../models/Session");
const AttendanceRecord_1 = require("../models/AttendanceRecord");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
require("@jest/globals");
describe('出勤記錄功能測試', () => {
    let teacherToken;
    let studentToken;
    let teacher;
    let student;
    let course;
    let session;
    let attendance;
    beforeEach(async () => {
        // 建立測試使用者
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        teacher = await userRepository.save({
            name: '測試教師',
            email: 'teacher@example.com',
            password: await bcrypt.hash('Test123!@#', 10),
            role: User_1.UserRole.TEACHER
        });
        student = await userRepository.save({
            name: '測試學生',
            email: 'student@example.com',
            password: await bcrypt.hash('Test123!@#', 10),
            role: User_1.UserRole.STUDENT,
            grade: 10,
            school: '測試高中',
            parent_name: '測試家長',
            parent_phone: '0912345678'
        });
        // 生成 JWT token
        teacherToken = jwt.sign({ id: teacher.id, role: teacher.role }, process.env.JWT_SECRET || 'your-secret-key');
        studentToken = jwt.sign({ id: student.id, role: student.role }, process.env.JWT_SECRET || 'your-secret-key');
        // 建立測試課程
        const courseRepository = database_1.AppDataSource.getRepository(Course_1.Course);
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
        const sessionRepository = database_1.AppDataSource.getRepository(Session_1.Session);
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
        const attendanceRepository = database_1.AppDataSource.getRepository(AttendanceRecord_1.AttendanceRecord);
        attendance = await attendanceRepository.save({
            session_id: session.id,
            student_id: student.id,
            status: AttendanceRecord_1.AttendanceStatus.PRESENT,
            check_in_time: new Date('2024-03-01T19:00:00'),
            check_out_time: new Date('2024-03-01T21:00:00')
        });
    });
    describe('建立出勤記錄', () => {
        it('教師可以建立出勤記錄', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/attendances')
                .set('Authorization', `Bearer ${teacherToken}`)
                .send({
                session_id: session.id,
                student_id: student.id,
                status: 'PRESENT',
                check_in_time: '2024-03-01T19:00:00.000Z',
                check_out_time: '2024-03-01T21:00:00.000Z',
                test_field: 'hello'
            });
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.attendances).toHaveLength(1);
            expect(response.body.data.attendances[0]).toHaveProperty('id');
            expect(response.body.data.attendances[0].status).toBe('PRESENT');
        });
        it('學生不能建立出勤記錄', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/attendances')
                .set('Authorization', `Bearer ${studentToken}`)
                .send({
                session_id: session.id,
                student_id: student.id,
                status: 'PRESENT',
                check_in_time: '2024-03-01T19:00:00.000Z',
                check_out_time: '2024-03-01T21:00:00.000Z'
            });
            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('error');
        });
        it('缺少必要欄位應該建立失敗', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
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
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/attendances')
                .set('Authorization', `Bearer ${teacherToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.attendances).toBeInstanceOf(Array);
        });
        it('可以查詢單一出勤記錄', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get(`/api/attendances/${attendance.id}`)
                .set('Authorization', `Bearer ${teacherToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.attendances).toHaveLength(1);
            expect(response.body.data.attendances[0].id).toBe(attendance.id);
        });
        it('可以查詢課程單元的所有出勤記錄', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get(`/api/attendances/session/${session.id}`)
                .set('Authorization', `Bearer ${teacherToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.attendances).toBeInstanceOf(Array);
        });
        it('可以查詢學生的所有出勤記錄', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get(`/api/attendances/student/${student.id}`)
                .set('Authorization', `Bearer ${teacherToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.attendances).toBeInstanceOf(Array);
        });
    });
    describe('更新出勤記錄', () => {
        it('教師可以更新出勤記錄', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .put(`/api/attendances/${attendance.id}`)
                .set('Authorization', `Bearer ${teacherToken}`)
                .send({
                status: AttendanceRecord_1.AttendanceStatus.LATE,
                note: '遲到 15 分鐘'
            });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.attendances).toHaveLength(1);
            expect(response.body.data.attendances[0].status).toBe(AttendanceRecord_1.AttendanceStatus.LATE);
            expect(response.body.data.attendances[0].note).toBe('遲到 15 分鐘');
        });
        it('學生不能更新出勤記錄', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .put(`/api/attendances/${attendance.id}`)
                .set('Authorization', `Bearer ${studentToken}`)
                .send({
                status: AttendanceRecord_1.AttendanceStatus.LATE,
                note: '遲到 15 分鐘'
            });
            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('error');
        });
    });
    describe('刪除出勤記錄', () => {
        it('教師可以刪除出勤記錄', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .delete(`/api/attendances/${attendance.id}`)
                .set('Authorization', `Bearer ${teacherToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });
        it('學生不能刪除出勤記錄', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .delete(`/api/attendances/${attendance.id}`)
                .set('Authorization', `Bearer ${studentToken}`);
            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('error');
        });
    });
});
