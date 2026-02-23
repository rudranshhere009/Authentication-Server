import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FilterListIcon from "@mui/icons-material/FilterList";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DangerousIcon from "@mui/icons-material/Dangerous";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

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

const API_URL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.REACT_APP_API_URL ||
  "http://localhost:8080";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function getSeverity(description) {
  const d = description?.toLowerCase() || "";
  if (d.includes("concurrent") || d.includes("multiple")) return "high";
  if (d.includes("failed") || d.includes("invalid")) return "medium";
  return "low";
}

const severityMeta = {
  high: { label: "HIGH", color: C.rose, bg: "rgba(244,63,94,0.12)", icon: DangerousIcon },
  medium: { label: "MED", color: C.amber, bg: "rgba(245,158,11,0.12)", icon: ErrorOutlineIcon },
  low: { label: "LOW", color: C.cyan, bg: "rgba(34,211,238,0.1)", icon: WarningAmberIcon },
};

const StatPill = ({ icon: Icon, label, value, color }) => (
  <Box
    sx={{
      bgcolor: `${color}10`,
      border: `1px solid ${color}28`,
      borderRadius: "12px",
      px: 2.5,
      py: 1.5,
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      minWidth: 130,
      position: "relative",
      overflow: "hidden",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
      },
    }}
  >
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: "9px",
        bgcolor: `${color}15`,
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
          fontSize: "0.62rem",
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontFamily: '"Space Grotesk", sans-serif',
        }}
      >
        {label}
      </Typography>
    </Box>
  </Box>
);

