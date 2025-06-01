import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { useContainer, useExpressServer } from 'routing-controllers';
import { Container } from 'typedi';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import sessionRoutes from './routes/session.routes';
import attendanceRoutes from './routes/attendance.routes';
import leaveRoutes from './routes/leave.routes';

const app = express();

app.use(cors());
app.use(express.json());

// 設定 class-transformer 的全局選項
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
defaultMetadataStorage.options = {
  enableImplicitConversion: true
};

// 註冊路由
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api', leaveRoutes);

export { app }; 