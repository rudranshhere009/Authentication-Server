import React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Paper,
} from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BoltIcon from "@mui/icons-material/Bolt";
import LoginIcon from "@mui/icons-material/Login";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

// Nivo
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";

const C = {
  orange: "#DC2626",
  orangeLt: "#EF4444",
  orangeDk: "#B91C1C",
  orangeGlow: "rgba(220,38,38,0.14)",
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

const nivoTheme = {
  background: "transparent",
  text: { fontSize: 11, fill: C.text300 },
  axis: {
    domain: { line: { stroke: C.char400, strokeWidth: 1 } },
    ticks: {
      line: { stroke: C.char400, strokeWidth: 1 },
      text: { fill: C.text300, fontWeight: 500, fontSize: 10 },
    },
    legend: { text: { fill: C.text100, fontWeight: 600, fontSize: 11 } },
  },
  grid: { line: { stroke: C.char400, strokeDasharray: "4 4" } },
  tooltip: {
    container: {
      background: C.char700,
      color: C.text100,
      fontSize: 12,
      borderRadius: 8,
      border: `1px solid ${C.char400}`,
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
    },
  },
  legends: { text: { fill: C.text300 } },
};

// --- Real Data Chart Builders ---
// 1. Weekly User Logins (Line Chart)
const getWeeklyLoginSeries = (sessions) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts = [0, 0, 0, 0, 0, 0, 0];
  sessions.forEach((s) => {
    if (s.created_at) {
      const d = new Date(s.created_at);
      const day = d.getDay(); // 0=Sun
      const idx = day === 0 ? 6 : day - 1; // Mon=0, Sun=6
      counts[idx]++;
    }
  });
  return [
    {
      id: "User Logins",
      data: days.map((d, i) => ({ x: d, y: counts[i] })),
    },
  ];
};

// 2. Session Duration (Avg per Week) - Bar Chart
const getWeeklyDuration = (sessions) => {
  // Group by week (ISO week)
  const weekMap = {};
  sessions.forEach((s) => {
    if (s.created_at && s.ended_at) {
      const start = new Date(s.created_at);
      const end = new Date(s.ended_at);
      const duration = (end - start) / 60000; // ms to min
      // Get ISO week string
      const week =
        start.getFullYear() + "-W" + String(getISOWeek(start)).padStart(2, "0");
      if (!weekMap[week]) weekMap[week] = [];
      weekMap[week].push(duration);
    }
  });
  // Format for nivo
  return Object.entries(weekMap)
    .sort()
    .map(([week, arr]) => ({
      week,
      minutes: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length),
    }));
};

function getISOWeek(date) {
  const d = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

// 3. Activity Status (Donut)
const getActivityDonut = (sessions) => {
  // Last 30 days
  const now = new Date();
  const last30 = new Set();
  for (let i = 0; i < 30; i++) {
    last30.add(
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() - i,
      ).toDateString(),
    );
  }
  const activeDays = new Set();
  sessions.forEach((s) => {
    if (s.created_at) {
      const d = new Date(s.created_at).toDateString();
      if (last30.has(d)) activeDays.add(d);
    }
  });
  return [
    { id: "Active Days", value: activeDays.size },
    { id: "Inactive Days", value: 30 - activeDays.size },
  ];
};

/* ── panel card wrapper ── */
const Panel = ({ title, accent = C.orange, children, minH = 300 }) => (
  <Box
    sx={{
      bgcolor: C.char600,
      border: `1px solid ${C.char400}`,
      borderRadius: "14px",
      p: "18px 20px",
      position: "relative",
      overflow: "hidden",
      minHeight: minH,
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: `linear-gradient(90deg, ${accent} 0%, transparent 65%)`,
      },
    }}
  >
    {title && (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Box
          sx={{
            width: 3,
            height: 18,
            borderRadius: 99,
            bgcolor: accent,
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            color: C.text100,
            fontWeight: 700,
            fontSize: "0.88rem",
            fontFamily: '"Orbitron", sans-serif',
          }}
        >
          {title}
        </Typography>
      </Box>
    )}
    {children}
  </Box>
);

