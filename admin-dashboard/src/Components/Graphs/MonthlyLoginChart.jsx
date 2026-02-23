import { useState } from "react";
import { Box, Typography, IconButton, Stack } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { ResponsiveLine } from "@nivo/line";

const ORANGE = "#DC2626";
const ORANGE_LT = "#EF4444";
const CHAR_400 = "#2D333B";
const CHAR_700 = "#0F1117";
const TEXT_300 = "#8B949E";
const TEXT_100 = "#F0F6FC";
const EMERALD = "#10B981";

const nivoTheme = {
  background: "transparent",
  text: { fontSize: 11, fill: TEXT_300 },
  axis: {
    domain: { line: { stroke: CHAR_400, strokeWidth: 1 } },
    legend: { text: { fontSize: 12, fill: TEXT_100, fontWeight: 600 } },
    ticks: {
      line: { stroke: CHAR_400, strokeWidth: 1 },
      text: { fontSize: 10, fill: TEXT_300 },
    },
  },
  grid: { line: { stroke: CHAR_400, strokeDasharray: "4 4" } },
  crosshair: {
    line: {
      stroke: ORANGE,
      strokeWidth: 1,
      strokeOpacity: 0.75,
      strokeDasharray: "6 6",
    },
  },
  tooltip: {
    container: {
      background: CHAR_700,
      color: TEXT_100,
      fontSize: 12,
      borderRadius: 8,
      border: `1px solid ${CHAR_400}`,
    },
  },
};

const MonthlyLoginChart = ({ allsessions = [] }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const calculateMonthData = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const counts = Array.from({ length: daysInMonth }, () => 0);

    if (Array.isArray(allsessions)) {
      for (const session of allsessions) {
        if (!session?.created_at) continue;
        const sessionDate = new Date(session.created_at);
        if (
          sessionDate.getFullYear() === year &&
          sessionDate.getMonth() === month
        ) {
          counts[sessionDate.getDate() - 1] += 1;
        }
      }
    }

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthShort = monthNames[month];

    return counts.map((count, index) => ({
      x: index + 1,
      y: count,
      label: `${monthShort} ${index + 1}, ${year}`,
    }));
  };

  const navigateMonth = (direction) => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthData = calculateMonthData(year, month);
  const monthTitle = selectedDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const nivoData = [
    {
      id: "logins",
      color: ORANGE,
      data: monthData,
    },
  ];

  const tickValues = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const currentDay = isCurrentMonth ? today.getDate() : null;

  return (
    <Box sx={{ height: "100%", position: "relative" }}>
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
            color: ORANGE,
            borderRadius: "8px",
            "&:hover": {
              bgcolor: "rgba(220,38,38,0.12)",
              color: ORANGE_LT,
            },
          }}
        >
          <ChevronLeft />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: TEXT_100,
            textAlign: "center",
            minWidth: "200px",
            fontSize: "0.95rem",
          }}
        >
          {monthTitle}
        </Typography>

        <IconButton
          onClick={() => navigateMonth(1)}
          size="small"
          sx={{
            color: ORANGE,
            borderRadius: "8px",
            "&:hover": {
              bgcolor: "rgba(220,38,38,0.12)",
              color: ORANGE_LT,
            },
          }}
        >
          <ChevronRight />
        </IconButton>
      </Stack>

      {/* Chart */}
      <Box sx={{ height: "calc(100% - 60px)" }}>
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
            format: (v) => `${v}`,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 10,
            legend: "User Logins",
            legendOffset: -50,
            legendPosition: "middle",
          }}
          pointSize={6}
          pointColor={CHAR_700}
          pointBorderWidth={2}
          pointBorderColor={ORANGE}
          lineWidth={2.5}
          enableArea={true}
          areaOpacity={0.12}
          areaBaselineValue={0}
          enablePoints={true}
          enableGridX={false}
          enableGridY={true}
          useMesh={true}
          colors={[ORANGE]}
          gridXValues={tickValues}
          theme={nivoTheme}
          defs={[
            {
              id: "orangeGradient",
              type: "linearGradient",
              colors: [
                { offset: 0, color: ORANGE, opacity: 0.4 },
                { offset: 100, color: ORANGE, opacity: 0 },
              ],
            },
          ]}
          fill={[{ match: "*", id: "orangeGradient" }]}
          markers={
            currentDay
              ? [
                  {
                    axis: "x",
                    value: currentDay,
                    lineStyle: {
                      stroke: EMERALD,
                      strokeWidth: 2,
                      strokeDasharray: "6 6",
                    },
                    legend: "Today",
                    legendPosition: "top-left",
                    textStyle: {
                      fill: EMERALD,
                      fontSize: 11,
                      fontWeight: 600,
                    },
                  },
                ]
              : []
          }
          tooltip={({ point }) => (
            <Box
              sx={{
                background: CHAR_700,
                p: "9px 12px",
                border: `1px solid ${CHAR_400}`,
                borderRadius: "8px",
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                  color: TEXT_100,
                  fontSize: "0.8rem",
                }}
              >
                {point.data.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: ORANGE_LT, fontSize: "0.8rem" }}
              >
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
