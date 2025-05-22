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
// GET /api/attendance
router.get('/', auth_1.authenticateToken, async (req, res) => {
    const { studentId } = req.query;
    let where = {};
    if (studentId) {
        where.studentId = Number(studentId);
    }
    const records = await prisma.attendanceRecord.findMany({
        where,
        include: {
            student: { select: { id: true, name: true, email: true, studentNo: true } },
            updatedBy: { select: { id: true, name: true } }
        }
    });
    res.json(records.map(r => ({
        id: r.id,
        student: r.student,
        status: r.status,
        note: r.note,
        updatedBy: r.updatedBy,
        updatedAt: r.updatedAt
    })));
});
// GET /api/attendance/:sessionId
router.get('/:sessionId', auth_1.authenticateToken, async (req, res) => {
    const { sessionId } = req.params;
    const records = await prisma.attendanceRecord.findMany({
        where: { sessionId: Number(sessionId) },
        include: {
            student: { select: { id: true, name: true, email: true, studentNo: true } },
            updatedBy: { select: { id: true, name: true } }
        }
    });
    res.json(records.map(r => ({
        id: r.id,
        student: r.student,
        status: r.status,
        note: r.note,
        updatedBy: r.updatedBy,
        updatedAt: r.updatedAt
    })));
});
// POST /api/attendance/:sessionId 批次更新/新增出席紀錄（限 admin/teacher）
router.post('/:sessionId', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'teacher'), async (req, res) => {
    const { sessionId } = req.params;
    const { records } = req.body; // [{studentId, status, note}]
    if (!Array.isArray(records))
        return res.status(400).json({ error: 'records 欄位必須為陣列' });
    try {
        for (const rec of records) {
            await prisma.attendanceRecord.upsert({
                where: {
                    sessionId_studentId: { sessionId: Number(sessionId), studentId: rec.studentId }
                },
                update: {
                    status: rec.status,
                    note: rec.note,
                    updatedById: req.user.id
                },
                create: {
                    sessionId: Number(sessionId),
                    studentId: rec.studentId,
                    status: rec.status,
                    note: rec.note,
                    updatedById: req.user.id
                }
            });
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
});
exports.default = router;
