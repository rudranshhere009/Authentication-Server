import { Box, Typography } from "@mui/material";
import { ResponsiveLine } from "@nivo/line";

const ORANGE = "#DC2626";
const ORANGE_LT = "#EF4444";
const CHAR_400 = "#2D333B";
const CHAR_700 = "#0F1117";
const TEXT_300 = "#8B949E";
const TEXT_100 = "#F0F6FC";

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
  grid: { line: { stroke: CHAR_400, strokeWidth: 1, strokeDasharray: "4 4" } },
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

const WeeklyLoginChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Typography sx={{ color: TEXT_300 }}>No data available</Typography>
      </Box>
    );
  }

  const dayLabels = data.map((d) => d.day);
  const nivoData = [
    {
      id: "Logins",
      color: ORANGE,
      data: data.map((item, i) => ({
        x: i + 1,
        y: item.logins,
        day: item.day,
      })),
    },
  ];

  return (
    <ResponsiveLine
      data={nivoData}
      margin={{ top: 20, right: 30, bottom: 55, left: 55 }}
      xScale={{ type: "linear", min: 1, max: 7 }}
      yScale={{ type: "linear", min: "auto", max: "auto" }}
      curve="monotoneX"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 4,
        tickPadding: 8,
        legend: "Day",
        legendOffset: 42,
        legendPosition: "middle",
        tickValues: [1, 2, 3, 4, 5, 6, 7],
        format: (v) => dayLabels[v - 1] || "",
      }}
      axisLeft={{
        tickSize: 4,
        tickPadding: 8,
        legend: "Logins",
        legendOffset: -44,
        legendPosition: "middle",
      }}
      enableArea={true}
      areaOpacity={0.12}
      areaBaselineValue={0}
      enablePoints={true}
      pointSize={7}
      pointColor={CHAR_700}
      pointBorderWidth={2}
      pointBorderColor={ORANGE}
      lineWidth={2.5}
      enableGridX={false}
      enableGridY={true}
      colors={[ORANGE]}
      useMesh={true}
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
      tooltip={({ point }) => (
        <Box
          sx={{
            background: CHAR_700,
            p: "8px 12px",
            border: `1px solid ${CHAR_400}`,
            borderRadius: "8px",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: TEXT_100, fontSize: "0.8rem" }}
          >
            {point.data.day}
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
  );
};

export default WeeklyLoginChart;
