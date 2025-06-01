"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const attendance_controller_1 = require("../controllers/attendance.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const validation_middleware_1 = require("../middlewares/validation.middleware");
const attendance_dto_1 = require("../dtos/attendance.dto");
const router = (0, express_1.Router)();
// 出勤記錄路由
router.post('/', auth_middleware_1.authenticate, role_middleware_1.isTeacher, (0, validation_middleware_1.validateDto)(attendance_dto_1.CreateAttendanceDto), attendance_controller_1.create);
router.post('/bulk', auth_middleware_1.authenticate, role_middleware_1.isTeacher, (0, validation_middleware_1.validateDto)(attendance_dto_1.BulkCreateAttendanceDto), attendance_controller_1.bulkCreate);
router.get('/', auth_middleware_1.authenticate, attendance_controller_1.findAll);
router.get('/:id', auth_middleware_1.authenticate, attendance_controller_1.findOne);
router.get('/session/:session_id', auth_middleware_1.authenticate, attendance_controller_1.findBySession);
router.get('/student/:student_id', auth_middleware_1.authenticate, attendance_controller_1.findByStudent);
router.put('/:id', auth_middleware_1.authenticate, role_middleware_1.isTeacher, (0, validation_middleware_1.validateDto)(attendance_dto_1.UpdateAttendanceDto), attendance_controller_1.update);
router.delete('/:id', auth_middleware_1.authenticate, role_middleware_1.isTeacher, attendance_controller_1.remove);
exports.default = router;
