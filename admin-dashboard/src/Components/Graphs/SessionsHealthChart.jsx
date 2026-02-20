

import { Box, Typography, useTheme } from "@mui/material";
import { ResponsiveBar } from '@nivo/bar';
import { memo, useMemo } from 'react';

const SessionsHealthChartBase = ({ sessions }) => {
  const theme = useTheme();
  
  // Memoize session status calculations
  const sessionCounts = useMemo(() => {
    if (!Array.isArray(sessions) || sessions.length === 0) {
      return { active: 0, inactive: 0, expired: 0 };
    }
    const now = new Date();
    const fifteenMinutesAgo = new Date(now - 15 * 60 * 1000);
    return sessions.reduce((acc, session) => {
      if (!session.is_active) {
        acc.inactive++;
      } else {
        const sessionDate = new Date(session.created_at);
        acc[sessionDate > fifteenMinutesAgo ? 'active' : 'expired']++;
      }
      return acc;
    }, { active: 0, inactive: 0, expired: 0 });
  }, [sessions]);

  if (!Array.isArray(sessions) || sessions.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <Typography variant="body1" color="text.secondary">
          No session data available
        </Typography>
      </Box>
    );
  }

  const activeCount = sessionCounts.active;
  const expiredCount = sessionCounts.expired;
  const inactiveCount = sessionCounts.inactive;
  
  // Calculate max value to determine appropriate tick interval
  const maxValue = Math.max(activeCount, inactiveCount, expiredCount);
  const tickInterval = Math.max(5, Math.ceil(maxValue / 10) * 5); // Minimum gap of 5

  const data = [
    {
      status: 'Active',
      count: activeCount,
      color: theme.palette.success?.main || '#4caf50'
    },
    {
      status: 'Inactive',
      count: inactiveCount,
      color: theme.palette.warning?.main || '#ff9800'
    },
    {
      status: 'Expired',
      count: expiredCount,
      color: theme.palette.error.main
    }
  ];

  return (
    <ResponsiveBar
      data={data}
      keys={['count']}
      indexBy="status"
      margin={{ top: 10, right: 20, bottom: 40, left: 40 }}
      padding={0.3}
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={({ data }) => data.color}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 1.6]]
      }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Session Status',
        legendPosition: 'middle',
        legendOffset: 32
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Count',
        legendPosition: 'middle',
        legendOffset: -30,
        tickValues: maxValue <= 20 ? 
          // For small values, show every 5
          Array.from({ length: Math.floor(maxValue / 5) + 2 }, (_, i) => i * 5) :
          // For larger values, use calculated interval
          Array.from({ length: Math.floor(maxValue / tickInterval) + 2 }, (_, i) => i * tickInterval)
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={theme.palette.text.primary}
      theme={{
        background: 'transparent',
        text: {
          fontSize: 11,
          fill: theme.palette.text.secondary,
        },
        axis: {
          domain: {
            line: {
              stroke: theme.palette.divider,
              strokeWidth: 1
            }
          },
          legend: {
            text: {
              fontSize: 12,
              fill: theme.palette.text.primary,
              fontWeight: 600
            }
          },
          ticks: {
            line: {
              stroke: theme.palette.divider,
              strokeWidth: 1
            },
            text: {
              fontSize: 10,
              fill: theme.palette.text.secondary
            }
          }
        },
        tooltip: {
          container: {
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontSize: 12,
            borderRadius: theme.shape.borderRadius || 4,
            boxShadow: theme.shadows[4],
            border: `1px solid ${theme.palette.divider}`,
            padding: '9px 12px'
          }
        }
      }}
      tooltip={({ id, value, color, data }) => (
        <div
          style={{
            background: theme.palette.background.paper,
            padding: '9px 12px',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: theme.shape.borderRadius || 4,
            boxShadow: theme.shadows[4],
            color: theme.palette.text.primary
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {data.status}
          </div>
          <div style={{ color: color }}>
            Count: {value}
          </div>
        </div>
      )}
    />
  );
};

const SessionsHealthChart = memo(SessionsHealthChartBase);
SessionsHealthChart.displayName = 'SessionsHealthChart';
export default SessionsHealthChart;