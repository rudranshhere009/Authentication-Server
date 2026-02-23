import { ResponsivePie } from "@nivo/pie";
import { Box, Typography } from "@mui/material";

const ORANGE = "#DC2626";
const ORANGE_LT = "#EF4444";
const ROSE = "#F43F5E";
const CHAR_400 = "#2D333B";
const CHAR_700 = "#0F1117";
const TEXT_300 = "#8B949E";
const TEXT_100 = "#F0F6FC";
const AMBER = "#F59E0B";

const UserDistributionChart = ({ users }) => {
  if (!users || users.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Typography sx={{ color: TEXT_300 }}>No user data</Typography>
      </Box>
    );
  }

  const adminCount = users.filter((u) => u.is_admin && !u.is_blocked).length;
  const activeCount = users.filter((u) => !u.is_admin && !u.is_blocked).length;
  const blockedCount = users.filter((u) => u.is_blocked).length;

  const data = [
    { id: "Active", label: "Active Users", value: activeCount, color: ORANGE },
    { id: "Admins", label: "Admins", value: adminCount, color: AMBER },
    { id: "Blocked", label: "Blocked", value: blockedCount, color: ROSE },
  ].filter((d) => d.value > 0);

  if (!data.length) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Typography sx={{ color: TEXT_300 }}>No data</Typography>
      </Box>
    );
  }

  return (
    <ResponsivePie
      data={data}
      margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
      innerRadius={0.55}
      padAngle={2}
      cornerRadius={4}
      activeOuterRadiusOffset={5}
      colors={({ data }) => data.color}
      borderWidth={0}
      arcLinkLabelsSkipAngle={12}
      arcLinkLabelsTextColor={TEXT_300}
      arcLinkLabelsThickness={1.5}
      arcLinkLabelsColor={{ from: "color" }}
      arcLabelsSkipAngle={12}
      arcLabelsTextColor="#ffffff"
      theme={{
        background: "transparent",
        text: { fontSize: 11, fill: TEXT_300 },
        labels: { text: { fontSize: 11, fill: TEXT_100, fontWeight: 600 } },
        tooltip: {
          container: {
            background: CHAR_700,
            color: TEXT_100,
            fontSize: 12,
            borderRadius: 8,
            border: `1px solid ${CHAR_400}`,
          },
        },
      }}
      tooltip={({ datum }) => (
        <div
          style={{
            background: CHAR_700,
            padding: "8px 12px",
            border: `1px solid ${CHAR_400}`,
            borderRadius: 8,
            color: TEXT_100,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{datum.label}</div>
          <div style={{ color: datum.color }}>Count: {datum.value}</div>
        </div>
      )}
    />
  );
};

export default UserDistributionChart;
