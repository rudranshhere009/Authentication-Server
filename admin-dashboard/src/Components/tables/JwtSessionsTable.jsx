import{
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Box,
  TablePagination,
  Backdrop
} from "@mui/material";
import { useState, useEffect } from "react";

function JwtSessionsTable({ title, jwtsessions, onRevokeSession, isLoading, total, fetchpage, jwtLoading }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [revokeLoading, setRevokeLoading] = useState(false);
  const [revokingSessionId, setRevokingSessionId] = useState(null);

  // FIXED: Use jwtLoading if available, otherwise fall back to isLoading
  const loading = jwtLoading !== undefined ? jwtLoading : isLoading;

  // Handle the completion of revoke operation
  const handleRevokeComplete = () => {
    setTimeout(() => {
      if (fetchpage) {
        fetchpage(page, rowsPerPage);
      }
      setTimeout(() => {
        setRevokeLoading(false);
        setRevokingSessionId(null);
      }, 300);
    }, 300);
  };

  // Refresh data when pagination changes and when jwtsessions prop changes
  useEffect(() => {
    if (fetchpage) {
      console.log(`JwtSessionsTable: Fetching page ${page} with ${rowsPerPage} rows`);
      fetchpage(page, rowsPerPage);
    }
  }, [page, rowsPerPage, jwtsessions?.length]); // Added jwtsessions.length as dependency to detect changes

  const handleChangePage = (event, newPage) => {
    console.log(`JwtSessionsTable: Changing to page ${newPage}`);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    console.log(`JwtSessionsTable: Changing rows per page to ${newRowsPerPage}`);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
  };

  // Show loading spinner
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading JWT sessions...</Typography>
      </Box>
    );
  }

  console.log("JwtSessionsTable rendering with:", {
    title,
    sessionsCount: jwtsessions?.length || 0,
    total,
    page,
    rowsPerPage,
    hasFetchpage: !!fetchpage
  });

  return (
    <div>
      {/* Add a backdrop for the loading state during revoke operation */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: 'column'
        }}
        open={revokeLoading}
      >
        <CircularProgress color="inherit" />
        <Typography sx={{ mt: 2 }}>Revoking session, please wait...</Typography>
      </Backdrop>
      
      <Typography variant="h5" gutterBottom>
        {title} {total !== undefined && `(${total} total)`}
      </Typography>

      <TableContainer
        component={Paper}
        className="custom-table-container sessions-table"
        sx={{
          maxHeight: "60vh",
          overflow: 'auto',
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
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Login Time</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jwtsessions && jwtsessions.length > 0 ? (
              jwtsessions.map((s, index) => (
                <TableRow key={s.id || index}>
                  <TableCell>
                    {/* FIXED: Calculate correct serial number based on pagination */}
                    {fetchpage ? (page * rowsPerPage + index + 1) : (index + 1)}
                  </TableCell>
                  <TableCell>{s.username || 'N/A'}</TableCell>
                  <TableCell>
    			{new Date(s.created_at).toLocaleString()}
		  </TableCell>


                  <TableCell className={s.is_active ? "active-status" : "inactive-status"}>
                    {s.is_active ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    {s.is_active && onRevokeSession && (
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                          setRevokeLoading(true);
                          setRevokingSessionId(s.id);
                          onRevokeSession(s.id)
                            .then(() => handleRevokeComplete())
                            .catch((err) => {
                              console.error("Error revoking session:", err);
                              handleRevokeComplete();
                            });
                        }}
                        className="table-action-button"
                        size="small"
                        disabled={revokeLoading}
                        startIcon={revokingSessionId === s.id && revokeLoading ? <CircularProgress size={16} color="inherit" /> : null}
                      >
                        {revokingSessionId === s.id && revokeLoading ? "Revoking..." : "Revoke"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  {loading ? "Loading..." : "No JWT sessions found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Show pagination only if fetchpage function exists and we have total count */}
      {fetchpage && total !== undefined && total > 0 && (
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Rows per page:"
          showFirstButton
          showLastButton
          sx={{ mt: 2 }}
        />
      )}
    </div>
  );
}

export default JwtSessionsTable;
