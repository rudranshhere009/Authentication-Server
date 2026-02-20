



import { Box, Typography, useTheme } from "@mui/material";
import { ResponsiveLine } from '@nivo/line';

const WeeklyLoginChart = ({ data }) => {
  const theme = useTheme();

  // Transform data for Nivo format with numeric x values for linear scale
  const nivoData = [
    {
      id: "logins",
      color: theme.palette.primary.main,
      data: data.map((item, index) => ({
        x: index + 1, // Use numeric values (1-7 for days)
        y: item.logins,
        day: item.day // Keep day name for tooltip
      }))
    }
  ];

  // Day labels for the x-axis
  const dayLabels = data.map(item => item.day);

  return (
    <ResponsiveLine
      data={nivoData}
      margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
      xScale={{
        type: 'linear',
        min: 1,
        max: 7
      }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: false,
        reverse: false
      }}
      curve="monotoneX"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: 'bottom',
        tickSize: 5,
        tickPadding: 10,
        tickRotation: 0,
        legend: 'Days',
        legendOffset: 46,
        legendPosition: 'middle',
        tickValues: [1, 2, 3, 4, 5, 6, 7], // Show all 7 days
        format: (value) => dayLabels[value - 1] || '' // Convert numeric to day names
      }}
      axisLeft={{
        orient: 'left',
        tickSize: 5,
        tickPadding: 10,
        tickRotation: 0,
        legend: 'User Logins',
        legendOffset: -50,
        legendPosition: 'middle'
      }}
      pointSize={8}
      pointColor={theme.palette.background.paper}
      pointBorderWidth={3}
      pointBorderColor={theme.palette.primary.main}
      pointLabelYOffset={-12}
      useMesh={true}
      colors={[theme.palette.primary.main]}
      lineWidth={3}
      enablePoints={true}
      enablePointLabel={false}
      enableArea={false}
      enableGridX={true}
      enableGridY={true}
      gridXValues={[1, 2, 3, 4, 5, 6, 7]} // Show grid for each day
      gridYValues={5}
      theme={{
        background: 'transparent',
        text: {
          fontSize: 12,
          fill: theme.palette.text.secondary,
          outlineWidth: 0,
          outlineColor: 'transparent'
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
              fontSize: 14,
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
              fontSize: 11,
              fill: theme.palette.text.secondary
            }
          }
        },
        grid: {
          line: {
            stroke: theme.palette.divider,
            strokeWidth: 1,
            strokeDasharray: '4 4'
          }
        },
        crosshair: {
          line: {
            stroke: theme.palette.primary.main,
            strokeWidth: 1,
            strokeOpacity: 0.75,
            strokeDasharray: '6 6'
          }
        },
        tooltip: {
          container: {
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            fontSize: 12,
            borderRadius: theme.shape.borderRadius,
            boxShadow: theme.shadows[4],
            border: `1px solid ${theme.palette.divider}`
          }
        }
      }}
      tooltip={({ point }) => (
        <Box
          sx={{
            background: theme.palette.background.paper,
            padding: '9px 12px',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            boxShadow: theme.shadows[4]
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
            {point.data.day}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: theme.palette.primary.main }}
          >
            Logins: {point.data.y}
          </Typography>
        </Box>
      )}
    />
  );
};

export default WeeklyLoginChart;