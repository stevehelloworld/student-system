import { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ role }: { role?: string }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (role === 'admin' || role === 'teacher') {
      navigate('/courses', { replace: true });
    } else if (role === 'student') {
      navigate('/attendance', { replace: true });
    }
  }, [role, navigate]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        歡迎使用點名系統
      </Typography>
      <Typography paragraph>
        請使用上方導航列來管理出缺勤、請假和補課記錄。
      </Typography>
    </div>
  );
};

export default HomePage;
