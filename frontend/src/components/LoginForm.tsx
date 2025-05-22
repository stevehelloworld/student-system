import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import axios from 'axios';

interface LoginFormProps {
  onLogin: (token: string, role: string, userId: number, name: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      // 從 JWT 中解碼用戶信息
      const token = res.data.token;
      const decoded = JSON.parse(atob(token.split('.')[1]));
      onLogin(token, decoded.role, decoded.id, decoded.name || '');
    } catch (err: any) {
      setError(err.response?.data?.error || '登入失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 6, maxWidth: 350, mx: 'auto' }}>
      <Typography variant="h6" mb={2} align="center">登入</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField
        label="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        type="email"
        fullWidth
        required
        margin="normal"
      />
      <TextField
        label="密碼"
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        fullWidth
        required
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ mt: 2 }}>
        {loading ? '登入中...' : '登入'}
      </Button>
    </Box>
  );
};

export default LoginForm;
