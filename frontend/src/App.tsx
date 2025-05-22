import { useState } from 'react';
import type { ReactNode, JSX } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { blue } from '@mui/material/colors';

// Pages
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import AttendancePage from './pages/AttendancePage';
import LeavePage from './pages/LeavePage';
import MakeupPage from './pages/MakeupPage';
import CoursesPage from './pages/CoursesPage';
import Layout from './components/Layout';
import UsersPage from './pages/UsersPage';
import ProfilePage from './pages/ProfilePage';
import SessionsPage from './pages/SessionsPage';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: blue[800],
    },
    secondary: {
      main: '#19857b',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null
  );
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'));

  const handleLogin = (jwt: string, role: string, userId: number, name: string) => {
    localStorage.setItem('token', jwt);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('userName', name);
    setToken(jwt);
    setRole(role);
    setUserId(userId);
    setUserName(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setToken(null);
    setRole(null);
    setUserId(null);
    setUserName(null);
  };

  // Protected Route component
  const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  // Role-based route component
  const RoleBasedRoute = ({ allowedRoles, children }: { allowedRoles: string[], children: JSX.Element }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    
    if (role && !allowedRoles.includes(role)) {
      return <Navigate to="/" replace />;
    }
    
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route 
            path="/login" 
            element={
              token ? 
                <Navigate to="/" replace /> : 
                <LoginPage onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout onLogout={handleLogout} role={role || undefined} userName={userName || undefined}>
                  <HomePage role={role || undefined} />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute>
                <Layout onLogout={handleLogout} role={role || undefined} userName={userName || undefined}>
                  <AttendancePage token={token!} role={role || undefined} userId={userId || undefined} />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leave" 
            element={
              <ProtectedRoute>
                <Layout onLogout={handleLogout} role={role || undefined} userName={userName || undefined}>
                  <LeavePage token={token!} role={role || undefined} userId={userId || undefined} />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/makeup" 
            element={
              <ProtectedRoute>
                <Layout onLogout={handleLogout} role={role || undefined} userName={userName || undefined}>
                  <MakeupPage token={token!} role={role || undefined} userId={userId || undefined} />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/courses" 
            element={
              <RoleBasedRoute allowedRoles={['admin', 'teacher']}>
                <Layout onLogout={handleLogout} role={role || undefined} userName={userName || undefined}>
                  <CoursesPage token={token!} role={role || undefined} />
                </Layout>
              </RoleBasedRoute>
            } 
          />
          <Route
            path="/courses/:courseId/sessions"
            element={
              <RoleBasedRoute allowedRoles={['admin', 'teacher']}>
                <Layout onLogout={handleLogout} role={role || undefined} userName={userName || undefined}>
                  <SessionsPage />
                </Layout>
              </RoleBasedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <RoleBasedRoute allowedRoles={['admin', 'teacher']}>
                <Layout onLogout={handleLogout} role={role || undefined} userName={userName || undefined}>
                  <UsersPage />
                </Layout>
              </RoleBasedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout onLogout={handleLogout} role={role || undefined} userName={userName || undefined}>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
