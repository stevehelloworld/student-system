"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
require("@jest/globals");
// 設定測試環境變數
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
beforeAll(async () => {
    try {
        // 確保測試資料庫已連接
        if (!database_1.AppDataSource.isInitialized) {
            await database_1.AppDataSource.initialize();
        }
    }
    catch (error) {
        console.error('測試資料庫初始化失敗:', error);
        throw error;
    }
});
beforeEach(async () => {
    try {
        // 關閉現有連線
        if (database_1.AppDataSource.isInitialized) {
            await database_1.AppDataSource.destroy();
        }
        // 重新初始化資料庫
        await database_1.AppDataSource.initialize();
    }
    catch (error) {
        console.error('測試資料庫重置失敗:', error);
        throw error;
    }
});
afterAll(async () => {
    try {
        // 關閉資料庫連線
        if (database_1.AppDataSource.isInitialized) {
            await database_1.AppDataSource.destroy();
        }
    }
    catch (error) {
        console.error('測試資料庫清理失敗:', error);
        throw error;
    }
});
