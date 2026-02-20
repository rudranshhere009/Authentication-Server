
import { useState } from 'react';
import { Box, Typography, useTheme, IconButton, Stack } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { ResponsiveLine } from "@nivo/line";

const MonthlyLoginChart = ({ allsessions = [], darkMode }) => {
    const theme = useTheme();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const calculateMonthData = (year, month) => {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const counts = Array.from({ length: daysInMonth }, () => 0);

        if (Array.isArray(allsessions)) {
            for (const session of allsessions) {
                if (!session?.created_at) continue;
                const sessionDate = new Date(session.created_at);
                if (sessionDate.getFullYear() === year && sessionDate.getMonth() === month) {
                    counts[sessionDate.getDate() - 1] += 1;
                }
            }
        }

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthShort = monthNames[month];

        return counts.map((count, index) => ({
            x: index + 1,
            y: count,
            label: `${monthShort} ${index + 1}, ${year}`
        }));
    };

    const navigateMonth = (direction) => {
        setSelectedDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthData = calculateMonthData(year, month);
    const monthTitle = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const nivoData = [{
        id: "logins",
        color: theme.palette.primary.main,
        data: monthData
    }];

    const tickValues = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;
    const currentDay = isCurrentMonth ? today.getDate() : null;

    // Theme-aware colors for the "Today" marker
    const getTodayMarkerColor = () => {
        if (darkMode) {
            return theme.palette.secondary.main; // Bright green in dark mode
        } else {
            return theme.palette.secondary.main; // Use secondary color in light mode
        }
    };

    return (
        <Box sx={{ height: '100%', position: 'relative' }}>
            {/* Month Navigation Header */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
            >
                <IconButton
                    onClick={() => navigateMonth(-1)}
                    size="small"
                    sx={{
                        color: theme.palette.primary.main,
                        '&:hover': { bgcolor: theme.palette.primary.light + '20' }
                    }}
                >
                    <ChevronLeft />
                </IconButton>

                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: theme.palette.text.primary,
                        textAlign: 'center',
                        minWidth: '200px'
                    }}
                >
                    {monthTitle}
                </Typography>

                <IconButton
                    onClick={() => navigateMonth(1)}
                    size="small"
                    sx={{
                        color: theme.palette.primary.main,
                        '&:hover': { bgcolor: theme.palette.primary.light + '20' }
                    }}
                >
                    <ChevronRight />
                </IconButton>
            </Stack>

            {/* Chart */}
            <Box sx={{ height: 'calc(100% - 60px)' }}>
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
                    pointSize={6}
                    pointColor={theme.palette.background.paper}
                    pointBorderWidth={2}
                    pointBorderColor={theme.palette.primary.main}
                    lineWidth={3}
                    enableArea={true}
                    areaOpacity={0.1}
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
                    markers={currentDay ? [
                        {
                            axis: "x",
                            value: currentDay,
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
                    ] : []}
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
            </Box>
        </Box>
    );
};

export default MonthlyLoginChart;