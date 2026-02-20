


import {
  Box,
  Typography,
  useTheme,
  IconButton,
  AppBar,
  Toolbar,
  useMediaQuery,
  Button,
  Tooltip,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from "react-router-dom";
import Logo from "../../Assets/logo.png";
import '../../index.css';
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const TopBar = ({ toggleSidebar, sidebarOpen, onLogout, darkMode, toggleDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`,
        boxShadow: darkMode 
          ? '0 4px 20px rgba(0, 0, 0, 0.3)' 
          : '0 2px 8px rgba(0, 98, 255, 0.08)',
        zIndex: theme.zIndex.appBar - 1,
        width: '100%',
        left: 0,
        right: 0,
      }}
    >
      <Toolbar
        sx={{
          px: { xs: 2, sm: 3 },
          minHeight: { xs: 56, sm: 64 },
          height: { xs: 56, sm: 64 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 1.5 },
          flex: 1,
        }}>
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              edge="start"
              color="primary"
              aria-label="open navigation menu"
              onClick={toggleSidebar}
              sx={{
                padding: '8px',
                '&:hover': {
                  bgcolor: `${theme.palette.primary.main}10`,
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo and Title */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.75, sm: 1.25 },
          }}>
            <Box
              component={RouterLink}
              to="/"
              sx={{
                height: { xs: 32, sm: 40 },
                width: { xs: 32, sm: 40 },
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                bgcolor: `${theme.palette.primary.main}08`,
                p: 0.5,
                flexShrink: 0,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: `${theme.palette.primary.main}12`,
                  transform: 'scale(1.05)',
                },
              }}
            >
              <img
                src={Logo}
                alt="Admin Logo"
                style={{
                  height: '100%',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: darkMode ? 'brightness(1.2)' : 'none',
                }}
              />
            </Box>

            {/* Title - responsive sizing */}
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                color: theme.palette.text.primary,
                fontWeight: 700,
                fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                letterSpacing: "0.3px",
                textDecoration: "none",
                background: darkMode 
                  ? `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`
                  : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: 'translateY(-1px)',
                  textShadow: darkMode 
                    ? '0 2px 8px rgba(79, 195, 247, 0.4)'
                    : '0 2px 8px rgba(0, 98, 255, 0.3)',
                },
                whiteSpace: 'nowrap',
                display: {
                  xs: isMobile ? 'block' : 'none',
                  sm: 'block',
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  display: { xs: 'none', sm: 'inline' }
                }}
              >
                Admin Dashboard
              </Box>
              <Box
                component="span"
                sx={{
                  display: { xs: 'inline', sm: 'none' }
                }}
              >
                Admin
              </Box>
            </Typography>
          </Box>
        </Box>

        {/* Right side - Controls */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: { xs: 1, sm: 1.5 },
            flexShrink: 0,
          }}
        >
          {/* Dark Mode Toggle */}
          <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton
              onClick={toggleDarkMode}
              sx={{
                color: theme.palette.text.primary,
                bgcolor: darkMode 
                  ? 'rgba(79, 195, 247, 0.1)' 
                  : 'rgba(0, 98, 255, 0.1)',
                width: 40,
                height: 40,
                '&:hover': {
                  bgcolor: darkMode 
                    ? 'rgba(79, 195, 247, 0.2)' 
                    : 'rgba(0, 98, 255, 0.2)',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Online status */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 0.75 },
              color: theme.palette.text.secondary,
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            <Box
              sx={{
                width: { xs: 6, sm: 8 },
                height: { xs: 6, sm: 8 },
                borderRadius: "50%",
                bgcolor: "#4caf50",
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": { 
                    transform: "scale(0.95)", 
                    boxShadow: "0 0 0 0 rgba(76, 175, 80, 0.7)" 
                  },
                  "70%": { 
                    transform: "scale(1)", 
                    boxShadow: "0 0 0 6px rgba(76, 175, 80, 0)" 
                  },
                  "100%": { 
                    transform: "scale(0.95)", 
                    boxShadow: "0 0 0 0 rgba(76, 175, 80, 0)" 
                  },
                },
              }}
            />
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                fontWeight: 500,
                display: { xs: "none", sm: "block" },
                whiteSpace: "nowrap",
              }}
            >
              Online
            </Typography>
          </Box>

          {/* Logout button */}
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LogoutIcon />}
            onClick={onLogout}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              borderRadius: "8px",
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main,
              "&:hover": {
                bgcolor: `${theme.palette.primary.main}10`,
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            <Box
              component="span"
              sx={{
                display: { xs: 'none', sm: 'inline' }
              }}
            >
              Logout
            </Box>
            <Box
              component="span"
              sx={{
                display: { xs: 'inline', sm: 'none' }
              }}
            >
              Exit
            </Box>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;