import { Box, Container } from '@mui/material';
import LoginForm from '../components/LoginForm';

interface LoginPageProps {
  onLogin: (token: string, role: string, userId: number, name: string) => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box sx={{ width: '100%', mt: 3 }}>
          <LoginForm onLogin={onLogin} />
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
