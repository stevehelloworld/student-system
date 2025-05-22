import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

export type AttendanceRecord = {
  id: number;
  studentName: string;
  date: string;
  status: '出席' | '缺席' | '遲到' | '早退';
};

interface AttendanceListProps {
  records: AttendanceRecord[];
  onEdit?: (record: AttendanceRecord) => void;
}

const AttendanceList: React.FC<AttendanceListProps> = ({ records, onEdit }) => (
  <>
    <Typography variant="h6" mb={2}>出缺勤紀錄</Typography>
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>學生</TableCell>
            <TableCell>日期</TableCell>
            <TableCell>狀態</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} align="center">無出缺勤紀錄</TableCell>
            </TableRow>
          ) : records.map(r => (
            <TableRow
              key={r.id}
              hover={!!onEdit}
              sx={onEdit ? { cursor: 'pointer' } : {}}
              onClick={onEdit ? () => onEdit(r) : undefined}
            >
              <TableCell>{r.studentName}</TableCell>
              <TableCell>{r.date}</TableCell>
              <TableCell>{r.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>
);

export default AttendanceList;
