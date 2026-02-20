
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  TablePagination
} from "@mui/material";
import { useState, useEffect } from "react";

const SessionsTable = ({ sessions, title, isLoading, total, fetchpage, sessionLoading }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Use sessionLoading if available, otherwise fall back to isLoading
  const loading = sessionLoading !== undefined ? sessionLoading : isLoading;

  // Fetch paginated data when page or rowsPerPage changes
  useEffect(() => {
    if (fetchpage) {
      fetchpage(page, rowsPerPage);
    }
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <Typography variant="h5" gutterBottom>{title} {total !== undefined && `(${total} total)`}</Typography>
      <TableContainer component={Paper} className="custom-table-container sessions-table" sx={{
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
      }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions && sessions.length > 0 ? (
              sessions.map((s, index) => (
                <TableRow key={s.id || index}>
                  <TableCell>
                    {fetchpage ? (page * rowsPerPage + index + 1) : (index + 1)}
                  </TableCell>
                  <TableCell>{s.username || 'N/A'}</TableCell>
                  <TableCell>
                    {s.created_at ? new Date(s.created_at).toLocaleString() : 'N/A'}
                  </TableCell>
                  <TableCell className={s.is_active ? "active-status" : "inactive-status"}>
                    {s.is_active ? "Yes" : "No"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  {loading ? "Loading..." : "No sessions found"}
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
};

export default SessionsTable;