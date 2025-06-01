import { Router } from 'express';
import { createLeave, deleteLeave, putLeaveByTeacher, arrangeMakeUpSession, getMyMakeUpSessions, updateMakeUpAttendance, updateMakeUpSession, deleteMakeUpSession } from '../controllers/leave.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validateDto } from '../middlewares/validation.middleware';
import { CreateLeaveDto } from '../dtos/leave.dto';

const router = Router();

router.post('/sessions/:sessionId/leave', authenticate, validateDto(CreateLeaveDto), createLeave);
router.delete('/leave_requests/:leaveId', authenticate, deleteLeave);
router.put('/sessions/:sessionId/leave/:studentId', authenticate, validateDto(CreateLeaveDto), putLeaveByTeacher);
router.post('/leave_requests/:leaveId/make_up', authenticate, arrangeMakeUpSession);
router.get('/users/me/make_up_sessions', authenticate, getMyMakeUpSessions);
router.put('/make_up_sessions/:makeUpSessionId/attendance', authenticate, updateMakeUpAttendance);
router.put('/make_up_sessions/:makeUpSessionId', authenticate, updateMakeUpSession);
router.delete('/make_up_sessions/:makeUpSessionId', authenticate, deleteMakeUpSession);

export default router; 