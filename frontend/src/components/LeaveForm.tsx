import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import type { LeaveRecord } from './LeaveList';

interface LeaveFormProps {
  open: boolean;
  initial?: Partial<LeaveRecord>;
  onClose: () => void;
  onSubmit: (record: Omit<LeaveRecord, 'id'>) => void;
}

const LeaveForm: React.FC<LeaveFormProps> = ({ open, initial, onClose, onSubmit }) => {
  const [studentName, setStudentName] = useState(initial?.studentName || '');
  const [date, setDate] = useState(initial?.date || '');
  const [reason, setReason] = useState(initial?.reason || '');
  const [status, setStatus] = useState<LeaveRecord['status']>(initial?.status || '審核中');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !date || !reason) return;
    onSubmit({ studentName, date, reason, status });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initial ? '編輯請假' : '新增請假'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="學生"
            value={studentName}
            onChange={e => setStudentName(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="日期"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="事由"
            value={reason}
            onChange={e => setReason(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="狀態"
            select
            value={status}
            onChange={e => setStatus(e.target.value as LeaveRecord['status'])}
            fullWidth
            margin="normal"
          >
            <MenuItem value="審核中">審核中</MenuItem>
            <MenuItem value="通過">通過</MenuItem>
            <MenuItem value="駁回">駁回</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>取消</Button>
          <Button type="submit" variant="contained">{initial ? '儲存' : '新增'}</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default LeaveForm;
