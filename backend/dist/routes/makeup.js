"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// 建立補課（僅 admin/teacher）
router.post('/', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'teacher'), async (req, res) => {
    const { originalSessionId, studentId, makeUpDate, startTime, endTime, content, leaveRequestId } = req.body;
    if (!originalSessionId || !studentId || !makeUpDate || !startTime || !endTime) {
        return res.status(400).json({ error: '缺少必要欄位' });
    }
    try {
        const makeUpSession = await prisma.makeUpSession.create({
            data: {
                originalSessionId: Number(originalSessionId),
                studentId: Number(studentId),
                makeUpDate: new Date(makeUpDate),
                startTime,
                endTime,
                attendanceStatus: '未簽到',
                content,
                createdById: req.user.id,
                leaveRequestId: leaveRequestId ? Number(leaveRequestId) : undefined
            }
        });
        res.json({ success: true, id: makeUpSession.id });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
});
// 查詢所有補課（admin/teacher）
router.get('/', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'teacher'), async (req, res) => {
    const makeups = await prisma.makeUpSession.findMany({
        include: {
            student: { select: { id: true, name: true, email: true, studentNo: true } },
            originalSession: true,
            createdBy: { select: { id: true, name: true } },
            leaveRequest: true
        },
        orderBy: { makeUpDate: 'desc' }
    });
    res.json(makeups);
});
// 查詢某學生補課（admin/teacher/student 本人）
router.get('/student/:studentId', auth_1.authenticateToken, async (req, res) => {
    const { studentId } = req.params;
    // 學生本人只能查自己的
    if (req.user.role === 'student' && req.user.id !== Number(studentId)) {
        return res.status(403).json({ error: '無權限' });
    }
    const makeups = await prisma.makeUpSession.findMany({
        where: { studentId: Number(studentId) },
        include: {
            student: { select: { id: true, name: true, email: true, studentNo: true } },
            originalSession: true,
            createdBy: { select: { id: true, name: true } },
            leaveRequest: true
        },
        orderBy: { makeUpDate: 'desc' }
    });
    res.json(makeups);
});
// 編輯補課（admin/teacher）
router.put('/:makeupId', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'teacher'), async (req, res) => {
    const { makeupId } = req.params;
    const { makeUpDate, startTime, endTime, attendanceStatus, content } = req.body;
    try {
        const makeUpSession = await prisma.makeUpSession.update({
            where: { id: Number(makeupId) },
            data: {
                makeUpDate: makeUpDate ? new Date(makeUpDate) : undefined,
                startTime,
                endTime,
                attendanceStatus,
                content
            }
        });
        res.json({ success: true });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
});
// 刪除補課（admin/teacher）
router.delete('/:makeupId', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'teacher'), async (req, res) => {
    const { makeupId } = req.params;
    try {
        await prisma.makeUpSession.delete({ where: { id: Number(makeupId) } });
        res.json({ success: true });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
});
exports.default = router;
