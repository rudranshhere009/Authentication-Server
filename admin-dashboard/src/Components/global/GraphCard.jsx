

import { Paper, Typography, useTheme, Box, alpha } from "@mui/material";

const GraphCard = ({ title, chart, height = 300, darkMode }) => {
  const theme = useTheme();

  const getCardStyles = () => {
    if (darkMode) {
      return {
        backgroundColor: alpha('#1a2332', 0.95),
        backdropFilter: 'blur(12px)',
        border: `1px solid ${alpha('#4fc3f7', 0.15)}`,
        boxShadow: `0 10px 30px -5px ${alpha('#000000', 0.4)}`,
        gradientColors: ['#4fc3f7', '#29b6f6'],
        hoverShadow: `0 15px 35px -10px ${alpha('#000000', 0.5)}`,
        titleColor: '#ffffff',
        underlineGradient: ['#4fc3f7', alpha('#4fc3f7', 0.4)]
      };
    } else {
      return {
        backgroundColor: alpha(theme.palette.background.paper, 0.85),
        backdropFilter: 'blur(8px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        boxShadow: `0 10px 30px -5px ${alpha(theme.palette.primary.main, 0.1)}`,
        gradientColors: [theme.palette.primary.main, theme.palette.secondary?.main || theme.palette.primary.light],
        hoverShadow: `0 15px 35px -10px ${alpha(theme.palette.primary.main, 0.15)}`,
        titleColor: theme.palette.text.primary,
        underlineGradient: [theme.palette.primary.main, alpha(theme.palette.primary.main, 0.4)]
      };
    }
  };

  const cardStyles = getCardStyles();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, sm: 3.5 },
        borderRadius: 3,
        backgroundColor: cardStyles.backgroundColor,
        backdropFilter: cardStyles.backdropFilter,
        border: cardStyles.border,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: cardStyles.boxShadow,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${cardStyles.gradientColors[0]}, ${cardStyles.gradientColors[1]})`,
          opacity: 0.8,
        },
        '&:hover': {
          boxShadow: cardStyles.hoverShadow,
          transform: 'translateY(-5px)',
        }
      }}
    >
      {title && (
        <Typography
          variant="h6"
          sx={{
            mb: 2.5,
            fontWeight: 600,
            color: cardStyles.titleColor,
            fontSize: { xs: '1.1rem', sm: '1.2rem' },
            position: 'relative',
            display: 'inline-block',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -6,
              left: 0,
              width: '40px',
              height: '3px',
              borderRadius: '3px',
              background: `linear-gradient(90deg, ${cardStyles.underlineGradient[0]}, ${cardStyles.underlineGradient[1]})`,
            }
          }}
        >
          {title}
        </Typography>
      )}
      <Box sx={{ 
        width: '100%', 
        height: { xs: 200, sm: typeof height === 'number' ? height : 300 },
        animation: 'fadeIn 0.6s ease-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0.7 },
          '100%': { opacity: 1 }
        }
      }}>
        {chart}
      </Box>
    </Paper>
  );
};
export default GraphCard;