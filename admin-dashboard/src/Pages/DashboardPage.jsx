





import { Container, Box } from "@mui/material";

import SessionsTable from "../Components/tables/SessionsTable";
import JwtSessionsTable from "../Components/tables/JwtSessionsTable";
import SessionsHealthChart from '../Components/Graphs/SessionsHealthChart';
import UserDistributionChart from '../Components/Graphs/UserDistributionChart';
import GraphCard from '../Components/global/GraphCard';
import WeeklyLoginChart from '../Components/Graphs/WeeklyLoginChart';
import QuickViewCard from '../Components/global/QuickViewCard';
import CurrentMonthLoginChart from "../Components/Graphs/CurrentMonthLoginChart";

// This component now receives all its data and functions via props
const DashboardPage = ({
  users = [],
  jwtSessions = [],
  recentJwtSessions = [],
  handleRevokeSession,
  isLoading,
  weeklyLogindata,
  fetchJwtSessions,
  jwtSessiontotal,
  currentMonthLogindata,
  darkMode,
}) => {
  // Use currentMonthLogindata prop directly
  const monthlyData = currentMonthLogindata?.data || [];
  const monthTitle = currentMonthLogindata?.monthTitle || 'Current Month';

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          p: { xs: 2, sm: 3, md: 4 },
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Top Metrics Row */}
        <Box
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)'
          }}
          gap={{ xs: 2, sm: 3 }}
          mb={4}
        >
          <QuickViewCard Title="Total Users" Value={users?.length || 0} compact={true} filterKey="all" darkMode={darkMode} />
          <QuickViewCard Title="Active Users" Value={users?.filter(u => !u.is_blocked)?.length || 0} compact={true} filterKey="active" darkMode={darkMode} />
          <QuickViewCard Title="Active Sessions" Value={jwtSessions?.filter(s => {
            if (!s.is_active) return false;
            const now = new Date();
            const fifteenMinutesAgo = new Date(now - 15 * 60 * 1000);
            const sessionDate = new Date(s.created_at);
            return sessionDate > fifteenMinutesAgo;
          })?.length || 0} compact={true} filterKey="sessions" darkMode={darkMode} />
          <QuickViewCard Title="Blocked Users" Value={users?.filter(u => u.is_blocked)?.length || 0} compact={true} color="error" filterKey="blocked" darkMode={darkMode} />
          <QuickViewCard Title="Admin Users" Value={users?.filter(u => u.is_admin)?.length || 0} compact={true} color="secondary" filterKey="admin" darkMode={darkMode} />
          <QuickViewCard Title="JWT Sessions" Value={jwtSessiontotal || jwtSessions?.length || 0} compact={true} color="info" filterKey="jwt" darkMode={darkMode} />
        </Box>

        {/* Monthly Login Chart - Full Width */}
        <Box sx={{ mb: 4 }}>
          <GraphCard
          darkMode={darkMode}
            title="Monthly JWT Login Trends"
            chart={<CurrentMonthLoginChart data={monthlyData} monthTitle={monthTitle} source="jwt" />}
            height={320}
          />
        </Box>

        {/* Weekly Charts Row */}
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', lg: '2fr 1fr' }}
          gap={{ xs: 3, sm: 4 }}
          mb={4}
        >
          {/* Weekly Login Chart - Takes 2/3 space on large screens */}
          <GraphCard
          darkMode={darkMode}
            title='Weekly User Logins'
            chart={<WeeklyLoginChart data={weeklyLogindata} />}
            height={300}
          />
          {/* Right Column - Stacked Charts */}
          <Box display="grid" gridTemplateRows="1fr 1fr" gap={{ xs: 2, sm: 3 }}>
            <GraphCard
              darkMode={darkMode}
              title='Session Health'
              chart={<SessionsHealthChart sessions={jwtSessions} />}
              height={140}
            />
            <GraphCard
            darkMode={darkMode}
              title='User Distribution'
              chart={<UserDistributionChart users={users} />}
              height={140}
            />
          </Box>
        </Box>

        {/* Tables Section */}
        <Box
          display="grid"
          //gridTemplateColumns={{ xs: '1fr', xl: '1fr 1fr' }}
          gap={{ xs: 3, sm: 4 }}
        >
          <JwtSessionsTable
            title="Recent JWT Sessions"
            jwtsessions={recentJwtSessions}
            onRevokeSession={handleRevokeSession}
            isLoading={isLoading}
            total={recentJwtSessions?.length || 0}
            fetchpage={fetchJwtSessions}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default DashboardPage;