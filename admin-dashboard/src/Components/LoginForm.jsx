import { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import { VisibilityOff, Visibility } from "@mui/icons-material";

import "../index.css";

const C = {
  red: "#DC2626",
  redLt: "#EF4444",
  redDk: "#B91C1C",
  redGlow: "rgba(220,38,38,0.16)",
  char600: "#161B22",
  char700: "#0F1117",
  char500: "#1C2128",
  char400: "#2D333B",
  text100: "#F0F6FC",
  text300: "#8B949E",
  text500: "#484F58",
};

function LoginForm({ handleLogin, error, isLoading }) {
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(adminUser, adminPass);
  };

  const fieldSx = {
    "& .MuiOutlinedInput-root": {
      bgcolor: C.char700,
      borderRadius: "12px",
      fontFamily: '"Space Grotesk", sans-serif',
      "& fieldset": { borderColor: C.char400 },
      "&:hover fieldset": { borderColor: C.red },
      "&.Mui-focused fieldset": {
        borderColor: C.red,
        boxShadow: `0 0 0 4px ${C.redGlow}`,
      },
    },
    "& .MuiInputLabel-root": {
      color: C.text500,
      fontFamily: '"Space Grotesk", sans-serif',
    },
    "& .MuiInputLabel-root.Mui-focused": { color: C.redLt },
    "& .MuiInputBase-input": {
      color: C.text100,
      fontFamily: '"Space Grotesk", sans-serif',
    },
    "& .MuiIconButton-root": {
      color: C.text500,
      "&:hover": { color: C.redLt },
    },
  };

  return (
    <Box
      sx={{
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: C.char700,
        background: `radial-gradient(1200px 600px at 85% -10%, rgba(220,38,38,0.18), transparent 60%),\n                    radial-gradient(900px 400px at -10% 110%, rgba(239,68,68,0.10), transparent 60%),\n                    linear-gradient(135deg, #010409 0%, #0D1117 100%)`,
      }}
    >
      {/* Top Navigation */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 2, md: 4 },
          borderBottom: `1px solid ${C.char400}`,
          background: "linear-gradient(180deg, rgba(13,17,23,0.8), rgba(13,17,23,0.2))",
          backdropFilter: "blur(6px)",
          zIndex: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            className="logobox"
            sx={{
              width: 34,
              height: 34,
              borderRadius: "9px",
              background: `linear-gradient(135deg, ${C.red} 0%, ${C.redDk} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 6px 22px rgba(220,38,38,0.45)`,
              flexShrink: 0,
            }}
          >
            <Box component="span" sx={{ fontSize: 16, color: "#fff" }}>⚡</Box>
          </Box>
          <Typography
            sx={{
              fontFamily: '"Orbitron", sans-serif',
              fontWeight: 800,
              letterSpacing: 2,
              color: C.text100,
            }}
          >
            APEX
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 } }>
          <Chip label="Docs" size="small" sx={{ bgcolor: "#0b0f14", border: `1px solid ${C.char400}`, color: C.text300 }} />
          <Chip label="Status: Operational" size="small" sx={{ bgcolor: "#0b0f14", border: `1px solid ${C.char400}`, color: "#22c55e" }} />
          <Chip label="Support" size="small" sx={{ bgcolor: "#0b0f14", border: `1px solid ${C.char400}`, color: C.text300 }} />
        </Box>
      </Box>

      {/* Subtle grid pattern */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "26px 26px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,1) 40%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Red matrix particles (CSS-only) */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        {Array.from({ length: 28 }).map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 100}%`,
              width: 1.2,
              height: `${Math.random() * 60 + 20}px`,
              bgcolor: i % 3 === 0 ? C.red : C.redLt,
              opacity: 0.12 + (i % 5) * 0.04,
              filter: "blur(0.4px)",
              transform: "translateZ(0)",
              animation: `${i % 2 === 0 ? 'fallSlow' : 'fallFast'} ${4 + (i % 7)}s linear ${i * 0.3}s infinite` ,
            }}
          />
        ))}
      </Box>

      <style>{`
        @keyframes fallSlow {
          0% { transform: translate3d(0,-120px,0); opacity: 0; }
          10% { opacity: .25; }
          100% { transform: translate3d(0,140vh,0); opacity: 0; }
        }
        @keyframes fallFast {
          0% { transform: translate3d(0,-200px,0); opacity: 0; }
          10% { opacity: .3; }
          100% { transform: translate3d(0,180vh,0); opacity: 0; }
        }
      `}</style>

      {/* Accent beams */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: { xs: 120, md: 100 },
          right: -120,
          width: 420,
          height: 2,
          transform: "rotate(-12deg)",
          background: `linear-gradient(90deg, transparent, ${C.red}, transparent)`,
          filter: "blur(0.6px)",
          opacity: 0.7,
          zIndex: 1,
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          bottom: 140,
          left: -160,
          width: 520,
          height: 2,
          transform: "rotate(18deg)",
          background: `linear-gradient(90deg, transparent, ${C.redLt}, transparent)`,
          filter: "blur(0.6px)",
          opacity: 0.5,
          zIndex: 1,
        }}
      />

      {/* Noise overlay */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Centered container */}
      <Box sx={{ width: "100%", maxWidth: 1200, mt: { xs: 6, md: 8 }, px: 2, position: "relative", zIndex: 4 }}>
        {/* Headline band (compact to avoid scrolling) */}
        <Box sx={{ display: { xs: "none", lg: "block" }, mb: 2 }}>
          <Typography sx={{ color: C.text500, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            Enterprise Identity & Access Platform
          </Typography>
          <Typography sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 900, fontSize: { lg: "2rem" }, color: C.text100, letterSpacing: "0.5px", mt: 0.25 }}>
            Secure authentication for modern organizations
          </Typography>
        </Box>

        {/* Main layout: centered card */}
        <Box sx={{ display: "flex", alignItems: "stretch", justifyContent: "center", gap: 3, flexWrap: "nowrap" }}>
          {/* Auth Card */}
          <Box
            sx={{
              width: 460,
              flexShrink: 0,
              bgcolor: C.char600,
              border: `1px solid ${C.char400}`,
              borderRadius: "18px",
              p: 4,
              position: "relative",
              boxShadow: "0 28px 90px rgba(0,0,0,0.85), 0 0 0 1px rgba(220,38,38,0.08)",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 2,
                background: `linear-gradient(90deg, ${C.red} 0%, ${C.redLt} 40%, transparent 100%)`,
              },
            }}
          >
            {/* Brand */}
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3.5, gap: 1.25 }}>
              <Box
                sx={{
                  width: 62,
                  height: 62,
                  borderRadius: "16px",
                  background: `linear-gradient(135deg, ${C.red} 0%, ${C.redDk} 100%)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: `0 10px 36px rgba(220,38,38,0.55)`,
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: -3,
                    borderRadius: "18px",
                    border: `1px solid rgba(220,38,38,0.3)`,
                  },
                }}
              >
                <Box component="span" sx={{ fontSize: "2rem", lineHeight: 1, color: "#fff" }}>⚡</Box>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography sx={{ fontWeight: 900, fontSize: "1.6rem", color: C.text100, letterSpacing: "3px", fontFamily: '"Orbitron", sans-serif' }}>
                  APEX
                </Typography>
                <Typography sx={{ color: C.text500, fontSize: "0.78rem", mt: 0.4, fontFamily: '"Space Grotesk", sans-serif', letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Auth Platform
                </Typography>
              </Box>
            </Box>

            <Typography sx={{ color: C.text300, fontSize: "0.85rem", mb: 2.5, textAlign: "center", fontFamily: '"Space Grotesk", sans-serif' }}>
              Sign in to the administrator portal
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.2 }}>
              <TextField
                label="Username"
                variant="outlined"
                value={adminUser}
                onChange={(e) => setAdminUser(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="username"
                fullWidth
                sx={fieldSx}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="current-password"
                fullWidth
                sx={fieldSx}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((p) => !p)} edge="end" aria-label="toggle password">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                fullWidth
                sx={{
                  mt: 0.5,
                  py: 1.5,
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "0.98rem",
                  fontFamily: '"Space Grotesk", sans-serif',
                  letterSpacing: "0.04em",
                  background: `linear-gradient(135deg, ${C.red} 0%, ${C.redDk} 100%)`,
                  boxShadow: `0 10px 30px rgba(220,38,38,0.45)`,
                  "&:hover": {
                    background: `linear-gradient(135deg, ${C.redLt} 0%, ${C.red} 100%)`,
                    boxShadow: `0 14px 40px rgba(220,38,38,0.6)`,
                    transform: "translateY(-1px)",
                  },
                  "&:active": { transform: "translateY(0)" },
                  "&.Mui-disabled": { background: C.char700, color: C.text500, boxShadow: "none" },
                  transition: "all 0.2s ease",
                }}
              >
                {isLoading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Sign In"}
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 2.5, bgcolor: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", color: "#FDA4AF", borderRadius: "12px", "& .MuiAlert-icon": { color: "#F43F5E" } }}>
                {error}
              </Alert>
            )}

            <Divider sx={{ my: 2.5, borderColor: C.char400 }} />

            <Typography variant="caption" sx={{ display: "block", textAlign: "center", color: C.text500, mt: 2, fontSize: "0.68rem", fontFamily: '"Space Grotesk", sans-serif', letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Restricted · Administrators Only · APEX v2.0
            </Typography>
          </Box>

          {/* Right-side: Sign in with Card (frontend only) */}
          <Box sx={{ width: 420, flexShrink: 0, display: { xs: "none", md: "flex" } }}>
            <Box
              sx={{
                bgcolor: C.char600,
                border: `1px solid ${C.char400}`,
                borderRadius: "18px",
                p: 3,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                alignSelf: "stretch",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 24px 80px rgba(0,0,0,0.7)",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, ${C.redLt} 0%, transparent 70%)`,
                },
              }}
            >
              <Typography sx={{ color: C.text100, fontWeight: 800, fontSize: "1rem", letterSpacing: "0.06em" }}>
                Sign in with Card
              </Typography>
              <Typography sx={{ color: C.text500, fontSize: "0.82rem", lineHeight: 1.5 }}>
                Tap your authorized smart card on the reader to continue. Ensure your card is registered with the security team.
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                <Box
                  sx={{
                    width: 220,
                    height: 140,
                    borderRadius: '14px',
                    border: `1px dashed ${C.char400}`,
                    bgcolor: C.char700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(200px 80px at 50% 10%, ${C.redGlow}, transparent)` }} />
                  <Typography sx={{ color: C.text300, fontSize: '0.82rem' }}>Tap card here</Typography>
                </Box>
              </Box>

              <Button
                variant="outlined"
                disabled
                sx={{
                  alignSelf: 'flex-start',
                  borderColor: C.char400,
                  color: C.text300,
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: '10px',
                  px: 2,
                  '&:hover': { borderColor: C.redLt },
                }}
              >
                Configure reader (coming soon)
              </Button>

              <Typography sx={{ color: C.text500, fontSize: '0.72rem' }}>
                This option is available for authorized admins with provisioned cards. Backend integration will be added later.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Compact footer to avoid scroll */}
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Chip label="ISO 27001" size="small" sx={{ bgcolor: "#0b0f14", border: `1px solid ${C.char400}`, color: C.text300 }} />
          <Chip label="SOC 2" size="small" sx={{ bgcolor: "#0b0f14", border: `1px solid ${C.char400}`, color: C.text300 }} />
          <Chip label="GDPR-ready" size="small" sx={{ bgcolor: "#0b0f14", border: `1px solid ${C.char400}`, color: C.text300 }} />
        </Box>
      </Box>
    </Box>
  );
}

export default LoginForm;
