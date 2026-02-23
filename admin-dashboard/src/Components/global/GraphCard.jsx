import { Paper, Typography, Box } from "@mui/material";

const GraphCard = ({ title, chart, height = 300 }) => (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 2.5, sm: 3 },
      borderRadius: "14px",
      bgcolor: "#161B22",
      border: "1px solid #3A3228",
      boxShadow: "0 4px 28px rgba(0,0,0,0.5)",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.2s ease",
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        background:
          "linear-gradient(90deg, #DC2626 0%, #EF4444 60%, transparent 100%)",
      },
      "&:hover": {
        borderColor: "#4A3C30",
        boxShadow: "0 8px 36px rgba(0,0,0,0.6), 0 0 0 1px rgba(220,38,38,0.12)",
      },
    }}
  >
    {title && (
      <Typography
        variant="h6"
        sx={{
          mb: 2.5,
          fontWeight: 600,
          color: "#F0F6FC",
          fontSize: { xs: "0.9rem", sm: "0.95rem" },
          position: "relative",
          display: "inline-block",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -5,
            left: 0,
            width: "24px",
            height: "2px",
            borderRadius: "2px",
            background: "linear-gradient(90deg, #DC2626, rgba(220,38,38,0.3))",
          },
        }}
      >
        {title}
      </Typography>
    )}
    <Box
      sx={{
        width: "100%",
        height: {
          xs: 200,
          sm: typeof height === "number" ? height : 300,
        },
      }}
    >
      {chart}
    </Box>
  </Paper>
);

export default GraphCard;
