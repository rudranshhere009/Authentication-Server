
  import{
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const UsersTable = ({ users, toggleBlock, filter }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  console.log('UsersTable received users:', users);

  const handleBlockClick = (event, username, isBlocked) => {
    event.stopPropagation(); 
    toggleBlock(username, !isBlocked);
  };

  const handleUserClick = (userId) => {
    // Use replace: false to maintain proper navigation history
    navigate(`/users/${userId}?filter=${filter}` , {replace: true});
  };

  return (
    <div>
     <TableContainer component={Paper} className="custom-table-container users-table" sx={{
          maxHeight:"60vh", // Set your desired height
          width: '100%', // Ensure full width
          overflow: 'auto', // Enable scrolling
          borderRadius: '12px',
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'divider',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: '#a8a8a8',
            },
          },
        }}>
       <Table stickyHeader sx={{ minWidth: '100%', tableLayout: 'fixed' }}>
                 <TableHead>
                   <TableRow>
              <TableCell width="7%" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Sr No.</TableCell>
              <TableCell width="18%" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Username</TableCell>
              <TableCell width="18%" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Department</TableCell>
              <TableCell width="15%" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Rank</TableCell>
              <TableCell width="10%" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Admin</TableCell>
              <TableCell width="32%" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.length > 0 ? (
              users.map((u , index) => (
                <TableRow 
                  key={u.id}
                  sx={{ 
                    '&:hover': { backgroundColor: 'action.hover' },
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ fontSize: '0.875rem' }}>{index+1}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', fontWeight: 500 }}>{u.username}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem' }}>{u.department || '-'}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem' }}>{u.rank || '-'}</TableCell>
                  <TableCell sx={{ fontSize: '0.875rem' }}>{u.is_admin ? "Yes" : "No"}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: 1 }}>
                      <Button
                        variant="outlined"
                        color={u.is_blocked ? "success" : "error"}
                        onClick={(event) => handleBlockClick(event, u.username, u.is_blocked)}
                        className="table-action-button"
                        size="small"
                        sx={{
                          borderRadius: '6px',
                          textTransform: 'none',
                          fontWeight: 500,
                          minWidth: '80px',
                          fontSize: '0.75rem',
                          py: 0.5
                        }}
                      >
                        {u.is_blocked ? "Unblock" : "Block"}
                      </Button>
                      <Button
                        variant="contained"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleUserClick(u.id);
                        }}
                        className="table-action-button"
                        size="small"
                        sx={{
                          backgroundColor: theme.palette.primary.light,
                          color: theme.palette.primary.main,
                          borderRadius: '6px',
                          textTransform: 'none',
                          fontWeight: 500,
                          minWidth: '100px',
                          fontSize: '0.75rem',
                          py: 0.5,
                          '&:hover': {
                            backgroundColor: '#d1e0ff',
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                    <Typography variant="subtitle1" sx={{ color: 'text.secondary', mb: 1 }}>
                      No users found
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      Try adjusting your search or filter criteria
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default UsersTable;