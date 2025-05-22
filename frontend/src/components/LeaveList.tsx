import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

export interface LeaveRecord {
  id: number;
  studentName: string;
  date: string;
  reason: string;
  status: '審核中' | '通過' | '駁回';
}

interface LeaveListProps {
  records: LeaveRecord[];
}

const LeaveList: React.FC<LeaveListProps> = ({ records }) => (
  <>
    <Typography variant="h6" mb={2}>請假紀錄</Typography>
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>學生</TableCell>
            <TableCell>日期</TableCell>
            <TableCell>事由</TableCell>
            <TableCell>狀態</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">無請假紀錄</TableCell>
            </TableRow>
          ) : records.map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.studentName}</TableCell>
              <TableCell>{r.date}</TableCell>
              <TableCell>{r.reason}</TableCell>
              <TableCell>{r.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>
);

export default LeaveList;
