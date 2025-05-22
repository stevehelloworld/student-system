import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import type { CourseRecord } from './CourseList';

interface CourseFormProps {
  open: boolean;
  initial?: Partial<CourseRecord>;
  onClose: () => void;
  token: string;
  onSuccess: (msg: string) => void;
}

const API_URL = '/api/courses';

const CourseForm: React.FC<CourseFormProps> = ({ open, initial, onClose, token, onSuccess }) => {
  const [name, setName] = useState(initial?.name || '');
  const [teacher, setTeacher] = useState(initial?.teacher || '');
  const [time, setTime] = useState(initial?.time || '');
  const [location, setLocation] = useState(initial?.location || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName(initial?.name || '');
    setTeacher(initial?.teacher || '');
    setTime(initial?.time || '');
    setLocation(initial?.location || '');
    setError(null);
  };

  // Reset form when open or initial changes
  React.useEffect(() => {
    resetForm();
    // eslint-disable-next-line
  }, [open, initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !teacher || !time || !location) return;
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
          body: JSON.stringify({ name, teacher, time, location }),
        });
        if (!res.ok) throw new Error('編輯課程失敗');
        onSuccess('課程已更新');
      } else {
        // 新增
        res = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name, teacher, time, location }),
        });
        if (!res.ok) throw new Error('新增課程失敗');
        onSuccess('課程已新增');
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
      <DialogTitle>{initial ? '編輯課程' : '新增課程'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="課程名稱"
            value={name}
            onChange={e => setName(e.target.value)}
            fullWidth
            required
            margin="normal"
            disabled={loading}
          />
          <TextField
            label="教師"
            value={teacher}
            onChange={e => setTeacher(e.target.value)}
            fullWidth
            required
            margin="normal"
            disabled={loading}
          />
          <TextField
            label="時間"
            value={time}
            onChange={e => setTime(e.target.value)}
            fullWidth
            required
            margin="normal"
            disabled={loading}
          />
          <TextField
            label="地點"
            value={location}
            onChange={e => setLocation(e.target.value)}
            fullWidth
            required
            margin="normal"
            disabled={loading}
          />
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

export default CourseForm;
