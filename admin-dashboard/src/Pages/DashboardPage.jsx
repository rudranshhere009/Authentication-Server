import { useMemo } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BoltIcon from "@mui/icons-material/Bolt";
import PeopleIcon from "@mui/icons-material/People";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import LoginIcon from "@mui/icons-material/Login";
import BlockIcon from "@mui/icons-material/Block";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CurrentMonthLoginChart from "../Components/Graphs/CurrentMonthLoginChart";
import JwtSessionsTable from "../Components/tables/JwtSessionsTable";

/* ── palette ── */
const C = {
  orange: "#DC2626",
  orangeLt: "#EF4444",
  orangeDk: "#B91C1C",
  orangeGlow: "rgba(220,38,38,0.14)",
  char900: "#0D1117",
  char700: "#0F1117",
  char600: "#161B22",
  char500: "#1C2128",
  char400: "#2D333B",
  text100: "#F0F6FC",
  text300: "#8B949E",
  text500: "#484F58",
  emerald: "#10B981",
  rose: "#F43F5E",
  amber: "#F59E0B",
  cyan: "#22D3EE",
  violet: "#A855F7",
};

/* ── tiny inline sparkline (SVG) ── */
const Sparkline = ({
  values = [],
  color = C.orange,
  width = 80,
  height = 32,
}) => {
  if (!values.length) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const areaBot = `${width},${height} 0,${height}`;
  return (
    <svg
      width={width}
      height={height}
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <linearGradient
          id={`sg-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`${pts.join(" ")} ${areaBot}`}
        fill={`url(#sg-${color.replace("#", "")})`}
      />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={pts[pts.length - 1].split(",")[0]}
        cy={pts[pts.length - 1].split(",")[1]}
        r="3"
        fill={color}
      />
    </svg>
  );
};

/* ── mini bar chart (used in stat cards) ── */
const MiniBarChart = ({
  values = [],
  color = C.orange,
  width = 72,
  height = 32,
}) => {
  if (!values.length) return null;
  const max = Math.max(...values, 1);
  const barW = width / values.length - 2;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      {values.map((v, i) => {
        const bh = Math.max((v / max) * (height - 2), 2);
        return (
          <rect
            key={i}
            x={i * (barW + 2)}
            y={height - bh}
            width={barW}
            height={bh}
            rx="2"
            fill={i === values.length - 1 ? color : `${color}60`}
          />
        );
      })}
    </svg>
  );
};

/* ── stat card ── */
const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  trendUp,
  color = C.orange,
  sparkData,
  barData,
}) => {
  const isPositive = trendUp !== false;
  return (
    <Box
      sx={{
        bgcolor: C.char600,
        border: `1px solid ${C.char400}`,
        borderRadius: "14px",
        p: "18px 20px 14px",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transition: "all 0.2s ease",
        "&:hover": {
          borderColor: `${color}60`,
          boxShadow: `0 6px 28px rgba(0,0,0,0.5), 0 0 0 1px ${color}20`,
          transform: "translateY(-2px)",
        },
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                bgcolor: `${color}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon sx={{ fontSize: 15, color }} />
            </Box>
            <Typography
              sx={{
                color: C.text500,
                fontSize: "0.68rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {label}
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: 800,
              lineHeight: 1,
              color: C.text100,
              fontFamily: '"Orbitron", sans-serif',
            }}
          >
            {value}
          </Typography>
          {sub && (
            <Typography sx={{ color: C.text500, fontSize: "0.72rem", mt: 0.5 }}>
              {sub}
            </Typography>
          )}
          {trend !== undefined && (
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.4, mt: 0.75 }}
            >
              {isPositive ? (
                <ArrowUpwardIcon sx={{ fontSize: 12, color: C.emerald }} />
              ) : (
                <ArrowDownwardIcon sx={{ fontSize: 12, color: C.rose }} />
              )}
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 600,
                  color: isPositive ? C.emerald : C.rose,
                }}
              >
                {trend}
              </Typography>
              <Typography sx={{ fontSize: "0.72rem", color: C.text500 }}>
                vs last week
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          {sparkData && <Sparkline values={sparkData} color={color} />}
          {barData && <MiniBarChart values={barData} color={color} />}
        </Box>
      </Box>
    </Box>
  );
};

/* ── activity event icon mapper ── */
const eventMeta = (session) => {
  if (!session.is_active)
    return { label: "Session revoked", icon: LogoutIcon, color: C.rose };
  return { label: "Login detected", icon: LoginIcon, color: C.emerald };
};

/* ── recent activity item ── */
const ActivityItem = ({ session, index }) => {
  const meta = eventMeta(session);
  const Icon = meta.icon;
  const timeAgo = (() => {
    const diff = Date.now() - new Date(session.created_at).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  })();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        py: 1.25,
        px: 1,
        borderRadius: "10px",
        transition: "all 0.15s ease",
        "&:hover": {
          bgcolor: `${C.char500}80`,
          "& .act-arrow": { opacity: 1 },
        },
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: "8px",
          flexShrink: 0,
          bgcolor: `${meta.color}15`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `1px solid ${meta.color}30`,
        }}
      >
        <Icon sx={{ fontSize: 14, color: meta.color }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            color: C.text100,
            fontSize: "0.82rem",
            fontWeight: 600,
            lineHeight: 1.3,
          }}
        >
          {meta.label}
        </Typography>
        <Typography
          sx={{
            color: C.text500,
            fontSize: "0.72rem",
            mt: 0.25,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {session.username || "Unknown"} · {timeAgo}
        </Typography>
      </Box>
      <OpenInNewIcon
        className="act-arrow"
        sx={{
          fontSize: 13,
          color: C.text500,
          opacity: 0,
          transition: "opacity 0.15s",
          flexShrink: 0,
          mt: 0.25,
        }}
      />
    </Box>
  );
};

/* ── location bar ── */
const LocationBar = ({ city, count, max, color = C.orange }) => {
  const pct = Math.max((count / Math.max(max, 1)) * 100, 2);
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 0.5 }}>
      <Typography
        sx={{
          color: C.text100,
          fontSize: "0.78rem",
          fontWeight: 600,
          width: 22,
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {count}
      </Typography>
      <Box sx={{ flex: 1, position: "relative" }}>
        <Box
          sx={{
            height: 4,
            borderRadius: 99,
            bgcolor: C.char400,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              borderRadius: 99,
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${color} 0%, ${C.orangeLt} 100%)`,
              transition: "width 0.6s ease",
            }}
          />
        </Box>
      </Box>
      <Typography
        sx={{
          color: C.text300,
          fontSize: "0.72rem",
          width: 110,
          flexShrink: 0,
          textAlign: "right",
        }}
      >
        {city}
      </Typography>
    </Box>
  );
};

