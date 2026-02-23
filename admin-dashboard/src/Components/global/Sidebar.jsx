import { Link, useLocation } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Drawer,
  useMediaQuery,
  Tooltip,
  Typography,
  Badge,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SecurityIcon from "@mui/icons-material/Security";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SettingsIcon from "@mui/icons-material/Settings";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState, useCallback, memo } from "react";

/* ── palette ── */
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
  violet: "#A855F7",
  cyan: "#22D3EE",
};

/* ── shared: kill every focus/active glow on icon buttons ── */
const noFocus = {
  outline: "none",
  boxShadow: "none",
  bgcolor: "transparent",
};

const noFocusSx = {
  "&:focus": { outline: "none", boxShadow: "none" },
  "&:focus-visible": { outline: "none", boxShadow: "none" },
  "&.Mui-focusVisible": { ...noFocus },
  "&:active": { bgcolor: "transparent" },
  "&.MuiButtonBase-root:focus-visible": { outline: "none", boxShadow: "none" },
};

/* ── menu data (static, defined once) ── */
const menuItems = [
  {
    text: "Dashboard",
    icon: DashboardIcon,
    path: "/",
    tip: "Dashboard",
    badge: null,
    section: "main",
  },
  {
    text: "Users",
    icon: PeopleIcon,
    path: "/users",
    tip: "User Management",
    badge: null,
    section: "main",
  },
  {
    text: "JWT Sessions",
    icon: SecurityIcon,
    path: "/jwt-sessions",
    tip: "Sessions",
    badge: "live",
    section: "main",
  },
  {
    text: "Analytics",
    icon: AnalyticsIcon,
    path: "/analytics",
    tip: "Analytics",
    badge: null,
    section: "main",
  },
  {
    text: "Anomalies",
    icon: WarningAmberIcon,
    path: "/anomalies",
    tip: "Anomaly Logs",
    badge: "alert",
    section: "security",
  },
  {
    text: "Reports",
    icon: AssessmentIcon,
    path: "/reports",
    tip: "Reports & Export",
    badge: null,
    section: "security",
  },
  {
    text: "Settings",
    icon: SettingsIcon,
    path: "/settings",
    tip: "System Settings",
    badge: null,
    section: "config",
  },
];

const mainItems = menuItems.filter((i) => i.section === "main");
const securityItems = menuItems.filter((i) => i.section === "security");
const configItems = menuItems.filter((i) => i.section === "config");

