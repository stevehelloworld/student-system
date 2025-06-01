"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMakeUpSession = exports.updateMakeUpSession = exports.updateMakeUpAttendance = exports.getMyMakeUpSessions = exports.arrangeMakeUpSession = exports.putLeaveByTeacher = exports.deleteLeave = exports.createLeave = void 0;
const database_1 = require("../config/database");
const LeaveRequest_1 = require("../models/LeaveRequest");
const Session_1 = require("../models/Session");
const User_1 = require("../models/User");
const MakeUpSession_1 = require("../models/MakeUpSession");
const createLeave = async (req, res) => {
    try {
        // 僅學生可申請
        if (!req.user || req.user.role !== User_1.UserRole.STUDENT) {
            return res.status(req.user ? 403 : 401).json({ success: false, error: '只有學生可以申請請假' });
        }
        const sessionId = parseInt(req.params.sessionId);
        const { type } = req.body;
        if (!Object.values(LeaveRequest_1.LeaveType).includes(type)) {
            return res.status(400).json({ success: false, error: 'type 必須為 事假 或 病假' });
        }
        // 檢查課程場次是否存在
        const sessionRepo = database_1.AppDataSource.getRepository(Session_1.Session);
        const session = await sessionRepo.findOne({ where: { id: sessionId } });
        if (!session) {
            return res.status(404).json({ success: false, error: '找不到課程場次' });
        }
        // 寫入 leave_requests
        const leaveRepo = database_1.AppDataSource.getRepository(LeaveRequest_1.LeaveRequest);
        const leave = leaveRepo.create({
            session_id: sessionId,
            student_id: req.user.id,
            type,
            status: LeaveRequest_1.LeaveStatus.ACTIVE,
            created_by: req.user.id
        });
        await leaveRepo.save(leave);
        return res.json({ success: true });
    }
    catch (err) {
        console.error('請假申請失敗:', err);
        return res.status(500).json({ success: false, error: '伺服器錯誤' });
    }
};
exports.createLeave = createLeave;
const deleteLeave = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: '未登入' });
        }
        const leaveId = parseInt(req.params.leaveId);
        const leaveRepo = database_1.AppDataSource.getRepository(LeaveRequest_1.LeaveRequest);
        const leave = await leaveRepo.findOne({ where: { id: leaveId } });
        if (!leave) {
            return res.status(404).json({ success: false, error: '找不到請假紀錄' });
        }
        if (!((req.user.role === User_1.UserRole.STUDENT && leave.student_id === req.user.id) ||
            req.user.role === User_1.UserRole.TEACHER)) {
            return res.status(403).json({ success: false, error: '只有本人學生或教師可取消' });
        }
        leave.status = LeaveRequest_1.LeaveStatus.CANCELLED;
        leave.cancelled_at = new Date();
        await leaveRepo.save(leave);
        return res.json({ success: true });
    }
    catch (err) {
        console.error('取消請假失敗:', err);
        return res.status(500).json({ success: false, error: '伺服器錯誤' });
    }
};
exports.deleteLeave = deleteLeave;
const putLeaveByTeacher = async (req, res) => {
    try {
        if (!req.user || req.user.role !== User_1.UserRole.TEACHER) {
            return res.status(req.user ? 403 : 401).json({ success: false, error: '只有教師可操作' });
        }
        const sessionId = parseInt(req.params.sessionId);
        const studentId = parseInt(req.params.studentId);
        const { type } = req.body;
        if (!Object.values(LeaveRequest_1.LeaveType).includes(type)) {
            return res.status(400).json({ success: false, error: 'type 必須為 事假 或 病假' });
        }
        // 檢查課程場次是否存在
        const sessionRepo = database_1.AppDataSource.getRepository(Session_1.Session);
        const session = await sessionRepo.findOne({ where: { id: sessionId } });
        if (!session) {
            return res.status(404).json({ success: false, error: '找不到課程場次' });
        }
        // 查詢是否已有請假紀錄
        const leaveRepo = database_1.AppDataSource.getRepository(LeaveRequest_1.LeaveRequest);
        let leave = await leaveRepo.findOne({ where: { session_id: sessionId, student_id: studentId } });
        if (leave) {
            leave.type = type;
            leave.status = LeaveRequest_1.LeaveStatus.ACTIVE;
            leave.cancelled_at = undefined;
            leave.created_by = req.user.id;
        }
        else {
            leave = leaveRepo.create({
                session_id: sessionId,
                student_id: studentId,
                type,
                status: LeaveRequest_1.LeaveStatus.ACTIVE,
                created_by: req.user.id
            });
        }
        await leaveRepo.save(leave);
        return res.json({ success: true });
    }
    catch (err) {
        console.error('教師登記/修改請假失敗:', err);
        return res.status(500).json({ success: false, error: '伺服器錯誤' });
    }
};
exports.putLeaveByTeacher = putLeaveByTeacher;
const arrangeMakeUpSession = async (req, res) => {
    if (!req.user || req.user.role !== User_1.UserRole.TEACHER) {
        return res.status(req.user ? 403 : 401).json({ success: false, error: '只有教師可安排補課' });
    }
    const { make_up_date, start_time, end_time } = req.body;
    if (!make_up_date || !start_time || !end_time || make_up_date.trim() === '' || start_time.trim() === '' || end_time.trim() === '') {
        return res.status(400).json({ success: false, error: '補課日期與時間必填' });
    }
    const leaveId = parseInt(req.params.leaveId);
    const leaveRepo = database_1.AppDataSource.getRepository(LeaveRequest_1.LeaveRequest);
    const leave = await leaveRepo.findOne({ where: { id: leaveId } });
    if (!leave) {
        return res.status(404).json({ success: false, error: '找不到請假紀錄' });
    }
    const makeUpRepo = database_1.AppDataSource.getRepository(MakeUpSession_1.MakeUpSession);
    const makeUp = makeUpRepo.create({
        leave_request_id: leaveId,
        make_up_date,
        start_time,
        end_time,
        created_by: req.user.id
    });
    await makeUpRepo.save(makeUp);
    return res.status(200).json({ success: true, make_up_session_id: makeUp.id });
};
exports.arrangeMakeUpSession = arrangeMakeUpSession;
const getMyMakeUpSessions = async (req, res) => {
    const userId = req.user.id;
    const makeUpRepo = database_1.AppDataSource.getRepository(MakeUpSession_1.MakeUpSession);
    // 需 join leave_request 以取得 original_session_id
    const makeUps = await makeUpRepo
        .createQueryBuilder('makeup')
        .leftJoinAndSelect('makeup.leave_request', 'leave')
        .where('leave.student_id = :userId', { userId })
        .getMany();
    const result = makeUps.map(m => ({
        make_up_session_id: m.id,
        original_session_id: m.leave_request.session_id,
        make_up_date: m.make_up_date,
        attendance_status: m.attendance_status || null
    }));
    return res.status(200).json(result);
};
exports.getMyMakeUpSessions = getMyMakeUpSessions;
const updateMakeUpAttendance = async (req, res) => {
    if (!req.user || req.user.role !== User_1.UserRole.TEACHER) {
        return res.status(req.user ? 403 : 401).json({ success: false, error: '只有教師可記錄補課出席' });
    }
    const { attendance_status } = req.body;
    if (!attendance_status || attendance_status.trim() === '') {
        return res.status(400).json({ success: false, error: 'attendance_status 必填' });
    }
    if (!Object.values(MakeUpSession_1.MakeUpAttendanceStatus).includes(attendance_status)) {
        return res.status(400).json({ success: false, error: 'attendance_status 必須為 PRESENT/ABSENT/LATE' });
    }
    const makeUpSessionId = parseInt(req.params.makeUpSessionId);
    const makeUpRepo = database_1.AppDataSource.getRepository(MakeUpSession_1.MakeUpSession);
    const makeUp = await makeUpRepo.findOne({ where: { id: makeUpSessionId } });
    if (!makeUp) {
        return res.status(404).json({ success: false, error: '找不到補課紀錄' });
    }
    makeUp.attendance_status = attendance_status;
    await makeUpRepo.save(makeUp);
    return res.status(200).json({ success: true });
};
exports.updateMakeUpAttendance = updateMakeUpAttendance;
const updateMakeUpSession = async (req, res) => {
    if (!req.user || req.user.role !== User_1.UserRole.TEACHER) {
        return res.status(req.user ? 403 : 401).json({ success: false, error: '只有教師可修改補課安排' });
    }
    const { make_up_date, start_time, end_time } = req.body;
    if (!make_up_date || !start_time || !end_time || make_up_date.trim() === '' || start_time.trim() === '' || end_time.trim() === '') {
        return res.status(400).json({ success: false, error: '補課日期與時間必填' });
    }
    const makeUpSessionId = parseInt(req.params.makeUpSessionId);
    const makeUpRepo = database_1.AppDataSource.getRepository(MakeUpSession_1.MakeUpSession);
    const makeUp = await makeUpRepo.findOne({ where: { id: makeUpSessionId } });
    if (!makeUp) {
        return res.status(404).json({ success: false, error: '找不到補課紀錄' });
    }
    makeUp.make_up_date = make_up_date;
    makeUp.start_time = start_time;
    makeUp.end_time = end_time;
    await makeUpRepo.save(makeUp);
    return res.status(200).json({ success: true });
};
exports.updateMakeUpSession = updateMakeUpSession;
const deleteMakeUpSession = async (req, res) => {
    if (!req.user || req.user.role !== User_1.UserRole.TEACHER) {
        return res.status(req.user ? 403 : 401).json({ success: false, error: '只有教師可刪除補課安排' });
    }
    const makeUpSessionId = parseInt(req.params.makeUpSessionId);
    const makeUpRepo = database_1.AppDataSource.getRepository(MakeUpSession_1.MakeUpSession);
    const makeUp = await makeUpRepo.findOne({ where: { id: makeUpSessionId } });
    if (!makeUp) {
        return res.status(404).json({ success: false, error: '找不到補課紀錄' });
    }
    await makeUpRepo.remove(makeUp);
    return res.status(200).json({ success: true });
};
exports.deleteMakeUpSession = deleteMakeUpSession;
