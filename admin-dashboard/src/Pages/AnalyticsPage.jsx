import { useMemo, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";
import SecurityIcon from "@mui/icons-material/Security";
import BoltIcon from "@mui/icons-material/Bolt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GraphCard from "../Components/global/GraphCard";
import WeeklyLoginChart from "../Components/Graphs/WeeklyLoginChart";
import MonthlyLoginChart from "../Components/Graphs/MonthlyLoginChart";
import SessionsHealthChart from "../Components/Graphs/SessionsHealthChart";
import UserDistributionChart from "../Components/Graphs/UserDistributionChart";
import HourlyActivityHeatmap from "../Components/Graphs/HourlyActivityHeatMap";

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

/* ── tiny sparkline svg ── */
const Spark = ({ values = [], color = C.orange, w = 64, h = 28 }) => {
  if (!values.length) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const pts = values.map((v, i) => {
    const x = (i / Math.max(values.length - 1, 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient
          id={`spark-${color.replace("#", "")}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`${pts.join(" ")} ${w},${h} 0,${h}`}
        fill={`url(#spark-${color.replace("#", "")})`}
      />
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle
        cx={pts[pts.length - 1].split(",")[0]}
        cy={pts[pts.length - 1].split(",")[1]}
        r="2.5"
        fill={color}
      />
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
  spark,
}) => (
  <Box
    sx={{
      bgcolor: C.char600,
      border: `1px solid ${C.char400}`,
      borderRadius: "14px",
      p: "16px 18px 14px",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.2s",
      "&:hover": {
        borderColor: `${color}50`,
        boxShadow: `0 6px 28px rgba(0,0,0,0.45), 0 0 0 1px ${color}18`,
        transform: "translateY(-2px)",
      },
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: `linear-gradient(90deg, ${color} 0%, transparent 65%)`,
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.9 }}>
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: "7px",
              bgcolor: `${color}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ fontSize: 14, color }} />
          </Box>
          <Typography
            sx={{
              color: C.text500,
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontSize: "1.85rem",
            fontWeight: 800,
            lineHeight: 1,
            color: C.text100,
            fontFamily: '"Orbitron", sans-serif',
          }}
        >
          {value}
        </Typography>
        {sub && (
          <Typography sx={{ color: C.text500, fontSize: "0.7rem", mt: 0.4 }}>
            {sub}
          </Typography>
        )}
        {trend !== undefined && (
          <Box
            sx={{ display: "flex", alignItems: "center", gap: 0.4, mt: 0.6 }}
          >
            {trendUp ? (
              <ArrowUpwardIcon sx={{ fontSize: 11, color: C.emerald }} />
            ) : (
              <ArrowDownwardIcon sx={{ fontSize: 11, color: C.rose }} />
            )}
            <Typography
              sx={{
                fontSize: "0.7rem",
                fontWeight: 600,
                color: trendUp ? C.emerald : C.rose,
              }}
            >
              {trend}
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: C.text500 }}>
              vs last week
            </Typography>
          </Box>
        )}
      </Box>
      {spark && <Spark values={spark} color={color} />}
    </Box>
  </Box>
);

/* ── section header ── */
const SectionHeader = ({ title, sub, color = C.orange }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
    <Box
      sx={{
        width: 3,
        height: 22,
        borderRadius: 99,
        bgcolor: color,
        flexShrink: 0,
      }}
    />
    <Box>
      <Typography
        sx={{
          color: C.text100,
          fontWeight: 700,
          fontSize: "0.95rem",
          fontFamily: '"Orbitron", sans-serif',
        }}
      >
        {title}
      </Typography>
      {sub && (
        <Typography sx={{ color: C.text500, fontSize: "0.7rem" }}>
          {sub}
        </Typography>
      )}
    </Box>
  </Box>
);

/* ── metric row (for summary lists) ── */
const MetricRow = ({
  label,
  value,
  color = C.text100,
  progress,
  progressColor = C.orange,
  total,
}) => {
  const pct = total ? Math.round((value / total) * 100) : null;
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: progress ? 0.5 : 0,
        }}
      >
        <Typography sx={{ color: C.text300, fontSize: "0.78rem" }}>
          {label}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Typography sx={{ color, fontSize: "0.88rem", fontWeight: 700 }}>
            {value}
          </Typography>
          {pct !== null && (
            <Typography sx={{ color: C.text500, fontSize: "0.68rem" }}>
              ({pct}%)
            </Typography>
          )}
        </Box>
      </Box>
      {progress && (
        <Box
          sx={{
            height: 3,
            borderRadius: 99,
            bgcolor: C.char400,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              borderRadius: 99,
              width: `${Math.max(pct || 0, 2)}%`,
              bgcolor: progressColor,
              transition: "width 0.6s ease",
            }}
          />
        </Box>
      )}
    </Box>
  );
};

/* ══════════════════════════════════════════════ MAIN PAGE ═══ */
const AnalyticsPage = ({
  weeklyLogindata = [],
  allsessions = [],
  users = [],
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  /* ── derived stats ── */
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.is_blocked).length;
  const blockedUsers = users.filter((u) => u.is_blocked).length;
  const adminUsers = users.filter((u) => u.is_admin).length;
  const activeSessions = allsessions.filter((s) => s.is_active).length;
  const totalSessions = allsessions.length;

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const thisWeekSessions = allsessions.filter(
    (s) => new Date(s.created_at) >= sevenDaysAgo,
  ).length;
  const lastWeekSessions = allsessions.filter(
    (s) =>
      new Date(s.created_at) >= fourteenDaysAgo &&
      new Date(s.created_at) < sevenDaysAgo,
  ).length;

  const weeklyTrend =
    lastWeekSessions > 0
      ? `${Math.abs(Math.round(((thisWeekSessions - lastWeekSessions) / lastWeekSessions) * 100))}%`
      : null;
  const weeklyTrendUp = thisWeekSessions >= lastWeekSessions;

  const avgDailyLogins = Math.round(
    (weeklyLogindata?.reduce((s, d) => s + d.logins, 0) || 0) / 7,
  );

  const healthPct = totalSessions
    ? Math.round((activeSessions / totalSessions) * 100)
    : 0;

  /* ── weekly sparkline ── */
  const weeklySparkline = useMemo(
    () => weeklyLogindata.map((d) => d.logins),
    [weeklyLogindata],
  );

  /* ── hourly peak ── */
  const peakHour = useMemo(() => {
    const hours = Array(24).fill(0);
    allsessions.forEach((s) => {
      if (s.created_at) hours[new Date(s.created_at).getHours()]++;
    });
    const max = Math.max(...hours);
    const idx = hours.indexOf(max);
    return { hour: `${idx}:00`, count: max };
  }, [allsessions]);

  /* ── day of week breakdown ── */
  const dayBreakdown = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const counts = Array(7).fill(0);
    allsessions.forEach((s) => {
      if (s.created_at) {
        const d = new Date(s.created_at).getDay();
        counts[d === 0 ? 6 : d - 1]++;
      }
    });
    return days.map((day, i) => ({ day, count: counts[i] }));
  }, [allsessions]);

  const maxDayCount = Math.max(...dayBreakdown.map((d) => d.count), 1);

  const tabs = ["overview", "sessions", "users", "heatmap"];

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2.5, md: 3 }, pb: 4 }}>
      {/* ── PAGE HEADER ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: '"Orbitron", sans-serif',
              fontWeight: 800,
              fontSize: { xs: "1.2rem", sm: "1.5rem" },
              color: C.text100,
              letterSpacing: "-0.3px",
            }}
          >
            Analytics
          </Typography>
          <Typography sx={{ color: C.text500, fontSize: "0.78rem", mt: 0.3 }}>
            Deep dive into session, login, and user metrics
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
            fontSize: "0.75rem",
            color: C.text300,
            "&:hover": { borderColor: C.orange, color: C.orangeLt },
            transition: "all 0.15s",
          }}
        >
          ← Dashboard
        </Box>
      </Box>

      {/* ── TABS ── */}
      <Box sx={{ display: "flex", gap: 1, mb: 3, flexWrap: "wrap" }}>
        {tabs.map((tab) => (
          <Box
            key={tab}
            onClick={() => setActiveTab(tab)}
            sx={{
              px: 2,
              py: 0.75,
              borderRadius: "8px",
              cursor: "pointer",
              bgcolor: activeTab === tab ? C.orange : C.char600,
              border: `1px solid ${activeTab === tab ? C.orange : C.char400}`,
              color: activeTab === tab ? "#fff" : C.text300,
              fontSize: "0.78rem",
              fontWeight: 600,
              transition: "all 0.15s",
              textTransform: "capitalize",
              "&:hover": {
                borderColor: C.orange,
                color: activeTab === tab ? "#fff" : C.orangeLt,
              },
            }}
          >
            {tab}
          </Box>
        ))}
      </Box>

      {/* ══ OVERVIEW TAB ══ */}
      {activeTab === "overview" && (
        <>
          {/* Stat cards */}
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
              icon={GroupIcon}
              label="Total Users"
              value={totalUsers}
              sub={`${activeUsers} active`}
              color={C.orange}
              spark={[
                totalUsers * 0.8,
                totalUsers * 0.85,
                totalUsers * 0.9,
                totalUsers,
                totalUsers,
                totalUsers,
                totalUsers,
              ]}
            />
            <StatCard
              icon={SecurityIcon}
              label="Total Sessions"
              value={totalSessions}
              sub="all time"
              color={C.cyan}
              spark={weeklySparkline}
              trend={weeklyTrend}
              trendUp={weeklyTrendUp}
            />
            <StatCard
              icon={TrendingUpIcon}
              label="This Week"
              value={thisWeekSessions}
              sub="login events"
              color={C.emerald}
              spark={weeklySparkline}
              trend={weeklyTrend}
              trendUp={weeklyTrendUp}
            />
            <StatCard
              icon={AccessTimeIcon}
              label="Avg Daily"
              value={avgDailyLogins}
              sub="logins/day"
              color={C.amber}
              spark={weeklySparkline}
            />
            <StatCard
              icon={BoltIcon}
              label="Health"
              value={`${healthPct}%`}
              sub={`${activeSessions} active`}
              color={healthPct > 60 ? C.emerald : C.amber}
              spark={[55, 60, 58, 65, 62, 68, healthPct]}
            />
            <StatCard
              icon={CalendarTodayIcon}
              label="Peak Hour"
              value={peakHour.hour}
              sub={`${peakHour.count} logins`}
              color={C.violet}
              spark={weeklySparkline.slice(0, 7)}
            />
          </Box>

          {/* Charts row */}
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", lg: "2fr 1fr" }}
            gap={2.5}
            mb={2.5}
          >
            <GraphCard
              title="Monthly Login History"
              chart={<MonthlyLoginChart allsessions={allsessions} />}
              height={320}
            />
            <Box display="grid" gridTemplateRows="1fr 1fr" gap={2}>
              <GraphCard
                title="Session Health"
                chart={<SessionsHealthChart sessions={allsessions} />}
                height={140}
              />
              <GraphCard
                title="User Distribution"
                chart={<UserDistributionChart users={users} />}
                height={140}
              />
            </Box>
          </Box>

          {/* Day of week breakdown + summary */}
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
            gap={2.5}
          >
            {/* Day of week */}
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
                  background: `linear-gradient(90deg, ${C.amber} 0%, transparent 60%)`,
                },
              }}
            >
              <SectionHeader
                title="Logins by Day of Week"
                sub="current data"
                color={C.amber}
              />
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
                            background: `linear-gradient(90deg, ${C.orange} 0%, ${C.orangeLt} 100%)`,
                            transition: "width 0.5s ease",
                          }}
                        />
                      </Box>
                      <Typography
                        sx={{
                          color: C.text100,
                          fontSize: "0.73rem",
                          fontWeight: 700,
                          width: 28,
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
            </Box>

            {/* Summary stats */}
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
              <SectionHeader
                title="Summary Metrics"
                sub="all-time data"
                color={C.violet}
              />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <MetricRow
                  label="Total Sessions"
                  value={totalSessions}
                  color={C.cyan}
                />
                <MetricRow
                  label="Active Sessions"
                  value={activeSessions}
                  color={C.emerald}
                />
                <MetricRow
                  label="Active Users"
                  value={activeUsers}
                  total={totalUsers}
                  color={C.orange}
                  progress
                  progressColor={C.orange}
                />
                <MetricRow
                  label="Blocked Users"
                  value={blockedUsers}
                  total={totalUsers}
                  color={C.rose}
                  progress
                  progressColor={C.rose}
                />
                <MetricRow
                  label="Admin Users"
                  value={adminUsers}
                  total={totalUsers}
                  color={C.violet}
                  progress
                  progressColor={C.violet}
                />
                <MetricRow
                  label="Engagement Rate"
                  value={`${Math.round((activeSessions / Math.max(totalUsers, 1)) * 100)}%`}
                  color={C.amber}
                />
                <MetricRow
                  label="Avg Daily Logins"
                  value={avgDailyLogins}
                  color={C.text100}
                />
                <MetricRow
                  label="Peak Hour"
                  value={peakHour.hour}
                  color={C.orangeLt}
                />
              </Box>
            </Box>
          </Box>
        </>
      )}

      {/* ══ SESSIONS TAB ══ */}
      {activeTab === "sessions" && (
        <>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "repeat(2,1fr)", md: "repeat(4,1fr)" }}
            gap={2}
            mb={2.5}
          >
            <StatCard
              icon={SecurityIcon}
              label="Total Sessions"
              value={totalSessions}
              color={C.cyan}
              spark={weeklySparkline}
            />
            <StatCard
              icon={BoltIcon}
              label="Active Now"
              value={activeSessions}
              color={C.emerald}
              spark={weeklySparkline}
            />
            <StatCard
              icon={TrendingUpIcon}
              label="This Week"
              value={thisWeekSessions}
              color={C.orange}
              trend={weeklyTrend}
              trendUp={weeklyTrendUp}
              spark={weeklySparkline}
            />
            <StatCard
              icon={AccessTimeIcon}
              label="Health"
              value={`${healthPct}%`}
              color={healthPct > 60 ? C.emerald : C.amber}
              spark={[55, 60, 58, 65, 62, 68, healthPct]}
            />
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", lg: "2fr 1fr" }}
            gap={2.5}
            mb={2.5}
          >
            <GraphCard
              title="Weekly Login Trend (Last 7 Days)"
              chart={<WeeklyLoginChart data={weeklyLogindata} />}
              height={300}
            />
            <GraphCard
              title="Session Health Breakdown"
              chart={<SessionsHealthChart sessions={allsessions} />}
              height={300}
            />
          </Box>

          <GraphCard
            title="Monthly Login History"
            chart={<MonthlyLoginChart allsessions={allsessions} />}
            height={340}
          />
        </>
      )}

      {/* ══ USERS TAB ══ */}
      {activeTab === "users" && (
        <>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "repeat(2,1fr)", md: "repeat(4,1fr)" }}
            gap={2}
            mb={2.5}
          >
            <StatCard
              icon={GroupIcon}
              label="Total Users"
              value={totalUsers}
              color={C.orange}
            />
            <StatCard
              icon={GroupIcon}
              label="Active"
              value={activeUsers}
              sub={`${Math.round((activeUsers / Math.max(totalUsers, 1)) * 100)}%`}
              color={C.emerald}
            />
            <StatCard
              icon={GroupIcon}
              label="Blocked"
              value={blockedUsers}
              sub={`${Math.round((blockedUsers / Math.max(totalUsers, 1)) * 100)}%`}
              color={C.rose}
            />
            <StatCard
              icon={GroupIcon}
              label="Admins"
              value={adminUsers}
              sub="privileged"
              color={C.violet}
            />
          </Box>

          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", lg: "1fr 1fr" }}
            gap={2.5}
          >
            <GraphCard
              title="User Distribution"
              chart={<UserDistributionChart users={users} />}
              height={320}
            />

            <Box
              sx={{
                bgcolor: C.char600,
                border: `1px solid ${C.char400}`,
                borderRadius: "14px",
                p: "20px",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "2px",
                  background: `linear-gradient(90deg, ${C.orange} 0%, transparent 60%)`,
                },
              }}
            >
              <SectionHeader
                title="User Metrics"
                sub="detailed breakdown"
                color={C.orange}
              />
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
                    label: "Admin Users",
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
                  {
                    label: "Sessions / User",
                    value: totalUsers
                      ? Math.round(totalSessions / totalUsers)
                      : 0,
                    color: C.cyan,
                  },
                  {
                    label: "Avg Daily Logins",
                    value: avgDailyLogins,
                    color: C.amber,
                  },
                  {
                    label: "Sessions (Last 7d)",
                    value: (() => {
                      const d = new Date(Date.now() - 7 * 86400000);
                      return allsessions.filter(
                        (s) => new Date(s.created_at) >= d,
                      ).length;
                    })(),
                    color: C.text100,
                  },
                ].map(({ label, value, total, color }) => (
                  <MetricRow
                    key={label}
                    label={label}
                    value={value}
                    total={total}
                    color={color}
                    progress={!!total}
                    progressColor={color}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </>
      )}

      {/* ══ HEATMAP TAB ══ */}
      {activeTab === "heatmap" && (
        <>
          <Box
            sx={{
              bgcolor: C.char600,
              border: `1px solid ${C.char400}`,
              borderRadius: "14px",
              p: "20px",
              mb: 2.5,
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
                mb: 2,
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: C.text100,
                    fontWeight: 700,
                    fontSize: "0.95rem",
                  }}
                >
                  Hourly Activity Heatmap
                </Typography>
                <Typography
                  sx={{ color: C.text500, fontSize: "0.72rem", mt: 0.25 }}
                >
                  Login frequency by day and hour · current week
                </Typography>
              </Box>
              <Chip
                label="Current Week"
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
            <Box sx={{ height: 420 }}>
              <HourlyActivityHeatmap allsessions={allsessions} />
            </Box>
          </Box>

          {/* Day + hour stats below */}
          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
            gap={2.5}
          >
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
              <SectionHeader
                title="Activity by Day"
                sub="session counts per weekday"
                color={C.cyan}
              />
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
                          width: 28,
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
            </Box>

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
              <SectionHeader
                title="Peak Activity"
                sub="busiest login times"
                color={C.violet}
              />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                {[
                  {
                    label: "Peak Hour",
                    value: peakHour.hour,
                    color: C.orangeLt,
                  },
                  {
                    label: "Peak Count",
                    value: peakHour.count,
                    color: C.orange,
                  },
                  {
                    label: "Total Sessions",
                    value: totalSessions,
                    color: C.cyan,
                  },
                  {
                    label: "Active Sessions",
                    value: activeSessions,
                    color: C.emerald,
                  },
                  {
                    label: "Avg Daily Logins",
                    value: avgDailyLogins,
                    color: C.amber,
                  },
                  {
                    label: "Busiest Day",
                    value: dayBreakdown.reduce(
                      (a, b) => (b.count > a.count ? b : a),
                      { day: "-", count: 0 },
                    ).day,
                    color: C.violet,
                  },
                ].map(({ label, value, color }) => (
                  <Box
                    key={label}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      py: 0.25,
                    }}
                  >
                    <Typography sx={{ color: C.text300, fontSize: "0.78rem" }}>
                      {label}
                    </Typography>
                    <Typography
                      sx={{ color, fontSize: "0.9rem", fontWeight: 700 }}
                    >
                      {value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AnalyticsPage;
