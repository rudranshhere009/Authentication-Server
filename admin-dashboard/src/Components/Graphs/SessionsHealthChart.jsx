import { Box, Typography } from "@mui/material";
import { ResponsiveBar } from "@nivo/bar";
import { memo, useMemo } from "react";

const EMERALD = "#10B981";
const AMBER = "#F59E0B";
const ROSE = "#F43F5E";
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
  grid: { line: { stroke: CHAR_400, strokeDasharray: "4 4" } },
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

const SessionsHealthChartBase = ({ sessions }) => {
  const counts = useMemo(() => {
    if (!Array.isArray(sessions) || !sessions.length)
      return { active: 0, inactive: 0, expired: 0 };
    const now = new Date();
    const fifteenAgo = new Date(now - 15 * 60 * 1000);
    return sessions.reduce(
      (a, s) => {
        if (!s.is_active) a.inactive++;
        else {
          const d = new Date(s.created_at);
          a[d > fifteenAgo ? "active" : "expired"]++;
        }
        return a;
      },
      { active: 0, inactive: 0, expired: 0 },
    );
  }, [sessions]);

  if (!Array.isArray(sessions) || !sessions.length)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Typography sx={{ color: TEXT_300 }}>No session data</Typography>
      </Box>
    );

  const { active, inactive, expired } = counts;
  const maxVal = Math.max(active, inactive, expired, 1);
  const ticks = Array.from(
    { length: Math.floor(maxVal / 5) + 2 },
    (_, i) => i * 5,
  );

  const data = [
    { status: "Active", count: active, color: EMERALD },
    { status: "Inactive", count: inactive, color: AMBER },
    { status: "Expired", count: expired, color: ROSE },
  ];

  return (
    <ResponsiveBar
      data={data}
      keys={["count"]}
      indexBy="status"
      margin={{ top: 10, right: 10, bottom: 42, left: 40 }}
      padding={0.35}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      colors={({ data }) => data.color}
      borderRadius={5}
      borderColor={{ from: "color", modifiers: [["darker", 1.4]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 4,
        tickPadding: 6,
        legend: "Status",
        legendPosition: "middle",
        legendOffset: 32,
        tickTextColor: TEXT_300,
      }}
      axisLeft={{
        tickSize: 4,
        tickPadding: 6,
        legend: "Count",
        legendPosition: "middle",
        legendOffset: -30,
        tickValues: ticks,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor="#ffffff"
      theme={nivoTheme}
      tooltip={({ data: d, value, color }) => (
        <div
          style={{
            background: CHAR_700,
            padding: "8px 12px",
            border: `1px solid ${CHAR_400}`,
            borderRadius: 8,
            color: TEXT_100,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{d.status}</div>
          <div style={{ color }}>Count: {value}</div>
        </div>
      )}
    />
  );
};

const SessionsHealthChart = memo(SessionsHealthChartBase);
SessionsHealthChart.displayName = "SessionsHealthChart";
export default SessionsHealthChart;
