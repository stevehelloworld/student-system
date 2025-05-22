import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Menu, MenuItem, Avatar, Tooltip, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

export interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  role?: string;
  userName?: string;
}

const menuItems = [
  { label: '出缺勤管理', path: '/attendance', roles: ['admin', 'teacher', 'student'] },
  { label: '請假管理', path: '/leave', roles: ['admin', 'teacher', 'student'] },
  { label: '補課管理', path: '/makeup', roles: ['admin', 'teacher', 'student'] },
  { label: '課程管理', path: '/courses', roles: ['admin', 'teacher'] },
  { label: '學生管理', path: '/users', roles: ['admin', 'teacher'] },
  { label: '個人資訊', path: '/profile', roles: ['admin', 'teacher', 'student'] },
];

const Layout = ({ children, onLogout, role, userName }: LayoutProps) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false);
    handleCloseUserMenu();
  };

  // 過濾出該角色能看到的選單
  const filteredMenu = menuItems.filter(item => !role || item.roles.includes(role));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Mobile: Menu Icon */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 2 }}>
              <IconButton
                size="large"
                color="inherit"
                aria-label="open drawer"
                onClick={() => setDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            {/* Logo */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              點名系統
            </Typography>
            {/* Desktop: Menu Buttons */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {filteredMenu.map(item => (
                <Button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
            {/* User Avatar */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="開啟選單">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={userName} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={() => {
                  handleCloseUserMenu();
                  onLogout();
                }}>
                  <Typography textAlign="center">登出</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {/* Drawer for Mobile */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: 240 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <Typography variant="h6" sx={{ m: 2 }}>
            點名系統
          </Typography>
          <Divider />
          <List>
            {filteredMenu.map(item => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton onClick={() => handleNavigation(item.path)}>
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={onLogout}>
                <ListItemText primary="登出" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      {/* Main Content */}
      <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} 點名系統
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
