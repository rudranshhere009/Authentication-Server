import { useState, useRef, useEffect } from "react";
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
  const containerRef = useRef(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const x = Math.max(-1, Math.min(1, (e.clientX - cx) / cx));
      const y = Math.max(-1, Math.min(1, (e.clientY - cy) / cy));
      setParallax({ x, y });
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

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
      ref={containerRef}
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

      {/* Background spectral blobs (parallax + smooth motion) */}
      <Box aria-hidden sx={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
        {/* Warm blob (parallax wrapper) */}
        <Box sx={{ position: "absolute", top: -220, left: -140, willChange: 'transform', transform: `translate3d(${parallax.x * 20}px, ${parallax.y * 10}px, 0)` }}>
          <Box sx={{ width: 900, height: 900, filter: "blur(60px)", opacity: 0.35, animation: "blobA 18s ease-in-out infinite alternate" , background: "radial-gradient(closest-side, rgba(255,0,128,0.7), rgba(255,120,0,0.5), transparent 70%)" }} />
        </Box>
        {/* Cool blob (parallax wrapper) */}
        <Box sx={{ position: "absolute", bottom: -180, right: -160, willChange: 'transform', transform: `translate3d(${parallax.x * -16}px, ${parallax.y * -12}px, 0)` }}>
          <Box sx={{ width: 800, height: 800, filter: "blur(70px)", opacity: 0.33, animation: "blobB 22s ease-in-out infinite alternate" , background: "radial-gradient(closest-side, rgba(0,208,255,0.7), rgba(124,58,237,0.55), transparent 70%)" }} />
        </Box>
        {/* Spectral band */}
        <Box sx={{ position: "absolute", left: "-10%", right: "-10%", bottom: -140, height: 380, filter: "blur(14px)", opacity: 0.45, background: "radial-gradient(120% 60% at 10% 80%, rgba(0,140,255,0.7) 0%, rgba(255,0,204,0.55) 35%, rgba(255,180,0,0.45) 60%, transparent 75%)", animation: "spectralPan 30s linear infinite alternate" }} />
      </Box>

      <style>{`
        @keyframes blobA {
          0% { transform: translate3d(0,0,0) scale(1); }
          100% { transform: translate3d(60px, 40px, 0) scale(1.06); }
        }
        @keyframes blobB {
          0% { transform: translate3d(0,0,0) scale(1); }
          100% { transform: translate3d(-40px, -30px, 0) scale(1.08); }
        }
        @keyframes spectralPan {
          0% { transform: translateX(0) scale(1); }
          100% { transform: translateX(6%) scale(1.04); }
        }
      `}</style>

      

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
              willChange: 'transform',
              transform: `perspective(1000px) rotateX(${parallax.y * -2}deg) rotateY(${parallax.x * 2}deg)`,
              transition: 'transform 0.06s linear',
              boxShadow: '0 30px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.35)',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: `radial-gradient(800px 200px at 50% -10%, rgba(220,38,38,0.20), transparent 50%)`,
                pointerEvents: 'none',
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                inset: 0,
                boxShadow: 'inset 0 0 80px rgba(0,0,0,0.22)'
              },
            }}
          >
            {/* Glass header controls like reference */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', mb: 1.25 }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '999px', p: 0.5 }}>
                <Box sx={{ px: 1.5, py: 0.5, color: C.text100, fontWeight: 700, fontSize: '0.82rem', bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '999px', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}>Sign in</Box>
              </Box>
            </Box>

            <Typography sx={{ color: C.text100, fontWeight: 900, fontSize: '1.5rem', mb: 1 }}>
              Administrator access
            </Typography>
            <Typography sx={{ color: C.text500, fontSize: '0.84rem', mb: 2 }}>
              Role-based access · JWT revocation · analytics
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
              <Button onClick={() => setOpenChooser(true)} variant="contained" sx={{ borderRadius: '10px', px: 2.4, py: 1.1, fontWeight: 800, color: '#111', background: 'linear-gradient(180deg, #ffffff, #dcdcdc)', boxShadow: '0 6px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.75)', '&:hover': { background: 'linear-gradient(180deg, #f5f5f5, #cfcfcf)' } }}>
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
