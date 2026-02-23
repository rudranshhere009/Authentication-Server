import {
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
  Backdrop,
  Chip,
} from "@mui/material";
import { useState, useEffect } from "react";

function JwtSessionsTable({
  title,
  jwtsessions,
  onRevokeSession,
  isLoading,
  total,
  fetchpage,
  jwtLoading,
}) {
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
      console.log(
        `JwtSessionsTable: Fetching page ${page} with ${rowsPerPage} rows`,
      );
      fetchpage(page, rowsPerPage);
    }
  }, [page, rowsPerPage, jwtsessions?.length]); // Added jwtsessions.length as dependency to detect changes

  const handleChangePage = (event, newPage) => {
    console.log(`JwtSessionsTable: Changing to page ${newPage}`);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    console.log(
      `JwtSessionsTable: Changing rows per page to ${newRowsPerPage}`,
    );
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset to first page
  };

  // Show loading spinner
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 4,
          gap: 1.5,
        }}
      >
        <CircularProgress size={22} sx={{ color: "#DC2626" }} />
        <Typography sx={{ color: "#8B949E", fontSize: "0.85rem" }}>
          Loading JWT sessions…
        </Typography>
      </Box>
    );
  }

  console.log("JwtSessionsTable rendering with:", {
    title,
    sessionsCount: jwtsessions?.length || 0,
    total,
    page,
    rowsPerPage,
    hasFetchpage: !!fetchpage,
  });

  return (
    <div>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          flexDirection: "column",
          bgcolor: "rgba(8,7,10,0.85)",
        }}
        open={revokeLoading}
      >
        <CircularProgress sx={{ color: "#DC2626" }} />
        <Typography sx={{ mt: 2, color: "#F0F6FC", fontSize: "0.88rem" }}>
          Revoking session…
        </Typography>
      </Backdrop>

      {title && (
        <Typography
          sx={{
            color: "#F0F6FC",
            fontWeight: 700,
            fontSize: "0.95rem",
            mb: 2,
          }}
        >
          {title}{" "}
          {total !== undefined && (
            <Typography
              component="span"
              sx={{ color: "#484F58", fontSize: "0.78rem", fontWeight: 400 }}
            >
              ({total} total)
            </Typography>
          )}
        </Typography>
      )}

      <TableContainer
        component={Paper}
        className="custom-table-container sessions-table"
        sx={{
          maxHeight: "60vh",
          overflow: "auto",
          bgcolor: "#161B22",
          border: "1px solid #2D333B",
          borderRadius: "10px",
          boxShadow: "none",
          "&::-webkit-scrollbar": { width: "5px", height: "5px" },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#0F1117",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#B91C1C",
            borderRadius: "4px",
            "&:hover": { backgroundColor: "#DC2626" },
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "60px" }}>#</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Login Time</TableCell>
              <TableCell sx={{ width: "100px" }}>Status</TableCell>
              <TableCell sx={{ width: "120px" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jwtsessions && jwtsessions.length > 0 ? (
              jwtsessions.map((s, index) => (
                <TableRow key={s.id || index}>
                  <TableCell
                    sx={{
                      color: "#5C5045 !important",
                      fontSize: "0.78rem !important",
                    }}
                  >
                    {fetchpage ? page * rowsPerPage + index + 1 : index + 1}
                  </TableCell>
                  <TableCell sx={{ fontWeight: "600 !important" }}>
                    {s.username || "N/A"}
                  </TableCell>
                  <TableCell
                    sx={{ color: "#A09080 !important", whiteSpace: "nowrap" }}
                  >
                    {new Date(s.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={s.is_active ? "Active" : "Revoked"}
                      size="small"
                      sx={{
                        bgcolor: s.is_active
                          ? "rgba(16,185,129,0.12)"
                          : "rgba(244,63,94,0.12)",
                        color: s.is_active ? "#10B981" : "#F43F5E",
                        border: `1px solid ${s.is_active ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)"}`,
                        fontWeight: 600,
                        fontSize: "0.68rem",
                        height: 22,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {s.is_active && onRevokeSession && (
                      <Button
                        variant="outlined"
                        size="small"
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
                        disabled={revokeLoading}
                        startIcon={
                          revokingSessionId === s.id && revokeLoading ? (
                            <CircularProgress size={12} color="inherit" />
                          ) : null
                        }
                        sx={{
                          borderColor: "rgba(244,63,94,0.4)",
                          color: "#F43F5E",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          textTransform: "none",
                          borderRadius: "7px",
                          py: 0.4,
                          px: 1.25,
                          "&:hover": {
                            borderColor: "#F43F5E",
                            bgcolor: "rgba(244,63,94,0.08)",
                          },
                        }}
                      >
                        {revokingSessionId === s.id && revokeLoading
                          ? "Revoking…"
                          : "Revoke"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Typography sx={{ color: "#484F58", fontSize: "0.82rem" }}>
                      {loading ? "Loading…" : "No JWT sessions found"}
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {fetchpage && total !== undefined && total > 0 && (
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25, 50]}
          labelRowsPerPage="Rows:"
          showFirstButton
          showLastButton
          sx={{
            mt: 1,
            color: "#8B949E",
            borderTop: "1px solid #3A3228",
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              { color: "#8B949E", fontSize: "0.78rem" },
            "& .MuiTablePagination-select": { color: "#F0F6FC" },
            "& .MuiIconButton-root": { color: "#8B949E" },
            "& .MuiIconButton-root:hover": {
              color: "#DC2626",
              bgcolor: "rgba(220,38,38,0.1)",
            },
            "& .MuiIconButton-root.Mui-disabled": { color: "#484F58" },
          }}
        />
      )}
    </div>
  );
}

export default JwtSessionsTable;
