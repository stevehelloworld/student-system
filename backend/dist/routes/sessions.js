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
// GET /api/sessions/:sessionId
router.get('/:sessionId', auth_1.authenticateToken, async (req, res) => {
    const { sessionId } = req.params;
    const session = await prisma.session.findUnique({
        where: { id: Number(sessionId) },
        include: {
            course: true,
            teacher: true,
            attendanceRecords: true,
            performances: true
        }
    });
    if (!session)
        return res.status(404).json({ error: '找不到場次' });
    res.json(session);
});
// POST /api/sessions 新增課程場次（限 admin/teacher）
router.post('/', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'teacher'), async (req, res) => {
    const { courseId, sessionDate, startTime, endTime, teacherId, content } = req.body;
    if (!courseId || !sessionDate || !startTime || !endTime)
        return res.status(400).json({ error: '缺少必要欄位' });
    try {
        const session = await prisma.session.create({
            data: { courseId, sessionDate: new Date(sessionDate), startTime, endTime, teacherId, content }
        });
        res.json({ success: true, id: session.id });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
});
exports.default = router;
