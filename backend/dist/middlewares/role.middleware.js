"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTeacher = void 0;
const User_1 = require("../models/User");
const isTeacher = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            error: '未經過身份驗證'
        });
    }
    if (req.user.role !== User_1.UserRole.TEACHER) {
        return res.status(403).json({
            success: false,
            error: '需要教師權限'
        });
    }
    next();
};
exports.isTeacher = isTeacher;