const AnomalyRow = ({ anomaly, index }) => {
  const sev = getSeverity(anomaly.description);
  const meta = severityMeta[sev];
  const Icon = meta.icon;

  return (
    <TableRow
      sx={{
        "&:hover": { bgcolor: "rgba(220,38,38,0.04) !important" },
        transition: "background 0.15s",
        animation: "fadeUp 0.3s ease-out",
        "@keyframes fadeUp": {
          from: { opacity: 0, transform: "translateY(6px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        animationDelay: `${index * 30}ms`,
        animationFillMode: "both",
      }}
    >
      {/* # */}
      <TableCell
        sx={{
          color: `${C.text500} !important`,
          fontSize: "0.75rem !important",
          fontFamily: '"Space Grotesk", sans-serif !important',
          width: 50,
        }}
      >
        {index + 1}
      </TableCell>

      {/* Severity */}
      <TableCell sx={{ width: 90 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            bgcolor: meta.bg,
            border: `1px solid ${meta.color}30`,
            borderRadius: "7px",
            px: 1,
            py: 0.35,
          }}
        >
          <Icon sx={{ fontSize: 12, color: meta.color }} />
          <Typography
            sx={{
              color: meta.color,
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            {meta.label}
          </Typography>
        </Box>
      </TableCell>

      {/* User */}
      <TableCell sx={{ width: 160 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: "7px",
              bgcolor: `${C.violet}15`,
              border: `1px solid ${C.violet}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <PersonIcon sx={{ fontSize: 13, color: C.violet }} />
          </Box>
          <Typography
            sx={{
              color: `${C.text100} !important`,
              fontSize: "0.83rem !important",
              fontWeight: "600 !important",
              fontFamily: '"Space Grotesk", sans-serif !important',
            }}
          >
            {anomaly.username || "Unknown"}
          </Typography>
        </Box>
      </TableCell>

      {/* Description */}
      <TableCell>
        <Typography
          sx={{
            color: `${C.text300} !important`,
            fontSize: "0.81rem !important",
            fontFamily: '"Space Grotesk", sans-serif !important',
          }}
        >
          {anomaly.description}
        </Typography>
      </TableCell>

      {/* Time */}
      <TableCell sx={{ width: 160, whiteSpace: "nowrap" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.2 }}>
          <Typography
            sx={{
              color: `${C.text300} !important`,
              fontSize: "0.78rem !important",
              fontFamily: '"Space Grotesk", sans-serif !important',
            }}
          >
            {new Date(anomaly.created_at).toLocaleString()}
          </Typography>
          <Typography
            sx={{
              color: `${C.text500} !important`,
              fontSize: "0.7rem !important",
              fontFamily: '"Space Grotesk", sans-serif !important',
            }}
          >
            {timeAgo(anomaly.created_at)}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};

const AnomaliesPage = () => {
  const navigate = useNavigate();
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchAnomalies = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/admin/anomalies`);
      if (!res.ok) throw new Error("Failed to fetch anomalies");
      const data = await res.json();
      setAnomalies(Array.isArray(data) ? data : []);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnomalies();
    const iv = setInterval(fetchAnomalies, 30000);
    return () => clearInterval(iv);
  }, []);

  const filtered = useMemo(() => {
    return anomalies.filter((a) => {
      const matchSearch =
        !search ||
        a.username?.toLowerCase().includes(search.toLowerCase()) ||
        a.description?.toLowerCase().includes(search.toLowerCase());
      const sev = getSeverity(a.description);
      const matchSev = severityFilter === "all" || sev === severityFilter;
      return matchSearch && matchSev;
    });
  }, [anomalies, search, severityFilter]);

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const stats = useMemo(() => {
    const high = anomalies.filter((a) => getSeverity(a.description) === "high").length;
    const medium = anomalies.filter((a) => getSeverity(a.description) === "medium").length;
    const low = anomalies.filter((a) => getSeverity(a.description) === "low").length;
    const last24h = anomalies.filter(
      (a) => Date.now() - new Date(a.created_at).getTime() < 86400000
    ).length;
    return { high, medium, low, last24h, total: anomalies.length };
  }, [anomalies]);

  const uniqueUsers = useMemo(
    () => [...new Set(anomalies.map((a) => a.username).filter(Boolean))],
    [anomalies]
  );

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 0.5 }}>
            <Box
              sx={{
                width: 30,
                height: 30,
                borderRadius: "8px",
                background: `linear-gradient(135deg, ${C.amber} 0%, #D97706 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px rgba(245,158,11,0.4)`,
              }}
            >
              <WarningAmberIcon sx={{ fontSize: 16, color: "#fff" }} />
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
              Anomaly Logs
            </Typography>
            {stats.total > 0 && (
              <Chip
                label={`${stats.total} total`}
                size="small"
                sx={{
                  bgcolor: `${C.amber}15`,
                  color: C.amber,
                  border: `1px solid ${C.amber}30`,
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  height: 22,
                  fontFamily: '"Space Grotesk", sans-serif',
                }}
              />
            )}
          </Box>
          <Typography
            sx={{
              color: C.text500,
              fontSize: "0.78rem",
              fontFamily: '"Space Grotesk", sans-serif',
            }}
          >
            Concurrent logins & suspicious activity · auto-refreshes every 30s
          </Typography>
        </Box>

        {/* Controls */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography
            sx={{
              color: C.text500,
              fontSize: "0.68rem",
              fontFamily: '"Space Grotesk", sans-serif',
              display: { xs: "none", sm: "block" },
            }}
          >
            Last: {lastRefresh.toLocaleTimeString()}
          </Typography>
          <Tooltip title="Refresh">
            <IconButton
              onClick={fetchAnomalies}
              disabled={loading}
              sx={{
                width: 34,
                height: 34,
                borderRadius: "8px",
                bgcolor: C.char600,
                border: `1px solid ${C.char400}`,
                color: C.text300,
                "&:hover": { borderColor: C.red, color: C.redLt },
              }}
            >
              {loading ? (
                <CircularProgress size={14} sx={{ color: C.red }} />
              ) : (
                <RefreshIcon sx={{ fontSize: 17 }} />
              )}
            </IconButton>
          </Tooltip>
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
      </Box>

      {/* ── STAT PILLS ── */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 3, flexWrap: "wrap" }}>
        <StatPill icon={WarningAmberIcon} label="Total" value={stats.total} color={C.amber} />
        <StatPill icon={DangerousIcon} label="High Severity" value={stats.high} color={C.rose} />
        <StatPill icon={ErrorOutlineIcon} label="Medium" value={stats.medium} color={C.amber} />
        <StatPill icon={CheckCircleOutlineIcon} label="Low" value={stats.low} color={C.cyan} />
        <StatPill icon={TrendingUpIcon} label="Last 24h" value={stats.last24h} color={C.red} />
      </Box>

      {/* ── RECENT TREND MINI-BAR ── */}
      {anomalies.length > 0 && (
        <Box
          sx={{
            bgcolor: C.char600,
            border: `1px solid ${C.char400}`,
            borderRadius: "12px",
            p: "14px 18px",
            mb: 2.5,
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: "2px",
              background: `linear-gradient(90deg, ${C.amber} 0%, ${C.rose} 50%, transparent 100%)`,
            },
          }}
        >
          <Typography
            sx={{
              color: C.text300,
              fontSize: "0.72rem",
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 600,
              mb: 1.25,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Activity by affected user
          </Typography>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {uniqueUsers.slice(0, 12).map((u) => {
              const count = anomalies.filter((a) => a.username === u).length;
              const hasHigh = anomalies.some(
                (a) => a.username === u && getSeverity(a.description) === "high"
              );
              const color = hasHigh ? C.rose : C.amber;
              return (
                <Box
                  key={u}
                  onClick={() => setSearch(u)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    bgcolor: `${color}10`,
                    border: `1px solid ${color}28`,
                    borderRadius: "8px",
                    px: 1.25,
                    py: 0.5,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    "&:hover": { bgcolor: `${color}20`, borderColor: `${color}50` },
                  }}
                >
                  <PersonIcon sx={{ fontSize: 11, color }} />
                  <Typography
                    sx={{
                      color,
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      fontFamily: '"Space Grotesk", sans-serif',
                    }}
                  >
                    {u}
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: `${color}25`,
                      borderRadius: "50%",
                      width: 16,
                      height: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        color,
                        fontSize: "0.6rem",
                        fontWeight: 800,
                        fontFamily: '"Space Grotesk", sans-serif',
                      }}
                    >
                      {count}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* ── FILTER BAR ── */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mb: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          placeholder="Search user or description…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 16, color: C.text500 }} />
              </InputAdornment>
            ),
            sx: {
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: "0.83rem",
              bgcolor: C.char600,
              borderRadius: "9px",
              "& fieldset": { borderColor: C.char400 },
              "&:hover fieldset": { borderColor: C.red },
              "&.Mui-focused fieldset": { borderColor: C.red },
            },
          }}
          sx={{ flexGrow: 1, maxWidth: 360 }}
        />

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <FilterListIcon sx={{ fontSize: 15, color: C.text500 }} />
          <FormControl size="small" sx={{ minWidth: 130 }}>
            <Select
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value);
                setPage(0);
              }}
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: "0.82rem",
                bgcolor: C.char600,
                borderRadius: "9px",
                "& fieldset": { borderColor: C.char400 },
                "&:hover fieldset": { borderColor: C.red },
                "&.Mui-focused fieldset": { borderColor: C.red },
                "& .MuiSelect-select": {
                  py: "7px",
                  fontFamily: '"Space Grotesk", sans-serif',
                },
              }}
            >
              <MenuItem value="all">All Severities</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {(search || severityFilter !== "all") && (
          <Box
            onClick={() => {
              setSearch("");
              setSeverityFilter("all");
              setPage(0);
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              bgcolor: C.char600,
              border: `1px solid ${C.char400}`,
              borderRadius: "9px",
              px: 1.25,
              py: 0.65,
              cursor: "pointer",
              color: C.text500,
              fontSize: "0.75rem",
              fontFamily: '"Space Grotesk", sans-serif',
              "&:hover": { borderColor: C.red, color: C.redLt },
            }}
          >
            ✕ Clear
          </Box>
        )}

        <Typography
          sx={{
            color: C.text500,
            fontSize: "0.72rem",
            fontFamily: '"Space Grotesk", sans-serif',
            ml: "auto",
          }}
        >
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </Typography>
      </Box>

      {/* ── TABLE ── */}
      <Box
        sx={{
          bgcolor: C.char600,
          border: `1px solid ${C.char400}`,
          borderRadius: "14px",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "2px",
            background: `linear-gradient(90deg, ${C.red} 0%, ${C.amber} 50%, transparent 100%)`,
          },
        }}
      >
        {error ? (
          <Box sx={{ p: 5, textAlign: "center" }}>
            <ErrorOutlineIcon sx={{ fontSize: 36, color: C.rose, mb: 1 }} />
            <Typography
              sx={{
                color: C.rose,
                fontSize: "0.88rem",
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              {error}
            </Typography>
          </Box>
        ) : loading && anomalies.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1.5,
              py: 6,
            }}
          >
            <CircularProgress size={20} sx={{ color: C.red }} />
            <Typography
              sx={{
                color: C.text500,
                fontSize: "0.84rem",
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              Loading anomaly logs…
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ bgcolor: "transparent", boxShadow: "none" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {["#", "Severity", "User", "Description", "Timestamp"].map((h) => (
                      <TableCell
                        key={h}
                        sx={{
                          bgcolor: `${C.char700} !important`,
                          color: `${C.redLt} !important`,
                          fontWeight: "700 !important",
                          fontSize: "0.7rem !important",
                          textTransform: "uppercase !important",
                          letterSpacing: "0.09em !important",
                          borderBottom: `1px solid ${C.char400} !important`,
                          fontFamily: '"Space Grotesk", sans-serif !important',
                          py: "10px",
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginated.length > 0 ? (
                    paginated.map((a, i) => (
                      <AnomalyRow key={a.id} anomaly={a} index={i} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6, border: "none" }}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <CheckCircleOutlineIcon sx={{ fontSize: 36, color: C.emerald }} />
                          <Typography
                            sx={{
                              color: C.text300,
                              fontSize: "0.88rem",
                              fontFamily: '"Space Grotesk", sans-serif',
                              fontWeight: 600,
                            }}
                          >
                            No anomalies found
                          </Typography>
                          <Typography
                            sx={{
                              color: C.text500,
                              fontSize: "0.75rem",
                              fontFamily: '"Space Grotesk", sans-serif',
                            }}
                          >
                            {search || severityFilter !== "all"
                              ? "Try adjusting your filters"
                              : "System looks clean"}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {filtered.length > rowsPerPage && (
              <TablePagination
                component="div"
                count={filtered.length}
                page={page}
                onPageChange={(_, p) => setPage(p)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[10, 15, 25, 50]}
                labelRowsPerPage="Rows:"
                showFirstButton
                showLastButton
                sx={{
                  color: C.text300,
                  borderTop: `1px solid ${C.char400}`,
                  fontFamily: '"Space Grotesk", sans-serif',
                  "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                    color: C.text300,
                    fontSize: "0.78rem",
                    fontFamily: '"Space Grotesk", sans-serif',
                  },
                  "& .MuiTablePagination-select": { color: C.text100 },
                  "& .MuiIconButton-root": { color: C.text300 },
                  "& .MuiIconButton-root:hover": { color: C.red, bgcolor: C.redGlow },
                  "& .MuiIconButton-root.Mui-disabled": { color: C.text500 },
                }}
              />
            )}
          </>
        )}
      </Box>

      {/* ── SEVERITY LEGEND ── */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          mt: 2,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            color: C.text500,
            fontSize: "0.68rem",
            fontFamily: '"Space Grotesk", sans-serif',
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          Legend:
        </Typography>
        {Object.entries(severityMeta).map(([key, meta]) => (
          <Box
            key={key}
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: meta.color,
              }}
            />
            <Typography
              sx={{
                color: C.text500,
                fontSize: "0.7rem",
                fontFamily: '"Space Grotesk", sans-serif',
              }}
            >
              {meta.label} — {key === "high" ? "Concurrent logins" : key === "medium" ? "Auth failures" : "Other flags"}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AnomaliesPage;
