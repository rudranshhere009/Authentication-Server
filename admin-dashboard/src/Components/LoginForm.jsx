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
} from "@mui/material";
import {
  VisibilityOff,
  Visibility,
  AdminPanelSettingsRounded,
  InsightsRounded,
  SecurityRounded,
  KeyRounded,
  CreditCardRounded,
} from "@mui/icons-material";

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

  const heroCardSx = {
    width: 760,
    maxWidth: "92vw",
    borderRadius: "20px",
    p: { xs: 2.2, sm: 3 },
    position: "relative",
    overflow: "hidden",
    background: "linear-gradient(180deg, rgba(12,16,24,0.28), rgba(8,10,16,0.22))",
    border: "1px solid rgba(255,255,255,0.24)",
    backdropFilter: "blur(16px)",
    animation: "heroIn 640ms cubic-bezier(.2,.7,.2,1) both",
    transition: "transform 240ms ease, border-color 240ms ease, box-shadow 240ms ease",
    boxShadow: "0 30px 100px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.3)",
    "&:hover": {
      transform: "translateY(-2px)",
      borderColor: "rgba(255,255,255,0.34)",
      boxShadow: "0 35px 105px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.32)",
    },
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background: "radial-gradient(800px 220px at 50% -10%, rgba(220,38,38,0.3), transparent 52%)",
      pointerEvents: "none",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      boxShadow: "inset 0 0 80px rgba(0,0,0,0.08)",
    },
    "& .glass-sheen": {
      position: "absolute",
      top: -30,
      left: -120,
      width: 260,
      height: "130%",
      transform: "rotate(12deg)",
      pointerEvents: "none",
      background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.09), rgba(255,255,255,0))",
      animation: "glassDrift 8s ease-in-out infinite alternate",
    },
    "& .hero-ring": {
      position: "absolute",
      width: 220,
      height: 220,
      borderRadius: "50%",
      right: -86,
      top: -74,
      border: "1px solid rgba(255,100,100,0.25)",
      boxShadow: "inset 0 0 0 1px rgba(255,100,100,0.08)",
      animation: "ringOrbit 14s linear infinite",
      pointerEvents: "none",
    },
    "& .hero-grid": {
      position: "absolute",
      inset: 0,
      opacity: 0.08,
      backgroundImage:
        "repeating-linear-gradient(0deg, rgba(255,92,92,0.18) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgba(255,92,92,0.18) 0 1px, transparent 1px 24px)",
      pointerEvents: "none",
    },
    "& .hero-title": {
      fontFamily: '"Orbitron", "Space Grotesk", sans-serif',
      fontWeight: 900,
      letterSpacing: "0.02em",
      color: C.text100,
      textShadow: "0 6px 22px rgba(0,0,0,0.42)",
    },
    "& .feature-card": {
      bgcolor: "rgba(13,17,23,0.2)",
      border: "1px solid rgba(255,255,255,0.24)",
      borderRadius: "12px",
      p: 1.25,
      backdropFilter: "blur(10px)",
      transition:
        "transform 180ms ease, border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease",
      "&:hover": {
        transform: "translateY(-3px)",
        borderColor: "rgba(255,255,255,0.4)",
        backgroundColor: "rgba(13,17,23,0.3)",
        boxShadow: "0 10px 18px rgba(0,0,0,0.26)",
      },
    },
    "& .feature-icon": {
      width: 26,
      height: 26,
      borderRadius: "8px",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ffb3b3",
      bgcolor: "rgba(220,38,38,0.14)",
      border: "1px solid rgba(255,120,120,0.24)",
      boxShadow: "inset 0 0 0 1px rgba(255,120,120,0.08)",
      flexShrink: 0,
    },
  };

  const modalShellSx = {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 30,
  };

  const modalBackdropSx = {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(circle at 50% 30%, rgba(10,14,20,0.3), rgba(0,0,0,0.56))",
    backdropFilter: "blur(9px)",
    animation: "overlayIn 220ms ease both",
  };

  const modalPanelSx = {
    position: "relative",
    background: "linear-gradient(180deg, rgba(14,18,26,0.28), rgba(8,11,17,0.22))",
    border: "1px solid rgba(255,255,255,0.24)",
    borderRadius: "18px",
    p: 3,
    boxShadow: "0 26px 95px rgba(0,0,0,0.64), inset 0 1px 0 rgba(255,255,255,0.2)",
    backdropFilter: "blur(16px)",
    animation: "modalIn 260ms cubic-bezier(.2,.7,.2,1) both",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      height: "2px",
      background:
        "linear-gradient(90deg, rgba(255,96,96,0.72), rgba(255,96,96,0.24), rgba(255,96,96,0))",
    },
  };

  const embers = [
    { left: "7%", size: 3, dur: "4.6s", delay: "-1.2s", op: 0.42 },
    { left: "14%", size: 2, dur: "5.4s", delay: "-3.4s", op: 0.36 },
    { left: "22%", size: 3, dur: "4.9s", delay: "-2.1s", op: 0.4 },
    { left: "31%", size: 2, dur: "5.8s", delay: "-4.2s", op: 0.28 },
    { left: "40%", size: 4, dur: "4.2s", delay: "-1.8s", op: 0.44 },
    { left: "51%", size: 2, dur: "6.2s", delay: "-3.7s", op: 0.3 },
    { left: "63%", size: 3, dur: "5.1s", delay: "-2.7s", op: 0.38 },
    { left: "74%", size: 2, dur: "6.4s", delay: "-4.9s", op: 0.27 },
    { left: "85%", size: 3, dur: "4.8s", delay: "-2.4s", op: 0.41 },
    { left: "93%", size: 2, dur: "5.6s", delay: "-3.5s", op: 0.33 },
  ];

  const featureCards = [
    {
      title: "Policy-grade access",
      desc: "RBAC, privilege boundaries, and strict role enforcement.",
      icon: <AdminPanelSettingsRounded sx={{ fontSize: 16 }} />,
      meta: "RBAC",
    },
    {
      title: "Realtime intelligence",
      desc: "Session telemetry and high-signal anomaly insights.",
      icon: <InsightsRounded sx={{ fontSize: 16 }} />,
      meta: "Live",
    },
    {
      title: "Hardened by default",
      desc: "Secure defaults, token controls, and audit integrity.",
      icon: <SecurityRounded sx={{ fontSize: 16 }} />,
      meta: "Secure",
    },
    {
      title: "Token lifecycle control",
      desc: "Issue, revoke, and trace JWT sessions with confidence.",
      icon: <KeyRounded sx={{ fontSize: 16 }} />,
      meta: "JWT",
    },
  ];

  const signInMethods = [
    {
      id: "password",
      title: "Authorized Password",
      desc: "Use assigned administrator credentials with role policy validation.",
      icon: <KeyRounded sx={{ fontSize: 17 }} />,
      onClick: () => {
        setOpenChooser(false);
        setOpenPassModal(true);
      },
    },
    {
      id: "card",
      title: "Smart Card",
      desc: "Tap a provisioned enterprise card for rapid secure sign-in.",
      icon: <CreditCardRounded sx={{ fontSize: 17 }} />,
      onClick: () => {
        setOpenChooser(false);
        setOpenCardModal(true);
      },
    },
  ];

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
        background: "linear-gradient(180deg, #05070c 0%, #080b12 45%, #05070c 100%)",
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
            <Box component="span" sx={{ fontSize: 16, color: "#fff" }}>{"\u26A1"}</Box>
          </Box>
          <Typography
            sx={{
              fontFamily: '"Audiowide", "Orbitron", sans-serif',
              fontWeight: 400,
              fontSize: { xs: "0.92rem", md: "1rem" },
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: "linear-gradient(180deg, #fff 0%, #ffe2e2 65%, #ffa5a5 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 16px rgba(255,72,72,0.24), 0 2px 10px rgba(0,0,0,0.45)",
            }}
          >
            APEX
          </Typography>
        </Box>
        <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1 } }>
          <Chip label="Docs" size="small" sx={{ bgcolor: "rgba(11,15,20,0.72)", border: `1px solid ${C.char400}`, color: C.text300, fontWeight: 600, '& .MuiChip-label': { px: 0.8 } }} />
          <Chip label="Status: Operational" size="small" sx={{ bgcolor: "rgba(16,185,129,0.12)", border: `1px solid rgba(16,185,129,0.32)`, color: "#34d399", fontWeight: 700, '& .MuiChip-label': { px: 0.8 } }} />
          <Chip label="Support" size="small" sx={{ bgcolor: "rgba(11,15,20,0.72)", border: `1px solid ${C.char400}`, color: C.text300, fontWeight: 600, '& .MuiChip-label': { px: 0.8 } }} />
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

      {/* Volcanic Plasma Theme */}
      <Box aria-hidden sx={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", overflow: "hidden" }}>
        <Box sx={{ position: "absolute", inset: 0, background: "radial-gradient(120% 80% at 10% 8%, rgba(255,64,64,0.24), transparent 54%), radial-gradient(90% 68% at 88% 86%, rgba(255,20,20,0.2), transparent 58%), linear-gradient(180deg, #03050a 0%, #070a11 52%, #03050a 100%)" }} />
        <Box sx={{ position: "absolute", top: "-30%", left: "-18%", width: "64%", height: "78%", borderRadius: "48%", filter: "blur(54px)", opacity: 0.26, background: "radial-gradient(circle, rgba(255,76,76,0.68) 0%, rgba(255,76,76,0.12) 46%, rgba(255,76,76,0) 74%)", animation: "plasmaA 14s ease-in-out infinite" }} />
        <Box sx={{ position: "absolute", bottom: "-36%", right: "-14%", width: "58%", height: "76%", borderRadius: "48%", filter: "blur(58px)", opacity: 0.24, background: "radial-gradient(circle, rgba(255,52,52,0.62) 0%, rgba(255,52,52,0.1) 48%, rgba(255,52,52,0) 76%)", animation: "plasmaB 16s ease-in-out infinite" }} />
        <Box sx={{ position: "absolute", inset: 0, opacity: 0.22, backgroundSize: "200% 200%", backgroundImage: "linear-gradient(120deg, rgba(255,90,90,0) 0%, rgba(255,90,90,0.28) 24%, rgba(255,90,90,0) 48%), linear-gradient(300deg, rgba(255,70,70,0) 0%, rgba(255,70,70,0.26) 26%, rgba(255,70,70,0) 52%)", animation: "ribbonFlow 9s ease-in-out infinite alternate" }} />
        <Box sx={{ position: "absolute", inset: 0, opacity: 0.12, backgroundImage: "repeating-radial-gradient(circle at 20% 20%, rgba(255,90,90,0.2) 0 1px, transparent 2px 18px)", animation: "grainDrift 12s linear infinite" }} />
        {embers.map((e, i) => (
          <Box key={i} sx={{ position: "absolute", bottom: "-6%", left: e.left, width: e.size, height: e.size * 3.2, borderRadius: "10px", opacity: e.op, filter: "blur(0.2px)", background: "linear-gradient(180deg, rgba(255,110,110,0) 0%, rgba(255,110,110,0.9) 54%, rgba(255,110,110,0) 100%)", animation: `emberRise ${e.dur} linear infinite`, animationDelay: e.delay }} />
        ))}
        <Box sx={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "linear-gradient(110deg, rgba(255,88,88,0) 0%, rgba(255,88,88,0.34) 18%, rgba(255,88,88,0) 34%)", animation: "heatShimmer 4.8s steps(9) infinite" }} />
        <Box sx={{ position: "absolute", inset: 0, animation: "screenFlicker 0.24s steps(2) infinite", background: "rgba(255,255,255,0.01)" }} />
        <Box sx={{ position: "absolute", inset: 0, opacity: 0.34, background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.38) 72%, rgba(0,0,0,0.64) 100%)" }} />
      </Box>

      <style>{`
        @keyframes plasmaA {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(36px,24px,0) scale(1.12); }
        }
        @keyframes plasmaB {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(-34px,-26px,0) scale(1.1); }
        }
        @keyframes ribbonFlow {
          0% { background-position: 0% 0%, 100% 100%; }
          100% { background-position: 100% 100%, 0% 0%; }
        }
        @keyframes grainDrift {
          0% { transform: translate3d(0,0,0); }
          100% { transform: translate3d(-26px,-22px,0); }
        }
        @keyframes emberRise {
          0% { transform: translateY(0) scale(0.92); opacity: 0; }
          15% { opacity: 1; }
          100% { transform: translateY(-120vh) scale(1.1); opacity: 0; }
        }
        @keyframes heatShimmer {
          0% { transform: translateX(-10%); }
          100% { transform: translateX(12%); }
        }
        @keyframes screenFlicker {
          0% { opacity: 0.035; }
          100% { opacity: 0.012; }
        }
        @keyframes ringOrbit {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes glassDrift {
          0% { transform: translateX(-14%); }
          100% { transform: translateX(14%); }
        }
        @keyframes featureIn {
          0% { opacity: 0; transform: translateY(10px) scale(0.985); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes heroIn {
          0% { opacity: 0; transform: translateY(16px) scale(0.985); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes overlayIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes modalIn {
          0% { opacity: 0; transform: translateY(12px) scale(0.985); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
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
          <Box sx={heroCardSx}>
            <Box className="hero-grid" />
            <Box className="hero-ring" />
            <Box className="glass-sheen" />
            {/* Glass header controls like reference */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.25, gap: 1.5, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, bgcolor: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '999px', p: 0.5 }}>
                <Box sx={{ px: 1.5, py: 0.5, color: C.text100, fontWeight: 700, fontSize: '0.82rem', bgcolor: 'rgba(255,255,255,0.06)', borderRadius: '999px', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}>Sign in</Box>
              </Box>
              <Box sx={{ color: '#ffb8b8', fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', px: 1.1, py: 0.45, borderRadius: '999px', border: '1px solid rgba(255,120,120,0.24)', bgcolor: 'rgba(220,38,38,0.1)' }}>
                Secure Channel
              </Box>
            </Box>

            <Typography className="hero-title" sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem' }, mb: 1 }}>
              Enterprise admin gateway
            </Typography>
            <Typography sx={{ color: '#c5ceda', fontSize: { xs: '0.88rem', sm: '0.94rem' }, mb: 2.2, maxWidth: 610, lineHeight: 1.55 }}>
              Precision access for critical operations. Sign in fast, monitor token activity in real time, and enforce controls from a single hardened command surface.
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.25, mb: 2 }}>
              {featureCards.map((f, i) => (
                <Box key={i} className="feature-card" sx={{ animation: `featureIn 420ms ease both`, animationDelay: `${120 + i * 80}ms` }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 0.65 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <Box className="feature-icon">{f.icon}</Box>
                      <Typography sx={{ color: C.text100, fontWeight: 700, fontSize: '0.9rem' }}>{f.title}</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '0.67rem', color: '#ffb8b8', border: '1px solid rgba(255,120,120,0.22)', bgcolor: 'rgba(220,38,38,0.1)', borderRadius: '999px', px: 0.75, py: 0.2, letterSpacing: '0.06em' }}>
                      {f.meta}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: C.text300, fontSize: '0.8rem', lineHeight: 1.45 }}>{f.desc}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
                {["SOC 2", "ISO 27001", "JWT Revocation"].map((tag) => (
                  <Box key={tag} sx={{ fontSize: '0.68rem', color: '#d8e2ee', border: '1px solid rgba(255,255,255,0.2)', bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '999px', px: 0.95, py: 0.35 }}>
                    {tag}
                  </Box>
                ))}
              </Box>
              <Button onClick={() => setOpenChooser(true)} variant="contained" sx={{ borderRadius: '12px', px: 2.6, py: 1.1, fontWeight: 800, color: '#111', textTransform: 'none', background: 'linear-gradient(180deg, #ffffff, #dddddd)', boxShadow: '0 10px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.75)', transition: 'transform 180ms ease, box-shadow 180ms ease', '&:hover': { background: 'linear-gradient(180deg, #fafafa, #d3d3d3)', transform: 'translateY(-1px)', boxShadow: '0 14px 26px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.8)' } }}>Let's Go</Button>
            </Box>
          </Box>
        </Box>

        {/* Chooser Modal */}
        <Box sx={{ ...modalShellSx, display: openChooser ? 'flex' : 'none', zIndex: 20 }}>
          <Box onClick={() => setOpenChooser(false)} sx={modalBackdropSx} />
          <Box sx={{ ...modalPanelSx, width: 680, maxWidth: '94vw' }}>
            <Typography sx={{ color: C.text100, fontWeight: 800, mb: 1 }}>Choose a sign-in method</Typography>
            <Typography sx={{ color: C.text300, fontSize: '0.88rem', mb: 2 }}>Select the most appropriate path for your secure administrator session.</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
              {signInMethods.map((m, i) => (
                <Box key={m.id} onClick={m.onClick} sx={{ cursor: 'pointer', bgcolor: 'rgba(13,17,23,0.2)', border: '1px solid rgba(255,255,255,0.26)', borderRadius: '12px', p: 2, backdropFilter: 'blur(10px)', transition: 'transform 180ms ease, border-color 180ms ease, background-color 180ms ease, box-shadow 180ms ease', animation: 'featureIn 360ms ease both', animationDelay: `${100 + i * 90}ms`, '&:hover': { borderColor: C.redLt, transform: 'translateY(-2px)', backgroundColor: 'rgba(13,17,23,0.3)', boxShadow: '0 10px 18px rgba(0,0,0,0.25)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.4 }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#ffb8b8', border: '1px solid rgba(255,120,120,0.24)', bgcolor: 'rgba(220,38,38,0.12)' }}>{m.icon}</Box>
                    <Typography sx={{ color: C.text100, fontWeight: 700 }}>{m.title}</Typography>
                  </Box>
                  <Typography sx={{ color: C.text300, fontSize: '0.83rem', mt: 0.5 }}>{m.desc}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Password Modal */}
        <Box sx={{ ...modalShellSx, display: openPassModal ? 'flex' : 'none' }}>
          <Box onClick={() => setOpenPassModal(false)} sx={modalBackdropSx} />
          <Box sx={{ ...modalPanelSx, width: 520, maxWidth: '92vw' }}>
            <Box sx={{ width: 28, height: 28, borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#ffb8b8', border: '1px solid rgba(255,120,120,0.24)', bgcolor: 'rgba(220,38,38,0.12)', mb: 1 }}>
              <KeyRounded sx={{ fontSize: 17 }} />
            </Box>
            <Typography sx={{ color: C.text100, fontWeight: 800, mb: 1 }}>Authorized Password</Typography>
            <Typography sx={{ color: C.text300, fontSize: '0.88rem', mb: 2 }}>Enter administrator credentials to continue to secure operations.</Typography>
            <Box component="form" onSubmit={(e) => { handleSubmit(e); }} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Username" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} required disabled={isLoading} autoComplete="username" fullWidth sx={fieldSx} />
              <TextField label="Password" type={showPassword ? 'text' : 'password'} value={adminPass} onChange={(e) => setAdminPass(e.target.value)} required disabled={isLoading} autoComplete="current-password" fullWidth sx={fieldSx} InputProps={{ endAdornment: (<InputAdornment position='end'><IconButton onClick={() => setShowPassword(p => !p)} edge='end' aria-label='toggle password'>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={() => setOpenPassModal(false)} sx={{ color: C.text300, textTransform: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', px: 1.8, '&:hover': { borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.03)' } }}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isLoading} sx={{ borderRadius: '10px', px: 2.2, fontWeight: 800, textTransform: 'none', background: `linear-gradient(135deg, ${C.red} 0%, ${C.redDk} 100%)`, boxShadow: '0 10px 22px rgba(220,38,38,0.3)', '&:hover': { background: `linear-gradient(135deg, ${C.redLt} 0%, ${C.red} 100%)` } }}>{isLoading ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Sign In'}</Button>
              </Box>
            </Box>
            {error && (<Alert severity="error" sx={{ mt: 2, bgcolor: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#FDA4AF', borderRadius: '12px' }}>{error}</Alert>)}
          </Box>
        </Box>

        {/* Card Modal (frontend only) */}
        <Box sx={{ ...modalShellSx, display: openCardModal ? 'flex' : 'none' }}>
          <Box onClick={() => setOpenCardModal(false)} sx={modalBackdropSx} />
          <Box sx={{ ...modalPanelSx, width: 520, maxWidth: '92vw' }}>
            <Box sx={{ width: 28, height: 28, borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#ffb8b8', border: '1px solid rgba(255,120,120,0.24)', bgcolor: 'rgba(220,38,38,0.12)', mb: 1 }}>
              <CreditCardRounded sx={{ fontSize: 17 }} />
            </Box>
            <Typography sx={{ color: C.text100, fontWeight: 800, mb: 1 }}>Sign in with Card</Typography>
            <Typography sx={{ color: C.text300, fontSize: '0.88rem', mb: 2 }}>Present a provisioned smart card at the reader to begin authenticated access.</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
              <Box sx={{ width: 260, height: 160, borderRadius: '14px', border: '1px dashed rgba(255,255,255,0.34)', bgcolor: 'rgba(13,17,23,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)' }}>
                <Box sx={{ position: 'absolute', inset: 0, background: `radial-gradient(240px 100px at 50% 10%, ${C.redGlow}, transparent)` }} />
                <Typography sx={{ color: C.text100, fontSize: '0.92rem', fontWeight: 700 }}>Tap card here</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={() => setOpenCardModal(false)} sx={{ color: C.text300, textTransform: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', px: 1.8, '&:hover': { borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'rgba(255,255,255,0.03)' } }}>Close</Button>
              <Button disabled variant="outlined" sx={{ color: C.text300, borderColor: 'rgba(255,255,255,0.14)', textTransform: 'none', fontWeight: 700, borderRadius: '10px' }}>Configure reader (coming soon)</Button>
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
