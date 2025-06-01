import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';

export const isTeacher = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: '未經過身份驗證'
    });
  }

  if (req.user.role !== UserRole.TEACHER) {
    return res.status(403).json({
      success: false,
      error: '需要教師權限'
    });
  }

  next();
}; 