import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Chip,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const C = {
  orange: "#DC2626",
  orangeLt: "#EF4444",
  orangeDk: "#B91C1C",
  orangeGlow: "rgba(220,38,38,0.14)",
  char700: "#0F1117",
  char600: "#161B22",
  char500: "#1C2128",
  char400: "#2D333B",
  text100: "#F0F6FC",
  text300: "#8B949E",
  text500: "#484F58",
  emerald: "#10B981",
  rose: "#F43F5E",
  amber: "#F59E0B",
  violet: "#A855F7",
};

const getInitials = (username) => {
  if (!username) return "?";
  return username.slice(0, 2).toUpperCase();
};

const avatarColors = [
  C.orange,
  C.emerald,
  C.violet,
  C.amber,
  "#22D3EE",
  "#F43F5E",
];

const getAvatarColor = (username) => {
  if (!username) return C.orange;
  const idx = username.charCodeAt(0) % avatarColors.length;
  return avatarColors[idx];
};

const UsersTable = ({ users, toggleBlock, filter }) => {
  const navigate = useNavigate();

  const handleBlockClick = (event, username, isBlocked) => {
    event.stopPropagation();
    toggleBlock(username, !isBlocked);
  };

  const handleUserClick = (userId) => {
    navigate(`/users/${userId}?filter=${filter}`, { replace: true });
  };

  return (
    <Box>
      <TableContainer
        component={Paper}
        className="custom-table-container users-table"
        sx={{
          maxHeight: "62vh",
          width: "100%",
          overflow: "auto",
          borderRadius: "10px",
          boxShadow: "none",
          bgcolor: C.char600,
          border: `1px solid ${C.char400}`,
          "&::-webkit-scrollbar": { width: "5px", height: "5px" },
          "&::-webkit-scrollbar-track": {
            backgroundColor: C.char700,
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: C.orangeDk,
            borderRadius: "4px",
            "&:hover": { backgroundColor: C.orange },
          },
        }}
      >
        <Table stickyHeader sx={{ minWidth: "100%", tableLayout: "fixed" }}>
          <TableHead>
            <TableRow>
              <TableCell width="5%">#</TableCell>
              <TableCell width="22%">User</TableCell>
              <TableCell width="18%">Department</TableCell>
              <TableCell width="13%">Rank</TableCell>
              <TableCell width="12%">Role</TableCell>
              <TableCell width="12%">Status</TableCell>
              <TableCell width="18%">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users && users.length > 0 ? (
              users.map((u, index) => {
                const avatarColor = getAvatarColor(u.username);
                return (
                  <TableRow
                    key={u.id}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: `rgba(220,38,38,0.04) !important`,
                        "& .view-btn": { opacity: 1 },
                      },
                    }}
                    onClick={() => handleUserClick(u.id)}
                  >
                    {/* # */}
                    <TableCell
                      sx={{
                        color: `${C.text500} !important`,
                        fontSize: "0.75rem !important",
                        fontWeight: "500 !important",
                      }}
                    >
                      {index + 1}
                    </TableCell>

                    {/* User */}
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.25,
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            bgcolor: `${avatarColor}22`,
                            border: `1px solid ${avatarColor}40`,
                            color: avatarColor,
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {getInitials(u.username)}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              color: `${C.text100} !important`,
                              fontSize: "0.84rem !important",
                              fontWeight: "600 !important",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {u.username}
                          </Typography>
                          {u.email && (
                            <Typography
                              sx={{
                                color: `${C.text500} !important`,
                                fontSize: "0.7rem !important",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {u.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Department */}
                    <TableCell>
                      {u.department ? (
                        <Typography
                          sx={{
                            color: `${C.text300} !important`,
                            fontSize: "0.8rem !important",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {u.department}
                        </Typography>
                      ) : (
                        <Typography
                          sx={{
                            color: `${C.text500} !important`,
                            fontSize: "0.78rem !important",
                          }}
                        >
                          —
                        </Typography>
                      )}
                    </TableCell>

                    {/* Rank */}
                    <TableCell>
                      {u.rank ? (
                        <Chip
                          label={u.rank}
                          size="small"
                          sx={{
                            bgcolor: `${C.amber}12`,
                            color: C.amber,
                            border: `1px solid ${C.amber}30`,
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            height: 20,
                          }}
                        />
                      ) : (
                        <Typography
                          sx={{
                            color: `${C.text500} !important`,
                            fontSize: "0.78rem !important",
                          }}
                        >
                          —
                        </Typography>
                      )}
                    </TableCell>

                    {/* Role */}
                    <TableCell>
                      {u.is_admin ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <AdminPanelSettingsIcon
                            sx={{ fontSize: 13, color: C.violet }}
                          />
                          <Typography
                            sx={{
                              color: `${C.violet} !important`,
                              fontSize: "0.75rem !important",
                              fontWeight: "600 !important",
                            }}
                          >
                            Admin
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <PersonIcon sx={{ fontSize: 13, color: C.text500 }} />
                          <Typography
                            sx={{
                              color: `${C.text500} !important`,
                              fontSize: "0.75rem !important",
                            }}
                          >
                            User
                          </Typography>
                        </Box>
                      )}
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Chip
                        icon={
                          u.is_blocked ? (
                            <BlockIcon
                              sx={{
                                fontSize: "11px !important",
                                color: `${C.rose} !important`,
                              }}
                            />
                          ) : (
                            <CheckCircleOutlineIcon
                              sx={{
                                fontSize: "11px !important",
                                color: `${C.emerald} !important`,
                              }}
                            />
                          )
                        }
                        label={u.is_blocked ? "Blocked" : "Active"}
                        size="small"
                        sx={{
                          bgcolor: u.is_blocked
                            ? `rgba(244,63,94,0.1)`
                            : `rgba(16,185,129,0.1)`,
                          color: u.is_blocked ? C.rose : C.emerald,
                          border: `1px solid ${
                            u.is_blocked
                              ? "rgba(244,63,94,0.3)"
                              : "rgba(16,185,129,0.3)"
                          }`,
                          fontWeight: 600,
                          fontSize: "0.68rem",
                          height: 22,
                          "& .MuiChip-label": { px: 0.6 },
                          "& .MuiChip-icon": { ml: 0.5 },
                        }}
                      />
                    </TableCell>

                    {/* Actions */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "nowrap",
                          gap: 0.75,
                          alignItems: "center",
                        }}
                      >
                        {/* Block / Unblock */}
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={(e) =>
                            handleBlockClick(e, u.username, u.is_blocked)
                          }
                          sx={{
                            borderRadius: "7px",
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.72rem",
                            py: 0.4,
                            px: 1.1,
                            minWidth: "auto",
                            borderColor: u.is_blocked
                              ? "rgba(16,185,129,0.4)"
                              : "rgba(244,63,94,0.4)",
                            color: u.is_blocked ? C.emerald : C.rose,
                            "&:hover": {
                              borderColor: u.is_blocked ? C.emerald : C.rose,
                              bgcolor: u.is_blocked
                                ? "rgba(16,185,129,0.08)"
                                : "rgba(244,63,94,0.08)",
                            },
                            transition: "all 0.15s",
                          }}
                        >
                          {u.is_blocked ? "Unblock" : "Block"}
                        </Button>

                        {/* View Details */}
                        <Button
                          className="view-btn"
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserClick(u.id);
                          }}
                          endIcon={
                            <OpenInNewIcon
                              sx={{ fontSize: "11px !important" }}
                            />
                          }
                          sx={{
                            borderRadius: "7px",
                            textTransform: "none",
                            fontWeight: 600,
                            fontSize: "0.72rem",
                            py: 0.4,
                            px: 1.1,
                            minWidth: "auto",
                            opacity: 0.85,
                            background: `linear-gradient(135deg, ${C.orange} 0%, ${C.orangeDk} 100%)`,
                            boxShadow: `0 3px 10px rgba(220,38,38,0.3)`,
                            "&:hover": {
                              background: `linear-gradient(135deg, ${C.orangeLt} 0%, ${C.orange} 100%)`,
                              boxShadow: `0 4px 14px rgba(220,38,38,0.45)`,
                              opacity: 1,
                            },
                            transition: "all 0.15s",
                          }}
                        >
                          View
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 32, color: C.text500 }} />
                    <Typography
                      sx={{
                        color: `${C.text500} !important`,
                        fontSize: "0.85rem !important",
                        fontWeight: "500 !important",
                      }}
                    >
                      No users found
                    </Typography>
                    <Typography
                      sx={{
                        color: `${C.text500} !important`,
                        fontSize: "0.75rem !important",
                      }}
                    >
                      Try adjusting your search or filter criteria
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UsersTable;
