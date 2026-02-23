import { createTheme } from "@mui/material/styles";

// ─── APEX — Dark Charcoal + Crimson Red Cybersecurity Palette ────────────────
const RED = "#DC2626"; // Primary accent — crimson red
const RED_LT = "#EF4444"; // Lighter red
const RED_DK = "#B91C1C"; // Deeper red
const RED_GLOW = "rgba(220,38,38,0.18)";

const AMBER = "#F59E0B";
const CYAN = "#22D3EE";
const EMERALD = "#10B981";
const ROSE = "#F43F5E";
const VIOLET = "#A855F7";

// Cool-dark charcoal (not orange-tinted)
const CHAR_950 = "#010409";
const CHAR_900 = "#0D1117";
const CHAR_800 = "#111318";
const CHAR_700 = "#0F1117";
const CHAR_600 = "#161B22";
const CHAR_500 = "#1C2128";
const CHAR_400 = "#2D333B";

const TEXT_100 = "#F0F6FC";
const TEXT_300 = "#8B949E";
const TEXT_500 = "#484F58";

const createAppTheme = () =>
  createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: RED,
        light: RED_LT,
        dark: RED_DK,
        contrastText: "#fff",
      },
      secondary: {
        main: VIOLET,
        light: "#C084FC",
        dark: "#7E22CE",
        contrastText: "#fff",
      },
      background: { default: CHAR_900, paper: CHAR_600 },
      text: { primary: TEXT_100, secondary: TEXT_300, disabled: TEXT_500 },
      error: { main: ROSE },
      warning: { main: AMBER },
      info: { main: CYAN },
      success: { main: EMERALD },
      divider: CHAR_400,
    },
    typography: {
      fontFamily: '"Space Grotesk", sans-serif',
      h1: {
        fontFamily: '"Orbitron", sans-serif',
        fontWeight: 800,
        color: TEXT_100,
        letterSpacing: "0.5px",
      },
      h2: {
        fontFamily: '"Orbitron", sans-serif',
        fontWeight: 700,
        color: TEXT_100,
        letterSpacing: "0.3px",
      },
      h3: {
        fontFamily: '"Orbitron", sans-serif',
        fontWeight: 700,
        color: TEXT_100,
        letterSpacing: "0.2px",
      },
      h4: {
        fontFamily: '"Orbitron", sans-serif',
        fontWeight: 700,
        color: TEXT_100,
        letterSpacing: "0.2px",
      },
      h5: {
        fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 600,
        color: TEXT_100,
      },
      h6: {
        fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 600,
        color: TEXT_100,
        fontSize: "0.95rem",
      },
      body1: { fontFamily: '"Space Grotesk", sans-serif', color: TEXT_100 },
      body2: { fontFamily: '"Space Grotesk", sans-serif', color: TEXT_300 },
      caption: { fontFamily: '"Space Grotesk", sans-serif', color: TEXT_500 },
      subtitle1: {
        fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 600,
        color: TEXT_100,
      },
      subtitle2: {
        fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 600,
        color: TEXT_300,
      },
      button: {
        fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 600,
      },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          "@global": {
            "@import": `url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap')`,
          },
          body: {
            background: `linear-gradient(135deg, ${CHAR_950} 0%, ${CHAR_900} 100%)`,
            minHeight: "100vh",
            fontFamily: '"Space Grotesk", sans-serif',
            scrollbarWidth: "thin",
            scrollbarColor: `${RED_DK} ${CHAR_700}`,
          },
          "*": { fontFamily: '"Space Grotesk", sans-serif' },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            backgroundColor: CHAR_600,
            border: `1px solid ${CHAR_400}`,
            borderRadius: 14,
            boxShadow: "0 4px 32px rgba(0,0,0,0.6)",
            fontFamily: '"Space Grotesk", sans-serif',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: CHAR_600,
            backgroundImage: "none",
            border: `1px solid ${CHAR_400}`,
            borderRadius: 14,
            fontFamily: '"Space Grotesk", sans-serif',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: CHAR_700,
            backgroundImage: "none",
            borderBottom: `1px solid ${CHAR_400}`,
            boxShadow: "none",
            color: TEXT_100,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: CHAR_700,
            backgroundImage: "none",
            borderRight: `1px solid ${CHAR_400}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 600,
            fontFamily: '"Space Grotesk", sans-serif',
            padding: "8px 20px",
            boxShadow: "none",
            transition: "all 0.2s ease",
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${RED} 0%, ${RED_DK} 100%)`,
            boxShadow: `0 4px 14px rgba(220,38,38,0.4)`,
            "&:hover": {
              background: `linear-gradient(135deg, ${RED_LT} 0%, ${RED} 100%)`,
              boxShadow: `0 6px 20px rgba(220,38,38,0.55)`,
            },
          },
          outlinedPrimary: {
            borderColor: RED,
            color: RED,
            "&:hover": { backgroundColor: RED_GLOW, borderColor: RED_LT },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: { fontFamily: '"Space Grotesk", sans-serif' },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              backgroundColor: CHAR_700,
              fontFamily: '"Space Grotesk", sans-serif',
              "& fieldset": { borderColor: CHAR_400 },
              "&:hover fieldset": { borderColor: RED },
              "&.Mui-focused fieldset": {
                borderColor: RED,
                boxShadow: `0 0 0 3px ${RED_GLOW}`,
              },
            },
            "& .MuiInputLabel-root": {
              fontFamily: '"Space Grotesk", sans-serif',
              color: TEXT_500,
            },
            "& .MuiInputLabel-root.Mui-focused": { color: RED_LT },
            "& .MuiInputBase-input": {
              fontFamily: '"Space Grotesk", sans-serif',
              color: TEXT_100,
            },
          },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: {
            fontFamily: '"Space Grotesk", sans-serif',
            "& .MuiOutlinedInput-notchedOutline": { borderColor: CHAR_400 },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: RED },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: RED,
            },
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: CHAR_700,
            fontWeight: 700,
            fontFamily: '"Space Grotesk", sans-serif',
            color: RED_LT,
            borderBottom: `1px solid ${CHAR_400}`,
            fontSize: "0.73rem",
            textTransform: "uppercase",
            letterSpacing: "0.07em",
          },
          root: {
            borderBottom: `1px solid ${CHAR_500}`,
            color: TEXT_100,
            fontFamily: '"Space Grotesk", sans-serif',
          },
        },
      },
      MuiTableRow: {
        styleOverrides: {
          root: {
            "&:hover": { backgroundColor: `rgba(220,38,38,0.05)` },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 600,
            fontSize: "0.75rem",
            fontFamily: '"Space Grotesk", sans-serif',
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            backgroundColor: CHAR_700,
            border: `1px solid ${CHAR_400}`,
            color: TEXT_100,
            fontSize: "0.78rem",
            fontFamily: '"Space Grotesk", sans-serif',
            borderRadius: 8,
          },
          arrow: { color: CHAR_700 },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            transition: "all 0.2s ease",
            "&:hover": { backgroundColor: RED_GLOW, color: RED },
          },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            backgroundColor: CHAR_700,
            border: `1px solid ${CHAR_400}`,
          },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            color: TEXT_100,
            fontFamily: '"Space Grotesk", sans-serif',
            "&:hover": { backgroundColor: RED_GLOW },
            "&.Mui-selected": {
              backgroundColor: `rgba(220,38,38,0.12)`,
              "&:hover": { backgroundColor: RED_GLOW },
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: { fontFamily: '"Space Grotesk", sans-serif' },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          root: { fontFamily: '"Space Grotesk", sans-serif', color: TEXT_300 },
          selectLabel: { fontFamily: '"Space Grotesk", sans-serif' },
          displayedRows: { fontFamily: '"Space Grotesk", sans-serif' },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 600,
            textTransform: "none",
          },
        },
      },
      MuiAlert: {
        styleOverrides: {
          root: { fontFamily: '"Space Grotesk", sans-serif' },
        },
      },
    },
  });

// Export palette constants for use in charts / components
export const APEX = {
  RED,
  RED_LT,
  RED_DK,
  RED_GLOW,
  // Legacy orange aliases
  ORANGE: RED,
  ORANGE_LT: RED_LT,
  ORANGE_DK: RED_DK,
  ORANGE_GLOW: RED_GLOW,
  AMBER,
  CYAN,
  EMERALD,
  ROSE,
  VIOLET,
  CHAR_950,
  CHAR_900,
  CHAR_800,
  CHAR_700,
  CHAR_600,
  CHAR_500,
  CHAR_400,
  TEXT_100,
  TEXT_300,
  TEXT_500,
};

export default createAppTheme;
