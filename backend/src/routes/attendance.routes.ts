import { Router } from 'express';
import { 
  create as createAttendance,
  bulkCreate as bulkCreateAttendance,
  findAll as getAttendances,
  findOne as getAttendance,
  findBySession as getSessionAttendances,
  findByStudent as getStudentAttendances,
  update as updateAttendance,
  remove as deleteAttendance
} from '../controllers/attendance.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isTeacher } from '../middlewares/role.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { CreateAttendanceDto, UpdateAttendanceDto, BulkCreateAttendanceDto } from '../dtos/attendance.dto';

const router = Router();

// 出勤記錄路由
router.post('/', authenticate, isTeacher, validateDto(CreateAttendanceDto), createAttendance);
router.post('/bulk', authenticate, isTeacher, validateDto(BulkCreateAttendanceDto), bulkCreateAttendance);
router.get('/', authenticate, getAttendances);
router.get('/:id', authenticate, getAttendance);
router.get('/session/:session_id', authenticate, getSessionAttendances);
router.get('/student/:student_id', authenticate, getStudentAttendances);
router.put('/:id', authenticate, isTeacher, validateDto(UpdateAttendanceDto), updateAttendance);
router.delete('/:id', authenticate, isTeacher, deleteAttendance);

export default router; 