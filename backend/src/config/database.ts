import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Course } from '../models/Course';
import { Session } from '../models/Session';
import { AttendanceRecord } from '../models/AttendanceRecord';
import { LeaveRequest } from '../models/LeaveRequest';
import { MakeUpSession } from '../models/MakeUpSession';
import dotenv from 'dotenv';

dotenv.config();

const isTestEnvironment = process.env.NODE_ENV === 'test';

export const AppDataSource = new DataSource(
  isTestEnvironment
    ? {
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [User, Course, Session, AttendanceRecord, LeaveRequest, MakeUpSession],
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
        entities: [User, Course, Session, AttendanceRecord, LeaveRequest, MakeUpSession],
        subscribers: [],
        migrations: []
      }
); 