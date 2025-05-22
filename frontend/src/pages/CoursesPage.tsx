import { useEffect, useState } from 'react';
import { Button, CircularProgress, Box, Snackbar, Alert } from '@mui/material';
import CourseList from '../components/CourseList';
import type { CourseRecord } from '../components/CourseList';
import CourseForm from '../components/CourseForm';

const API_URL = '/api/courses';

const CoursesPage = ({ token, role }: { token: string; role?: string }) => {
  const [courses, setCourses] = useState<CourseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editCourse, setEditCourse] = useState<CourseRecord | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('無法取得課程資料');
      const data = await res.json();
      setCourses(data);
    } catch (err: any) {
      setError(err.message || '發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line
  }, []);

  const handleEdit = (course: CourseRecord) => {
    setEditCourse(course);
    setFormOpen(true);
  };

  const handleSuccess = (msg: string) => {
    setFormOpen(false);
    setEditCourse(null);
    setSuccessMsg(msg);
    fetchCourses();
  };

  const handleAdd = () => {
    setEditCourse(null);
    setFormOpen(true);
  };

  return (
    <Box>
      {role === 'admin' && (
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{ mb: 2 }}
        >
          新增課程
        </Button>
      )}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <CourseList
          records={courses}
          onEdit={role === 'admin' ? handleEdit : undefined}
        />
      )}
      <CourseForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editCourse || undefined}
        onSuccess={(msg: string) => handleSuccess(msg)}
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

export default CoursesPage;