/* ── isolated clock (own state, never re-renders parent) ── */
const ClockStrip = memo(() => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <Box
      sx={{
        px: 2,
        py: 0.75,
        borderBottom: `1px solid ${C.char400}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0,
        bgcolor: "rgba(28,33,40,0.6)",
      }}
    >
      <Typography
        sx={{
          color: C.text500,
          fontSize: "0.62rem",
          fontFamily: '"Space Grotesk", monospace',
          letterSpacing: "0.06em",
        }}
      >
        {time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
        <Box
          sx={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            bgcolor: C.emerald,
            animation: "livePulse 2s infinite",
            "@keyframes livePulse": {
              "0%": { opacity: 1 },
              "50%": { opacity: 0.4 },
              "100%": { opacity: 1 },
            },
          }}
        />
        <Typography
          sx={{
            color: C.emerald,
            fontSize: "0.6rem",
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 600,
            letterSpacing: "0.08em",
          }}
        >
          LIVE
        </Typography>
      </Box>
    </Box>
  );
});

/* ── section label ── */
const SectionLabel = memo(({ label }) => (
  <Typography
    sx={{
      color: C.text500,
      fontSize: "0.6rem",
      fontWeight: 700,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      px: 2.5,
      pt: 1.75,
      pb: 0.5,
      fontFamily: '"Space Grotesk", sans-serif',
    }}
  >
    {label}
  </Typography>
));

/* ── full-panel nav item (with text) ── */
const NavItem = memo(({ item, isOn, mobile, toggleSidebar, anomalyCount }) => {
  const Icon = item.icon;
  const badgeContent =
    item.badge === "alert" && anomalyCount > 0 ? anomalyCount : null;
  const isLive = item.badge === "live";
  const isAlert = item.badge === "alert" && anomalyCount > 0;
  const iconColor = isOn ? C.redLt : isAlert ? C.amber : C.text500;

  const handleClick = useCallback(() => {
    if (mobile) toggleSidebar();
  }, [mobile, toggleSidebar]);

  return (
    <ListItemButton
      component={Link}
      to={item.path}
      selected={isOn}
      onClick={handleClick}
      disableRipple
      sx={{
        minHeight: 44,
        borderRadius: "10px",
        mx: 1,
        my: "2px",
        px: "12px",
        bgcolor: isOn ? C.redGlow : "transparent",
        borderLeft: isOn
          ? `2px solid ${C.red}`
          : isAlert
            ? `2px solid ${C.amber}33`
            : "2px solid transparent",
        transition: "background-color 0.1s, border-color 0.1s, transform 0.1s",
        "&:hover": {
          bgcolor: C.redGlow,
          transform: "translateX(2px)",
          "& .SI": { color: `${C.redLt} !important` },
          "& .ST .MuiTypography-root": { color: `${C.redLt} !important` },
        },
        ...noFocusSx,
      }}
    >
      <ListItemIcon
        className="SI"
        sx={{
          minWidth: 32,
          mr: 1.25,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: iconColor,
          transition: "color 0.1s",
          "& svg": { width: 17, height: 17 },
        }}
      >
        {badgeContent ? (
          <Badge
            badgeContent={badgeContent}
            sx={{
              "& .MuiBadge-badge": {
                bgcolor: C.red,
                color: "#fff",
                fontSize: "0.6rem",
                minWidth: 16,
                height: 16,
                fontFamily: '"Space Grotesk", sans-serif',
              },
            }}
          >
            <Icon />
          </Badge>
        ) : (
          <Icon />
        )}
      </ListItemIcon>

      <Box
        className="ST"
        sx={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <ListItemText
          primary={item.text}
          sx={{
            m: 0,
            "& .MuiTypography-root": {
              fontSize: "0.85rem",
              fontWeight: isOn ? 700 : 500,
              fontFamily: '"Space Grotesk", sans-serif',
              color: isOn ? C.redLt : isAlert ? C.amber : C.text300,
              transition: "color 0.1s",
              letterSpacing: "0.01em",
            },
          }}
        />
        {isLive && (
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              bgcolor: C.emerald,
              flexShrink: 0,
              boxShadow: `0 0 6px ${C.emerald}`,
              animation: "livePulse 2s infinite",
              "@keyframes livePulse": {
                "0%": { opacity: 1 },
                "50%": { opacity: 0.4 },
                "100%": { opacity: 1 },
              },
            }}
          />
        )}
        {isAlert && (
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              bgcolor: C.amber,
              flexShrink: 0,
              boxShadow: `0 0 6px ${C.amber}`,
              animation: "alertPulse 1.5s infinite",
              "@keyframes alertPulse": {
                "0%": { opacity: 1, transform: "scale(1)" },
                "50%": { opacity: 0.5, transform: "scale(1.3)" },
                "100%": { opacity: 1, transform: "scale(1)" },
              },
            }}
          />
        )}
      </Box>
    </ListItemButton>
  );
});

/* ── mini rail icon button ── */
const MiniNavItem = memo(({ item, isOn }) => {
  const Icon = item.icon;
  return (
    <Tooltip title={item.tip} placement="right" arrow>
      <ListItemButton
        component={Link}
        to={item.path}
        disableRipple
        sx={{
          justifyContent: "center",
          minHeight: 44,
          mx: "10px",
          my: "2px",
          borderRadius: "10px",
          px: 0,
          bgcolor: isOn ? C.redGlow : "transparent",
          borderLeft: isOn ? `2px solid ${C.red}` : "2px solid transparent",
          transition: "background-color 0.1s",
          "&:hover": { bgcolor: C.redGlow },
          ...noFocusSx,
        }}
      >
        <Icon sx={{ fontSize: 17, color: isOn ? C.redLt : C.text500 }} />
      </ListItemButton>
    </Tooltip>
  );
});

/* ════════════════════════════════════════════════
   SIDEBAR
   ════════════════════════════════════════════════ */
const Sidebar = ({ isOpen, toggleSidebar, anomalyCount = 0 }) => {
  const theme = useTheme();
  const loc = useLocation();
  const mobile = useMediaQuery(theme.breakpoints.down("md"));

  const active = useCallback((p) => loc.pathname === p, [loc.pathname]);

  /* ── Mobile: standard MUI Drawer ── */
  if (mobile) {
    const mobileInner = (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          bgcolor: C.char700,
          overflow: "hidden",
        }}
      >
        {/* header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            minHeight: 64,
            borderBottom: `1px solid ${C.char400}`,
            flexShrink: 0,
            background: `linear-gradient(180deg, rgba(220,38,38,0.06) 0%, transparent 100%)`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "9px",
                background: `linear-gradient(135deg, ${C.red} 0%, ${C.redDk} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 14px rgba(220,38,38,0.55)`,
                flexShrink: 0,
                fontSize: "1.1rem",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              ⚡
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: "0.88rem",
                  color: C.text100,
                  letterSpacing: "2.5px",
                  fontFamily: '"Orbitron", sans-serif',
                  lineHeight: 1.1,
                }}
              >
                APEX
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.52rem",
                  color: C.text500,
                  letterSpacing: "0.15em",
                  fontFamily: '"Space Grotesk", sans-serif',
                  textTransform: "uppercase",
                }}
              >
                Auth Platform
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={toggleSidebar}
            size="small"
            disableRipple
            sx={{
              color: C.text500,
              width: 28,
              height: 28,
              borderRadius: "7px",
              "&:hover": { bgcolor: C.redGlow, color: C.redLt },
              ...noFocusSx,
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>
        <ClockStrip />
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            py: 0.75,
            "&::-webkit-scrollbar": { width: 3 },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: C.char400,
              borderRadius: 99,
            },
          }}
        >
          <SectionLabel label="Main" />
          <List sx={{ px: 0, py: 0 }}>
            {mainItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <NavItem
                  item={item}
                  isOn={active(item.path)}
                  mobile={mobile}
                  toggleSidebar={toggleSidebar}
                  anomalyCount={anomalyCount}
                />
              </ListItem>
            ))}
          </List>
          <SectionLabel label="Security" />
          <List sx={{ px: 0, py: 0 }}>
            {securityItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <NavItem
                  item={item}
                  isOn={active(item.path)}
                  mobile={mobile}
                  toggleSidebar={toggleSidebar}
                  anomalyCount={anomalyCount}
                />
              </ListItem>
            ))}
          </List>
          <SectionLabel label="System" />
          <List sx={{ px: 0, py: 0 }}>
            {configItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <NavItem
                  item={item}
                  isOn={active(item.path)}
                  mobile={mobile}
                  toggleSidebar={toggleSidebar}
                  anomalyCount={anomalyCount}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box
          sx={{
            p: "10px 14px",
            borderTop: `1px solid ${C.char400}`,
            background: `linear-gradient(0deg, rgba(220,38,38,0.05) 0%, transparent 100%)`,
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "7px",
                background: `linear-gradient(135deg, ${C.red} 0%, ${C.redDk} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 2px 8px rgba(220,38,38,0.35)`,
                flexShrink: 0,
                fontSize: "0.8rem",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              ⚡
            </Box>
            <Box>
              <Typography
                sx={{
                  color: C.text100,
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  fontFamily: '"Orbitron", sans-serif',
                  letterSpacing: "1px",
                }}
              >
                APEX
              </Typography>
              <Typography
                sx={{
                  color: C.text500,
                  fontSize: "0.58rem",
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                Admin v2.0
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );

    return (
      <Drawer
        variant="temporary"
        anchor="left"
        open={isOpen}
        onClose={toggleSidebar}
        ModalProps={{ keepMounted: true }}
        transitionDuration={{ enter: 140, exit: 110 }}
        sx={{
          "& .MuiDrawer-paper": {
            width: 240,
            bgcolor: C.char700,
            borderRight: `1px solid ${C.char400}`,
            boxShadow: "8px 0 40px rgba(0,0,0,0.8)",
            willChange: "transform",
          },
          "& .MuiBackdrop-root": { backgroundColor: "rgba(0,0,0,0.4)" },
        }}
      >
        {mobileInner}
      </Drawer>
    );
  }

  /* ── Desktop: permanent mini rail + overlay full panel ── */
  return (
    <>
      {/* ── Layer 1: permanent mini icon rail (never moves, no animation) ── */}
      <Box
        sx={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 68,
          height: "100vh",
          zIndex: theme.zIndex.drawer,
          bgcolor: C.char700,
          borderRight: `1px solid ${C.char400}`,
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* mini header — hamburger */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 64,
            borderBottom: `1px solid ${C.char400}`,
            flexShrink: 0,
            background: `linear-gradient(180deg, rgba(220,38,38,0.06) 0%, transparent 100%)`,
          }}
        >
          <IconButton
            onClick={toggleSidebar}
            size="small"
            disableRipple
            disableTouchRipple
            sx={{
              color: C.text500,
              width: 32,
              height: 32,
              borderRadius: "8px",
              transition: "color 0.1s, background-color 0.1s",
              "&:hover": { bgcolor: C.redGlow, color: C.redLt },
              ...noFocusSx,
            }}
          >
            <MenuIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* mini nav icons */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            py: 0.75,
            "&::-webkit-scrollbar": { width: 0 },
          }}
        >
          {/* main section divider */}
          <Box sx={{ height: "1px", bgcolor: C.char400, mx: "10px", my: 1 }} />
          <List sx={{ px: 0, py: 0 }}>
            {mainItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <MiniNavItem item={item} isOn={active(item.path)} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ height: "1px", bgcolor: C.char400, mx: "10px", my: 1 }} />
          <List sx={{ px: 0, py: 0 }}>
            {securityItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <MiniNavItem item={item} isOn={active(item.path)} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ height: "1px", bgcolor: C.char400, mx: "10px", my: 1 }} />
          <List sx={{ px: 0, py: 0 }}>
            {configItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <MiniNavItem item={item} isOn={active(item.path)} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* mini footer */}
        <Box
          sx={{
            p: "10px 0",
            borderTop: `1px solid ${C.char400}`,
            display: "flex",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: "7px",
              background: `linear-gradient(135deg, ${C.red} 0%, ${C.redDk} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.85rem",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            ⚡
          </Box>
        </Box>
      </Box>

      {/* ── Layer 2: full overlay panel (GPU transform slide, transparent) ── */}
      <Box
        sx={{
          position: "fixed",
          left: 0,
          top: 0,
          width: 240,
          height: "100vh",
          zIndex: theme.zIndex.drawer + 2,
          /* pure transform — zero layout reflow, runs on compositor */
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.12s cubic-bezier(0.4,0,0.2,1)",
          willChange: "transform",
          /* high transparency — no blur, no composite layer cost */
          bgcolor: "rgba(11,13,18,0.72)",
          borderRight: `1px solid rgba(45,51,59,0.5)`,
          boxShadow: "4px 0 24px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          contain: "layout style",
        }}
      >
        {/* overlay header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            minHeight: 64,
            borderBottom: `1px solid rgba(45,51,59,0.45)`,
            flexShrink: 0,
            background: `linear-gradient(180deg, rgba(220,38,38,0.07) 0%, transparent 100%)`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: "9px",
                background: `linear-gradient(135deg, ${C.red} 0%, ${C.redDk} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 14px rgba(220,38,38,0.55)`,
                flexShrink: 0,
                fontSize: "1.1rem",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              ⚡
            </Box>
            <Box>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: "0.88rem",
                  color: C.text100,
                  letterSpacing: "2.5px",
                  fontFamily: '"Orbitron", sans-serif',
                  lineHeight: 1.1,
                }}
              >
                APEX
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.52rem",
                  color: C.text500,
                  letterSpacing: "0.15em",
                  fontFamily: '"Space Grotesk", sans-serif',
                  textTransform: "uppercase",
                }}
              >
                Auth Platform
              </Typography>
            </Box>
          </Box>

          {/* close chevron — zero focus ring */}
          <IconButton
            onClick={toggleSidebar}
            size="small"
            disableRipple
            disableTouchRipple
            sx={{
              color: C.text500,
              width: 28,
              height: 28,
              borderRadius: "7px",
              transition: "color 0.1s, background-color 0.1s",
              "&:hover": { bgcolor: C.redGlow, color: C.redLt },
              ...noFocusSx,
            }}
          >
            <ChevronLeftIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* clock */}
        <ClockStrip />

        {/* nav list */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            py: 0.75,
            "&::-webkit-scrollbar": { width: 3 },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: C.char400,
              borderRadius: 99,
            },
          }}
        >
          <SectionLabel label="Main" />
          <List sx={{ px: 0, py: 0 }}>
            {mainItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <NavItem
                  item={item}
                  isOn={active(item.path)}
                  mobile={false}
                  toggleSidebar={toggleSidebar}
                  anomalyCount={anomalyCount}
                />
              </ListItem>
            ))}
          </List>

          <SectionLabel label="Security" />
          <List sx={{ px: 0, py: 0 }}>
            {securityItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <NavItem
                  item={item}
                  isOn={active(item.path)}
                  mobile={false}
                  toggleSidebar={toggleSidebar}
                  anomalyCount={anomalyCount}
                />
              </ListItem>
            ))}
          </List>

          <SectionLabel label="System" />
          <List sx={{ px: 0, py: 0 }}>
            {configItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <NavItem
                  item={item}
                  isOn={active(item.path)}
                  mobile={false}
                  toggleSidebar={toggleSidebar}
                  anomalyCount={anomalyCount}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* help */}
        <Box sx={{ px: 1.5, pb: 0.5 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              borderRadius: "10px",
              px: 1.5,
              py: 0.85,
              cursor: "pointer",
              transition: "background-color 0.1s",
              "&:hover": { bgcolor: C.redGlow },
            }}
          >
            <HelpOutlineIcon sx={{ fontSize: 15, color: C.text500 }} />
            <Typography
              sx={{
                color: C.text500,
                fontSize: "0.78rem",
                fontWeight: 500,
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              Help &amp; Docs
            </Typography>
          </Box>
        </Box>

        {/* footer */}
        <Box
          sx={{
            p: "10px 14px",
            borderTop: `1px solid rgba(45,51,59,0.45)`,
            background: `linear-gradient(0deg, rgba(220,38,38,0.05) 0%, transparent 100%)`,
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                width: 24,
                height: 24,
                borderRadius: "7px",
                background: `linear-gradient(135deg, ${C.red} 0%, ${C.redDk} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 2px 8px rgba(220,38,38,0.35)`,
                flexShrink: 0,
                fontSize: "0.8rem",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              ⚡
            </Box>
            <Box>
              <Typography
                sx={{
                  color: C.text100,
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  fontFamily: '"Orbitron", sans-serif',
                  letterSpacing: "1px",
                }}
              >
                APEX
              </Typography>
              <Typography
                sx={{
                  color: C.text500,
                  fontSize: "0.58rem",
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                Admin v2.0
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── dim backdrop — always mounted, opacity toggle (no DOM churn) ── */}
      <Box
        onClick={isOpen ? toggleSidebar : undefined}
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: "rgba(0,0,0,0.18)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.12s",
          cursor: "pointer",
        }}
      />
    </>
  );
};

export default Sidebar;
