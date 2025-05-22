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
// GET /api/leave/:sessionId 取得該場次所有請假紀錄
router.get('/:sessionId', auth_1.authenticateToken, async (req, res) => {
    const { sessionId } = req.params;
    const leaves = await prisma.leaveRequest.findMany({
        where: { sessionId: Number(sessionId) },
        include: {
            student: { select: { id: true, name: true, email: true, studentNo: true } },
            approvedBy: { select: { id: true, name: true } }
        }
    });
    res.json(leaves.map(l => ({
        id: l.id,
        student: l.student,
        reason: l.reason,
        status: l.status,
        approvedBy: l.approvedBy,
        approvedAt: l.approvedAt,
        createdAt: l.createdAt
    })));
});
// POST /api/leave/:sessionId 學生請假申請（student）
router.post('/:sessionId', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('student'), async (req, res) => {
    const { sessionId } = req.params;
    const { reason } = req.body;
    if (!reason)
        return res.status(400).json({ error: '缺少請假原因' });
    try {
        const leave = await prisma.leaveRequest.create({
            data: {
                sessionId: Number(sessionId),
                studentId: req.user.id,
                reason,
                status: 'pending'
            }
        });
        res.json({ success: true, id: leave.id });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
});
// PUT /api/leave/:leaveId 審核請假（admin/teacher）
router.put('/:leaveId', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'teacher'), async (req, res) => {
    const { leaveId } = req.params;
    const { status } = req.body; // approved/rejected
    if (!['approved', 'rejected'].includes(status))
        return res.status(400).json({ error: 'status 必須為 approved 或 rejected' });
    try {
        const leave = await prisma.leaveRequest.update({
            where: { id: Number(leaveId) },
            data: {
                status,
                approvedById: req.user.id,
                approvedAt: new Date()
            }
        });
        res.json({ success: true });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
});
exports.default = router;
