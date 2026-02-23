import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  Button,
  CircularProgress,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DownloadIcon from "@mui/icons-material/Download";
import PeopleIcon from "@mui/icons-material/People";
import SecurityIcon from "@mui/icons-material/Security";
import BarChartIcon from "@mui/icons-material/BarChart";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BlockIcon from "@mui/icons-material/Block";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArticleIcon from "@mui/icons-material/Article";

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

/* ─── helpers ─── */
function downloadCSV(filename, rows, headers) {
  const escape = (v) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    return s.includes(",") || s.includes('"') || s.includes("\n")
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };
  const lines = [
    headers.map(escape).join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadJSON(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function fmtDate(d) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString();
  } catch {
    return String(d);
  }
}

/* ─── sub-components ─── */

const Panel = ({ title, sub, color = C.red, children, action }) => (
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
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        mb: 2,
        flexWrap: "wrap",
        gap: 1,
      }}
    >
      <Box>
        <Typography
          sx={{
            color: C.text100,
            fontWeight: 700,
            fontSize: "0.92rem",
            fontFamily: '"Space Grotesk", sans-serif',
            letterSpacing: "0.01em",
          }}
        >
          {title}
        </Typography>
        {sub && (
          <Typography
            sx={{
              color: C.text500,
              fontSize: "0.7rem",
              mt: 0.2,
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            {sub}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
    {children}
  </Box>
);

const StatRow = ({ label, value, color = C.text100, sub }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      py: 0.9,
      borderBottom: `1px solid ${C.char400}`,
      "&:last-of-type": { borderBottom: "none" },
    }}
  >
    <Typography
      sx={{
        color: C.text300,
        fontSize: "0.8rem",
        fontFamily: '"Space Grotesk", sans-serif',
      }}
    >
      {label}
    </Typography>
    <Box sx={{ textAlign: "right" }}>
      <Typography
        sx={{
          color,
          fontSize: "0.88rem",
          fontWeight: 700,
          fontFamily: '"Space Grotesk", sans-serif',
        }}
      >
        {value}
      </Typography>
      {sub && (
        <Typography
          sx={{
            color: C.text500,
            fontSize: "0.65rem",
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          {sub}
        </Typography>
      )}
    </Box>
  </Box>
);

const ExportCard = ({
  icon: Icon,
  title,
  description,
  color,
  onCSV,
  onJSON,
  loading,
  count,
}) => (
  <Box
    sx={{
      bgcolor: C.char600,
      border: `1px solid ${C.char400}`,
      borderRadius: "13px",
      p: "16px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 1.5,
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.15s, box-shadow 0.15s",
      "&:hover": {
        borderColor: `${color}50`,
        boxShadow: `0 4px 20px ${color}15`,
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
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          bgcolor: `${color}15`,
          border: `1px solid ${color}28`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon sx={{ fontSize: 19, color }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            color: C.text100,
            fontWeight: 700,
            fontSize: "0.88rem",
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            color: C.text500,
            fontSize: "0.68rem",
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          {description}
        </Typography>
      </Box>
      {count !== undefined && (
        <Chip
          label={`${count} rows`}
          size="small"
          sx={{
            bgcolor: `${color}10`,
            color,
            border: `1px solid ${color}25`,
            fontSize: "0.65rem",
            fontWeight: 700,
            height: 20,
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        />
      )}
    </Box>

    <Box sx={{ display: "flex", gap: 1 }}>
      <Button
        variant="outlined"
        size="small"
        startIcon={
          loading ? (
            <CircularProgress size={11} color="inherit" />
          ) : (
            <DownloadIcon sx={{ fontSize: "14px !important" }} />
          )
        }
        onClick={onCSV}
        disabled={loading}
        sx={{
          flex: 1,
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.75rem",
          fontFamily: '"Space Grotesk", sans-serif',
          borderColor: `${color}40`,
          color,
          py: 0.6,
          "&:hover": { borderColor: color, bgcolor: `${color}10` },
        }}
      >
        Export CSV
      </Button>
      <Button
        variant="outlined"
        size="small"
        startIcon={<ArticleIcon sx={{ fontSize: "14px !important" }} />}
        onClick={onJSON}
        disabled={loading}
        sx={{
          flex: 1,
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.75rem",
          fontFamily: '"Space Grotesk", sans-serif',
          borderColor: `${C.char400}`,
          color: C.text300,
          py: 0.6,
          "&:hover": {
            borderColor: C.text300,
            bgcolor: `rgba(255,255,255,0.04)`,
          },
        }}
      >
        Export JSON
      </Button>
    </Box>
  </Box>
);

/* ─── Mini bar chart (pure CSS/SVG) ─── */
const MiniBar = ({ data, color }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <Box
      sx={{ display: "flex", alignItems: "flex-end", gap: "3px", height: 50 }}
    >
      {data.map((d, i) => {
        const h = Math.max((d.value / max) * 50, 2);
        return (
          <Tooltip key={i} title={`${d.label}: ${d.value}`} placement="top">
            <Box
              sx={{
                flex: 1,
                height: h,
                bgcolor: `${color}${d.value > 0 ? "CC" : "30"}`,
                borderRadius: "3px 3px 0 0",
                transition: "height 0.4s ease",
                cursor: "default",
                "&:hover": { bgcolor: color },
              }}
            />
          </Tooltip>
        );
      })}
    </Box>
  );
};

/* ─── Main ─── */
const ReportsPage = ({ users = [], jwtSessions = [] }) => {
  const navigate = useNavigate();
  const [exportFormat, setExportFormat] = useState("csv");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const now = new Date();

  /* ── derived stats ── */
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => !u.is_blocked).length;
  const blockedUsers = users.filter((u) => u.is_blocked).length;
  const adminUsers = users.filter((u) => u.is_admin).length;

  const totalSessions = jwtSessions.length;
  const activeSessions = jwtSessions.filter((s) => s.is_active).length;
  const revokedSessions = jwtSessions.filter((s) => !s.is_active).length;
  const healthPct = totalSessions
    ? Math.round((activeSessions / totalSessions) * 100)
    : 0;

  const last7Days = jwtSessions.filter(
    (s) => Date.now() - new Date(s.created_at).getTime() < 7 * 86400000,
  ).length;
  const last30Days = jwtSessions.filter(
    (s) => Date.now() - new Date(s.created_at).getTime() < 30 * 86400000,
  ).length;

  /* ── weekly bar data ── */
  const weeklyData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const counts = Array(7).fill(0);
    jwtSessions.forEach((s) => {
      if (s.created_at) {
        const d = new Date(s.created_at);
        const diffDays = Math.floor((now - d) / 86400000);
        if (diffDays >= 0 && diffDays < 7) {
          const idx = (d.getDay() + 6) % 7; // Mon=0
          counts[idx]++;
        }
      }
    });
    return days.map((label, i) => ({ label, value: counts[i] }));
  }, [jwtSessions]);

  /* ── department breakdown ── */
  const deptBreakdown = useMemo(() => {
    const map = {};
    users.forEach((u) => {
      const d = u.department || "Unassigned";
      map[d] = (map[d] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([label, value]) => ({ label, value }));
  }, [users]);

  /* ── rank breakdown ── */
  const rankBreakdown = useMemo(() => {
    const map = {};
    users.forEach((u) => {
      const r = u.rank || "Unranked";
      map[r] = (map[r] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value }));
  }, [users]);

  const maxRank = Math.max(...rankBreakdown.map((r) => r.value), 1);

  /* ── top active users ── */
  const topUsers = useMemo(() => {
    const map = {};
    jwtSessions.forEach((s) => {
      if (s.username) map[s.username] = (map[s.username] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([username, sessions]) => ({ username, sessions }));
  }, [jwtSessions]);

  /* ── export functions ── */
  const handleExportUsers = async (fmt) => {
    setLoadingUsers(true);
    await new Promise((r) => setTimeout(r, 300));
    const rows = users.map((u) => ({
      id: u.id,
      username: u.username,
      name: u.name || "",
      rank: u.rank || "",
      department: u.department || "",
      age: u.age || "",
      contact_no: u.contact_no || "",
      address: u.address || "",
      location: u.location || "",
      is_admin: u.is_admin ? "Yes" : "No",
      is_blocked: u.is_blocked ? "Yes" : "No",
      date_of_joining: fmtDate(u.date_of_joining),
      dob: fmtDate(u.dob),
    }));
    const ts = now.toISOString().slice(0, 10);
    if (fmt === "json") {
      downloadJSON(`apex_users_${ts}.json`, rows);
    } else {
      downloadCSV(`apex_users_${ts}.csv`, rows, [
        "id",
        "username",
        "name",
        "rank",
        "department",
        "age",
        "contact_no",
        "address",
        "location",
        "is_admin",
        "is_blocked",
        "date_of_joining",
        "dob",
      ]);
    }
    setLoadingUsers(false);
  };

  const handleExportSessions = async (fmt) => {
    setLoadingSessions(true);
    await new Promise((r) => setTimeout(r, 300));
    const rows = jwtSessions.map((s) => ({
      id: s.id,
      username: s.username || "",
      created_at: fmtDate(s.created_at),
      is_active: s.is_active ? "Active" : "Revoked",
    }));
    const ts = now.toISOString().slice(0, 10);
    if (fmt === "json") {
      downloadJSON(`apex_sessions_${ts}.json`, rows);
    } else {
      downloadCSV(`apex_sessions_${ts}.csv`, rows, [
        "id",
        "username",
        "created_at",
        "is_active",
      ]);
    }
    setLoadingSessions(false);
  };

  const handleExportAudit = async (fmt) => {
    setLoadingAudit(true);
    await new Promise((r) => setTimeout(r, 300));
    const report = {
      generated_at: now.toISOString(),
      summary: {
        total_users: totalUsers,
        active_users: activeUsers,
        blocked_users: blockedUsers,
        admin_users: adminUsers,
        total_sessions: totalSessions,
        active_sessions: activeSessions,
        revoked_sessions: revokedSessions,
        health_pct: `${healthPct}%`,
        sessions_last_7_days: last7Days,
        sessions_last_30_days: last30Days,
      },
      department_breakdown: deptBreakdown,
      rank_breakdown: rankBreakdown,
      top_active_users: topUsers,
    };
    const ts = now.toISOString().slice(0, 10);
    if (fmt === "json") {
      downloadJSON(`apex_audit_report_${ts}.json`, report);
    } else {
      const rows = [
        { metric: "Total Users", value: totalUsers },
        { metric: "Active Users", value: activeUsers },
        { metric: "Blocked Users", value: blockedUsers },
        { metric: "Admin Users", value: adminUsers },
        { metric: "Total Sessions", value: totalSessions },
        { metric: "Active Sessions", value: activeSessions },
        { metric: "Revoked Sessions", value: revokedSessions },
        { metric: "Health %", value: `${healthPct}%` },
        { metric: "Sessions (last 7d)", value: last7Days },
        { metric: "Sessions (last 30d)", value: last30Days },
      ];
      downloadCSV(`apex_audit_report_${ts}.csv`, rows, ["metric", "value"]);
    }
    setLoadingAudit(false);
  };

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
                background: `linear-gradient(135deg, ${C.cyan} 0%, #0891B2 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px rgba(34,211,238,0.35)`,
              }}
            >
              <AssessmentIcon sx={{ fontSize: 16, color: "#fff" }} />
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
              Reports
            </Typography>
            <Chip
              label={`${now.toLocaleDateString()}`}
              size="small"
              sx={{
                bgcolor: `${C.cyan}15`,
                color: C.cyan,
                border: `1px solid ${C.cyan}30`,
                fontSize: "0.65rem",
                fontWeight: 600,
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
            Export data &amp; generate audit summaries
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

      {/* ══ ROW 1 — SUMMARY STATS ══ */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "repeat(2,1fr)", sm: "repeat(4,1fr)" }}
        gap={2}
        mb={3}
      >
        {[
          {
            icon: PeopleIcon,
            label: "Total Users",
            value: totalUsers,
            color: C.red,
          },
          {
            icon: CheckCircleOutlineIcon,
            label: "Active Users",
            value: activeUsers,
            color: C.emerald,
          },
          {
            icon: BlockIcon,
            label: "Blocked",
            value: blockedUsers,
            color: C.rose,
          },
          {
            icon: SecurityIcon,
            label: "Total Sessions",
            value: totalSessions,
            color: C.cyan,
          },
        ].map(({ icon: Icon, label, value, color }) => (
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
              }}
            >
              <Icon sx={{ fontSize: 18, color }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  color,
                  fontSize: "1.4rem",
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
                  fontSize: "0.67rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              >
                {label}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      {/* ══ ROW 2 — EXPORT CARDS ══ */}
      <Panel
        title="Data Exports"
        sub="Download platform data in CSV or JSON format"
        color={C.red}
        action={
          <Chip
            label="Instant download"
            size="small"
            sx={{
              bgcolor: `${C.emerald}12`,
              color: C.emerald,
              border: `1px solid ${C.emerald}28`,
              fontSize: "0.65rem",
              fontWeight: 600,
              height: 20,
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          />
        }
      >
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
          gap={2}
        >
          <ExportCard
            icon={PeopleIcon}
            title="Users Report"
            description="All user accounts with metadata"
            color={C.violet}
            count={totalUsers}
            loading={loadingUsers}
            onCSV={() => handleExportUsers("csv")}
            onJSON={() => handleExportUsers("json")}
          />
          <ExportCard
            icon={SecurityIcon}
            title="Session Log"
            description="All JWT sessions with status"
            color={C.cyan}
            count={totalSessions}
            loading={loadingSessions}
            onCSV={() => handleExportSessions("csv")}
            onJSON={() => handleExportSessions("json")}
          />
          <ExportCard
            icon={BarChartIcon}
            title="Audit Summary"
            description="Full system metrics snapshot"
            color={C.amber}
            loading={loadingAudit}
            onCSV={() => handleExportAudit("csv")}
            onJSON={() => handleExportAudit("json")}
          />
        </Box>
      </Panel>

      {/* ══ ROW 3 — CHARTS ══ */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap={2.5}
        mt={2.5}
      >
        {/* Weekly login trend */}
        <Panel title="Logins This Week" sub="Daily login count" color={C.red}>
          <MiniBar data={weeklyData} color={C.red} />
          <Box
            sx={{ display: "flex", justifyContent: "space-between", mt: 0.75 }}
          >
            {weeklyData.map((d) => (
              <Typography
                key={d.label}
                sx={{
                  color: C.text500,
                  fontSize: "0.62rem",
                  fontFamily: '"Space Grotesk", sans-serif',
                  flex: 1,
                  textAlign: "center",
                }}
              >
                {d.label}
              </Typography>
            ))}
          </Box>
          <Box sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${C.char400}` }}>
            <StatRow label="Last 7 days" value={last7Days} color={C.redLt} />
            <StatRow label="Last 30 days" value={last30Days} color={C.amber} />
            <StatRow
              label="Daily average"
              value={Math.round(last7Days / 7)}
              color={C.cyan}
            />
          </Box>
        </Panel>

        {/* Department breakdown */}
        <Panel
          title="Users by Department"
          sub="Distribution across units"
          color={C.violet}
        >
          {deptBreakdown.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {deptBreakdown.map(({ label, value }) => {
                const pct = Math.max(
                  Math.round((value / Math.max(totalUsers, 1)) * 100),
                  2,
                );
                return (
                  <Box key={label}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.35,
                      }}
                    >
                      <Typography
                        sx={{
                          color: C.text300,
                          fontSize: "0.75rem",
                          fontFamily: '"Space Grotesk", sans-serif',
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "60%",
                        }}
                      >
                        {label}
                      </Typography>
                      <Typography
                        sx={{
                          color: C.text100,
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          fontFamily: '"Space Grotesk", sans-serif',
                        }}
                      >
                        {value}
                        <Typography
                          component="span"
                          sx={{
                            color: C.text500,
                            fontSize: "0.65rem",
                            fontFamily: '"Space Grotesk", sans-serif',
                            ml: 0.5,
                          }}
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
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${C.violet} 0%, ${C.cyan} 100%)`,
                          transition: "width 0.5s ease",
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Typography
              sx={{
                color: C.text500,
                fontSize: "0.8rem",
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              No department data available
            </Typography>
          )}
        </Panel>
      </Box>

      {/* ══ ROW 4 — RANK + TOP USERS ══ */}
      <Box
        display="grid"
        gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
        gap={2.5}
        mt={2.5}
      >
        {/* Rank breakdown */}
        <Panel
          title="Users by Rank"
          sub="Personnel rank distribution"
          color={C.amber}
        >
          {rankBreakdown.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
              {rankBreakdown.map(({ label, value }) => {
                const pct = Math.max(Math.round((value / maxRank) * 100), 2);
                return (
                  <Box
                    key={label}
                    sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
                  >
                    <Typography
                      sx={{
                        color: C.text300,
                        fontSize: "0.73rem",
                        fontWeight: 600,
                        fontFamily: '"Space Grotesk", sans-serif',
                        width: 80,
                        flexShrink: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
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
                          background: `linear-gradient(90deg, ${C.amber} 0%, ${C.redLt} 100%)`,
                          transition: "width 0.5s ease",
                        }}
                      />
                    </Box>
                    <Typography
                      sx={{
                        color: C.text100,
                        fontSize: "0.73rem",
                        fontWeight: 700,
                        fontFamily: '"Space Grotesk", sans-serif',
                        width: 24,
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      {value}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Typography
              sx={{
                color: C.text500,
                fontSize: "0.8rem",
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              No rank data available
            </Typography>
          )}
        </Panel>

        {/* Top active users */}
        <Panel
          title="Most Active Users"
          sub="Ranked by total login sessions"
          color={C.cyan}
        >
          {topUsers.length > 0 ? (
            <TableContainer
              component={Paper}
              sx={{ bgcolor: "transparent", boxShadow: "none" }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {["#", "Username", "Sessions"].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          bgcolor: `${C.char700} !important`,
                          color: `${C.redLt} !important`,
                          fontWeight: "700 !important",
                          fontSize: "0.68rem !important",
                          textTransform: "uppercase !important",
                          letterSpacing: "0.08em !important",
                          borderBottom: `1px solid ${C.char400} !important`,
                          fontFamily: '"Space Grotesk", sans-serif !important',
                          py: "8px",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topUsers.map((u, i) => (
                    <TableRow
                      key={u.username}
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(220,38,38,0.04) !important",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          color: `${C.text500} !important`,
                          fontSize: "0.73rem !important",
                          fontFamily: '"Space Grotesk", sans-serif !important',
                          width: 32,
                          py: "7px",
                        }}
                      >
                        {i + 1}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: `${C.text100} !important`,
                          fontSize: "0.81rem !important",
                          fontWeight: "600 !important",
                          fontFamily: '"Space Grotesk", sans-serif !important',
                          py: "7px",
                        }}
                      >
                        {u.username}
                      </TableCell>
                      <TableCell sx={{ py: "7px" }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box
                            sx={{
                              flex: 1,
                              height: 4,
                              borderRadius: 99,
                              bgcolor: C.char400,
                              overflow: "hidden",
                              maxWidth: 80,
                            }}
                          >
                            <Box
                              sx={{
                                height: "100%",
                                borderRadius: 99,
                                width: `${Math.round((u.sessions / (topUsers[0]?.sessions || 1)) * 100)}%`,
                                bgcolor: C.cyan,
                                transition: "width 0.5s ease",
                              }}
                            />
                          </Box>
                          <Typography
                            sx={{
                              color: `${C.cyan} !important`,
                              fontSize: "0.78rem !important",
                              fontWeight: "700 !important",
                              fontFamily:
                                '"Space Grotesk", sans-serif !important',
                            }}
                          >
                            {u.sessions}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography
              sx={{
                color: C.text500,
                fontSize: "0.8rem",
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              No session data available
            </Typography>
          )}
        </Panel>
      </Box>

      {/* ══ ROW 5 — SESSION SUMMARY ══ */}
      <Box mt={2.5}>
        <Panel
          title="Session Health Summary"
          sub="Authentication system overview"
          color={C.emerald}
        >
          <Box
            display="grid"
            gridTemplateColumns={{
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4,1fr)",
            }}
            gap={2}
          >
            {[
              { label: "Total Sessions", value: totalSessions, color: C.cyan },
              { label: "Active", value: activeSessions, color: C.emerald },
              { label: "Revoked", value: revokedSessions, color: C.rose },
              {
                label: "Health Score",
                value: `${healthPct}%`,
                color: healthPct > 60 ? C.emerald : C.amber,
              },
              { label: "Admin Users", value: adminUsers, color: C.violet },
              { label: "Blocked Users", value: blockedUsers, color: C.rose },
              {
                label: "Sessions / User",
                value: totalUsers ? Math.round(totalSessions / totalUsers) : 0,
                color: C.amber,
              },
              { label: "Last 30 Days", value: last30Days, color: C.red },
            ].map(({ label, value, color }) => (
              <Box
                key={label}
                sx={{
                  bgcolor: C.char700,
                  border: `1px solid ${C.char400}`,
                  borderRadius: "10px",
                  p: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.4,
                }}
              >
                <Typography
                  sx={{
                    color: C.text500,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.09em",
                    fontFamily: '"Space Grotesk", sans-serif',
                  }}
                >
                  {label}
                </Typography>
                <Typography
                  sx={{
                    color,
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    lineHeight: 1.1,
                    fontFamily: '"Space Grotesk", sans-serif',
                  }}
                >
                  {value}
                </Typography>
              </Box>
            ))}
          </Box>
        </Panel>
      </Box>
    </Box>
  );
};

export default ReportsPage;
