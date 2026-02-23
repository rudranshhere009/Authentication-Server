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
      borderRadius: "10px",
      fontFamily: '"Space Grotesk", sans-serif',
      "& fieldset": { borderColor: C.char400 },
      "&:hover fieldset": { borderColor: C.red },
      "&.Mui-focused fieldset": {
        borderColor: C.red,
        boxShadow: `0 0 0 3px ${C.redGlow}`,
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
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #010409 0%, #0D1117 100%)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 65%)",
          top: -250,
          right: -180,
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 65%)",
          bottom: -120,
          left: -100,
          pointerEvents: "none",
        },
      }}
    >
      {/* Card */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 440,
          mx: 2,
          bgcolor: C.char600,
          border: `1px solid ${C.char400}`,
          borderRadius: "18px",
          p: { xs: 3.5, sm: 5.5 },
          position: "relative",
          zIndex: 1,
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(220,38,38,0.1)",
        }}
      >
        {/* Brand */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 4,
            gap: 1.5,
          }}
        >
          {/* Brand logo */}
          <Box
            sx={{
              width: 62,
              height: 62,
              borderRadius: "16px",
              background: `linear-gradient(135deg, ${C.red} 0%, ${C.redDk} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 8px 32px rgba(220,38,38,0.55)`,
              position: "relative",
              "&::after": {
                content: '""',
                position: "absolute",
                inset: -3,
                borderRadius: "18px",
                border: `1px solid rgba(220,38,38,0.3)`,
                pointerEvents: "none",
              },
            }}
          >
            <Box
              component="span"
              sx={{ fontSize: "2rem", lineHeight: 1, userSelect: "none" }}
            >
              ⚡
            </Box>
          </Box>

          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: "1.6rem",
                color: C.text100,
                letterSpacing: "3px",
                fontFamily: '"Orbitron", sans-serif',
              }}
            >
              APEX
            </Typography>
            <Typography
              sx={{
                color: C.text500,
                fontSize: "0.78rem",
                mt: 0.4,
                fontFamily: '"Space Grotesk", sans-serif',
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Auth Platform
            </Typography>
          </Box>
        </Box>

        <Typography
          sx={{
            color: C.text300,
            fontSize: "0.85rem",
            mb: 3,
            textAlign: "center",
            fontFamily: '"Space Grotesk", sans-serif',
          }}
        >
          Sign in to the administrator portal
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}
        >
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
                  <IconButton
                    onClick={() => setShowPassword((p) => !p)}
                    edge="end"
                    aria-label="toggle password"
                  >
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
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.95rem",
              fontFamily: '"Space Grotesk", sans-serif',
              letterSpacing: "0.04em",
              background: `linear-gradient(135deg, ${C.red} 0%, ${C.redDk} 100%)`,
              boxShadow: `0 8px 28px rgba(220,38,38,0.45)`,
              "&:hover": {
                background: `linear-gradient(135deg, ${C.redLt} 0%, ${C.red} 100%)`,
                boxShadow: `0 12px 36px rgba(220,38,38,0.6)`,
                transform: "translateY(-1px)",
              },
              "&:active": { transform: "translateY(0)" },
              "&.Mui-disabled": {
                background: C.char700,
                color: C.text500,
                boxShadow: "none",
              },
              transition: "all 0.2s ease",
            }}
          >
            {isLoading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>

        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 2.5,
              bgcolor: "rgba(220,38,38,0.1)",
              border: "1px solid rgba(220,38,38,0.3)",
              color: "#FDA4AF",
              borderRadius: "10px",
              "& .MuiAlert-icon": { color: "#F43F5E" },
            }}
          >
            {error}
          </Alert>
        )}

        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            color: C.text500,
            mt: 3,
            fontSize: "0.68rem",
            fontFamily: '"Space Grotesk", sans-serif',
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Restricted · Administrators Only · APEX v2.0
        </Typography>
      </Box>
    </Box>
  );
}

export default LoginForm;
