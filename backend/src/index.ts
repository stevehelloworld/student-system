import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import authRouter from './routes/auth';
import usersRouter from './routes/users';

dotenv.config();
const prisma = new PrismaClient();

import app from './app';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Attendance System API');
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
