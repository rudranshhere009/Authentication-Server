
import { 
  Container, 
  Box, 
  Typography, 
  Button, 
  TextField, 
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack
} from "@mui/material";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useState } from 'react';
import UsersTable from '../Components/tables/UsersTable';

const UsersPage = ({ users, toggleBlock }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [rankFilter, setRankFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const filter = searchParams.get("filter") || 'all';

  // Predefined ranks and departments
  const ranks = ['Private', 'Corporal', 'Sergeant', 'Lieutenant', 'Captain'];
  const departments = ['Operations', 'Logistics', 'Intelligence', 'Communications', 'Training'];

  const filteredUsers = (users || []).filter(user => {
    // Apply base filter conditions
    const baseFilterCondition = (() => {
      if (filter === "active") return !user.is_blocked;
      if (filter === "blocked") return user.is_blocked;
      if (filter === "admin") return user.is_admin;
      return true;
    })();

    if (!baseFilterCondition) return false;

    // Apply additional filters
    const rankCondition = rankFilter === 'all' || user.rank === rankFilter;
    const departmentCondition = departmentFilter === 'all' || user.department === departmentFilter;

    // If user doesn't have a rank or department, show them only in "all" filter
    if (rankFilter !== 'all' && !user.rank) return false;
    if (departmentFilter !== 'all' && !user.department) return false;
    
    // Apply search query if it exists
    const searchCondition = !searchQuery || (
      user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.display_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return rankCondition && departmentCondition && searchCondition;
  });
  const handleBackNavigation = () => {
    // Navigate back to dashboard or main page
    // You can adjust this path based on your app structure
    navigate('/', { replace: true });
  };

  return (
    <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 3 } }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={handleBackNavigation}
        sx={{ 
          mb: 3, 
          color: 'primary.main',
          textTransform: 'none',
          fontWeight: 500,
          '&:hover': {
            backgroundColor: 'transparent',
            textDecoration: 'underline'
          }
        }}
        variant="text"
      >
        Back to Dashboard
      </Button>

      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 98, 255, 0.08)',
          p: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            alignItems: 'center', 
            mb: 3
          }}>
            <Typography variant="h5" sx={{ 
              color: 'primary.main', 
              fontWeight: 600,
              mb: { xs: 2, md: 0 },
              width: { xs: '100%', md: 'auto' }
            }}>
              {filter !== "undefined" ? `${filter.charAt(0).toUpperCase() + filter.slice(1)}` : ''} Users
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: 2,
              width: { xs: '100%', md: 'auto' },
              flexWrap: 'wrap'
            }}>
              <Box sx={{ 
                display: 'flex', 
                gap: 1.5, 
                alignItems: 'center',
                bgcolor: 'background.default',
                borderRadius: 2,
                p: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary', fontSize: '0.85rem' }}>
                    Rank:
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 100 }} variant="standard">
                    <Select
                      value={rankFilter}
                      onChange={(e) => setRankFilter(e.target.value)}
                      disableUnderline
                      sx={{ 
                        '& .MuiSelect-select': { 
                          py: 0, 
                          fontSize: '0.9rem',
                          fontWeight: 500
                        }
                      }}
                    >
                      <MenuItem value="all">All Ranks</MenuItem>
                      {ranks.map(rank => (
                        <MenuItem key={rank} value={rank}>{rank}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 1, color: 'text.secondary', fontSize: '0.85rem' }}>
                    Department:
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 120 }} variant="standard">
                    <Select
                      value={departmentFilter}
                      onChange={(e) => setDepartmentFilter(e.target.value)}
                      disableUnderline
                      sx={{ 
                        '& .MuiSelect-select': { 
                          py: 0, 
                          fontSize: '0.9rem',
                          fontWeight: 500
                        }
                      }}
                    >
                      <MenuItem value="all">All Departments</MenuItem>
                      {departments.map(dept => (
                        <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              <TextField
                size="small"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 2 }
                }}
                sx={{ 
                  width: { xs: '100%', sm: '250px' }
                }}
              />
            </Box>
          </Box>
        </Box>
        <UsersTable users={filteredUsers} toggleBlock={toggleBlock} filter={filter} />
      </Box>
    </Container>
  );
};

export default UsersPage;


