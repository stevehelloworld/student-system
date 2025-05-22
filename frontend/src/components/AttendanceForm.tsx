import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem } from '@mui/material';
import type { AttendanceRecord } from './AttendanceList';

interface AttendanceFormProps {
  open: boolean;
  initial?: Partial<AttendanceRecord>;
  onClose: () => void;
  token: string;
  onSuccess: (msg: string) => void;
}

const API_URL = '/api/attendance';

const AttendanceForm: React.FC<AttendanceFormProps> = ({ open, initial, onClose, token, onSuccess }) => {
  const [studentName, setStudentName] = useState(initial?.studentName || '');
  const [date, setDate] = useState(initial?.date || '');
  const [status, setStatus] = useState<AttendanceRecord['status']>(initial?.status || '出席');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setStudentName(initial?.studentName || '');
    setDate(initial?.date || '');
    setStatus(initial?.status || '出席');
    setError(null);
  };

  React.useEffect(() => {
    resetForm();
    // eslint-disable-next-line
  }, [open, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !date) return;
    setLoading(true);
    setError(null);
    try {
      let res;
      if (initial && initial.id) {
        // 編輯
        res = await fetch(`${API_URL}/${initial.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ studentName, date, status }),
        });
        if (!res.ok) throw new Error('編輯出缺勤失敗');
        onSuccess('出缺勤已更新');
      } else {
        // 新增
        res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ studentName, date, status }),
        });
        if (!res.ok) throw new Error('新增出缺勤失敗');
        onSuccess('出缺勤已新增');
      }
      onClose();
    } catch (err: any) {
      setError(err.message || '發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{initial ? '編輯出缺勤' : '新增出缺勤'}</DialogTitle>
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
            disabled={loading}
          />
          <TextField
            label="狀態"
            select
            value={status}
            onChange={e => setStatus(e.target.value as AttendanceRecord['status'])}
            fullWidth
            margin="normal"
            disabled={loading}
          >
            <MenuItem value="出席">出席</MenuItem>
            <MenuItem value="缺席">缺席</MenuItem>
            <MenuItem value="遲到">遲到</MenuItem>
            <MenuItem value="早退">早退</MenuItem>
          </TextField>
          {error && (
            <div style={{ color: 'red', marginTop: 8 }}>{error}</div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={loading}>取消</Button>
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? '處理中...' : (initial ? '儲存' : '新增')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AttendanceForm;
