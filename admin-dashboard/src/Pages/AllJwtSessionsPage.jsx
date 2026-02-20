// 

import JwtSessionsTable from '../Components/tables/JwtSessionsTable'
import { Container, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const AllJwtSessionsPage = ({
  title,
  jwtSessions,           // FIXED: Changed from allJwtSessions to jwtSessions
  jwtTotal,              // ADDED: Total count for pagination
  jwtLoading,            // ADDED: Loading state for pagination
  fetchJwtSessionsPage,  // ADDED: Fetch function for pagination
  onRevokeSession,
  isLoading
}) => {
  const navigate = useNavigate();

  console.log("AllJwtSessionsPage received:", {
    title,
    jwtSessions: jwtSessions?.length,
    jwtTotal,
    jwtLoading,
    isLoading,
    fetchJwtSessionsPage: !!fetchJwtSessionsPage
  });

  const handleBackNavigation = () => {
    navigate('/', { replace: true });
  };

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 3 } }}>
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
          borderRadius: '12px',
          boxShadow: 3,
          p: { xs: 1.5, sm: 3 },
        }}
      >
        <JwtSessionsTable
          title={title}
          jwtsessions={jwtSessions}           // FIXED: Pass jwtSessions
          onRevokeSession={onRevokeSession}
          isLoading={isLoading}
          total={jwtTotal}                   // ADDED: Pass total count
          fetchpage={fetchJwtSessionsPage}   // ADDED: Pass fetch function
          jwtLoading={jwtLoading}            // ADDED: Pass loading state
        />
      </Box>
    </Container>
  );
}

export default AllJwtSessionsPage;