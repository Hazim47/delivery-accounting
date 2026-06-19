import { useEffect, useState } from "react";
import API from "../api/axios";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    commissionRate: "",
  });

  // 🔥 Fetch Restaurants
  const fetchRestaurants = async () => {
    try {
      const res = await API.get("/restaurants");

setRestaurants(res.data.restaurants);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // 🔥 Open Create Modal
  const handleOpen = () => {
    setForm({
      name: "",
      phone: "",
      address: "",
      commissionRate: "",
    });
    setEditId(null);
    setOpen(true);
  };

  // 🔥 Create / Update
  const handleSave = async () => {
    try {
      if (editId) {
        await API.put(`/restaurants/${editId}`, form);
      } else {
        await API.post("/restaurants", form);
      }

      setOpen(false);
      fetchRestaurants();
    } catch (err) {
      console.log(err);
     alert(t("errorSaveRestaurant"));
    }
  };

  // 🔥 Edit
  const handleEdit = (restaurant) => {
    setForm({
      name: restaurant.name,
      phone: restaurant.phone,
      address: restaurant.address,
      commissionRate: restaurant.commissionRate,
    });

    setEditId(restaurant.id);
    setOpen(true);
  };

  // 🔥 Delete
  const handleDelete = async (id) => {
    try {
      if (!window.confirm(t("deleteConfirm"))) return;

      await API.delete(`/restaurants/${id}`);
      fetchRestaurants();
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <h2>{t("loading")}</h2>;

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
        flexWrap: "wrap",
        gap: 2,
      }}
    >
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
        {t("restaurantsTitle")}
      </Typography>

      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          borderRadius: "14px",
          px: 3,
          py: 1.2,
          textTransform: "none",
          fontWeight: 900,
          color: "#000",
          background:
            "linear-gradient(135deg,#facc15,#f59e0b)",
          boxShadow: "0 10px 30px rgba(250,204,21,0.25)",
          "&:hover": {
            background:
              "linear-gradient(135deg,#fde047,#facc15)",
            transform: "scale(1.03)",
          },
        }}
      >
        + {t("addRestaurant")}
      </Button>
    </Box>

    {/* TABLE */}
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "24px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(22px)",
        border: "1px solid rgba(250,204,21,0.12)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
      }}
    >
      <Table>
        <TableHead>
          <TableRow
            sx={{
              background:
                "linear-gradient(90deg,#0a0a0a,#111)",
            }}
          >
            {[
  t("name"),
  t("phone"),
  t("commission"),
  t("status"),
  t("actions"),
].map((h) => (
              <TableCell
                key={h}
                sx={{
                  color: "#e5e5e5",
                  fontWeight: 800,
                }}
              >
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {restaurants.map((r) => (
            <TableRow
              key={r.id}
              hover
              sx={{
                "& td": {
                  color: "#e5e5e5",
                  borderBottom:
                    "1px solid rgba(255,255,255,0.05)",
                },

                "&:hover": {
                  background: "rgba(250,204,21,0.05)",
                },
              }}
            >
              <TableCell sx={{ fontWeight: 700 }}>
                {r.name}
              </TableCell>

              <TableCell>{r.phone}</TableCell>

              {/* COMMISSION */}
              <TableCell>
                <Chip
                  label={`${r.commissionRate}%`}
                  sx={{
                    background:
                      "linear-gradient(135deg,#facc15,#f59e0b)",
                    color: "#000",
                    fontWeight: 800,
                  }}
                />
              </TableCell>

              {/* STATUS */}
              <TableCell>
                {r.active ? (
                  <Chip
                    label={t("active")}
                    sx={{
                      background:
                        "rgba(250,204,21,0.15)",
                      color: "#facc15",
                      fontWeight: 800,
                    }}
                  />
                ) : (
                  <Chip
                    label={t("Inactive")}
                    sx={{
                      background:
                        "rgba(255,255,255,0.08)",
                      color: "#a1a1aa",
                      fontWeight: 800,
                    }}
                  />
                )}
              </TableCell>

              {/* ACTIONS */}
              <TableCell align="right">
                <IconButton
                  onClick={() => handleEdit(r)}
                  sx={{ color: "#facc15" }}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  onClick={() => handleDelete(r.id)}
                  sx={{ color: "#ef4444" }}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    {/* MODAL */}
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
  {editId ? t("editRestaurant") : t("addRestaurantDialog")}
</DialogTitle>

      <DialogContent>
        {[
           t("name"),
           t("phone"),
          t("address"),
          t("commission"),
        ].map((field) => (
          <TextField
            key={field}
            fullWidth
            margin="dense"
            label={field}
            type={
              field === "commissionRate"
                ? "number"
                : "text"
            }
            value={form[field]}
            onChange={(e) =>
              setForm({
                ...form,
                [field]: e.target.value,
              })
            }
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                color: "#fff",
                background: "rgba(255,255,255,0.04)",

                "& fieldset": {
                  borderColor:
                    "rgba(250,204,21,0.12)",
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
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setOpen(false)}
          sx={{ color: "#a1a1aa", fontWeight: 700 }}
        >
        {t("cancel")}
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          sx={{
            background:
              "linear-gradient(135deg,#facc15,#f59e0b)",
            color: "#000",
            fontWeight: 900,
            borderRadius: "12px",
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

export default Restaurants;