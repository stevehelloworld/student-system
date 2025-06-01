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
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
const register = async (req, res) => {
    try {
        const registerDto = req.body;
        // 檢查 email 是否已存在
        const existingUser = await userRepository.findOne({ where: { email: registerDto.email } });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: '此 email 已被註冊'
            });
        }
        const user = new User_1.User();
        Object.assign(user, registerDto);
        user.password = await bcrypt.hash(registerDto.password, 10);
        await userRepository.save(user);
        // 移除密碼後回傳
        const { password, ...userWithoutPassword } = user;
        console.log('註冊回應:', {
            success: true,
            data: {
                user: userWithoutPassword
            }
        });
        res.status(201).json({
            success: true,
            data: {
                user: userWithoutPassword
            }
        });
    }
    catch (error) {
        console.error('註冊錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // 查找使用者
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                error: '帳號或密碼錯誤'
            });
        }
        // 驗證密碼
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: '帳號或密碼錯誤'
            });
        }
        // 產生 JWT
        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
        // 移除密碼後回傳
        const { password: _, ...userWithoutPassword } = user;
        res.json({
            success: true,
            data: {
                token,
                user: userWithoutPassword
            }
        });
    }
    catch (error) {
        console.error('登入錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.login = login;
