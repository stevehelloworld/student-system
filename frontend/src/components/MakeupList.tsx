import React, { useEffect, useState } from 'react';
import { fetchAllMakeups, fetchStudentMakeups, type MakeUpSession, deleteMakeup } from '../api/makeup';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, Stack
} from '@mui/material';

interface MakeupListProps {
  token: string;
  onEdit: (session: MakeUpSession) => void;
  role?: string;
  userId?: number;
}

const MakeupList: React.FC<MakeupListProps> = ({ token, onEdit, role, userId }) => {
  const [makeups, setMakeups] = useState<MakeUpSession[]>([]);

  const load = async () => {
    try {
      let data: MakeUpSession[] = [];
      if (role === 'student' && userId) {
        data = await fetchStudentMakeups(userId, token);
      } else {
        data = await fetchAllMakeups(token);
      }
      setMakeups(data);
    } catch (error) {
      console.error('Failed to load makeups:', error);
    }
  };

  useEffect(() => { load(); }, [token, role, userId]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('確定要刪除這筆補課紀錄嗎？')) return;
    await deleteMakeup(id, token);
    load();
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">補課管理</Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>學生</TableCell>
              <TableCell>補課日期</TableCell>
              <TableCell>時間</TableCell>
              <TableCell>說明</TableCell>
              <TableCell>狀態</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {makeups.map(m => (
              <TableRow key={m.id}>
                <TableCell>{m.student?.name || m.studentId}</TableCell>
                <TableCell>{m.makeUpDate?.slice(0,10)}</TableCell>
                <TableCell>{m.startTime} - {m.endTime}</TableCell>
                <TableCell>{m.content}</TableCell>
                <TableCell>{m.attendanceStatus}</TableCell>
                <TableCell>
                  {(role === 'admin' || role === 'teacher') && (
                    <>
                      <Button size="small" onClick={() => onEdit(m)}>編輯</Button>
                      <Button size="small" color="error" onClick={() => handleDelete(m.id)}>刪除</Button>
                    </>
                  )}
                
                </TableCell>
              </TableRow>
            ))}
            {makeups.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">無補課紀錄</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default MakeupList;
