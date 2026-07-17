import { useEffect, useState } from "react";
import API from "../api/axios";
import { useTranslation } from "react-i18next";
import KeyIcon from "@mui/icons-material/Key";
import SecurityIcon from "@mui/icons-material/Security";
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
  Checkbox,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

function Users() {
  const [users, setUsers] = useState([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [permissionsOpen, setPermissionsOpen] = useState(false);

const [selectedPermissionsUser, setSelectedPermissionsUser] =
  useState(null);

const [permissions, setPermissions] = useState({});
  const [open, setOpen] = useState(false);
 const [resetOpen, setResetOpen] =
  useState(false);

const [selectedUser, setSelectedUser] =
  useState(null);

const [newPassword, setNewPassword] =
  useState("");
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
const handleClose = () => {
  setOpen(false);

  setFullName("");
  setUsername("");
  setPassword("");
  setRole("EMPLOYEE");
  setError("");
};const createUser = async () => {
  try {
    setError("");
    if (
  !fullName.trim() ||
  !username.trim() ||
  !password.trim() ||
  !role
) {
  setError("يجب تعبئة جميع الحقول");
  return;
}
    await API.post("/users", {
      fullName,
      username,
      password,
      role,
    });

await loadUsers();

handleClose();
  } catch (err) {
    setError(
      err.response?.data?.message || t("failed")
    );
  }
};
const roleKeyMap = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
  ACCOUNTANT_1: "accountant1",
  ACCOUNTANT_2: "accountant2",
};
const sortedUsers = [...users].sort((a, b) => {
  if (a.id === 1) return -1;
  if (b.id === 1) return 1;
  return a.id - b.id;
});
const openResetPassword = (user) => {
  setSelectedUser(user);
  setNewPassword("");
  setResetOpen(true);
};
const resetPassword = async () => {
  try {
    await API.put(
      `/users/${selectedUser.id}/reset-password`,
      {
        password: newPassword,
      }
    );

    alert("Password updated");

    setResetOpen(false);
  } catch (err) {
    console.log(err);
  }
};
const deleteUser = async (id) => {
  if (id === 1) return; // 🚫 منع حذف الأدمن

  if (!window.confirm(t("deleteThisUser"))) return;

  try {
    await API.delete(`/users/${id}`);
    await loadUsers();
  } catch (err) {
    console.log(err);
  }
};

const permissionFields = [
  {
    key: "restaurantName",
    label: t("restaurantName"),
  },
  {
    key: "branchName",
    label: t("branchName"),
  },
  {
    key: "captainName",
    label: t("captainName"),
  },
  {
    key: "captainPhone",
    label: t("captainPhone"),
  },
  {
    key: "tariff",
    label: t("tariff"),
  },
  {
    key: "customerName",
    label: t("customerName"),
  },
  {
    key: "customerPhone",
    label: t("customerPhone"),
  },
  {
    key: "customerAddress",
    label: t("customerAddress"),
  },
  {
    key: "customerAreaInput",
    label: t("customerAreaInput"),
  },
  {
    key: "deliveryFee",
    label: t("deliveryFee"),
  },
  {
    key: "orderAmount",
    label: t("orderAmount"),
  },
  {
    key: "vehicleType",
    label: t("vehicleType"),
  },
  {
    key: "distance",
    label: t("distance"),
  },
  {
    key: "invoiceNumber",
    label: t("invoiceNumber"),
  },
  {
    key: "companyCommission",
    label: t("companyCommission"),
  },
  {
    key: "commissionDescription",
    label: t("commissionDescription"),
  },
  {
    key: "cancelReason",
    label: t("cancelReason"),
  },
  {
    key: "status",
    label: t("status"),
  },
  {
    key: "employeeNote",
    label: t("Note"),
  },
  {
    key: "accountantNote",
    label: t("accountantNote"),
  },
  {
  key: "AccountingDepartment",
  label: t("AccountingDepartment"),
},
];
return (
  <Box
    sx={{
      p: 4,
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
        alignItems: "flex-end",
        mb: 4,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            letterSpacing: "-0.5px",
            background:
              "linear-gradient(90deg,#facc15,#f59e0b,#fde047)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("usersManagement")}
        </Typography>

        <Typography sx={{ color: "#a1a1aa", mt: 1, fontSize: "0.95rem" }}>
          {t("manageSystemUsers")}
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => {
  setFullName("");
  setUsername("");
  setPassword("");
  setRole("EMPLOYEE");
  setError("");
  setOpen(true);
}}
        sx={{
          borderRadius: "16px",
          px: 3,
          py: 1.3,
          fontWeight: 900,
          textTransform: "none",
          color: "#000",
          background:
            "linear-gradient(135deg,#facc15,#f59e0b)",
          boxShadow: "0 12px 35px rgba(250,204,21,0.25)",
          transition: "all 0.25s ease",
          "&:hover": {
            transform: "translateY(-2px) scale(1.03)",
            boxShadow: "0 18px 45px rgba(250,204,21,0.35)",
          },
        }}
      >
        {t("addUser")}
      </Button>
    </Box>

    {/* TABLE WRAPPER */}
    <Paper
      sx={{
        borderRadius: "28px",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(26px)",
        border: "1px solid rgba(250,204,21,0.12)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.65)",
        overflow: "hidden",
      }}
    >
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 10,
          }}
        >
          <CircularProgress sx={{ color: "#facc15" }} />
        </Box>
      ) : (
        <TableContainer>
          <Table>
            {/* HEADER */}
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
                ].map((item) => (
                  <TableCell
                    key={item}
                    sx={{
                      color: "#e5e5e5",
                      fontWeight: 900,
                      py: 2,
                      borderBottom: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {item}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {/* BODY */}
            <TableBody>
              {sortedUsers.map((user, index) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    transition: "all 0.2s ease",
                    "& td": {
                      color: "#e5e5e5",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      py: 2,
                    },
                    "&:hover": {
                      background: "rgba(250,204,21,0.05)",
                      transform: "scale(1.002)",
                    },
                  }}
                >
                  <TableCell sx={{ opacity: 0.8 }}>
                    {index + 1}
                  </TableCell>

                  <TableCell sx={{ fontWeight: 700 }}>
                    {user.fullName}
                  </TableCell>

                  <TableCell sx={{ opacity: 0.9 }}>
                    {user.username}
                  </TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        display: "inline-flex",
                        px: 2,
                        py: 0.5,
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: 900,
                        background: "rgba(250,204,21,0.15)",
                        color: "#facc15",
                        letterSpacing: "0.5px",
                      }}
                    >
                     {t(roleKeyMap[user.role] || user.role)}
                    </Box>
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {user.role !== "ADMIN" && (
                      <IconButton
                        onClick={() => deleteUser(user.id)}
                        sx={{
                          background: "rgba(239,68,68,0.12)",
                          color: "#ef4444",
                          transition: "all 0.2s ease",
                          "&:hover": {
                            background: "rgba(239,68,68,0.25)",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                        )}
                      <IconButton
                        onClick={() => openResetPassword(user)}
                        sx={{
                          background: "rgba(250,204,21,0.12)",
                          color: "#facc15",
                          "&:hover": {
                            background: "rgba(250,204,21,0.22)",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <KeyIcon />
                      </IconButton>
                     {user.role !== "ADMIN" && (
                      <IconButton
                        onClick={() => {
                          setSelectedPermissionsUser(user);
                
                          setPermissions(user.permissions || {});
                          setPermissionsOpen(true);
                          
                        }}
                        sx={{
                          background: "rgba(99,102,241,0.15)",
                          color: "#818cf8",
                          "&:hover": {
                            background: "rgba(99,102,241,0.25)",
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <SecurityIcon />
                      </IconButton>
                     )}
                    </Box>
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
 key={open ? "open" : "close"}
  open={open}
 onClose={handleClose}
 keepMounted={false} 
  fullWidth
  maxWidth="sm"
  PaperProps={{
    sx: {
      borderRadius: "26px",
      overflow: "hidden",
      background: "linear-gradient(135deg,#050505,#111111)",
      border: "1px solid rgba(250,204,21,.15)",
      boxShadow: "0 30px 80px rgba(0,0,0,.7)",
      color: "#fff",
    },
  }}
>
  {/* HEADER */}
  <DialogTitle
    sx={{
      py: 2.5,
      px: 3,
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      fontWeight: 900,
      fontSize: 22,
      color: "#fff",
      background:"#000000",
      borderBottom: "1px solid rgba(255,255,255,.06)",
    }}
  >
    <AddIcon sx={{ color: "#facc15", fontSize: 28 }} />
    {t("addUser")}
  </DialogTitle>

  {/* CONTENT */}
  <DialogContent
    sx={{
      p: 3,
      background: "#0b0b0b",
    }}
  >
    {error && (
      <Alert
        severity="error"
        sx={{
          mb: 3,
          borderRadius: "14px",
        }}
      >
        {error}
      </Alert>
    )}

    {[
      {
        label: t("fullName"),
        
        value: fullName,
        set: setFullName,
      },
      {
        label: t("username"),
         
        value: username,
        set: setUsername,
      },
      {
        label: t("password"),
        value: password,
         
        set: setPassword,
         type: "text",
      },
    ].map((f) => (
      <TextField
  key={f.label}
  fullWidth
  margin="normal"
  label={f.label}
  type={f.type || "text"}
  value={f.value}
  onChange={(e) => f.set(e.target.value)}
  autoComplete={
    f.type === "password"
      ? "new-password"
      : f.label === t("username")
      ? "new-username"
      : "off"
  }
  inputProps={{
    autoComplete:
      f.type === "password"
        ? "new-password"
        : f.label === t("username")
        ? "new-username"
        : "off",
  }}

        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "14px",
            color: "#fff",
            background: "rgba(255,255,255,.03)",

            "& fieldset": {
              borderColor: "rgba(250,204,21,.15)",
            },

            "&:hover fieldset": {
              borderColor: "#facc15",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#facc15",
            },
          },

          "& .MuiInputLabel-root": {
            color: "#aaa",
          },

          "& .MuiInputLabel-root.Mui-focused": {
            color: "#facc15",
          },
        }}
      />
    ))}

    <TextField
     autoComplete="off"
      select
      fullWidth
      margin="normal"
      label={t("role")}
      value={role}
      onChange={(e) => setRole(e.target.value)}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "14px",
          color: "#fff",
          background: "rgba(255,255,255,.03)",

          "& fieldset": {
            borderColor: "rgba(250,204,21,.15)",
          },

          "&:hover fieldset": {
            borderColor: "#facc15",
          },

          "&.Mui-focused fieldset": {
            borderColor: "#facc15",
          },
        },

        "& .MuiSvgIcon-root": {
          color: "#facc15",
        },

        "& .MuiInputLabel-root": {
          color: "#aaa",
        },

        "& .MuiInputLabel-root.Mui-focused": {
          color: "#facc15",
        },
      }}
    >
      <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
      <MenuItem value="ACCOUNTANT_1">ACCOUNTANT_1</MenuItem>
      <MenuItem value="ACCOUNTANT_2">ACCOUNTANT_2</MenuItem>
    </TextField>
  </DialogContent>

  {/* FOOTER */}
  <DialogActions
    sx={{
      px: 3,
      py: 2.5,
      background: "#090909",
      borderTop: "1px solid rgba(255,255,255,.06)",
      justifyContent: "space-between",
    }}
  >
    <Button
      onClick={handleClose}
      sx={{
        color: "#fff",
        fontWeight: 700,
        px: 3,
        borderRadius: "12px",

        "&:hover": {
          background: "rgba(255,255,255,.06)",
        },
      }}
    >
      {t("cancel")}
    </Button>

    <Button
      variant="contained"
      onClick={createUser}
      sx={{
        borderRadius: "14px",
        px: 4,
        py: 1.1,
        fontWeight: 900,
        textTransform: "none",
        color: "#000",
        background:
          "linear-gradient(135deg,#facc15,#f59e0b)",
        boxShadow:
          "0 10px 30px rgba(250,204,21,.25)",

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0 18px 40px rgba(250,204,21,.35)",
        },
      }}
    >
      {t("save")}
    </Button>
  </DialogActions>
</Dialog>

    {/* RESET PASSWORD */}
<Dialog
  open={resetOpen}
  onClose={() => setResetOpen(false)}
  fullWidth
  maxWidth="xs"
  PaperProps={{
    sx: {
      borderRadius: "26px",
      overflow: "hidden",
      background: "linear-gradient(135deg,#050505,#111111)",
      border: "1px solid rgba(250,204,21,.15)",
      boxShadow: "0 30px 80px rgba(0,0,0,.7)",
      color: "#fff",
    },
  }}
>
  {/* HEADER */}
  <DialogTitle
    sx={{
      py: 2.5,
      px: 3,
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      fontWeight: 900,
      fontSize: 22,
      color: "#fff",
      background:"#000000",
      borderBottom: "1px solid rgba(255,255,255,.06)",
    }}
  >
    <KeyIcon sx={{ color: "#facc15", fontSize: 28 }} />
    {t("resetPassword")}
  </DialogTitle>

  {/* CONTENT */}
  <DialogContent
    sx={{
      p: 3,
      background: "#0b0b0b",
    }}
  >
    <TextField
      fullWidth
      type="text"
      label={t("newPassword")}
      margin="normal"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      sx={{
        mt: 2,

        "& .MuiOutlinedInput-root": {
          borderRadius: "14px",
          color: "#fff",
          background: "rgba(255,255,255,.03)",

          "& fieldset": {
            borderColor: "rgba(250,204,21,.15)",
          },

          "&:hover fieldset": {
            borderColor: "#facc15",
          },

          "&.Mui-focused fieldset": {
            borderColor: "#facc15",
          },
        },

        "& .MuiInputLabel-root": {
          color: "#aaa",
        },

        "& .MuiInputLabel-root.Mui-focused": {
          color: "#facc15",
        },
      }}
    />
  </DialogContent>

  {/* FOOTER */}
  <DialogActions
    sx={{
      px: 3,
      py: 2.5,
      background: "#000000",
      borderTop: "1px solid rgba(0, 0, 0, 0.93)",
      justifyContent: "space-between",
    }}
  >
    <Button
      onClick={() => setResetOpen(false)}
     sx={{
        borderRadius: "14px",
        px: 4,
        py: 1.1,

        fontWeight: 900,
        textTransform: "none",

        color: "#000",

        background:
          "linear-gradient(135deg,#facc15,#f59e0b)",

        boxShadow:
          "0 10px 30px rgba(250,204,21,.25)",

        transition: ".25s",

        "&:hover": {
          transform: "translateY(-2px) scale(1.02)",
          boxShadow:
            "0 18px 40px rgba(250,204,21,.35)",
        },
      }}
    >
      {t("cancel")}
    </Button>

    <Button
      variant="contained"
      onClick={resetPassword}
      sx={{
        borderRadius: "14px",
        px: 4,
        py: 1.1,
        fontWeight: 900,
        textTransform: "none",
        color: "#000",
        background:
          "linear-gradient(135deg,#facc15,#f59e0b)",
        boxShadow:
          "0 10px 30px rgba(250,204,21,.25)",

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            "0 18px 40px rgba(250,204,21,.35)",
        },
      }}
    >
      {t("save")}
    </Button>
  </DialogActions>
</Dialog>

    {/* PERMISSIONS */}
   <Dialog
  open={permissionsOpen}
  onClose={() => setPermissionsOpen(false)}
  fullWidth
  maxWidth="sm"
  PaperProps={{
    sx: {
      borderRadius: "26px",
      overflow: "hidden",
      background: "linear-gradient(135deg,#050505,#111111)",
      border: "1px solid rgba(250,204,21,.15)",
      boxShadow: "0 30px 80px rgba(0,0,0,.7)",
      color: "#000000",
    },
  }}
>
  {/* HEADER */}
  <DialogTitle
    sx={{
      py: 2.5,
      px: 3,
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      fontWeight: 900,
      fontSize: 22,
      color: "#ffffff",
      background:"#000000",
      borderBottom: "1px solid rgba(255,255,255,.06)",
    }}
  >
    <SecurityIcon sx={{ color: "#facc15" }} />

    {t("permissions")}
  </DialogTitle>

  {/* BODY */}
  <DialogContent
    sx={{
      p: 3,
      background: "#0b0b0b",
    }}
  >
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
        mt: 1,
      }}
    >
      {permissionFields.map((field) => (
        <Box
          key={field.key}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            px: 2.5,
            py: 2,

            borderRadius: "16px",

            background:
              "linear-gradient(135deg,rgba(255,255,255,.03),rgba(255,255,255,.015))",

            border: "1px solid rgba(255,255,255,.05)",

            transition: ".25s",

            "&:hover": {
              borderColor: "rgba(250,204,21,.25)",
              background:
                "linear-gradient(135deg,rgba(250,204,21,.08),rgba(250,204,21,.03))",
              transform: "translateX(4px)",
              boxShadow:
                "0 10px 25px rgba(250,204,21,.08)",
            },
          }}
        >
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: ".3px",
            }}
          >
            {field.label}
          </Typography>

          <Checkbox
            checked={permissions[field.key] || false}
  onChange={(e) => {
  console.log(field);

  setPermissions({
    ...permissions,
    [field.key]: e.target.checked,
  });
}}
            sx={{
              color: "#666",

              "&.Mui-checked": {
                color: "#facc15",
              },

              "& .MuiSvgIcon-root": {
                fontSize: 30,
              },
            }}
          />
        </Box>
      ))}
    </Box>
  </DialogContent>

  {/* FOOTER */}
  <DialogActions
    sx={{
      px: 3,
      py: 2.5,
      background: "#090909",
      borderTop: "1px solid rgba(255,255,255,.06)",
      justifyContent: "space-between",
    }}
  >
    <Button
      onClick={() => setPermissionsOpen(false)}
   sx={{
        borderRadius: "14px",
        px: 4,
        py: 1.1,

        fontWeight: 900,
        textTransform: "none",

        color: "#000",

        background:
          "linear-gradient(135deg,#facc15,#f59e0b)",

        boxShadow:
          "0 10px 30px rgba(250,204,21,.25)",

        transition: ".25s",

        "&:hover": {
          transform: "translateY(-2px) scale(1.02)",
          boxShadow:
            "0 18px 40px rgba(250,204,21,.35)",
        },
      }}
    >
      {t("cancel")}
    </Button>

    <Button
      variant="contained"
      onClick={async () => {
      await API.put(
  `/users/${selectedPermissionsUser.id}/permissions`,
  {
    permissions,
  }
);

await loadUsers();

setPermissionsOpen(false);
      }}
      sx={{
        borderRadius: "14px",
        px: 4,
        py: 1.1,

        fontWeight: 900,
        textTransform: "none",

        color: "#000",

        background:
          "linear-gradient(135deg,#facc15,#f59e0b)",

        boxShadow:
          "0 10px 30px rgba(250,204,21,.25)",

        transition: ".25s",

        "&:hover": {
          transform: "translateY(-2px) scale(1.02)",
          boxShadow:
            "0 18px 40px rgba(250,204,21,.35)",
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