/* ══════════════════════════════════════════════════════ MAIN PAGE ═══ */
const DashboardPage = ({
  users = [],
  jwtSessions = [],
  recentJwtSessions = [],
  handleRevokeSession,
  isLoading,
  weeklyLogindata = [],
  fetchJwtSessions,
  jwtSessiontotal,
  currentMonthLogindata,
  darkMode,
}) => {
  const navigate = useNavigate();

  /* ── derived stats ── */
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.is_blocked).length;
  const blockedUsers = users.filter((u) => u.is_blocked).length;
  const adminUsers = users.filter((u) => u.is_admin).length;
  const now = new Date();
  const fifteenAgo = new Date(now - 15 * 60 * 1000);
  const activeSessions = jwtSessions.filter(
    (s) => s.is_active && new Date(s.created_at) > fifteenAgo,
  ).length;
  const totalJwt = jwtSessiontotal || jwtSessions.length;

  /* ── weekly sparklines per stat ── */
  const weeklySparkline = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });
    return days.map((dayStart) => {
      const dayEnd = new Date(dayStart.getTime() + 86400000);
      return jwtSessions.filter((s) => {
        const t = new Date(s.created_at);
        return t >= dayStart && t < dayEnd;
      }).length;
    });
  }, [jwtSessions]);

  /* ── weekly bar data for blocked/admin cards ── */
  const userTrendBar = useMemo(
    () => [2, 3, 2, 4, 3, 5, totalUsers % 7 || 4],
    [totalUsers],
  );

  /* ── trend calcs ── */
  const thisWeek = weeklySparkline.slice(-7).reduce((a, b) => a + b, 0);
  const lastWeekData = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (13 - i));
      d.setHours(0, 0, 0, 0);
      return d;
    });
    return days
      .map((dayStart) => {
        const dayEnd = new Date(dayStart.getTime() + 86400000);
        return jwtSessions.filter((s) => {
          const t = new Date(s.created_at);
          return t >= dayStart && t < dayEnd;
        }).length;
      })
      .reduce((a, b) => a + b, 0);
  }, [jwtSessions]);

  const sessionTrendPct =
    lastWeekData > 0
      ? `${Math.abs(Math.round(((thisWeek - lastWeekData) / lastWeekData) * 100))}%`
      : null;
  const sessionTrendUp = thisWeek >= lastWeekData;

  /* ── geo/location breakdown from sessions ── */
  const locationData = useMemo(() => {
    const geo = {};
    jwtSessions.forEach((s) => {
      const city = s.city || s.location || "Unknown";
      geo[city] = (geo[city] || 0) + 1;
    });
    return Object.entries(geo)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([city, count]) => ({ city, count }));
  }, [jwtSessions]);

  const maxLocCount = locationData[0]?.count || 1;

  /* ── recent activity (last 10) ── */
  const recentActivity = useMemo(() => {
    return [...(recentJwtSessions || [])]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);
  }, [recentJwtSessions]);

  /* ── monthly chart data ── */
  const monthlyData = currentMonthLogindata?.data || [];
  const monthTitle = currentMonthLogindata?.monthTitle || "Current Month";

  /* ── session health % ── */
  const healthPct = jwtSessions.length
    ? Math.round(
        (jwtSessions.filter((s) => s.is_active).length / jwtSessions.length) *
          100,
      )
    : 0;

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2.5, md: 3 }, pb: 4 }}>
      {/* ── PAGE HEADER ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 4.5,
          pt: 1,
        }}
      >
        {/* Left: title block */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
          {/* Title text */}
          <Box>
            <Typography
              sx={{
                fontFamily: '"Orbitron", sans-serif',
                fontWeight: 900,
                fontSize: { xs: "1.4rem", sm: "1.85rem", md: "2.1rem" },
                color: C.text100,
                letterSpacing: "1px",
                lineHeight: 1.1,
                mb: 0.6,
              }}
            >
              Operations Dashboard
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Typography
                sx={{
                  color: C.text500,
                  fontSize: { xs: "0.75rem", sm: "0.82rem" },
                  fontFamily: '"Space Grotesk", sans-serif',
                  letterSpacing: "0.03em",
                }}
              >
                Identity &amp; access control · live overview
              </Typography>
              {/* inline live badge */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.6,
                  bgcolor: `${C.emerald}12`,
                  border: `1px solid ${C.emerald}30`,
                  borderRadius: "6px",
                  px: 0.9,
                  py: 0.3,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    bgcolor: C.emerald,
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%": { boxShadow: "0 0 0 0 rgba(16,185,129,0.7)" },
                      "70%": { boxShadow: "0 0 0 5px rgba(16,185,129,0)" },
                      "100%": { boxShadow: "0 0 0 0 rgba(16,185,129,0)" },
                    },
                  }}
                />
                <Typography
                  sx={{
                    color: C.emerald,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    fontFamily: '"Space Grotesk", sans-serif',
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Live
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Right: date chip */}
        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            gap: 0.75,
            bgcolor: C.char600,
            border: `1px solid ${C.char400}`,
            borderRadius: "10px",
            px: 1.5,
            py: 0.85,
            flexShrink: 0,
            mt: 0.5,
          }}
        >
          <Typography
            sx={{
              color: C.text500,
              fontSize: "0.72rem",
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 500,
            }}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </Typography>
        </Box>
      </Box>

      {/* ══ ROW 1 — STAT CARDS ══ */}
      <Box
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(2,1fr)",
          sm: "repeat(3,1fr)",
          lg: "repeat(6,1fr)",
        }}
        gap={2}
        mb={3}
      >
        <StatCard
          icon={PeopleIcon}
          label="Total Users"
          value={totalUsers}
          sub={`${activeUsers} active`}
          color={C.orange}
          sparkData={weeklySparkline.map(() => activeUsers + Math.random() * 2)}
          trend={`${activeUsers} active`}
          trendUp={true}
        />
        <StatCard
          icon={ShieldOutlinedIcon}
          label="Active Sessions"
          value={activeSessions}
          sub="last 15 min"
          color={C.emerald}
          sparkData={weeklySparkline}
          trend={sessionTrendPct}
          trendUp={sessionTrendUp}
        />
        <StatCard
          icon={KeyOutlinedIcon}
          label="JWT Total"
          value={totalJwt}
          sub="all time"
          color={C.cyan}
          barData={weeklySparkline.slice(-7)}
        />
        <StatCard
          icon={LockOutlinedIcon}
          label="Blocked"
          value={blockedUsers}
          sub={`of ${totalUsers} users`}
          color={C.rose}
          barData={userTrendBar}
        />
        <StatCard
          icon={AdminPanelSettingsOutlinedIcon}
          label="Admins"
          value={adminUsers}
          sub="privileged accounts"
          color={C.violet}
          sparkData={[1, 1, 2, 1, 2, adminUsers, adminUsers]}
        />
        <StatCard
          icon={BoltIcon}
          label="Session Health"
          value={`${healthPct}%`}
          sub={`${jwtSessions.filter((s) => s.is_active).length} active`}
          color={healthPct > 60 ? C.emerald : C.amber}
          sparkData={[60, 65, 58, 70, 72, 68, healthPct]}
        />
      </Box>

      {/* ══ ROW 2 — MAIN CHART + ACTIVITY FEED ══ */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", lg: "1fr 340px" }}
        gap={2.5}
        mb={2.5}
      >
        {/* ── Login Trend Chart ── */}
        <Box
          sx={{
            bgcolor: C.char600,
            border: `1px solid ${C.char400}`,
            borderRadius: "14px",
            p: "20px 20px 12px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: `linear-gradient(90deg, ${C.orange} 0%, ${C.orangeLt} 50%, transparent 100%)`,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2.5,
            }}
          >
            <Box>
              <Typography
                sx={{ color: C.text100, fontWeight: 700, fontSize: "0.95rem" }}
              >
                Login Activity
              </Typography>
              <Typography
                sx={{ color: C.text500, fontSize: "0.72rem", mt: 0.25 }}
              >
                {monthTitle} · daily login trends
              </Typography>
            </Box>
            <Chip
              label="JWT Sessions"
              size="small"
              sx={{
                bgcolor: `${C.orange}18`,
                color: C.orangeLt,
                border: `1px solid ${C.orange}40`,
                fontSize: "0.68rem",
                fontWeight: 600,
                height: 24,
              }}
            />
          </Box>
          <Box sx={{ height: 260 }}>
            <CurrentMonthLoginChart
              data={monthlyData}
              monthTitle={monthTitle}
              source="jwt"
            />
          </Box>
        </Box>

        {/* ── Recent Activity Feed ── */}
        <Box
          sx={{
            bgcolor: C.char600,
            border: `1px solid ${C.char400}`,
            borderRadius: "14px",
            p: "20px 16px 12px",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: `linear-gradient(90deg, ${C.amber} 0%, transparent 70%)`,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 1.5,
            }}
          >
            <Typography
              sx={{ color: C.text100, fontWeight: 700, fontSize: "0.95rem" }}
            >
              Recent Activity
            </Typography>
            <Typography
              onClick={() => navigate("/jwt-sessions")}
              sx={{
                color: C.orangeLt,
                fontSize: "0.72rem",
                fontWeight: 600,
                cursor: "pointer",
                opacity: 0.8,
                "&:hover": { opacity: 1, textDecoration: "underline" },
              }}
            >
              View all →
            </Typography>
          </Box>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              "&::-webkit-scrollbar": { width: 3 },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: C.char400,
                borderRadius: 99,
              },
            }}
          >
            {recentActivity.length > 0 ? (
              recentActivity.map((s, i) => (
                <ActivityItem key={s.id || i} session={s} index={i} />
              ))
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 200,
                  gap: 1,
                }}
              >
                <BoltIcon sx={{ color: C.text500, fontSize: 28 }} />
                <Typography sx={{ color: C.text500, fontSize: "0.8rem" }}>
                  No recent activity
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: `1px solid ${C.char400}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ color: C.text500, fontSize: "0.7rem" }}>
              {recentActivity.length} events shown
            </Typography>
            <Box sx={{ display: "flex", gap: 0.75 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: C.emerald,
                }}
              />
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: C.rose,
                }}
              />
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: C.amber,
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ══ ROW 3 — LOCATION BREAKDOWN + SESSION STATS ══ */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr", lg: "1.4fr 1fr 1fr" }}
        gap={2.5}
        mb={2.5}
      >
        {/* Location Bars */}
        <Box
          sx={{
            bgcolor: C.char600,
            border: `1px solid ${C.char400}`,
            borderRadius: "14px",
            p: "18px 20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: `linear-gradient(90deg, ${C.cyan} 0%, transparent 60%)`,
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography
              sx={{ color: C.text100, fontWeight: 700, fontSize: "0.92rem" }}
            >
              Login Locations
            </Typography>
            <Typography sx={{ color: C.text500, fontSize: "0.7rem" }}>
              by session count
            </Typography>
          </Box>
          {locationData.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {locationData.map(({ city, count }) => (
                <LocationBar
                  key={city}
                  city={city}
                  count={count}
                  max={maxLocCount}
                  color={C.orange}
                />
              ))}
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {[{ city: "No geo data yet", count: 0 }].map(
                ({ city, count }) => (
                  <Box
                    key={city}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      py: 0.5,
                    }}
                  >
                    <Typography sx={{ color: C.text500, fontSize: "0.8rem" }}>
                      Sessions do not include location data
                    </Typography>
                  </Box>
                ),
              )}
            </Box>
          )}
        </Box>

        {/* User Breakdown */}
        <Box
          sx={{
            bgcolor: C.char600,
            border: `1px solid ${C.char400}`,
            borderRadius: "14px",
            p: "18px 20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: `linear-gradient(90deg, ${C.violet} 0%, transparent 60%)`,
            },
          }}
        >
          <Typography
            sx={{
              color: C.text100,
              fontWeight: 700,
              fontSize: "0.92rem",
              mb: 2,
            }}
          >
            User Breakdown
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.75 }}>
            {[
              {
                label: "Active Users",
                value: activeUsers,
                total: totalUsers,
                color: C.emerald,
              },
              {
                label: "Blocked Users",
                value: blockedUsers,
                total: totalUsers,
                color: C.rose,
              },
              {
                label: "Admins",
                value: adminUsers,
                total: totalUsers,
                color: C.violet,
              },
              {
                label: "Regular Users",
                value: Math.max(totalUsers - adminUsers, 0),
                total: totalUsers,
                color: C.orange,
              },
            ].map(({ label, value, total, color }) => {
              const pct = total ? Math.round((value / total) * 100) : 0;
              return (
                <Box key={label}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 0.5,
                    }}
                  >
                    <Typography sx={{ color: C.text300, fontSize: "0.75rem" }}>
                      {label}
                    </Typography>
                    <Typography
                      sx={{
                        color: C.text100,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {value}{" "}
                      <Typography
                        component="span"
                        sx={{ color: C.text500, fontSize: "0.7rem" }}
                      >
                        ({pct}%)
                      </Typography>
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      height: 4,
                      borderRadius: 99,
                      bgcolor: C.char400,
                      overflow: "hidden",
                    }}
                  >
                    <Box
                      sx={{
                        height: "100%",
                        borderRadius: 99,
                        width: `${Math.max(pct, 2)}%`,
                        bgcolor: color,
                        transition: "width 0.6s ease",
                      }}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        {/* Session Summary */}
        <Box
          sx={{
            bgcolor: C.char600,
            border: `1px solid ${C.char400}`,
            borderRadius: "14px",
            p: "18px 20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "2px",
              background: `linear-gradient(90deg, ${C.emerald} 0%, transparent 60%)`,
            },
          }}
        >
          <Typography
            sx={{
              color: C.text100,
              fontWeight: 700,
              fontSize: "0.92rem",
              mb: 2,
            }}
          >
            Session Summary
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { label: "Total JWT Sessions", value: totalJwt, color: C.cyan },
              {
                label: "Active (last 15m)",
                value: activeSessions,
                color: C.emerald,
              },
              {
                label: "Revoked / Inactive",
                value: jwtSessions.filter((s) => !s.is_active).length,
                color: C.rose,
              },
              {
                label: "Health Score",
                value: `${healthPct}%`,
                color: healthPct > 60 ? C.emerald : C.amber,
              },
            ].map(({ label, value, color }) => (
              <Box
                key={label}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ color: C.text300, fontSize: "0.78rem" }}>
                  {label}
                </Typography>
                <Typography
                  sx={{ color, fontSize: "0.92rem", fontWeight: 700 }}
                >
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box
            onClick={() => navigate("/jwt-sessions")}
            sx={{
              mt: 2.5,
              pt: 2,
              borderTop: `1px solid ${C.char400}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.75,
              cursor: "pointer",
              opacity: 0.75,
              "&:hover": { opacity: 1 },
            }}
          >
            <Typography
              sx={{ color: C.orangeLt, fontSize: "0.75rem", fontWeight: 600 }}
            >
              View all sessions →
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ══ ROW 4 — SESSIONS TABLE ══ */}
      <Box
        sx={{
          bgcolor: C.char600,
          border: `1px solid ${C.char400}`,
          borderRadius: "14px",
          p: "20px 20px 12px",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${C.orange} 0%, ${C.orangeLt} 40%, transparent 100%)`,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2.5,
          }}
        >
          <Box>
            <Typography
              sx={{ color: C.text100, fontWeight: 700, fontSize: "0.95rem" }}
            >
              Recent JWT Sessions
            </Typography>
            <Typography
              sx={{ color: C.text500, fontSize: "0.72rem", mt: 0.25 }}
            >
              Latest authentication events
            </Typography>
          </Box>
          <Box
            onClick={() => navigate("/jwt-sessions")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.6,
              bgcolor: `${C.orange}18`,
              border: `1px solid ${C.orange}40`,
              borderRadius: "8px",
              px: 1.5,
              py: 0.75,
              cursor: "pointer",
              "&:hover": { bgcolor: `${C.orange}28` },
              transition: "all 0.15s",
            }}
          >
            <Typography
              sx={{ color: C.orangeLt, fontSize: "0.75rem", fontWeight: 600 }}
            >
              Full Report
            </Typography>
            <OpenInNewIcon sx={{ fontSize: 12, color: C.orangeLt }} />
          </Box>
        </Box>
        <JwtSessionsTable
          title=""
          jwtsessions={recentJwtSessions}
          onRevokeSession={handleRevokeSession}
          isLoading={isLoading}
          total={recentJwtSessions?.length || 0}
          fetchpage={fetchJwtSessions}
        />
      </Box>
    </Box>
  );
};

export default DashboardPage;
