import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Session } from '../models/Session';
import { Course } from '../models/Course';
import { User, UserRole } from '../models/User';
import { CreateSessionDto, UpdateSessionDto } from '../dtos/session.dto';

const sessionRepository = AppDataSource.getRepository(Session);
const courseRepository = AppDataSource.getRepository(Course);

export const createSession = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    if (user.role !== UserRole.TEACHER) {
      return res.status(403).json({
        success: false,
        error: '只有教師可以建立課程單元'
      });
    }

    const sessionDto = req.body as CreateSessionDto;
    
    // 檢查課程是否存在且屬於該教師
    const course = await courseRepository.findOne({
      where: { id: sessionDto.course_id }
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: '找不到課程'
      });
    }

    if (course.teacher_id !== user.id) {
      return res.status(403).json({
        success: false,
        error: '您沒有權限管理此課程'
      });
    }

    const session = new Session();
    Object.assign(session, sessionDto);

    await sessionRepository.save(session);

    res.status(201).json({
      success: true,
      data: {
        session
      }
    });
  } catch (error) {
    console.error('建立課程單元錯誤:', error);
    res.status(500).json({
      success: false,
      error: '伺服器錯誤'
    });
  }
};

export const getSessions = async (req: Request, res: Response) => {
  try {
    const { course_id } = req.query;
    
    const sessions = await sessionRepository.find({
      where: course_id ? { course_id: parseInt(course_id as string) } : undefined,
      relations: ['course'],
      order: {
        session_date: 'ASC',
        start_time: 'ASC'
      }
    });

    res.json({
      success: true,
      data: {
        sessions
      }
    });
  } catch (error) {
    console.error('查詢課程單元錯誤:', error);
    res.status(500).json({
      success: false,
      error: '伺服器錯誤'
    });
  }
};

export const getSession = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const session = await sessionRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['course']
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: '找不到課程單元'
      });
    }

    res.json({
      success: true,
      data: {
        session
      }
    });
  } catch (error) {
    console.error('查詢課程單元錯誤:', error);
    res.status(500).json({
      success: false,
      error: '伺服器錯誤'
    });
  }
};

export const updateSession = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { id } = req.params;
    const sessionDto = req.body as UpdateSessionDto;

    const session = await sessionRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['course']
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: '找不到課程單元'
      });
    }

    if (session.course.teacher_id !== user.id) {
      return res.status(403).json({
        success: false,
        error: '您沒有權限修改此課程單元'
      });
    }

    Object.assign(session, sessionDto);
    await sessionRepository.save(session);

    res.json({
      success: true,
      data: {
        session
      }
    });
  } catch (error) {
    console.error('更新課程單元錯誤:', error);
    res.status(500).json({
      success: false,
      error: '伺服器錯誤'
    });
  }
};

export const deleteSession = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { id } = req.params;

    const session = await sessionRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['course']
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        error: '找不到課程單元'
      });
    }

    if (session.course.teacher_id !== user.id) {
      return res.status(403).json({
        success: false,
        error: '您沒有權限刪除此課程單元'
      });
    }

    await sessionRepository.remove(session);

    res.json({
      success: true,
      data: null
    });
  } catch (error) {
    console.error('刪除課程單元錯誤:', error);
    res.status(500).json({
      success: false,
      error: '伺服器錯誤'
    });
  }
}; 