import request from 'supertest';
import { AppDataSource } from '../config/database';
import { app } from '../app';
import { User, UserRole } from '../models/User';
import * as bcrypt from 'bcrypt';
import '@jest/globals';

describe('認證功能測試', () => {
  let user: User;

  beforeEach(async () => {
    // 清空資料表
    const entities = AppDataSource.entityMetadatas;
    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      await repository.clear();
    }

    // 建立測試使用者
    const userRepository = AppDataSource.getRepository(User);
    user = await userRepository.save({
      name: '測試使用者',
      email: 'test@example.com',
      password: await bcrypt.hash('Test123!@#', 10),
      role: UserRole.STUDENT,
      grade: 10,
      school: '測試高中',
      parent_name: '測試家長',
      parent_phone: '0912345678'
    });
  });

  describe('註冊', () => {
    it('使用有效的資料可以註冊成功', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: '新使用者',
          email: 'new@example.com',
          password: 'Test123!@#',
          role: UserRole.STUDENT,
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
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: '新使用者',
          email: 'test@example.com',
          password: 'Test123!@#',
          role: UserRole.STUDENT,
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
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: '新使用者',
          role: UserRole.STUDENT
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('登入', () => {
    it('使用正確的帳號密碼可以登入成功', async () => {
      const response = await request(app)
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
      const response = await request(app)
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
      const response = await request(app)
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