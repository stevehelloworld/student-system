import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';

export type CourseRecord = {
  id: number;
  name: string;
  teacher: string;
  time: string;
  location: string;
};

interface CourseListProps {
  records: CourseRecord[];
  onEdit?: (course: CourseRecord) => void;
}

const CourseList: React.FC<CourseListProps> = ({ records, onEdit }) => (
  <>
    <Typography variant="h6" mb={2}>課程列表</Typography>
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>課程名稱</TableCell>
            <TableCell>教師</TableCell>
            <TableCell>時間</TableCell>
            <TableCell>地點</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} align="center">無課程資料</TableCell>
            </TableRow>
          ) : records.map(r => (
            <TableRow
              key={r.id}
              hover={!!onEdit}
              sx={onEdit ? { cursor: 'pointer' } : {}}
              onClick={onEdit ? () => onEdit(r) : undefined}
            >
              <TableCell>{r.name}</TableCell>
              <TableCell>{r.teacher}</TableCell>
              <TableCell>{r.time}</TableCell>
              <TableCell>{r.location}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>
);

export default CourseList;
