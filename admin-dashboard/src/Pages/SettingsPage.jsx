import { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  Switch,
  Divider,
  Tooltip,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import SecurityIcon from "@mui/icons-material/Security";
import PersonIcon from "@mui/icons-material/Person";
import ShieldIcon from "@mui/icons-material/Shield";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StorageIcon from "@mui/icons-material/Storage";
import BoltIcon from "@mui/icons-material/Bolt";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockIcon from "@mui/icons-material/Lock";
import KeyIcon from "@mui/icons-material/Key";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DnsIcon from "@mui/icons-material/Dns";
import MemoryIcon from "@mui/icons-material/Memory";

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
  rose: "#F43F5E",
  cyan: "#22D3EE",
  violet: "#A855F7",
};

/* ── reusable panel ── */
const Panel = ({ title, sub, icon: Icon, color = C.red, children }) => (
  <Box
    sx={{
      bgcolor: C.char600,
      border: `1px solid ${C.char400}`,
      borderRadius: "14px",
      p: "20px 22px",
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: `linear-gradient(90deg, ${color} 0%, transparent 70%)`,
      },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2 }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "9px",
          bgcolor: `${color}14`,
          border: `1px solid ${color}28`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {Icon && <Icon sx={{ fontSize: 17, color }} />}
      </Box>
      <Box>
        <Typography
          sx={{
            color: C.text100,
            fontWeight: 700,
            fontSize: "0.9rem",
            fontFamily: '"Space Grotesk", sans-serif',
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        {sub && (
          <Typography
            sx={{
              color: C.text500,
              fontSize: "0.68rem",
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            {sub}
          </Typography>
        )}
      </Box>
    </Box>
    {children}
  </Box>
);

/* ── info row ── */
const InfoRow = ({ label, value, color = C.text100, mono = false, badge }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      py: 0.85,
      borderBottom: `1px solid ${C.char500}`,
      "&:last-of-type": { borderBottom: "none" },
      gap: 1,
    }}
  >
    <Typography
      sx={{
        color: C.text500,
        fontSize: "0.78rem",
        fontFamily: '"Space Grotesk", sans-serif',
        flexShrink: 0,
      }}
    >
      {label}
    </Typography>
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
      {badge && (
        <Box
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            bgcolor: badge,
            flexShrink: 0,
          }}
        />
      )}
      <Typography
        sx={{
          color,
          fontSize: "0.8rem",
          fontWeight: mono ? 500 : 600,
          fontFamily: mono
            ? '"Space Grotesk", monospace'
            : '"Space Grotesk", sans-serif',
          textAlign: "right",
          letterSpacing: mono ? "0.04em" : "normal",
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

/* ── toggle row ── */
const ToggleRow = ({
  label,
  sub,
  checked,
  onChange,
  color = C.red,
  disabled = false,
}) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      py: 1,
      borderBottom: `1px solid ${C.char500}`,
      "&:last-of-type": { borderBottom: "none" },
      gap: 2,
    }}
  >
    <Box>
      <Typography
        sx={{
          color: disabled ? C.text500 : C.text100,
          fontSize: "0.82rem",
          fontWeight: 600,
          fontFamily: '"Space Grotesk", sans-serif',
        }}
      >
        {label}
      </Typography>
      {sub && (
        <Typography
          sx={{
            color: C.text500,
            fontSize: "0.68rem",
            fontFamily: '"Space Grotesk", sans-serif',
            mt: 0.1,
          }}
        >
          {sub}
        </Typography>
      )}
    </Box>
    <Switch
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      size="small"
      sx={{
        flexShrink: 0,
        "& .MuiSwitch-switchBase.Mui-checked": { color },
        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
          bgcolor: `${color}70`,
        },
        "& .MuiSwitch-track": { bgcolor: C.char400 },
      }}
    />
  </Box>
);

