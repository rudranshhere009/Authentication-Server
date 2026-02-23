import { Box, Typography } from "@mui/material";
import { ResponsiveHeatMap } from "@nivo/heatmap";

const ORANGE = "#DC2626";
const ORANGE_LT = "#EF4444";
const CHAR_400 = "#2D333B";
const CHAR_700 = "#0F1117";
const CHAR_600 = "#161B22";
const CHAR_500 = "#1C2128";
const TEXT_300 = "#8B949E";
const TEXT_100 = "#F0F6FC";

const nivoTheme = {
  background: "transparent",
  text: { fontSize: 11, fill: TEXT_300, fontWeight: 500 },
  axis: {
    domain: { line: { stroke: CHAR_400 } },
    legend: {
      text: { fontSize: 13, fill: TEXT_100, fontWeight: 600 },
    },
    ticks: {
      line: { stroke: CHAR_400 },
      text: { fontSize: 10, fill: TEXT_300, fontWeight: 500 },
    },
  },
  tooltip: {
    container: {
      background: CHAR_700,
      color: TEXT_100,
      fontSize: 12,
      borderRadius: 8,
      border: `1px solid ${CHAR_400}`,
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
    },
  },
};

const HourlyActivityHeatMap = ({ allsessions = [] }) => {
  const processHeatmapData = () => {
    const days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const hours = Array.from({ length: 24 }, (_, i) => i);

    const activityMatrix = {};
    days.forEach((day) => {
      activityMatrix[day] = {};
      hours.forEach((hour) => {
        activityMatrix[day][hour] = 0;
      });
    });

    const today = new Date();
    const currentDayOfWeek = today.getDay();
    const daysToSubtract = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    const currentWeekMonday = new Date(today);
    currentWeekMonday.setDate(today.getDate() - daysToSubtract);
    currentWeekMonday.setHours(0, 0, 0, 0);

    if (Array.isArray(allsessions)) {
      allsessions.forEach((session) => {
        if (!session?.created_at) return;
        const date = new Date(session.created_at);
        if (date >= currentWeekMonday && date <= today) {
          const dayOfWeek = date.getDay();
          const hour = date.getHours();
          const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
          const dayName = days[dayIndex];
          activityMatrix[dayName][hour]++;
        }
      });
    }

    return days.map((day) => ({
      id: day,
      data: hours.map((hour) => ({
        x: `${hour}:00`,
        y: activityMatrix[day][hour],
      })),
    }));
  };

  const heatmapData = processHeatmapData();

  const maxValue = Math.max(
    ...heatmapData.flatMap((day) => day.data.map((h) => h.y)),
    1,
  );

  const heatmapColors = {
    type: "sequential",
    colors: [
      CHAR_600, // empty / zero
      CHAR_500, // very low
      "#4A2E14", // low-mid
      "#7A3D0A", // mid
      "#B84E06", // high
      ORANGE, // very high
      ORANGE_LT, // peak
    ],
    minValue: 0,
    maxValue: maxValue || 10,
  };

  const tickHours = [
    "0:00",
    "2:00",
    "4:00",
    "6:00",
    "8:00",
    "10:00",
    "12:00",
    "14:00",
    "16:00",
    "18:00",
    "20:00",
    "22:00",
  ];

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <ResponsiveHeatMap
        data={heatmapData}
        margin={{ top: 60, right: 40, bottom: 80, left: 140 }}
        valueFormat=">-.0f"
        axisTop={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: "",
          legendOffset: 36,
          tickValues: tickHours,
        }}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: "Hours of Day",
          legendPosition: "middle",
          legendOffset: 50,
          tickValues: tickHours,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 15,
          tickRotation: 0,
          legend: "Days of Week",
          legendPosition: "middle",
          legendOffset: -100,
        }}
        colors={heatmapColors}
        emptyColor={CHAR_600}
        borderColor={CHAR_700}
        borderWidth={2}
        borderRadius={4}
        enableLabels={true}
        labelTextColor={(cell) =>
          cell.value > maxValue * 0.4 ? "#ffffff" : TEXT_300
        }
        cellOpacity={0.88}
        cellHoverOpacity={1}
        theme={nivoTheme}
        tooltip={({ cell }) => (
          <Box
            sx={{
              background: CHAR_700,
              p: "10px 14px",
              border: `1px solid ${CHAR_400}`,
              borderRadius: "8px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              color: TEXT_100,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 600,
                mb: 0.5,
                color: TEXT_100,
                fontSize: "0.82rem",
              }}
            >
              {cell.serieId} at {cell.data.x}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: ORANGE_LT, fontSize: "0.82rem" }}
            >
              {cell.formattedValue} logins
            </Typography>
          </Box>
        )}
      />
    </Box>
  );
};

export default HourlyActivityHeatMap;
