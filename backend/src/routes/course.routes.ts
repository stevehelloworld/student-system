import { Router } from 'express';
import { createCourse, getCourses, getCourse, updateCourse, deleteCourse } from '../controllers/course.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { CreateCourseDto, UpdateCourseDto } from '../dtos/course.dto';

const router = Router();

router.post('/', authenticate, validateDto(CreateCourseDto), createCourse);
router.get('/', authenticate, getCourses);
router.get('/:id', authenticate, getCourse);
router.put('/:id', authenticate, validateDto(UpdateCourseDto), updateCourse);
router.delete('/:id', authenticate, deleteCourse);

export default router; 