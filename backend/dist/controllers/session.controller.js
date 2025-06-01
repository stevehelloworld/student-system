"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSession = exports.updateSession = exports.getSession = exports.getSessions = exports.createSession = void 0;
const database_1 = require("../config/database");
const Session_1 = require("../models/Session");
const Course_1 = require("../models/Course");
const User_1 = require("../models/User");
const sessionRepository = database_1.AppDataSource.getRepository(Session_1.Session);
const courseRepository = database_1.AppDataSource.getRepository(Course_1.Course);
const createSession = async (req, res) => {
    try {
        const user = req.user;
        if (user.role !== User_1.UserRole.TEACHER) {
            return res.status(403).json({
                success: false,
                error: '只有教師可以建立課程單元'
            });
        }
        const sessionDto = req.body;
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
        const session = new Session_1.Session();
        Object.assign(session, sessionDto);
        await sessionRepository.save(session);
        res.status(201).json({
            success: true,
            data: {
                session
            }
        });
    }
    catch (error) {
        console.error('建立課程單元錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.createSession = createSession;
const getSessions = async (req, res) => {
    try {
        const { course_id } = req.query;
        const sessions = await sessionRepository.find({
            where: course_id ? { course_id: parseInt(course_id) } : undefined,
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
    }
    catch (error) {
        console.error('查詢課程單元錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.getSessions = getSessions;
const getSession = async (req, res) => {
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
    }
    catch (error) {
        console.error('查詢課程單元錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.getSession = getSession;
const updateSession = async (req, res) => {
    try {
        const user = req.user;
        const { id } = req.params;
        const sessionDto = req.body;
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
    }
    catch (error) {
        console.error('更新課程單元錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.updateSession = updateSession;
const deleteSession = async (req, res) => {
    try {
        const user = req.user;
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
    }
    catch (error) {
        console.error('刪除課程單元錯誤:', error);
        res.status(500).json({
            success: false,
            error: '伺服器錯誤'
        });
    }
};
exports.deleteSession = deleteSession;
