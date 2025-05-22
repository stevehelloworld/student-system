import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Stack } from '@mui/material';
import type { MakeUpSession } from '../api/makeup';
import { createMakeup, updateMakeup } from '../api/makeup';

interface MakeupFormProps {
  open: boolean;
  onClose: () => void;
  token: string;
  initial?: Partial<MakeUpSession>;
  onSuccess: () => void;
}

const MakeupForm: React.FC<MakeupFormProps> = ({ open, onClose, token, initial, onSuccess }) => {
  const isEdit = Boolean(initial && initial.id);
  const [form, setForm] = useState<Partial<MakeUpSession>>({ ...initial });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (isEdit && form.id) {
        await updateMakeup(form.id, form, token);
      } else {
        await createMakeup(form, token);
      }
      onSuccess();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEdit ? '編輯補課' : '新增補課'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
          <TextField
            name="studentId"
            label="學生ID"
            type="number"
            value={form.studentId || ''}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="originalSessionId"
            label="原課堂SessionID"
            type="number"
            value={form.originalSessionId || ''}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="makeUpDate"
            label="補課日期"
            type="date"
            value={form.makeUpDate?.slice(0,10) || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
          <TextField
            name="startTime"
            label="開始時間"
            type="time"
            value={form.startTime || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
          <TextField
            name="endTime"
            label="結束時間"
            type="time"
            value={form.endTime || ''}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            fullWidth
            required
          />
          <TextField
            name="content"
            label="補課說明"
            value={form.content || ''}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={saving}>取消</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving}>
          {isEdit ? '儲存' : '新增'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MakeupForm;
