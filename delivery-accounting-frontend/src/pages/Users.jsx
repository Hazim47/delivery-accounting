import { useEffect, useState } from "react";
import API from "../api/axios";
import { useTranslation } from "react-i18next";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function Users() {
  const [users, setUsers] = useState([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [role, setRole] =
    useState("EMPLOYEE");

  const [error, setError] =
    useState("");

  const loadUsers = async () => {
    try {
      const res =
        await API.get("/users");

      setUsers(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async () => {
    try {
      setError("");

      await API.post("/users", {
        fullName,
        username,
        password,
        role,
      });

      setOpen(false);

      setFullName("");
      setUsername("");
      setPassword("");
      setRole("EMPLOYEE");

      loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t("failed")
      );
    }
  };

  const deleteUser = async (id) => {
    if (
     window.confirm(t("deleteThisUser"))
    )
      return;

    try {
      await API.delete(
        `/users/${id}`
      );

      loadUsers();
    } catch (err) {
      console.log(err);
    }
  };
const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    color: "#fff",
    background: "rgba(255,255,255,0.05)",

    "& fieldset": {
      borderColor: "rgba(255,255,255,0.1)",
    },

    "&:hover fieldset": {
      borderColor: "#6366f1",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#818cf8",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#94a3b8",
  },

  "& .MuiSvgIcon-root": {
    color: "#94a3b8",
  },
};
return (
  <Box
    sx={{
      p: 3,
      minHeight: "100vh",
      background:
        "radial-gradient(circle at top left, #0a0a0a 0%, #050505 50%, #000 100%)",
      color: "#fff",
    }}
  >

    {/* HEADER */}
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            background:
              "linear-gradient(90deg,#facc15,#f59e0b,#fde047)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("usersManagement")}
        </Typography>

        <Typography sx={{ color: "#a1a1aa", mt: 1 }}>
         {t("manageSystemUsers")}
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: "14px",
          px: 3,
          py: 1.2,
          fontWeight: 900,
          textTransform: "none",
          color: "#000",
          background:
            "linear-gradient(135deg,#facc15,#f59e0b)",
          boxShadow: "0 10px 30px rgba(250,204,21,0.25)",
          "&:hover": {
            transform: "scale(1.03)",
          },
        }}
      >
        {t("addUser")}
      </Button>
    </Box>

    {/* TABLE */}
    <Paper
      sx={{
        borderRadius: "24px",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(22px)",
        border: "1px solid rgba(250,204,21,0.12)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
        overflow: "hidden",
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress sx={{ color: "#facc15" }} />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(90deg,#0a0a0a,#111)",
                }}
              >
                {[
  t("id"),
  t("fullNameColumn"),
  t("usernameColumn"),
  t("roleColumn"),
  t("actionsColumn"),
].map(
                  (item) => (
                    <TableCell
                      key={item}
                      sx={{
                        color: "#e5e5e5",
                        fontWeight: 800,
                      }}
                    >
                      {item}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    "& td": {
                      color: "#e5e5e5",
                      borderBottom:
                        "1px solid rgba(255,255,255,0.05)",
                    },
                    "&:hover": {
                      background: "rgba(250,204,21,0.04)",
                    },
                  }}
                >
                  <TableCell>{user.id}</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {user.fullName}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-flex",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 800,
                        background:
                          "rgba(250,204,21,0.15)",
                        color: "#facc15",
                      }}
                    >
                      {user.role}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => deleteUser(user.id)}
                      sx={{
                        background:
                          "rgba(239,68,68,0.1)",
                        "&:hover": {
                          background:
                            "rgba(239,68,68,0.2)",
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>

    {/* ADD USER DIALOG */}
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "24px",
          background:
            "linear-gradient(135deg,#0a0a0a,#111)",
          color: "#fff",
          border: "1px solid rgba(250,204,21,0.12)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 900 }}>
        {t("addUser")}
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert
            severity="error"
            sx={{
              mt: 1,
              mb: 2,
              borderRadius: "12px",
            }}
          >
            {error}
          </Alert>
        )}

        {[
  { label: t("fullName"), value: fullName, set: setFullName },
  { label: t("username"), value: username, set: setUsername },
  { label: t("password"), value: password, set: setPassword, type: "password" },
].map((f) => (
          <TextField
            key={f.label}
            fullWidth
            label={f.label}
            type={f.type || "text"}
            margin="normal"
            value={f.value}
            onChange={(e) => f.set(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                color: "#fff",
                background: "rgba(255,255,255,0.04)",
                "& fieldset": {
                  borderColor: "rgba(250,204,21,0.12)",
                },
                "&:hover fieldset": {
                  borderColor: "#facc15",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#a1a1aa",
              },
            }}
          />
        ))}

        <TextField
          select
          fullWidth
         label={t("role")}
          margin="normal"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              color: "#fff",
              background: "rgba(255,255,255,0.04)",
              "& fieldset": {
                borderColor: "rgba(250,204,21,0.12)",
              },
              "&:hover fieldset": {
                borderColor: "#facc15",
              },
            },
            "& .MuiInputLabel-root": {
              color: "#a1a1aa",
            },
          }}
        >
          <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
          <MenuItem value="ACCOUNTANT_1">ACCOUNTANT_1</MenuItem>
          <MenuItem value="ACCOUNTANT_2">ACCOUNTANT_2</MenuItem>
        </TextField>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={() => setOpen(false)}
          sx={{ color: "#a1a1aa", fontWeight: 700 }}
        >
          {t("cancel")}
        </Button>

        <Button
          variant="contained"
          onClick={createUser}
          sx={{
            borderRadius: "12px",
            px: 3,
            fontWeight: 900,
            color: "#000",
            background:
              "linear-gradient(135deg,#facc15,#f59e0b)",
            "&:hover": {
              transform: "scale(1.03)",
            },
          }}
        >
          {t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  </Box>
);
}

export default Users;