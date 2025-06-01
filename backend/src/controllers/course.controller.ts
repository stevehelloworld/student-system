import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Course } from '../models/Course';
import { User, UserRole } from '../models/User';
import { CreateCourseDto, UpdateCourseDto } from '../dtos/course.dto';

const courseRepository = AppDataSource.getRepository(Course);

export const createCourse = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    if (user.role !== UserRole.TEACHER) {
      return res.status(403).json({
        success: false,
        error: '只有教師可以建立課程'
      });
    }

    const courseDto = req.body as CreateCourseDto;
    const course = new Course();
    Object.assign(course, courseDto);
    course.teacher_id = user.id;

    await courseRepository.save(course);

    res.status(201).json({
      success: true,
      data: {
        course: {
          id: course.id,
          name: course.name,
          description: course.description,
          capacity: course.capacity,
          start_date: course.start_date,
          end_date: course.end_date,
          schedule: course.schedule,
          location: course.location,
          price: course.price,
          teacher_id: course.teacher_id
        }
      }
    });
  } catch (error) {
    console.error('建立課程錯誤:', error);
    res.status(500).json({
      success: false,
      error: '伺服器錯誤'
    });
  }
};

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await courseRepository.find({
      relations: ['teacher']
    });

    res.json({
      success: true,
      data: {
        courses: courses.map(course => ({
          id: course.id,
          name: course.name,
          description: course.description,
          capacity: course.capacity,
          start_date: course.start_date,
          end_date: course.end_date,
          schedule: course.schedule,
          location: course.location,
          price: course.price,
          teacher: {
            id: course.teacher.id,
            name: course.teacher.name
          }
        }))
      }
    });
  } catch (error) {
    console.error('查詢課程錯誤:', error);
    res.status(500).json({
      success: false,
      error: '伺服器錯誤'
    });
  }
};

export const getCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await courseRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['teacher']
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: '找不到課程'
      });
    }

    res.json({
      success: true,
      data: {
        course: {
          id: course.id,
          name: course.name,
          description: course.description,
          capacity: course.capacity,
          start_date: course.start_date,
          end_date: course.end_date,
          schedule: course.schedule,
          location: course.location,
          price: course.price,
          teacher: {
            id: course.teacher.id,
            name: course.teacher.name
          }
        }
      }
    });
  } catch (error) {
    console.error('查詢課程錯誤:', error);
    res.status(500).json({
      success: false,
      error: '伺服器錯誤'
    });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { id } = req.params;
    const courseDto = req.body as UpdateCourseDto;

    const course = await courseRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['teacher']
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: '找不到課程'
      });
    }

    if (user.role !== UserRole.TEACHER) {
      return res.status(403).json({
        success: false,
        error: '只有教師可以更新課程'
      });
    }

    if (course.teacher_id !== user.id) {
      return res.status(403).json({
        success: false,
        error: '只能更新自己的課程'
      });
    }

    Object.assign(course, courseDto);
    await courseRepository.save(course);

    res.json({
      success: true,
      data: {
        course: {
          id: course.id,
          name: course.name,
          description: course.description,
          capacity: course.capacity,
          start_date: course.start_date,
          end_date: course.end_date,
          schedule: course.schedule,
          location: course.location,
          price: course.price,
          teacher_id: course.teacher_id
        }
      }
    });
  } catch (error) {
    console.error('更新課程錯誤:', error);
    res.status(500).json({
      success: false,
      error: '伺服器錯誤'
    });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const { id } = req.params;

    const course = await courseRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['teacher']
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        error: '找不到課程'
      });
    }

    if (user.role !== UserRole.TEACHER) {
      return res.status(403).json({
        success: false,
        error: '只有教師可以刪除課程'
      });
    }

    if (course.teacher_id !== user.id) {
      return res.status(403).json({
        success: false,
        error: '只能刪除自己的課程'
      });
    }

    await courseRepository.remove(course);

    res.json({
      success: true,
      message: '課程已成功刪除'
    });
  } catch (error) {
    console.error('刪除課程錯誤:', error);
    res.status(500).json({
      success: false,
      error: '伺服器錯誤'
    });
  }
}; 