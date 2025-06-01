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
const bcrypt = __importStar(require("bcrypt"));
require("@jest/globals");
describe('認證功能測試', () => {
    let user;
    beforeEach(async () => {
        // 清空資料表
        const entities = database_1.AppDataSource.entityMetadatas;
        for (const entity of entities) {
            const repository = database_1.AppDataSource.getRepository(entity.name);
            await repository.clear();
        }
        // 建立測試使用者
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        user = await userRepository.save({
            name: '測試使用者',
            email: 'test@example.com',
            password: await bcrypt.hash('Test123!@#', 10),
            role: User_1.UserRole.STUDENT,
            grade: 10,
            school: '測試高中',
            parent_name: '測試家長',
            parent_phone: '0912345678'
        });
    });
    describe('註冊', () => {
        it('使用有效的資料可以註冊成功', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/register')
                .send({
                name: '新使用者',
                email: 'new@example.com',
                password: 'Test123!@#',
                role: User_1.UserRole.STUDENT,
                grade: 10,
                school: '測試高中',
                parent_name: '測試家長',
                parent_phone: '0912345678'
            });
            console.log('註冊回應:', response.body);
            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toHaveProperty('id');
            expect(response.body.data.user.email).toBe('new@example.com');
        });
        it('使用已存在的 email 應該註冊失敗', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/register')
                .send({
                name: '新使用者',
                email: 'test@example.com',
                password: 'Test123!@#',
                role: User_1.UserRole.STUDENT,
                grade: 10,
                school: '測試高中',
                parent_name: '測試家長',
                parent_phone: '0912345678'
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('error');
        });
        it('缺少必要欄位應該註冊失敗', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/register')
                .send({
                name: '新使用者',
                role: User_1.UserRole.STUDENT
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('error');
        });
    });
    describe('登入', () => {
        it('使用正確的帳號密碼可以登入成功', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/login')
                .send({
                email: 'test@example.com',
                password: 'Test123!@#'
            });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data.user.email).toBe('test@example.com');
        });
        it('使用錯誤的密碼應該登入失敗', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/login')
                .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('error');
        });
        it('使用不存在的帳號應該登入失敗', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: 'Test123!@#'
            });
            expect(response.status).toBe(401);
            expect(response.body.success).toBe(false);
            expect(response.body).toHaveProperty('error');
        });
    });
});
