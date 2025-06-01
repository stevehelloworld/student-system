"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../models/User");
const Course_1 = require("../models/Course");
const Session_1 = require("../models/Session");
const AttendanceRecord_1 = require("../models/AttendanceRecord");
const LeaveRequest_1 = require("../models/LeaveRequest");
const MakeUpSession_1 = require("../models/MakeUpSession");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isTestEnvironment = process.env.NODE_ENV === 'test';
exports.AppDataSource = new typeorm_1.DataSource(isTestEnvironment
    ? {
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [User_1.User, Course_1.Course, Session_1.Session, AttendanceRecord_1.AttendanceRecord, LeaveRequest_1.LeaveRequest, MakeUpSession_1.MakeUpSession],
        synchronize: true,
        logging: false
    }
    : {
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'student_system',
        synchronize: true,
        logging: process.env.NODE_ENV === 'development',
        entities: [User_1.User, Course_1.Course, Session_1.Session, AttendanceRecord_1.AttendanceRecord, LeaveRequest_1.LeaveRequest, MakeUpSession_1.MakeUpSession],
        subscribers: [],
        migrations: []
    });