/* ── stat row ── */
const StatRow = ({ label, value, color = C.text100 }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      py: 0.6,
    }}
  >
    <Typography sx={{ color: C.text300, fontSize: "0.78rem" }}>
      {label}
    </Typography>
    <Typography sx={{ color, fontSize: "0.88rem", fontWeight: 700 }}>
      {value}
    </Typography>
  </Box>
);

const UserProfilePage = ({ users, sessions, toggleBlock }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";

  const user = users.find((u) => u.id.toString() === userId);

  const userSessions = Array.isArray(sessions)
    ? sessions.filter((s) => s && s.user_id && s.user_id.toString() === userId)
    : [];

  const loginHistory =
    userSessions.length > 0
      ? [...userSessions]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 10)
      : [];

  const activeSessions = userSessions.filter((s) => s.is_active).length;
  const totalSessions = userSessions.length;

  // day of week breakdown
  const dayBreakdown = (() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const counts = Array(7).fill(0);
    userSessions.forEach((s) => {
      if (s.created_at) {
        const d = new Date(s.created_at).getDay();
        counts[d === 0 ? 6 : d - 1]++;
      }
    });
    return days.map((day, i) => ({ day, count: counts[i] }));
  })();

  const maxDayCount = Math.max(...dayBreakdown.map((d) => d.count), 1);

  // avg sessions per week
  const avgPerWeek = (() => {
    if (!userSessions.length) return 0;
    const oldest = new Date(
      Math.min(...userSessions.map((s) => new Date(s.created_at))),
    );
    const weeks = Math.max(
      Math.ceil((Date.now() - oldest) / (7 * 86400000)),
      1,
    );
    return Math.round(totalSessions / weeks);
  })();

  if (!user) {
    return (
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 4 }}>
        <Box
          sx={{
            bgcolor: C.char600,
            border: `1px solid ${C.char400}`,
            borderRadius: "14px",
            p: 4,
            textAlign: "center",
          }}
        >
          <PersonIcon sx={{ fontSize: 40, color: C.text500, mb: 1 }} />
          <Typography
            sx={{
              color: C.text100,
              fontWeight: 700,
              fontSize: "1.1rem",
              mb: 1,
            }}
          >
            User not found
          </Typography>
          <Button
            onClick={() => navigate(`/users?filter=${filter}`)}
            sx={{
              mt: 1,
              color: C.orangeLt,
              borderColor: C.char400,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { borderColor: C.orange },
            }}
            variant="outlined"
          >
            ← Back to Users
          </Button>
        </Box>
      </Box>
    );
  }

  const handleToggleBlock = () => {
    toggleBlock(user.username, !user.is_blocked);
  };

  const initials = user.username
    ? user.username.slice(0, 2).toUpperCase()
    : "??";
  const avatarColor = C.orange;

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2.5, md: 3 }, pb: 4 }}>
      {/* ── BACK ── */}
      <Box
        onClick={() => navigate(`/users?filter=${filter}`)}
        sx={{
          display: "inline-flex",
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
          mb: 3,
          transition: "all 0.15s",
          "&:hover": { borderColor: C.orange, color: C.orangeLt },
        }}
      >
        ← Back to Users
      </Box>

      {/* ── PROFILE HEADER ── */}
      <Box
        sx={{
          bgcolor: C.char600,
          border: `1px solid ${C.char400}`,
          borderRadius: "14px",
          p: "20px 24px",
          position: "relative",
          overflow: "hidden",
          mb: 2.5,
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
            alignItems: "flex-start",
            gap: 2.5,
            flexWrap: "wrap",
          }}
        >
          {/* Avatar */}
          <Avatar
            sx={{
              width: 60,
              height: 60,
              flexShrink: 0,
              bgcolor: `${avatarColor}22`,
              border: `2px solid ${avatarColor}50`,
              color: avatarColor,
              fontSize: "1.2rem",
              fontWeight: 800,
              fontFamily: '"Orbitron", sans-serif',
            }}
          >
            {initials}
          </Avatar>

          {/* Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                flexWrap: "wrap",
                mb: 0.5,
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Orbitron", sans-serif',
                  fontWeight: 800,
                  fontSize: { xs: "1.2rem", sm: "1.5rem" },
                  color: C.text100,
                  letterSpacing: "-0.2px",
                }}
              >
                {user.username || user.email}
              </Typography>
              {/* Role chip */}
              <Chip
                icon={
                  user.is_admin ? (
                    <AdminPanelSettingsIcon
                      sx={{
                        fontSize: "12px !important",
                        color: `${C.violet} !important`,
                      }}
                    />
                  ) : (
                    <PersonIcon
                      sx={{
                        fontSize: "12px !important",
                        color: `${C.text500} !important`,
                      }}
                    />
                  )
                }
                label={user.is_admin ? "Admin" : "User"}
                size="small"
                sx={{
                  bgcolor: user.is_admin ? `${C.violet}15` : `${C.char500}`,
                  color: user.is_admin ? C.violet : C.text500,
                  border: `1px solid ${user.is_admin ? `${C.violet}35` : C.char400}`,
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  height: 22,
                  "& .MuiChip-label": { px: 0.75 },
                  "& .MuiChip-icon": { ml: 0.5 },
                }}
              />
              {/* Status chip */}
              <Chip
                icon={
                  user.is_blocked ? (
                    <BlockIcon
                      sx={{
                        fontSize: "11px !important",
                        color: `${C.rose} !important`,
                      }}
                    />
                  ) : (
                    <CheckCircleOutlineIcon
                      sx={{
                        fontSize: "11px !important",
                        color: `${C.emerald} !important`,
                      }}
                    />
                  )
                }
                label={user.is_blocked ? "Blocked" : "Active"}
                size="small"
                sx={{
                  bgcolor: user.is_blocked
                    ? `rgba(244,63,94,0.1)`
                    : `rgba(16,185,129,0.1)`,
                  color: user.is_blocked ? C.rose : C.emerald,
                  border: `1px solid ${user.is_blocked ? "rgba(244,63,94,0.3)" : "rgba(16,185,129,0.3)"}`,
                  fontSize: "0.68rem",
                  fontWeight: 600,
                  height: 22,
                  "& .MuiChip-label": { px: 0.75 },
                  "& .MuiChip-icon": { ml: 0.5 },
                }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
              {user.department && (
                <Typography sx={{ color: C.text300, fontSize: "0.78rem" }}>
                  Dept:{" "}
                  <Typography
                    component="span"
                    sx={{
                      color: C.text100,
                      fontWeight: 600,
                      fontSize: "0.78rem",
                    }}
                  >
                    {user.department}
                  </Typography>
                </Typography>
              )}
              {user.rank && (
                <Typography sx={{ color: C.text300, fontSize: "0.78rem" }}>
                  Rank:{" "}
                  <Typography
                    component="span"
                    sx={{
                      color: C.amber,
                      fontWeight: 600,
                      fontSize: "0.78rem",
                    }}
                  >
                    {user.rank}
                  </Typography>
                </Typography>
              )}
              <Typography sx={{ color: C.text300, fontSize: "0.78rem" }}>
                Sessions:{" "}
                <Typography
                  component="span"
                  sx={{
                    color: C.orangeLt,
                    fontWeight: 600,
                    fontSize: "0.78rem",
                  }}
                >
                  {totalSessions}
                </Typography>
              </Typography>
            </Box>
          </Box>

          {/* Action button */}
          <Button
            variant="outlined"
            onClick={handleToggleBlock}
            startIcon={
              user.is_blocked ? <CheckCircleOutlineIcon /> : <BlockIcon />
            }
            sx={{
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.82rem",
              borderRadius: "10px",
              px: 2,
              py: 0.9,
              borderColor: user.is_blocked
                ? "rgba(16,185,129,0.4)"
                : "rgba(244,63,94,0.4)",
              color: user.is_blocked ? C.emerald : C.rose,
              "&:hover": {
                borderColor: user.is_blocked ? C.emerald : C.rose,
                bgcolor: user.is_blocked
                  ? "rgba(16,185,129,0.08)"
                  : "rgba(244,63,94,0.08)",
              },
            }}
          >
            {user.is_blocked ? "Grant Access" : "Revoke Access"}
          </Button>
        </Box>

        {/* Mini stat pills */}
        <Box sx={{ display: "flex", gap: 1.5, mt: 2.5, flexWrap: "wrap" }}>
          {[
            {
              label: "Total Sessions",
              value: totalSessions,
              color: C.orange,
              icon: LoginIcon,
            },
            {
              label: "Active",
              value: activeSessions,
              color: C.emerald,
              icon: BoltIcon,
            },
            {
              label: "Avg/Week",
              value: avgPerWeek,
              color: C.cyan,
              icon: TrendingUpIcon,
            },
            {
              label: "Busiest Day",
              value: dayBreakdown.reduce(
                (a, b) => (b.count > a.count ? b : a),
                { day: "—", count: 0 },
              ).day,
              color: C.amber,
              icon: AccessTimeIcon,
            },
          ].map(({ label, value, color, icon: Icon }) => (
            <Box
              key={label}
              sx={{
                bgcolor: `${color}12`,
                border: `1px solid ${color}25`,
                borderRadius: "10px",
                px: 1.75,
                py: 0.9,
                display: "flex",
                alignItems: "center",
                gap: 0.75,
              }}
            >
              <Icon sx={{ fontSize: 14, color }} />
              <Box>
                <Typography
                  sx={{
                    color,
                    fontSize: "1rem",
                    fontWeight: 800,
                    lineHeight: 1,
                    fontFamily: '"Orbitron", sans-serif',
                  }}
                >
                  {value}
                </Typography>
                <Typography
                  sx={{
                    color: C.text500,
                    fontSize: "0.62rem",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── CHARTS ROW ── */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }}
        gap={2.5}
        mb={2.5}
      >
        {/* Weekly Logins Line */}
        <Panel title="Weekly Logins" accent={C.orange} minH={280}>
          <Box sx={{ height: 220 }}>
            <ResponsiveLine
              data={getWeeklyLoginSeries(userSessions)}
              theme={nivoTheme}
              margin={{ top: 10, right: 10, bottom: 50, left: 40 }}
              xScale={{ type: "point" }}
              yScale={{ type: "linear", min: 0, max: "auto" }}
              curve="monotoneX"
              axisBottom={{
                tickRotation: 0,
                legend: "Day",
                legendOffset: 36,
                legendPosition: "middle",
              }}
              axisLeft={{
                legend: "Logins",
                legendOffset: -32,
                legendPosition: "middle",
              }}
              enableGridX={false}
              enableGridY={true}
              colors={[C.orange]}
              lineWidth={2.5}
              pointSize={7}
              pointColor={C.char700}
              pointBorderWidth={2}
              pointBorderColor={C.orange}
              enableArea={true}
              areaOpacity={0.12}
              useMesh={true}
            />
          </Box>
        </Panel>

        {/* Session Duration Bar */}
        <Panel title="Session Duration (avg/week)" accent={C.violet} minH={280}>
          <Box sx={{ height: 220 }}>
            <ResponsiveBar
              data={getWeeklyDuration(userSessions)}
              theme={nivoTheme}
              keys={["minutes"]}
              indexBy="week"
              margin={{ top: 10, right: 10, bottom: 50, left: 50 }}
              padding={0.35}
              colors={[C.violet]}
              valueScale={{ type: "linear" }}
              indexScale={{ type: "band", round: true }}
              enableLabel={false}
              borderRadius={4}
              axisBottom={{
                tickRotation: -30,
                legend: "Week",
                legendOffset: 40,
                legendPosition: "middle",
              }}
              axisLeft={{
                legend: "Minutes",
                legendOffset: -40,
                legendPosition: "middle",
              }}
            />
          </Box>
        </Panel>

        {/* Activity Donut */}
        <Panel title="Activity Status (Last 30d)" accent={C.emerald} minH={280}>
          <Box sx={{ height: 220 }}>
            <ResponsivePie
              data={getActivityDonut(userSessions)}
              theme={nivoTheme}
              margin={{ top: 10, right: 10, bottom: 40, left: 10 }}
              innerRadius={0.62}
              padAngle={2}
              cornerRadius={4}
              activeOuterRadiusOffset={5}
              colors={[C.emerald, C.char500]}
              enableArcLabels={true}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor="#fff"
              enableArcLinkLabels={false}
              legends={[
                {
                  anchor: "bottom",
                  direction: "row",
                  translateY: 30,
                  itemWidth: 110,
                  itemHeight: 14,
                  symbolSize: 10,
                  symbolShape: "circle",
                  itemTextColor: C.text300,
                },
              ]}
            />
          </Box>
        </Panel>
      </Box>

      {/* ── BOTTOM ROW — Day breakdown + Login History ── */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", lg: "1fr 1.6fr" }}
        gap={2.5}
      >
        {/* Day of week breakdown */}
        <Panel title="Activity by Day of Week" accent={C.amber} minH={240}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            {dayBreakdown.map(({ day, count }) => {
              const pct = Math.max((count / maxDayCount) * 100, 2);
              return (
                <Box
                  key={day}
                  sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                >
                  <Typography
                    sx={{
                      color: C.text300,
                      fontSize: "0.73rem",
                      fontWeight: 600,
                      width: 28,
                      flexShrink: 0,
                    }}
                  >
                    {day}
                  </Typography>
                  <Box
                    sx={{
                      flex: 1,
                      height: 5,
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
                        background: `linear-gradient(90deg, ${C.orange}, ${C.orangeLt})`,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </Box>
                  <Typography
                    sx={{
                      color: C.text100,
                      fontSize: "0.73rem",
                      fontWeight: 700,
                      width: 22,
                      textAlign: "right",
                      flexShrink: 0,
                    }}
                  >
                    {count}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Box
            sx={{
              mt: 2.5,
              pt: 2,
              borderTop: `1px solid ${C.char400}`,
              display: "flex",
              flexDirection: "column",
              gap: 0.75,
            }}
          >
            <StatRow
              label="Total Sessions"
              value={totalSessions}
              color={C.orange}
            />
            <StatRow
              label="Active Sessions"
              value={activeSessions}
              color={C.emerald}
            />
            <StatRow label="Avg / Week" value={avgPerWeek} color={C.cyan} />
          </Box>
        </Panel>

        {/* Login History Table */}
        <Panel title="Login History (Last 10)" accent={C.cyan} minH={240}>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              bgcolor: "transparent",
              border: `1px solid ${C.char400}`,
              borderRadius: "10px",
              maxHeight: 320,
              overflow: "auto",
              "&::-webkit-scrollbar": { width: "4px" },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: C.orangeDk,
                borderRadius: 99,
              },
            }}
          >
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {["Date", "Time", "IP Address", "Status"].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        bgcolor: `${C.char700} !important`,
                        color: `${C.orangeLt} !important`,
                        fontSize: "0.68rem !important",
                        fontWeight: "700 !important",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        borderBottom: `1px solid ${C.char400} !important`,
                        py: "10px",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loginHistory.length > 0 ? (
                  loginHistory.map((session) => (
                    <TableRow
                      key={session.id}
                      sx={{
                        bgcolor: `${C.char600} !important`,
                        "&:nth-of-type(odd)": {
                          bgcolor: `${C.char500}60 !important`,
                        },
                        "&:hover": {
                          bgcolor: `rgba(220,38,38,0.05) !important`,
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          color: `${C.text100} !important`,
                          fontSize: "0.8rem !important",
                          borderBottom: `1px solid ${C.char400} !important`,
                        }}
                      >
                        {new Date(session.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: `${C.text300} !important`,
                          fontSize: "0.78rem !important",
                          borderBottom: `1px solid ${C.char400} !important`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(session.created_at).toLocaleTimeString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: `${C.text300} !important`,
                          fontSize: "0.78rem !important",
                          borderBottom: `1px solid ${C.char400} !important`,
                        }}
                      >
                        {session.ip_address || "—"}
                      </TableCell>
                      <TableCell
                        sx={{
                          borderBottom: `1px solid ${C.char400} !important`,
                        }}
                      >
                        <Chip
                          label={session.is_active ? "Active" : "Ended"}
                          size="small"
                          sx={{
                            bgcolor: session.is_active
                              ? "rgba(16,185,129,0.12)"
                              : "rgba(90,80,69,0.3)",
                            color: session.is_active ? C.emerald : C.text500,
                            border: `1px solid ${session.is_active ? "rgba(16,185,129,0.3)" : C.char400}`,
                            fontWeight: 600,
                            fontSize: "0.65rem",
                            height: 20,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ py: 4, borderBottom: "none !important" }}
                    >
                      <BoltIcon
                        sx={{ fontSize: 28, color: C.text500, mb: 0.5 }}
                      />
                      <Typography
                        sx={{
                          color: `${C.text500} !important`,
                          fontSize: "0.8rem !important",
                        }}
                      >
                        No login history available
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Panel>
      </Box>
    </Box>
  );
};

export default UserProfilePage;
