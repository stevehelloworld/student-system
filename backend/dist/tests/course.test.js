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
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
require("@jest/globals");
describe('課程功能測試', () => {
    let teacherToken;
    let studentToken;
    let teacher;
    let student;
    let course;
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
    });
    describe('建立課程', () => {
        it('教師可以建立課程', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
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
            const response = await (0, supertest_1.default)(app_1.app)
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
            const response = await (0, supertest_1.default)(app_1.app)
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
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/courses')
                .set('Authorization', `Bearer ${teacherToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.courses).toBeInstanceOf(Array);
        });
        it('可以查詢單一課程', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get(`/api/courses/${course.id}`)
                .set('Authorization', `Bearer ${teacherToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.course.id).toBe(course.id);
        });
        it('查詢不存在的課程應該失敗', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/courses/999')
                .set('Authorization', `Bearer ${teacherToken}`);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('error');
        });
    });
    describe('更新課程', () => {
        it('教師可以更新自己的課程', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
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
            const otherTeacher = await database_1.AppDataSource.getRepository(User_1.User).save({
                name: '其他教師',
                email: 'other.teacher@example.com',
                password: await bcrypt.hash('Test123!@#', 10),
                role: User_1.UserRole.TEACHER
            });
            const otherTeacherToken = jwt.sign({ id: otherTeacher.id, role: otherTeacher.role }, process.env.JWT_SECRET || 'your-secret-key');
            const response = await (0, supertest_1.default)(app_1.app)
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
            const response = await (0, supertest_1.default)(app_1.app)
                .delete(`/api/courses/${course.id}`)
                .set('Authorization', `Bearer ${teacherToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty('message');
        });
        it('教師不能刪除其他教師的課程', async () => {
            // 建立另一個教師
            const otherTeacher = await database_1.AppDataSource.getRepository(User_1.User).save({
                name: '其他教師',
                email: 'other.teacher@example.com',
                password: await bcrypt.hash('Test123!@#', 10),
                role: User_1.UserRole.TEACHER
            });
            const otherTeacherToken = jwt.sign({ id: otherTeacher.id, role: otherTeacher.role }, process.env.JWT_SECRET || 'your-secret-key');
            const response = await (0, supertest_1.default)(app_1.app)
                .delete(`/api/courses/${course.id}`)
                .set('Authorization', `Bearer ${otherTeacherToken}`);
            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('error');
        });
    });
});
