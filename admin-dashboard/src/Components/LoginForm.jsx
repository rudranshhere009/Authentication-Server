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

  // Welcome -> chooser -> specific modals
  const [openChooser, setOpenChooser] = useState(false);
  const [openPassModal, setOpenPassModal] = useState(false);
  const [openCardModal, setOpenCardModal] = useState(false);

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
        {/* Minimal header removed for a cleaner, glass-card focus */}
        <Box sx={{ display: 'none' }} />

        {/* Centered Minimal Glass Card */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            sx={{
              width: 720,
              maxWidth: '92vw',
              borderRadius: '20px',
              p: 3,
              position: 'relative',
              overflow: 'hidden',
              background: 'rgba(22,27,34,0.55)',
              border: `1px solid ${C.char400}`,
              boxShadow: '0 30px 100px rgba(0,0,0,0.8)',
              backdropFilter: 'blur(10px)',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(800px 200px at 50% -10%, rgba(220,38,38,0.20), transparent 50%)`,
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.25 }}>
              <Box sx={{ width: 34, height: 34, borderRadius: '10px', background: `linear-gradient(135deg, ${C.red} 0%, ${C.redDk} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 22px rgba(220,38,38,0.45)` }}>
                <Box component="span" sx={{ fontSize: 16, color: '#fff' }}>⚡</Box>
              </Box>
              <Typography sx={{ fontFamily: '"Orbitron", sans-serif', fontWeight: 800, letterSpacing: 2, color: C.text100 }}>APEX</Typography>
            </Box>

            <Typography sx={{ color: C.text100, fontWeight: 900, fontSize: '1.6rem', mb: 1 }}>
              Secure authentication for modern organizations
            </Typography>
            <Typography sx={{ color: C.text500, fontSize: '0.85rem', mb: 2 }}>
              Role-based access · JWT · revocation · analytics · zero-trust ready
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.25, mb: 2 }}>
              {[{h:'Enterprise-grade controls',p:'RBAC, session intel, anomaly detection.'},{h:'Modern authentication',p:'JWT, revocation, short-lived tokens.'},{h:'Operational excellence',p:'Dashboards, alerts, analytics.'},{h:'Hardened platform',p:'Encryption, secure defaults, audits.'}].map((f,i)=> (
                <Box key={i} sx={{ bgcolor: 'rgba(13,17,23,0.55)', border: `1px solid ${C.char400}`, borderRadius: '12px', p: 1.25 }}>
                  <Typography sx={{ color: C.text100, fontWeight: 700, fontSize: '0.9rem' }}>{f.h}</Typography>
                  <Typography sx={{ color: C.text500, fontSize: '0.78rem', mt: 0.25 }}>{f.p}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Button onClick={() => setOpenChooser(true)} variant="contained" sx={{ borderRadius: '10px', px: 2.25, py: 1.1, fontWeight: 800, background: `linear-gradient(135deg, ${C.red} 0%, ${C.redDk} 100%)`, '&:hover': { background: `linear-gradient(135deg, ${C.redLt} 0%, ${C.red} 100%)` } }}>
                Let’s Go
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Chooser Modal */}
        <Box sx={{ position: 'fixed', inset: 0, display: openChooser ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
          <Box onClick={() => setOpenChooser(false)} sx={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <Box sx={{ position: 'relative', width: 680, maxWidth: '94vw', bgcolor: C.char600, border: `1px solid ${C.char400}`, borderRadius: '16px', p: 3, boxShadow: '0 24px 90px rgba(0,0,0,0.9)' }}>
            <Typography sx={{ color: C.text100, fontWeight: 800, mb: 1 }}>Choose a sign-in method</Typography>
            <Typography sx={{ color: C.text500, fontSize: '0.85rem', mb: 2 }}>Select how you want to access the administrator portal.</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              <Box onClick={() => { setOpenChooser(false); setOpenPassModal(true); }} sx={{ cursor: 'pointer', bgcolor: C.char700, border: `1px solid ${C.char400}`, borderRadius: '12px', p: 2, '&:hover': { borderColor: C.redLt } }}>
                <Typography sx={{ color: C.text100, fontWeight: 700 }}>Authorized Password</Typography>
                <Typography sx={{ color: C.text500, fontSize: '0.82rem', mt: 0.5 }}>Use your assigned admin credentials</Typography>
              </Box>
              <Box onClick={() => { setOpenChooser(false); setOpenCardModal(true); }} sx={{ cursor: 'pointer', bgcolor: C.char700, border: `1px solid ${C.char400}`, borderRadius: '12px', p: 2, '&:hover': { borderColor: C.redLt } }}>
                <Typography sx={{ color: C.text100, fontWeight: 700 }}>Card</Typography>
                <Typography sx={{ color: C.text500, fontSize: '0.82rem', mt: 0.5 }}>Tap your authorized smart card</Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Password Modal */}
        <Box sx={{ position: 'fixed', inset: 0, display: openPassModal ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}>
          <Box onClick={() => setOpenPassModal(false)} sx={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <Box sx={{ position: 'relative', width: 520, maxWidth: '92vw', bgcolor: C.char600, border: `1px solid ${C.char400}`, borderRadius: '16px', p: 3 }}>
            <Typography sx={{ color: C.text100, fontWeight: 800, mb: 1 }}>Authorized Password</Typography>
            <Typography sx={{ color: C.text500, fontSize: '0.85rem', mb: 2 }}>Enter your credentials to continue.</Typography>
            <Box component="form" onSubmit={(e) => { handleSubmit(e); }} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Username" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} required disabled={isLoading} autoComplete="username" fullWidth sx={fieldSx} />
              <TextField label="Password" type={showPassword ? 'text' : 'password'} value={adminPass} onChange={(e) => setAdminPass(e.target.value)} required disabled={isLoading} autoComplete="current-password" fullWidth sx={fieldSx} InputProps={{ endAdornment: (<InputAdornment position='end'><IconButton onClick={() => setShowPassword(p => !p)} edge='end' aria-label='toggle password'>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={() => setOpenPassModal(false)} sx={{ color: C.text300, textTransform: 'none' }}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isLoading} sx={{ fontWeight: 800, textTransform: 'none', background: `linear-gradient(135deg, ${C.red} 0%, ${C.redDk} 100%)`, '&:hover': { background: `linear-gradient(135deg, ${C.redLt} 0%, ${C.red} 100%)` } }}>{isLoading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Sign In'}</Button>
              </Box>
            </Box>
            {error && (<Alert severity="error" sx={{ mt: 2, bgcolor: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#FDA4AF', borderRadius: '12px' }}>{error}</Alert>)}
          </Box>
        </Box>

        {/* Card Modal (frontend only) */}
        <Box sx={{ position: 'fixed', inset: 0, display: openCardModal ? 'flex' : 'none', alignItems: 'center', justifyContent: 'center', zIndex: 30 }}>
          <Box onClick={() => setOpenCardModal(false)} sx={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }} />
          <Box sx={{ position: 'relative', width: 520, maxWidth: '92vw', bgcolor: C.char600, border: `1px solid ${C.char400}`, borderRadius: '16px', p: 3 }}>
            <Typography sx={{ color: C.text100, fontWeight: 800, mb: 1 }}>Sign in with Card</Typography>
            <Typography sx={{ color: C.text500, fontSize: '0.85rem', mb: 2 }}>Tap your authorized smart card on the reader to continue.</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
              <Box sx={{ width: 260, height: 160, borderRadius: '14px', border: `1px dashed ${C.char400}`, bgcolor: C.char700, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)' }}>
                <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(240px 100px at 50% 10%, ${C.redGlow}, transparent)` }} />
                <Typography sx={{ color: C.text300, fontSize: '0.9rem' }}>Tap card here</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={() => setOpenCardModal(false)} sx={{ color: C.text300, textTransform: 'none' }}>Close</Button>
              <Button disabled variant="outlined" sx={{ color: C.text300, borderColor: C.char400, textTransform: 'none', fontWeight: 700 }}>Configure reader (coming soon)</Button>
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
