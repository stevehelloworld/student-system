"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// GET /api/users/me
router.get('/me', auth_1.authenticateToken, async (req, res) => {
    if (!req.user)
        return res.status(401).json({ error: '未登入' });
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user)
        return res.status(404).json({ error: '找不到使用者' });
    const { id, name, role, email } = user;
    res.json({ id, name, role, email });
});
// GET /api/users
router.get('/', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'teacher'), async (req, res) => {
    const users = await prisma.user.findMany({
        select: {
            id: true, name: true, role: true, email: true, grade: true, school: true, parentName: true, parentPhone: true, studentNo: true
        }
    });
    res.json(users);
});
// POST /api/users
router.post('/', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'teacher'), async (req, res) => {
    const { name, email, password, role, grade, school, parent_name, parent_phone, student_no, enroll_courses } = req.body;
    if (!name || !email || !password || !role)
        return res.status(400).json({ error: '缺少必要欄位' });
    const hash = await bcrypt_1.default.hash(password, 10);
    try {
        const user = await prisma.user.create({
            data: {
                name, email, passwordHash: hash, role,
                grade, school,
                parentName: parent_name, parentPhone: parent_phone, studentNo: student_no,
                enrollments: enroll_courses && enroll_courses.length > 0 ? {
                    create: enroll_courses.map((courseId) => ({ courseId }))
                } : undefined
            }
        });
        res.json({ success: true, id: user.id });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
});
// PUT /api/users/:userId
router.put('/:userId', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'teacher'), async (req, res) => {
    const { name, email, grade, school, parent_name, parent_phone, student_no, enroll_courses } = req.body;
    const { userId } = req.params;
    try {
        const user = await prisma.user.update({
            where: { id: Number(userId) },
            data: {
                name, email, grade, school,
                parentName: parent_name, parentPhone: parent_phone, studentNo: student_no
            }
        });
        if (enroll_courses) {
            // 先刪除舊的，再新增
            await prisma.enrollment.deleteMany({ where: { studentId: Number(userId) } });
            await prisma.enrollment.createMany({ data: enroll_courses.map((courseId) => ({ studentId: Number(userId), courseId })) });
        }
        res.json({ success: true });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
});
// DELETE /api/users/:userId
router.delete('/:userId', auth_1.authenticateToken, (0, auth_1.authorizeRoles)('admin', 'teacher'), async (req, res) => {
    const { userId } = req.params;
    try {
        await prisma.enrollment.deleteMany({ where: { studentId: Number(userId) } });
        await prisma.user.delete({ where: { id: Number(userId) } });
        res.json({ success: true });
    }
    catch (e) {
        res.status(400).json({ error: e.message });
    }
});
exports.default = router;
