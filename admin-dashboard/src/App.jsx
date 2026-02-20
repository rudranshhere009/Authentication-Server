

import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Box, useMediaQuery, CssBaseline } from "@mui/material";
import { ThemeProvider } from '@mui/material/styles';
import createAppTheme from './theme'; // Updated import
import './index.css';
import "./Components/tables/table.css";

import LoginForm from "./Components/LoginForm";
import TopBar from "./Components/global/TopBar";
import useAdmin from "./hooks/useAdmin";

// Import your page components
import DashboardPage from './Pages/DashboardPage';
import UsersPage from './Pages/UsersPage';
import UserProfilePage from './Pages/UserProfilePage';
import AnalyticsPage from './Pages/AnalyticsPage';
import Sidebar from "./Components/global/Sidebar";
import AllJwtSessionsPage from './Pages/AllJwtSessionsPage';

// Use import.meta.env for Vite or modern React setups
const API_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || "http://localhost:8000";


function App() {
  // FIXED: Initialize dark mode state from localStorage immediately
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode !== null ? JSON.parse(savedDarkMode) : false;
  });

  // Update localStorage and document theme when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Create theme based on dark mode state
  const theme = createAppTheme(darkMode);

  // Helper to calculate current month login data from JWT sessions
  function calculateCurrentMonthLoginData(jwtSessions) {
    if (!Array.isArray(jwtSessions) || jwtSessions.length === 0) {
      return { data: [], daysInMonth: 0, monthTitle: '' };
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // Pre-calculate month strings
    const monthShort = now.toLocaleString('default', { month: 'short' });
    const monthLong = now.toLocaleString('default', { month: 'long' });
    
    // Use reduce instead of for loop
    const counts = jwtSessions.reduce((acc, s) => {
      if (!s?.created_at) return acc;
      const d = new Date(s.created_at);
      if (d.getFullYear() === year && (d.getMonth() + 1) === month) {
        const day = d.getDate() - 1;
        if (acc[day] !== undefined) acc[day]++;
      }
      return acc;
    }, Array(daysInMonth).fill(0));

    const data = counts.map((c, i) => ({
      dayNumber: i + 1,
      logins: c,
      dateLabel: `${monthShort} ${i + 1}, ${year}`
    }));

    return { data, daysInMonth, monthTitle: `${monthLong} ${year}` };
  }

  const {
    isLoggedIn,
    users,
    error,
    isLoading,
    handleLogin,
    handleLogout,
    toggleBlock,
    recentJwtSessions,
    handleRevokeSession,
    jwtSessions,
    tableJwtSessions,
    jwtTotal,
    jwtLoading,
    fetchJwtSessionsPage,
  } = useAdmin(API_URL);

  // Logout
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      const token = sessionStorage.getItem("token");
      console.log("Logout clicked, token =", token);

      if (token) {
        await fetch(`${API_URL}/admin/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      handleLogout();
      navigate("/login", { replace: true });
    }
  };

  const [isSideBarOpen, setisSidebarOpen] = useState(false);

  // Anomaly change
  const [lastSeenAnomalyId, setLastSeenAnomalyId] = useState(() => {
    return localStorage.getItem("lastSeenAnomalyId") || null;
  });

  useEffect(() => {
    const fetchAnomalies = async (isInitialLoad = false) => {
      try {
        const res = await fetch(`${API_URL}/admin/anomalies`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          const newest = data[0];
          const newestId = newest.id.toString();

          if (isInitialLoad) {
            if (!lastSeenAnomalyId) {
              setLastSeenAnomalyId(newestId);
              return;
            }
          }

          if (newestId !== lastSeenAnomalyId) {
            if (Notification.permission === "granted" && navigator.serviceWorker) {
              navigator.serviceWorker.ready.then((registration) => {
                registration.showNotification("⚠️ Concurrent Login Detected", {
                  body: `${newest.username} - ${newest.description}`,
                  requireInteraction: true,
                  icon: "/favicon.ico",
                });
              });
            } else {
              alert(`⚠️ Concurrent login detected for ${newest.username}`);
            }
            setLastSeenAnomalyId(newestId);
          }
        }
      } catch (err) {
        console.error("Error fetching anomalies:", err);
      }
    };

    fetchAnomalies(true);
    const interval = setInterval(() => fetchAnomalies(false), 10000);
    return () => clearInterval(interval);
  }, [lastSeenAnomalyId]);

  useEffect(() => {
    if (lastSeenAnomalyId !== null) {
      localStorage.setItem("lastSeenAnomalyId", lastSeenAnomalyId);
    }
  }, [lastSeenAnomalyId]);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleSidebar = () => {
    setisSidebarOpen(!isSideBarOpen);
  };

  const calculateWeeklyLoginData = () => {
    if (!jwtSessions || jwtSessions.length === 0) {
      return [
        { day: 'Mon', logins: 0 },
        { day: 'Tue', logins: 0 },
        { day: 'Wed', logins: 0 },
        { day: 'Thu', logins: 0 },
        { day: 'Fri', logins: 0 },
        { day: 'Sat', logins: 0 },
        { day: 'Sun', logins: 0 },
      ];
    }

    const loginCounts = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date();
    
    const currentDayOfWeek = today.getDay();
    const daysToSubtract = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    const currentWeekMonday = new Date(today);
    currentWeekMonday.setDate(today.getDate() - daysToSubtract);
    currentWeekMonday.setHours(0, 0, 0, 0);

    jwtSessions.forEach(session => {
      if (session.created_at) {
        const date = new Date(session.created_at);
        
        if (date >= currentWeekMonday && date <= today) {
          const dayOfWeek = date.getDay();
          const chartIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          loginCounts[chartIndex]++;
        }
      }
    });

    return [
      { day: 'Mon', logins: loginCounts[0] },
      { day: 'Tue', logins: loginCounts[1] },
      { day: 'Wed', logins: loginCounts[2] },
      { day: 'Thu', logins: loginCounts[3] },
      { day: 'Fri', logins: loginCounts[4] },
      { day: 'Sat', logins: loginCounts[5] },
      { day: 'Sun', logins: loginCounts[6] },
    ];
  };

  const weeklyLogindata = calculateWeeklyLoginData();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        {/* Public Route: Login */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <LoginForm 
                handleLogin={handleLogin} 
                error={error} 
                isLoading={isLoading} 
                darkMode={darkMode}
              />
            )
          }
        />

        {/* Protected Routes */}
        {isLoggedIn ? (
          <Route
            path="/*"
            element={
              <Box sx={{ 
                display: 'flex', 
                minHeight: '100vh',
                bgcolor: theme.palette.background.default,
              }}>
                {/* Sidebar */}
                <Sidebar 
                  isOpen={isSideBarOpen} 
                  toggleSidebar={toggleSidebar}
                  darkMode={darkMode}
                />

                {/* Main Area */}
                <Box
                  sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    marginLeft: {
                      xs: 0,
                      md: isSideBarOpen ? '240px' : '72px'
                    },
                    transition: theme.transitions.create('margin-left', {
                      easing: theme.transitions.easing.sharp,
                      duration: theme.transitions.duration.enteringScreen,
                    }),
                    minWidth: 0,
                    bgcolor: theme.palette.background.default,
                  }}
                >
                  {/* TopBar */}
                  <TopBar
                    toggleSidebar={toggleSidebar}
                    sidebarOpen={isSideBarOpen}
                    onLogout={onLogout}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                  />

                  {/* Content */}
                  <Box
                    className="app-container"
                    sx={{
                      bgcolor: theme.palette.background.default,
                      minHeight: 'calc(100vh - 64px)',
                      pt: 3,
                      pb: 3,
                      px: 3,
                      overflow: 'auto',
                      width: '100%',
                    }}
                  >
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <DashboardPage
                            users={users}
                            jwtSessions={jwtSessions}
                            tableJwtSessions={tableJwtSessions}
                            recentJwtSessions={recentJwtSessions}
                            handleRevokeSession={handleRevokeSession}
                            isLoading={isLoading}
                            weeklyLogindata={weeklyLogindata}
                            jwtSessiontotal={jwtTotal}
                            fetchJwtSessions={fetchJwtSessionsPage}
                            currentMonthLogindata={calculateCurrentMonthLoginData(jwtSessions)}
                            darkMode={darkMode}
                            replace
                          />
                        }
                      />
                      <Route
                        path="/users"
                        element={
                          <UsersPage 
                            users={users} 
                            toggleBlock={toggleBlock} 
                            darkMode={darkMode}
                            replace 
                          />
                        }
                      />
                      <Route
                        path="/users/:userId"
                        element={
                          <UserProfilePage 
                            users={users} 
                            sessions={jwtSessions} 
                            toggleBlock={toggleBlock} 
                            darkMode={darkMode}
                            replace 
                          />
                        }
                      />
                      <Route
                        path="/jwt-sessions"
                        element={
                          <AllJwtSessionsPage
                            title="All JWT Sessions"
                            jwtSessions={jwtSessions}
                            jwtTotal={jwtTotal}
                            jwtLoading={jwtLoading}
                            fetchJwtSessionsPage={fetchJwtSessionsPage}
                            onRevokeSession={handleRevokeSession}
                            isLoading={isLoading}
                            darkMode={darkMode}
                            replace
                          />
                        }
                      />
                      <Route
                        path="/analytics"
                        element={
                          <AnalyticsPage
                            weeklyLogindata={weeklyLogindata}
                            allsessions={jwtSessions}
                            users={users}
                            darkMode={darkMode}
                            replace
                          />
                        }
                      />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </Box>
                </Box>
              </Box>
            }
          />
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </ThemeProvider>
  );
}

export default App;