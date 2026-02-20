


import { Container, Box, Typography, Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import SessionsHealthChart from '../Components/Graphs/SessionsHealthChart';
import UserDistributionChart from '../Components/Graphs/UserDistributionChart';
import GraphCard from '../Components/global/GraphCard';
import WeeklyLoginChart from '../Components/Graphs/WeeklyLoginChart';
import MonthlyLoginChart from '../Components/Graphs/MonthlyLoginChart';
import HourlyActivityHeatmap from '../Components/Graphs/HourlyActivityHeatMap';

const AnalyticsPage = ({
  weeklyLogindata = [],
  allsessions = [],
  users = [],
  darkMode
  

}) => {
  const navigate = useNavigate();

  const handleBackNavigation = () => {
    // Navigate back to dashboard or main page
    // You can adjust this path based on your app structure
    navigate('/', { replace: true });
  };


  return (
    <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
      {/* Back to Dashboard Button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBackNavigation}
        sx={{ mb: 2 }}
      >
        Back to Dashboard
      </Button>


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


        <Typography variant="h5" gutterBottom>
          Analytics Dashboard
        </Typography>

        {/* Monthly Login Chart - Full Width */}
        <Box sx={{ mb: 4 }}>
          <GraphCard
            darkMode={darkMode}
            title="Monthly Login History"
            chart={<MonthlyLoginChart allsessions={allsessions} />}
            height={360}
          />
        </Box>

        {/* Weekly and Distribution Charts Row */}
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', lg: '2fr 1fr' }}
          gap={{ xs: 3, sm: 4 }}
          mb={4}
        >
          {/* Weekly Login Chart */}
          <GraphCard
            darkMode={darkMode}
            title='Weekly User Logins (Last 7 Days)'
            chart={<WeeklyLoginChart data={weeklyLogindata} />}
            height={320}
          />

          {/* Right Column - Stacked Charts */}
          <Box display="grid" gridTemplateRows="1fr 1fr" gap={{ xs: 2, sm: 3 }}>
            <GraphCard
            darkMode={darkMode}
              title='Session Health Overview'
              chart={<SessionsHealthChart sessions={allsessions} />}
              height={150}
            />
            <GraphCard
              darkMode={darkMode}
              title='User Distribution'
              chart={<UserDistributionChart users={users} />}
              height={150}
            />
          </Box>
        </Box>

        {/* Hourly Activity Heatmap - Full Width */}
        <Box sx={{ mb: 4 }}>
          <GraphCard
          darkMode={darkMode}
            title="Hourly Activity Heatmap"
            chart={<HourlyActivityHeatmap allsessions={allsessions} />}
            height={400}
          />
        </Box>

        {/* Additional Analytics Row */}
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
          gap={{ xs: 3, sm: 4 }}
        >
          {/* Login Trends Summary */}
          <GraphCard
          darkMode={darkMode}
            title="Login Trends Analysis"
            chart={
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ mb: 2, color: 'text.secondary' }}>
                  Summary Statistics
                </Typography>
                <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      {allsessions?.length || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Total Sessions
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main' }}>
                      {allsessions?.filter(s => s.is_active)?.length || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Active Sessions
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'info.main' }}>
                      {users?.filter(u => !u.is_blocked)?.length || 0}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Active Users
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main' }}>
                      {Math.round(((allsessions?.filter(s => s.is_active)?.length || 0) / Math.max(users?.length || 1, 1)) * 100)}%
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Engagement Rate
                    </Typography>
                  </Box>
                </Box>
              </Box>
            }
            height={200}
          />

          {/* User Activity Metrics */}
          <GraphCard
          darkMode={darkMode}
            title="User Activity Metrics"
            chart={
              <Box sx={{ p: 2 }}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Admin Users
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                      {users?.filter(u => u.is_admin)?.length || 0}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Blocked Users
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                      {users?.filter(u => u.is_blocked)?.length || 0}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Recent Sessions (Last 7 Days)
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'info.main' }}>
                      {(() => {
                        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                        return allsessions?.filter(s => new Date(s.created_at) >= sevenDaysAgo)?.length || 0;
                      })()}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Average Daily Logins
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                      {Math.round((weeklyLogindata?.reduce((sum, day) => sum + day.logins, 0) || 0) / 7)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            }
            height={200}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default AnalyticsPage;