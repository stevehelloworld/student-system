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
const LeaveRequest_1 = require("../models/LeaveRequest");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
require("@jest/globals");
describe('教師登記/修改/刪除學生請假功能測試', () => {
    let teacherToken;
    let studentToken;
    let teacher;
    let student;
    let course;
    let session;
    let leave;
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
            role: User_1.UserRole.STUDENT
        });
        teacherToken = jwt.sign({ id: teacher.id, role: teacher.role }, process.env.JWT_SECRET || 'your-secret-key');
        studentToken = jwt.sign({ id: student.id, role: student.role }, process.env.JWT_SECRET || 'your-secret-key');
        // 建立課程與場次
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
        // 建立請假紀錄
        const leaveRepo = database_1.AppDataSource.getRepository(LeaveRequest_1.LeaveRequest);
        leave = await leaveRepo.save({
            session_id: session.id,
            student_id: student.id,
            type: LeaveRequest_1.LeaveType.PERSONAL,
            status: LeaveRequest_1.LeaveStatus.ACTIVE,
            created_by: student.id
        });
    });
    it('教師可為學生登記/修改請假', async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .put(`/api/sessions/${session.id}/leave/${student.id}`)
            .set('Authorization', `Bearer ${teacherToken}`)
            .send({ type: '病假' });
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        // 檢查資料庫
        const leaveRepo = database_1.AppDataSource.getRepository(LeaveRequest_1.LeaveRequest);
        const updated = await leaveRepo.findOne({ where: { session_id: session.id, student_id: student.id } });
        expect(updated?.type).toBe(LeaveRequest_1.LeaveType.SICK);
        expect(updated?.created_by).toBe(teacher.id);
    });
    it('教師可刪除學生請假', async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .delete(`/api/leave_requests/${leave.id}`)
            .set('Authorization', `Bearer ${teacherToken}`);
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        // 檢查資料庫
        const leaveRepo = database_1.AppDataSource.getRepository(LeaveRequest_1.LeaveRequest);
        const updated = await leaveRepo.findOne({ where: { id: leave.id } });
        expect(updated?.status).toBe(LeaveRequest_1.LeaveStatus.CANCELLED);
        expect(updated?.cancelled_at).toBeTruthy();
    });
    it('學生不可用教師 API', async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .put(`/api/sessions/${session.id}/leave/${student.id}`)
            .set('Authorization', `Bearer ${studentToken}`)
            .send({ type: '病假' });
        expect(response.status).toBe(403);
    });
});