/* ── main ── */
const SettingsPage = ({ users = [], jwtSessions = [] }) => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    anomalyAlerts: true,
    concurrentLoginBlock: false,
    autoRevokeSessions: false,
    sessionHealthMonitor: true,
    showAdminBadge: true,
    compactMode: false,
    notificationsSound: false,
  });

  const toggle = (key) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const now = new Date();
  const uptime = "Active"; // placeholder — real uptime would come from backend
  const totalUsers = users.length;
  const activeSessions = jwtSessions.filter((s) => s.is_active).length;
  const totalSessions = jwtSessions.length;
  const healthPct = totalSessions
    ? Math.round((activeSessions / totalSessions) * 100)
    : 0;

  const adminUser = users.find((u) => u.is_admin);

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2.5, md: 3 }, pb: 5 }}>
      {/* ── PAGE HEADER ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 0.5 }}
          >
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "8px",
                background: `linear-gradient(135deg, ${C.violet} 0%, #7C3AED 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px rgba(168,85,247,0.4)`,
              }}
            >
              <SettingsIcon sx={{ fontSize: 16, color: "#fff" }} />
            </Box>
            <Typography
              sx={{
                fontFamily: '"Orbitron", sans-serif',
                fontWeight: 800,
                fontSize: { xs: "1.1rem", sm: "1.4rem" },
                color: C.text100,
                letterSpacing: "0.5px",
              }}
            >
              Settings
            </Typography>
            <Chip
              label="v2.0"
              size="small"
              sx={{
                bgcolor: `${C.violet}15`,
                color: C.violet,
                border: `1px solid ${C.violet}30`,
                fontSize: "0.65rem",
                fontWeight: 700,
                height: 20,
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            />
          </Box>
          <Typography
            sx={{
              color: C.text500,
              fontSize: "0.78rem",
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            System configuration &amp; platform preferences
          </Typography>
        </Box>

        <Box
          onClick={() => navigate("/")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            bgcolor: C.char600,
            border: `1px solid ${C.char400}`,
            borderRadius: "10px",
            px: 1.5,
            py: 0.75,
            cursor: "pointer",
            color: C.text300,
            fontSize: "0.75rem",
            fontFamily: '"Space Grotesk", sans-serif',
            transition: "all 0.15s",
            "&:hover": { borderColor: C.red, color: C.redLt },
          }}
        >
          ← Dashboard
        </Box>
      </Box>

      {/* ══ ROW 1 — SYSTEM STATUS CARDS ══ */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "repeat(2,1fr)", sm: "repeat(4,1fr)" }}
        gap={2}
        mb={3}
      >
        {[
          {
            icon: CheckCircleOutlineIcon,
            label: "System Status",
            value: "Operational",
            color: C.emerald,
            badge: C.emerald,
          },
          {
            icon: PersonIcon,
            label: "Total Users",
            value: totalUsers,
            color: C.cyan,
            badge: null,
          },
          {
            icon: SecurityIcon,
            label: "Active Sessions",
            value: activeSessions,
            color: C.red,
            badge: activeSessions > 0 ? C.red : null,
          },
          {
            icon: BoltIcon,
            label: "Health Score",
            value: `${healthPct}%`,
            color: healthPct > 60 ? C.emerald : C.amber,
            badge: null,
          },
        ].map(({ icon: Icon, label, value, color, badge }) => (
          <Box
            key={label}
            sx={{
              bgcolor: C.char600,
              border: `1px solid ${C.char400}`,
              borderRadius: "12px",
              p: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "2px",
                background: `linear-gradient(90deg, ${color} 0%, transparent 80%)`,
              },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: "9px",
                bgcolor: `${color}12`,
                border: `1px solid ${color}25`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <Icon sx={{ fontSize: 18, color }} />
              {badge && (
                <Box
                  sx={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: badge,
                    border: `1.5px solid ${C.char600}`,
                    animation: "livePulse 2s infinite",
                    "@keyframes livePulse": {
                      "0%": { opacity: 1 },
                      "50%": { opacity: 0.5 },
                      "100%": { opacity: 1 },
                    },
                  }}
                />
              )}
            </Box>
            <Box>
              <Typography
                sx={{
                  color,
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  lineHeight: 1,
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                {value}
              </Typography>
              <Typography
                sx={{
                  color: C.text500,
                  fontSize: "0.63rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                {label}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ══ ROW 2 — SYSTEM INFO + JWT CONFIG ══ */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap={2.5}
        mb={2.5}
      >
        {/* System Info */}
        <Panel
          title="System Information"
          sub="Backend & runtime details"
          icon={DnsIcon}
          color={C.cyan}
        >
          <InfoRow
            label="Platform"
            value="APEX Auth Server"
            color={C.text100}
          />
          <InfoRow label="Version" value="v2.0.0" color={C.cyan} mono />
          <InfoRow
            label="Framework"
            value="FastAPI + SQLAlchemy"
            color={C.text300}
          />
          <InfoRow
            label="Database"
            value="PostgreSQL (async)"
            color={C.violet}
          />
          <InfoRow
            label="Auth Method"
            value="JWT (HS256)"
            color={C.amber}
            mono
          />
          <InfoRow
            label="Status"
            value={uptime}
            color={C.emerald}
            badge={C.emerald}
          />
          <InfoRow
            label="Server Time"
            value={now.toLocaleTimeString()}
            color={C.text300}
            mono
          />
          <InfoRow
            label="Date"
            value={now.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
            color={C.text300}
          />
        </Panel>

        {/* JWT Configuration */}
        <Panel
          title="JWT Configuration"
          sub="Token lifecycle settings"
          icon={KeyIcon}
          color={C.amber}
        >
          <InfoRow label="Algorithm" value="HS256" color={C.amber} mono />
          <InfoRow label="Token Expiry" value="15 minutes" color={C.redLt} />
          <InfoRow label="Token Type" value="Bearer" color={C.text300} mono />
          <InfoRow
            label="Session Tracking"
            value="Enabled"
            color={C.emerald}
            badge={C.emerald}
          />
          <InfoRow
            label="Concurrent Detection"
            value="Active"
            color={C.emerald}
            badge={C.emerald}
          />
          <InfoRow
            label="Revocation Support"
            value="Yes (JTI blacklist)"
            color={C.cyan}
          />
          <InfoRow
            label="Total JWTs Issued"
            value={totalSessions}
            color={C.text100}
          />
          <InfoRow
            label="Currently Active"
            value={activeSessions}
            color={activeSessions > 0 ? C.red : C.emerald}
          />
        </Panel>
      </Box>

      {/* ══ ROW 3 — SECURITY SETTINGS + DISPLAY SETTINGS ══ */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap={2.5}
        mb={2.5}
      >
        {/* Security toggles */}
        <Panel
          title="Security Controls"
          sub="Runtime security behavior"
          icon={ShieldIcon}
          color={C.red}
        >
          <Box
            sx={{
              bgcolor: `${C.amber}0A`,
              border: `1px solid ${C.amber}20`,
              borderRadius: "9px",
              px: 1.5,
              py: 1,
              mb: 1.75,
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            <InfoOutlinedIcon
              sx={{ fontSize: 14, color: C.amber, mt: "1px", flexShrink: 0 }}
            />
            <Typography
              sx={{
                color: C.amber,
                fontSize: "0.7rem",
                fontFamily: '"Space Grotesk", sans-serif',
                lineHeight: 1.5,
              }}
            >
              These toggles are display-only in this build. Enable backend
              enforcement in{" "}
              <code style={{ fontFamily: "monospace" }}>main.py</code>.
            </Typography>
          </Box>

          <ToggleRow
            label="Anomaly Alerts"
            sub="Notify on concurrent logins"
            checked={settings.anomalyAlerts}
            onChange={() => toggle("anomalyAlerts")}
            color={C.red}
          />
          <ToggleRow
            label="Block Concurrent Logins"
            sub="Prevent simultaneous sessions"
            checked={settings.concurrentLoginBlock}
            onChange={() => toggle("concurrentLoginBlock")}
            color={C.red}
          />
          <ToggleRow
            label="Auto-Revoke Expired Sessions"
            sub="Clean up inactive JWTs automatically"
            checked={settings.autoRevokeSessions}
            onChange={() => toggle("autoRevokeSessions")}
            color={C.amber}
          />
          <ToggleRow
            label="Session Health Monitor"
            sub="Track active session percentage"
            checked={settings.sessionHealthMonitor}
            onChange={() => toggle("sessionHealthMonitor")}
            color={C.emerald}
          />
        </Panel>

        {/* Display/UI preferences */}
        <Panel
          title="Interface Preferences"
          sub="Dashboard display options"
          icon={SettingsIcon}
          color={C.violet}
        >
          <ToggleRow
            label="Show Admin Badge"
            sub="Display admin indicator on user profiles"
            checked={settings.showAdminBadge}
            onChange={() => toggle("showAdminBadge")}
            color={C.violet}
          />
          <ToggleRow
            label="Compact Mode"
            sub="Reduce padding and spacing"
            checked={settings.compactMode}
            onChange={() => toggle("compactMode")}
            color={C.cyan}
            disabled
          />
          <ToggleRow
            label="Notification Sounds"
            sub="Audio alert on anomaly detection"
            checked={settings.notificationsSound}
            onChange={() => toggle("notificationsSound")}
            color={C.amber}
            disabled
          />

          <Box
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: `1px solid ${C.char500}`,
            }}
          >
            <Typography
              sx={{
                color: C.text500,
                fontSize: "0.65rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontFamily: '"Space Grotesk", sans-serif',
                mb: 1,
              }}
            >
              Color Theme
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {[
                { label: "Crimson", color: C.red, active: true },
                { label: "Cyber Blue", color: C.cyan, active: false },
                { label: "Violet", color: C.violet, active: false },
                { label: "Emerald", color: C.emerald, active: false },
              ].map(({ label, color, active }) => (
                <Tooltip key={label} title={active ? "Active" : "Coming soon"}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.6,
                      bgcolor: active ? `${color}18` : C.char500,
                      border: `1px solid ${active ? color : C.char400}`,
                      borderRadius: "8px",
                      px: 1,
                      py: 0.5,
                      cursor: active ? "default" : "not-allowed",
                      opacity: active ? 1 : 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: color,
                      }}
                    />
                    <Typography
                      sx={{
                        color: active ? color : C.text500,
                        fontSize: "0.68rem",
                        fontWeight: 600,
                        fontFamily: '"Space Grotesk", sans-serif',
                      }}
                    >
                      {label}
                    </Typography>
                    {active && (
                      <CheckCircleOutlineIcon sx={{ fontSize: 10, color }} />
                    )}
                  </Box>
                </Tooltip>
              ))}
            </Box>
          </Box>
        </Panel>
      </Box>

      {/* ══ ROW 4 — ADMIN PROFILE + QUICK ACTIONS ══ */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap={2.5}
        mb={2.5}
      >
        {/* Admin profile */}
        <Panel
          title="Admin Profile"
          sub="Logged-in administrator details"
          icon={PersonIcon}
          color={C.violet}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              p: "14px 16px",
              bgcolor: C.char700,
              borderRadius: "10px",
              border: `1px solid ${C.char400}`,
            }}
          >
            <Avatar
              sx={{
                width: 46,
                height: 46,
                bgcolor: `${C.violet}20`,
                border: `2px solid ${C.violet}45`,
                color: C.violet,
                fontSize: "1rem",
                fontWeight: 800,
                fontFamily: '"Space Grotesk", sans-serif',
                flexShrink: 0,
              }}
            >
              {adminUser ? adminUser.username.slice(0, 2).toUpperCase() : "AD"}
            </Avatar>
            <Box>
              <Typography
                sx={{
                  color: C.text100,
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                {adminUser?.username || "Administrator"}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  mt: 0.3,
                }}
              >
                <Chip
                  label="Admin"
                  size="small"
                  sx={{
                    bgcolor: `${C.violet}15`,
                    color: C.violet,
                    border: `1px solid ${C.violet}30`,
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    height: 18,
                    fontFamily: '"Space Grotesk", sans-serif',
                  }}
                />
                <Chip
                  label="Active"
                  size="small"
                  sx={{
                    bgcolor: `${C.emerald}12`,
                    color: C.emerald,
                    border: `1px solid ${C.emerald}28`,
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    height: 18,
                    fontFamily: '"Space Grotesk", sans-serif',
                  }}
                />
              </Box>
            </Box>
          </Box>

          <InfoRow label="Role" value="System Administrator" color={C.violet} />
          <InfoRow label="Access Level" value="Full Access" color={C.red} />
          <InfoRow
            label="Session Type"
            value="JWT Bearer"
            color={C.text300}
            mono
          />
          <InfoRow
            label="Session Expiry"
            value="15 min rolling"
            color={C.amber}
          />
          <InfoRow
            label="Department"
            value={adminUser?.department || "System"}
            color={C.text300}
          />
          <InfoRow
            label="Rank"
            value={adminUser?.rank || "Super Admin"}
            color={C.text300}
          />
        </Panel>

        {/* Quick actions */}
        <Panel
          title="Quick Actions"
          sub="Platform management shortcuts"
          icon={BoltIcon}
          color={C.red}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {[
              {
                label: "View All Users",
                sub: "Manage user accounts",
                path: "/users",
                color: C.violet,
                icon: PersonIcon,
              },
              {
                label: "JWT Sessions",
                sub: "Monitor active tokens",
                path: "/jwt-sessions",
                color: C.cyan,
                icon: SecurityIcon,
              },
              {
                label: "Anomaly Logs",
                sub: "Review security alerts",
                path: "/anomalies",
                color: C.amber,
                icon: WarningAmberIcon,
              },
              {
                label: "Analytics",
                sub: "View platform metrics",
                path: "/analytics",
                color: C.emerald,
                icon: MemoryIcon,
              },
              {
                label: "Reports & Export",
                sub: "Download data exports",
                path: "/reports",
                color: C.red,
                icon: StorageIcon,
              },
            ].map(({ label, sub, path, color, icon: Icon }) => (
              <Box
                key={label}
                onClick={() => navigate(path)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  bgcolor: C.char700,
                  border: `1px solid ${C.char400}`,
                  borderRadius: "10px",
                  px: 1.5,
                  py: 1,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  "&:hover": {
                    borderColor: `${color}50`,
                    bgcolor: `${color}08`,
                    transform: "translateX(3px)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: "8px",
                    bgcolor: `${color}12`,
                    border: `1px solid ${color}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ fontSize: 15, color }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      color: C.text100,
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      fontFamily: '"Space Grotesk", sans-serif',
                    }}
                  >
                    {label}
                  </Typography>
                  <Typography
                    sx={{
                      color: C.text500,
                      fontSize: "0.67rem",
                      fontFamily: '"Space Grotesk", sans-serif',
                    }}
                  >
                    {sub}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: C.text500,
                    fontSize: "0.72rem",
                    fontFamily: '"Space Grotesk", sans-serif',
                  }}
                >
                  →
                </Typography>
              </Box>
            ))}
          </Box>
        </Panel>
      </Box>

      {/* ══ ROW 5 — SECURITY AUDIT TRAIL ══ */}
      <Panel
        title="Security Posture"
        sub="Current platform security assessment"
        icon={LockIcon}
        color={C.emerald}
      >
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: "1fr",
            sm: "1fr 1fr",
            md: "repeat(3,1fr)",
          }}
          gap={1.5}
        >
          {[
            {
              check: "JWT Authentication",
              status: "Enabled",
              ok: true,
            },
            {
              check: "Password Hashing",
              status: "bcrypt",
              ok: true,
            },
            {
              check: "Session Revocation",
              status: "Supported",
              ok: true,
            },
            {
              check: "Anomaly Detection",
              status: "Active",
              ok: true,
            },
            {
              check: "Admin Role Guard",
              status: "Enforced",
              ok: true,
            },
            {
              check: "CORS Policy",
              status: "Configured",
              ok: true,
            },
            {
              check: "Rate Limiting",
              status: "Not configured",
              ok: false,
            },
            {
              check: "HTTPS / TLS",
              status: "Depends on host",
              ok: null,
            },
            {
              check: "Audit Logging",
              status: "Partial (anomalies)",
              ok: null,
            },
          ].map(({ check, status, ok }) => (
            <Box
              key={check}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: C.char700,
                border: `1px solid ${ok === true ? `${C.emerald}25` : ok === false ? `${C.rose}25` : C.char400}`,
                borderRadius: "10px",
                px: 1.5,
                py: 1,
                gap: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    bgcolor:
                      ok === true ? C.emerald : ok === false ? C.rose : C.amber,
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    color: C.text300,
                    fontSize: "0.76rem",
                    fontFamily: '"Space Grotesk", sans-serif',
                  }}
                >
                  {check}
                </Typography>
              </Box>
              <Chip
                label={status}
                size="small"
                sx={{
                  bgcolor:
                    ok === true
                      ? `${C.emerald}12`
                      : ok === false
                        ? `${C.rose}12`
                        : `${C.amber}12`,
                  color:
                    ok === true ? C.emerald : ok === false ? C.rose : C.amber,
                  border: `1px solid ${ok === true ? `${C.emerald}30` : ok === false ? `${C.rose}30` : `${C.amber}30`}`,
                  fontSize: "0.63rem",
                  fontWeight: 700,
                  height: 19,
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              />
            </Box>
          ))}
        </Box>
      </Panel>
    </Box>
  );
};

export default SettingsPage;
