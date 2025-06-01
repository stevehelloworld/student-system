import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../models/User';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';

const userRepository = AppDataSource.getRepository(User);

export const register = async (req: Request, res: Response) => {
  try {
    const registerDto = req.body as RegisterDto;

    // 檢查 email 是否已存在
    const existingUser = await userRepository.findOne({ where: { email: registerDto.email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: '此 email 已被註冊'
      });
    }

    const user = new User();
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
  } catch (error) {
    console.error('註冊錯誤:', error);
    res.status(500).json({
      success: false,
      error: '伺服器錯誤'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginDto;

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
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // 移除密碼後回傳
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      data: {
        token,
        user: userWithoutPassword
      }
    });
  } catch (error) {
    console.error('登入錯誤:', error);
    res.status(500).json({
      success: false,
      error: '伺服器錯誤'
    });
  }
}; 