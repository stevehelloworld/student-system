"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leave_controller_1 = require("../controllers/leave.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const leave_dto_1 = require("../dtos/leave.dto");
const router = (0, express_1.Router)();
router.post('/sessions/:sessionId/leave', auth_middleware_1.authenticate, (0, validation_middleware_1.validateDto)(leave_dto_1.CreateLeaveDto), leave_controller_1.createLeave);
router.delete('/leave_requests/:leaveId', auth_middleware_1.authenticate, leave_controller_1.deleteLeave);
router.put('/sessions/:sessionId/leave/:studentId', auth_middleware_1.authenticate, (0, validation_middleware_1.validateDto)(leave_dto_1.CreateLeaveDto), leave_controller_1.putLeaveByTeacher);
router.post('/leave_requests/:leaveId/make_up', auth_middleware_1.authenticate, leave_controller_1.arrangeMakeUpSession);
router.get('/users/me/make_up_sessions', auth_middleware_1.authenticate, leave_controller_1.getMyMakeUpSessions);
router.put('/make_up_sessions/:makeUpSessionId/attendance', auth_middleware_1.authenticate, leave_controller_1.updateMakeUpAttendance);
router.put('/make_up_sessions/:makeUpSessionId', auth_middleware_1.authenticate, leave_controller_1.updateMakeUpSession);
router.delete('/make_up_sessions/:makeUpSessionId', auth_middleware_1.authenticate, leave_controller_1.deleteMakeUpSession);
exports.default = router;
