import { useEffect, useState } from 'react';
import { Button, Box, CircularProgress, Snackbar, Alert } from '@mui/material';
import AttendanceList from '../components/AttendanceList';
import type { AttendanceRecord } from '../components/AttendanceList';
import AttendanceForm from '../components/AttendanceForm';

const API_URL = '/api/attendance';

const AttendancePage = ({ token, role, userId }: { token: string; role?: string; userId?: number }) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<AttendanceRecord | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = API_URL;
      if (role === 'student' && userId) {
        url += `?studentId=${userId}`;
      }
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('無法取得出缺勤資料');
      const data = await res.json();
      setRecords(data);
    } catch (err: any) {
      setError(err.message || '發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, []);

  const handleEdit = (record: AttendanceRecord) => {
    setEditRecord(record);
    setFormOpen(true);
  };

  const handleSuccess = (msg: string) => {
    setFormOpen(false);
    setEditRecord(null);
    setSuccessMsg(msg);
    fetchRecords();
  };

  const handleAdd = () => {
    setEditRecord(null);
    setFormOpen(true);
  };

  return (
    <Box>
      {(role === 'admin' || role === 'teacher') && (
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{ mb: 2 }}
        >
          新增出缺勤記錄
        </Button>
      )}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <AttendanceList
          records={records}
          onEdit={(role === 'admin' || role === 'teacher') ? handleEdit : undefined}
        />
      )}
      <AttendanceForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editRecord || undefined}
        onSuccess={handleSuccess}
        token={token}
      />
      <Snackbar
        open={!!successMsg}
        autoHideDuration={3000}
        onClose={() => setSuccessMsg(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" onClose={() => setSuccessMsg(null)}>
          {successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AttendancePage;
