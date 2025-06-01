"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.findByStudent = exports.findBySession = exports.findOne = exports.findAll = exports.bulkCreate = exports.create = void 0;
const database_1 = require("../config/database");
const AttendanceRecord_1 = require("../models/AttendanceRecord");
const Session_1 = require("../models/Session");
const User_1 = require("../models/User");
const typeorm_1 = require("typeorm");
const attendanceRepository = database_1.AppDataSource.getRepository(AttendanceRecord_1.AttendanceRecord);
const sessionRepository = database_1.AppDataSource.getRepository(Session_1.Session);
const userRepository = database_1.AppDataSource.getRepository(User_1.User);
const create = async (req, res) => {
    try {
        const createAttendanceDto = req.body;
        console.log('建立出勤記錄請求:', createAttendanceDto);
        // 檢查課程單元是否存在
        const session = await sessionRepository.findOne({
            where: { id: createAttendanceDto.session_id }
        });
        if (!session) {
            return res.status(404).json({
                success: false,
                error: '找不到課程單元'
            });
        }
        // 檢查學生是否存在
        const student = await userRepository.findOne({
            where: { id: createAttendanceDto.student_id }
        });
        if (!student) {
            return res.status(404).json({
                success: false,
                error: '找不到學生'
            });
        }
        // 檢查是否已有出勤記錄
        const existingAttendance = await attendanceRepository.findOne({
            where: {
                session_id: createAttendanceDto.session_id,
                student_id: createAttendanceDto.student_id
            }
        });
        if (existingAttendance) {
            return res.status(400).json({
                success: false,
                error: '此學生已有出勤記錄'
            });
        }
        // 建立出勤記錄
        const attendance = new AttendanceRecord_1.AttendanceRecord();
        attendance.session_id = createAttendanceDto.session_id;
        attendance.student_id = createAttendanceDto.student_id;
        attendance.status = createAttendanceDto.status;
        attendance.note = createAttendanceDto.note;
        attendance.check_in_time = createAttendanceDto.check_in_time;
        attendance.check_out_time = createAttendanceDto.check_out_time;
        await attendanceRepository.save(attendance);
        res.status(201).json({
            success: true,
            data: {
                attendances: [attendance]
            }
        });
    }
    catch (error) {
        console.error('建立出勤記錄錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.create = create;
const bulkCreate = async (req, res) => {
    try {
        const bulkCreateAttendanceDto = req.body;
        // 檢查課程單元是否存在
        const session = await sessionRepository.findOne({
            where: { id: bulkCreateAttendanceDto.session_id }
        });
        if (!session) {
            return res.status(404).json({
                success: false,
                error: '找不到課程單元'
            });
        }
        // 檢查學生是否存在
        const students = await userRepository.findByIds(bulkCreateAttendanceDto.student_ids);
        if (students.length !== bulkCreateAttendanceDto.student_ids.length) {
            return res.status(404).json({
                success: false,
                error: '部分學生不存在'
            });
        }
        // 檢查是否已有出勤記錄
        const existingAttendances = await attendanceRepository.find({
            where: {
                session_id: bulkCreateAttendanceDto.session_id,
                student_id: (0, typeorm_1.In)(bulkCreateAttendanceDto.student_ids)
            }
        });
        if (existingAttendances.length > 0) {
            return res.status(400).json({
                success: false,
                error: '部分學生已有出勤記錄'
            });
        }
        // 建立出勤記錄
        const attendances = bulkCreateAttendanceDto.student_ids.map(student_id => {
            const attendance = new AttendanceRecord_1.AttendanceRecord();
            attendance.session_id = bulkCreateAttendanceDto.session_id;
            attendance.student_id = student_id;
            attendance.status = AttendanceRecord_1.AttendanceStatus.ABSENT;
            return attendance;
        });
        await attendanceRepository.save(attendances);
        res.status(201).json({
            success: true,
            data: {
                attendances
            }
        });
    }
    catch (error) {
        console.error('批量建立出勤記錄錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.bulkCreate = bulkCreate;
const findAll = async (req, res) => {
    try {
        const attendances = await attendanceRepository.find();
        res.json({
            success: true,
            data: {
                attendances
            }
        });
    }
    catch (error) {
        console.error('查詢出勤記錄錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.findAll = findAll;
const findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const attendance = await attendanceRepository.findOne({
            where: { id: parseInt(id) }
        });
        if (!attendance) {
            return res.status(404).json({
                success: false,
                error: '找不到出勤記錄'
            });
        }
        res.json({
            success: true,
            data: {
                attendances: [attendance]
            }
        });
    }
    catch (error) {
        console.error('查詢出勤記錄錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.findOne = findOne;
const findBySession = async (req, res) => {
    try {
        const { session_id } = req.params;
        const attendances = await attendanceRepository.find({
            where: { session_id: parseInt(session_id) }
        });
        res.json({
            success: true,
            data: {
                attendances
            }
        });
    }
    catch (error) {
        console.error('查詢出勤記錄錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.findBySession = findBySession;
const findByStudent = async (req, res) => {
    try {
        const { student_id } = req.params;
        const attendances = await attendanceRepository.find({
            where: { student_id: parseInt(student_id) }
        });
        res.json({
            success: true,
            data: {
                attendances
            }
        });
    }
    catch (error) {
        console.error('查詢出勤記錄錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.findByStudent = findByStudent;
const update = async (req, res) => {
    try {
        const { id } = req.params;
        const updateAttendanceDto = req.body;
        const attendance = await attendanceRepository.findOne({
            where: { id: parseInt(id) }
        });
        if (!attendance) {
            return res.status(404).json({
                success: false,
                error: '找不到出勤記錄'
            });
        }
        // 更新出勤記錄
        Object.assign(attendance, updateAttendanceDto);
        await attendanceRepository.save(attendance);
        res.json({
            success: true,
            data: {
                attendances: [attendance]
            }
        });
    }
    catch (error) {
        console.error('更新出勤記錄錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.update = update;
const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const attendance = await attendanceRepository.findOne({
            where: { id: parseInt(id) }
        });
        if (!attendance) {
            return res.status(404).json({
                success: false,
                error: '找不到出勤記錄'
            });
        }
        await attendanceRepository.remove(attendance);
        res.json({
            success: true,
            message: '出勤記錄已刪除'
        });
    }
    catch (error) {
        console.error('刪除出勤記錄錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.remove = remove;
