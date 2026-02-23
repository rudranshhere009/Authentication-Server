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
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "../../index.css";

const C = {
  red: "#DC2626",
  redLt: "#EF4444",
  redDk: "#B91C1C",
  redGlow: "rgba(220,38,38,0.14)",
  char700: "#0F1117",
  char600: "#161B22",
  char500: "#1C2128",
  char400: "#2D333B",
  text100: "#F0F6FC",
  text300: "#8B949E",
  text500: "#484F58",
  emerald: "#10B981",
  amber: "#F59E0B",
};

const TopBar = ({ toggleSidebar, onLogout, anomalyCount = 0 }) => {
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: C.char700,
        color: C.text100,
        borderBottom: `1px solid ${C.char400}`,
        boxShadow: "none",
        zIndex: theme.zIndex.appBar - 1,
        width: "100%",
        backgroundImage: "none",
      }}
    >
      <Toolbar
        sx={{
          px: { xs: 2, sm: 3 },
          minHeight: { xs: 56, sm: 60 },
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* ── Left ── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {mobile && (
            <IconButton
              edge="start"
              onClick={toggleSidebar}
              aria-label="menu"
              disableRipple
              disableTouchRipple
              sx={{
                color: C.text500,
                width: 34,
                height: 34,
                borderRadius: "8px",
                transition: "color 0.1s, background-color 0.1s",
                "&:hover": { bgcolor: C.redGlow, color: C.redLt },
                "&:focus": {
                  outline: "none",
                  boxShadow: "none",
                  bgcolor: "transparent",
                },
                "&:focus-visible": {
                  outline: "none",
                  boxShadow: "none",
                  bgcolor: "transparent",
                },
                "&.Mui-focusVisible": {
                  outline: "none",
                  boxShadow: "none",
                  bgcolor: "transparent",
                },
                "&:active": { bgcolor: "transparent", boxShadow: "none" },
                "&.MuiButtonBase-root:focus-visible": {
                  outline: "none",
                  boxShadow: "none",
                },
              }}
            >
              <MenuIcon fontSize="small" />
            </IconButton>
          )}

          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              textDecoration: "none",
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "9px",
                background: `linear-gradient(135deg, ${C.red} 0%, ${C.redDk} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 14px rgba(220,38,38,0.45)`,
                flexShrink: 0,
                fontSize: "1.2rem",
                lineHeight: 1,
                userSelect: "none",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
                "&:hover": {
                  boxShadow: `0 6px 22px rgba(220,38,38,0.65)`,
                  transform: "scale(1.05)",
                },
              }}
            >
              ⚡
            </Box>

            <Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                  color: C.text100,
                  letterSpacing: "2px",
                  display: { xs: "none", sm: "block" },
                  fontFamily: '"Orbitron", sans-serif',
                  lineHeight: 1,
                  "& span": { color: C.redLt },
                }}
              >
                AP<span>EX</span>
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.52rem",
                  color: C.text500,
                  letterSpacing: "0.15em",
                  fontFamily: '"Space Grotesk", sans-serif',
                  textTransform: "uppercase",
                  display: { xs: "none", sm: "block" },
                  lineHeight: 1,
                }}
              >
                Auth Platform
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* ── Right ── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Live indicator */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              bgcolor: C.char600,
              border: `1px solid ${C.char400}`,
              borderRadius: "8px",
              px: 1.25,
              py: 0.5,
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: C.emerald,
                animation: "pulse 2s infinite",
                "@keyframes pulse": {
                  "0%": {
                    transform: "scale(0.95)",
                    boxShadow: "0 0 0 0 rgba(16,185,129,0.7)",
                  },
                  "70%": {
                    transform: "scale(1)",
                    boxShadow: "0 0 0 6px rgba(16,185,129,0)",
                  },
                  "100%": {
                    transform: "scale(0.95)",
                    boxShadow: "0 0 0 0 rgba(16,185,129,0)",
                  },
                },
              }}
            />
            <Typography
              sx={{
                color: C.text500,
                fontSize: "0.72rem",
                fontWeight: 600,
                fontFamily: '"Space Grotesk", sans-serif',
                display: { xs: "none", sm: "block" },
                letterSpacing: "0.04em",
              }}
            >
              Online
            </Typography>
          </Box>

          {/* Anomaly bell */}
          {anomalyCount > 0 && (
            <Tooltip title={`${anomalyCount} anomaly alert(s)`}>
              <IconButton
                onClick={() => navigate("/anomalies")}
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "8px",
                  bgcolor: `${C.amber}12`,
                  border: `1px solid ${C.amber}35`,
                  color: C.amber,
                  "&:hover": {
                    bgcolor: `${C.amber}22`,
                    borderColor: C.amber,
                  },
                }}
              >
                <Badge
                  badgeContent={anomalyCount}
                  sx={{
                    "& .MuiBadge-badge": {
                      bgcolor: C.red,
                      color: "#fff",
                      fontSize: "0.6rem",
                      minWidth: 16,
                      height: 16,
                      fontFamily: '"Space Grotesk", sans-serif',
                      top: -2,
                      right: -2,
                      animation: "anomalyPulse 2s infinite",
                    },
                  }}
                >
                  <WarningAmberIcon sx={{ fontSize: 17 }} />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {/* Notification icon (no anomalies) */}
          {anomalyCount === 0 && (
            <Tooltip title="No active alerts">
              <IconButton
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "8px",
                  color: C.text500,
                  "&:hover": { bgcolor: C.redGlow, color: C.redLt },
                }}
              >
                <NotificationsIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}

          {/* Logout */}
          <Tooltip title="Logout">
            <Button
              variant="outlined"
              size="small"
              startIcon={<LogoutIcon sx={{ fontSize: "0.95rem !important" }} />}
              onClick={onLogout}
              sx={{
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.78rem",
                fontFamily: '"Space Grotesk", sans-serif',
                borderRadius: "8px",
                borderColor: C.char400,
                color: C.text300,
                px: { xs: 1.5, sm: 2 },
                "&:hover": {
                  borderColor: C.redLt,
                  color: C.redLt,
                  bgcolor: `rgba(220,38,38,0.07)`,
                },
                transition: "all 0.2s ease",
              }}
            >
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                Logout
              </Box>
            </Button>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
