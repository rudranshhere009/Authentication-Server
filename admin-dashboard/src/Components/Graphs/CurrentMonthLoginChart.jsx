
import { Box, Typography, useTheme } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";

const CurrentMonthLoginChart = ({ data, monthTitle, darkMode }) => {
    const theme = useTheme();
    const daysInMonth = data.length;

    // Build Nivo series
    const nivoData = [
        {
            id: "logins",
            color: theme.palette.primary.main,
            data: data.map((d) => ({
                x: d.dayNumber, // 1..daysInMonth
                y: d.logins,
                label: d.dateLabel
            }))
        }
    ];

    const tickValues = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const today = new Date().getDate();

    // Theme-aware colors for the "Today" marker
    const getTodayMarkerColor = () => {
        if (darkMode) {
            return theme.palette.secondary.main; // Bright green in dark mode
        } else {
            return theme.palette.secondary.main; // Use secondary color in light mode
        }
    };

    return (
        <ResponsiveLine
            data={nivoData}
            margin={{ top: 20, right: 30, bottom: 60, left: 60 }}
            xScale={{ type: "linear", min: 1, max: daysInMonth }}
            yScale={{ type: "linear", min: "auto", max: "auto" }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 10,
                legend: `Days in ${monthTitle}`,
                legendOffset: 46,
                legendPosition: "middle",
                tickValues,
                format: (v) => `${v}`
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 10,
                legend: "User Logins",
                legendOffset: -50,
                legendPosition: "middle"
            }}
            pointSize={8}
            pointColor={theme.palette.background.paper}
            pointBorderWidth={3}
            pointBorderColor={theme.palette.primary.main}
            lineWidth={3}
            enableArea={false}
            enablePoints={true}
            enableGridX={true}
            enableGridY={true}
            useMesh={true}
            colors={[theme.palette.primary.main]}
            gridXValues={tickValues}
            theme={{
                background: "transparent",
                text: { 
                    fontSize: 12, 
                    fill: darkMode ? '#b0bec5' : theme.palette.text.secondary 
                },
                axis: {
                    domain: { 
                        line: { 
                            stroke: darkMode ? '#2d3748' : theme.palette.divider 
                        } 
                    },
                    legend: { 
                        text: { 
                            fontSize: 14, 
                            fill: darkMode ? '#ffffff' : theme.palette.text.primary, 
                            fontWeight: 600 
                        } 
                    },
                    ticks: {
                        line: { 
                            stroke: darkMode ? '#2d3748' : theme.palette.divider 
                        },
                        text: { 
                            fontSize: 11, 
                            fill: darkMode ? '#b0bec5' : theme.palette.text.secondary 
                        }
                    }
                },
                grid: { 
                    line: { 
                        stroke: darkMode ? '#2d3748' : theme.palette.divider, 
                        strokeDasharray: "4 4" 
                    } 
                },
                tooltip: {
                    container: {
                        background: darkMode ? '#1a2332' : theme.palette.background.paper,
                        color: darkMode ? '#ffffff' : theme.palette.text.primary,
                        fontSize: 12,
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: darkMode 
                            ? '0 8px 32px rgba(0, 0, 0, 0.6)' 
                            : theme.shadows[4],
                        border: `1px solid ${darkMode ? '#2d3748' : theme.palette.divider}`
                    }
                }
            }}
            markers={[
                {
                    axis: "x",
                    value: today,
                    lineStyle: { 
                        stroke: getTodayMarkerColor(), 
                        strokeWidth: 2, 
                        strokeDasharray: "6 6" 
                    },
                    legend: "Today",
                    legendPosition: "top-left",
                    textStyle: {
                        fill: darkMode ? '#ffffff' : theme.palette.text.primary,
                        fontSize: 12,
                        fontWeight: 600
                    }
                }
            ]}
            tooltip={({ point }) => (
                <Box sx={{ 
                    background: darkMode ? '#1a2332' : theme.palette.background.paper, 
                    p: "9px 12px", 
                    border: `1px solid ${darkMode ? '#2d3748' : theme.palette.divider}`, 
                    borderRadius: 1, 
                    boxShadow: darkMode 
                        ? '0 8px 32px rgba(0, 0, 0, 0.6)' 
                        : theme.shadows[4],
                    color: darkMode ? '#ffffff' : theme.palette.text.primary,
                }}>
                    <Typography variant="body2" sx={{ 
                        fontWeight: 600,
                        color: darkMode ? '#ffffff' : theme.palette.text.primary,
                    }}>
                        {point.data.label}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                        color: theme.palette.primary.main 
                    }}>
                        Logins: {point.data.y}
                    </Typography>
                </Box>
            )}
        />
    );
};

export default CurrentMonthLoginChart;