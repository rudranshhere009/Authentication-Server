

import { Card, CardContent, Typography, useTheme, Box, alpha } from "@mui/material";

const QuickViewCard = ({ Title, Value, color = "primary", compact, filterKey, darkMode }) => {
  const theme = useTheme();
  
  const getCardColors = () => {
    const baseColor = theme.palette[color]?.main || theme.palette.primary.main;
    
    if (darkMode) {
      return {
        background: '#1a2332',
        shadowColor: alpha(baseColor, 0.2),
        hoverShadowColor: alpha(baseColor, 0.3),
        borderColor: baseColor,
        titleColor: '#b0bec5',
        valueColor: '#ffffff'
      };
    } else {
      return {
        background: theme.palette.background.paper,
        shadowColor: alpha(baseColor, 0.08),
        hoverShadowColor: alpha(baseColor, 0.15),
        borderColor: baseColor,
        titleColor: alpha(theme.palette.text.secondary, 1),
        valueColor: theme.palette.text.primary
      };
    }
  };

  const colors = getCardColors();
  
  return (
    <Card
      sx={{
        cursor: filterKey ? "pointer" : "default",
        bgcolor: colors.background,
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: `0 8px 24px ${colors.shadowColor}`,
        transition: 'all 0.3s ease',
        border: darkMode ? `1px solid #2d3748` : 'none',
        '&:hover': {
          boxShadow: filterKey ? `0 12px 28px ${colors.hoverShadowColor}` : 
            `0 8px 24px ${colors.shadowColor}`,
          transform: filterKey ? 'translateY(-4px)' : 'translateY(-2px)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          background: darkMode 
            ? `linear-gradient(to bottom, ${colors.borderColor}, ${alpha(colors.borderColor, 0.6)})`
            : `linear-gradient(to bottom, ${colors.borderColor}, ${alpha(colors.borderColor, 0.6)})`,
        }
      }}
    >
      <CardContent sx={{ 
        p: compact ? 2 : 2.5,
        pl: compact ? 2.5 : 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5
      }}>
        <Typography 
          variant="subtitle2" 
          sx={{
            color: colors.titleColor,
            fontSize: '0.85rem',
            fontWeight: 800,
            letterSpacing: '0.3px',
            textTransform: 'uppercase'
          }}
        >
          {Title}
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{
            color: colors.valueColor,
            fontWeight: 700,
            fontSize: compact ? '1.3rem' : '1.5rem',
            mt: 0.5,
            background: `linear-gradient(135deg, ${colors.borderColor}, 
              ${theme.palette[color]?.dark || theme.palette.primary.dark})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {Value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default QuickViewCard;