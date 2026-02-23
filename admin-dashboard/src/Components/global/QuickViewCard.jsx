import { Card, CardContent, Typography } from "@mui/material";

const PALETTE = {
  primary: { main: "#DC2626", dark: "#B91C1C", glow: "rgba(220,38,38,0.15)" },
  secondary: {
    main: "#EF4444",
    dark: "#DC2626",
    glow: "rgba(251,139,36,0.15)",
  },
  error: { main: "#F43F5E", dark: "#BE123C", glow: "rgba(244,63,94,0.15)" },
  warning: { main: "#F59E0B", dark: "#B45309", glow: "rgba(245,158,11,0.15)" },
  info: { main: "#22D3EE", dark: "#0E7490", glow: "rgba(34,211,238,0.15)" },
  success: { main: "#10B981", dark: "#047857", glow: "rgba(16,185,129,0.15)" },
};

const C = {
  char600: "#161B22",
  char500: "#1C2128",
  char400: "#2D333B",
  text100: "#F0F6FC",
  text500: "#484F58",
};

const QuickViewCard = ({
  Title,
  Value,
  color = "primary",
  compact,
  filterKey,
}) => {
  const a = PALETTE[color] || PALETTE.primary;

  return (
    <Card
      sx={{
        cursor: filterKey ? "pointer" : "default",
        bgcolor: C.char600,
        border: `1px solid ${C.char400}`,
        borderRadius: "14px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
        transition: "all 0.2s ease",
        "&:hover": filterKey
          ? {
              transform: "translateY(-3px)",
              borderColor: a.main,
              boxShadow: `0 8px 36px ${a.glow}, 0 0 0 1px ${a.main}30`,
            }
          : {},
        // Left accent bar
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "3px",
          background: `linear-gradient(to bottom, ${a.main}, ${a.dark})`,
        },
        // Subtle top glow
        "&::after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, ${a.main}60, transparent 60%)`,
        },
      }}
    >
      <CardContent
        sx={{
          pl: compact ? 2.5 : 3,
          pr: 2,
          py: compact ? 1.75 : 2.25,
          display: "flex",
          flexDirection: "column",
          gap: 0.6,
          "&:last-child": { pb: compact ? 1.75 : 2.25 },
        }}
      >
        {/* Label */}
        <Typography
          sx={{
            color: C.text500,
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.09em",
            textTransform: "uppercase",
          }}
        >
          {Title}
        </Typography>

        {/* Value */}
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: compact ? "1.7rem" : "2.1rem",
            lineHeight: 1,
            background: `linear-gradient(135deg, ${a.main} 0%, ${a.dark} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {Value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default QuickViewCard;
