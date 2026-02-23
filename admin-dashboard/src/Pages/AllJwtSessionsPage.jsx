import { Box, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SecurityIcon from "@mui/icons-material/Security";
import BoltIcon from "@mui/icons-material/Bolt";
import JwtSessionsTable from "../Components/tables/JwtSessionsTable";

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
};

const StatPill = ({ label, value, color = C.orange }) => (
  <Box
    sx={{
      bgcolor: `${color}12`,
      border: `1px solid ${color}30`,
      borderRadius: "10px",
      px: 2,
      py: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minWidth: 90,
    }}
  >
    <Typography
      sx={{
        color,
        fontSize: "1.35rem",
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
        fontSize: "0.65rem",
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        mt: 0.4,
      }}
    >
      {label}
    </Typography>
  </Box>
);

const AllJwtSessionsPage = ({
  title,
  jwtSessions,
  jwtTotal,
  jwtLoading,
  fetchJwtSessionsPage,
  onRevokeSession,
  isLoading,
}) => {
  const navigate = useNavigate();

  const activeSessions = (jwtSessions || []).filter((s) => s.is_active).length;
  const revokedSessions = (jwtSessions || []).filter(
    (s) => !s.is_active,
  ).length;
  const healthPct =
    jwtTotal > 0 ? Math.round((activeSessions / jwtTotal) * 100) : 0;

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2.5, md: 3 }, pb: 4 }}>
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
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.4 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: "8px",
                background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDk} 100%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px rgba(220,38,38,0.35)`,
              }}
            >
              <SecurityIcon sx={{ fontSize: 15, color: "#fff" }} />
            </Box>
            <Typography
              sx={{
                fontFamily: '"Orbitron", sans-serif',
                fontWeight: 800,
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                color: C.text100,
                letterSpacing: "-0.3px",
              }}
            >
              JWT Sessions
            </Typography>
          </Box>
          <Typography sx={{ color: C.text500, fontSize: "0.78rem" }}>
            All authentication tokens · manage & revoke access
          </Typography>
        </Box>

        {/* Back button */}
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
            transition: "all 0.15s",
            "&:hover": { borderColor: C.orange, color: C.orangeLt },
          }}
        >
          ← Dashboard
        </Box>
      </Box>

      {/* ── STAT PILLS ── */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          mb: 3,
          flexWrap: "wrap",
        }}
      >
        <StatPill label="Total" value={jwtTotal ?? "—"} color={C.orange} />
        <StatPill label="Active" value={activeSessions} color={C.emerald} />
        <StatPill label="Revoked" value={revokedSessions} color={C.rose} />
        <StatPill
          label="Health"
          value={`${healthPct}%`}
          color={healthPct > 60 ? C.emerald : C.amber}
        />
      </Box>

      {/* ── TABLE PANEL ── */}
      <Box
        sx={{
          bgcolor: C.char600,
          border: `1px solid ${C.char400}`,
          borderRadius: "14px",
          p: { xs: "16px 14px", sm: "22px 24px" },
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
        {/* Panel header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2.5,
            flexWrap: "wrap",
            gap: 1.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 3,
                height: 20,
                borderRadius: 99,
                bgcolor: C.orange,
                flexShrink: 0,
              }}
            />
            <Box>
              <Typography
                sx={{
                  color: C.text100,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                {title || "All JWT Sessions"}
              </Typography>
              <Typography
                sx={{ color: C.text500, fontSize: "0.7rem", mt: 0.15 }}
              >
                {jwtTotal !== undefined
                  ? `${jwtTotal} total records`
                  : "Loading…"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Live badge */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.6,
                bgcolor: `${C.emerald}12`,
                border: `1px solid ${C.emerald}30`,
                borderRadius: "8px",
                px: 1.25,
                py: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  bgcolor: C.emerald,
                  animation: "livePulse 2s infinite",
                  "@keyframes livePulse": {
                    "0%": { opacity: 1 },
                    "50%": { opacity: 0.35 },
                    "100%": { opacity: 1 },
                  },
                }}
              />
              <Typography
                sx={{
                  color: C.emerald,
                  fontSize: "0.7rem",
                  fontWeight: 600,
                }}
              >
                Live
              </Typography>
            </Box>

            <Chip
              icon={
                <BoltIcon
                  sx={{
                    fontSize: "13px !important",
                    color: `${C.orangeLt} !important`,
                  }}
                />
              }
              label="JWT Auth"
              size="small"
              sx={{
                bgcolor: `${C.orange}12`,
                color: C.orangeLt,
                border: `1px solid ${C.orange}35`,
                fontSize: "0.68rem",
                fontWeight: 600,
                height: 26,
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          </Box>
        </Box>

        {/* Divider */}
        <Box
          sx={{
            height: "1px",
            bgcolor: C.char400,
            mb: 2,
            mx: -3,
          }}
        />

        {/* Table */}
        <JwtSessionsTable
          title=""
          jwtsessions={jwtSessions}
          onRevokeSession={onRevokeSession}
          isLoading={isLoading}
          total={jwtTotal}
          fetchpage={fetchJwtSessionsPage}
          jwtLoading={jwtLoading}
        />
      </Box>
    </Box>
  );
};

export default AllJwtSessionsPage;
