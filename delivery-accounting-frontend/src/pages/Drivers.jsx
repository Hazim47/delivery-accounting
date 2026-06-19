import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useTranslation } from "react-i18next";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Chip,
  CircularProgress,
} from "@mui/material";

function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    vehicleType: "",
  });

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/drivers");
      setDrivers(res.data.drivers);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleAdd = async () => {
    try {
      await API.post("/drivers", form);
      setOpen(false);
      setForm({ fullName: "", phone: "", vehicleType: "" });
      fetchDrivers();
    } catch (err) {
      console.log(err);
      alert("Error adding driver");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/drivers/${id}`);
      fetchDrivers();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredDrivers = useMemo(() => {
    return drivers.filter((d) =>
      d.fullName.toLowerCase().includes(search.toLowerCase())
    );
  }, [drivers, search]);

  const stats = useMemo(() => {
    const total = drivers.length;
    const active = drivers.filter((d) => d.active).length;

    const totalEarnings = drivers.reduce(
      (sum, d) => sum + Number(d.totalEarnings || 0),
      0
    );

    const totalPaid = drivers.reduce(
      (sum, d) => sum + Number(d.paidAmount || 0),
      0
    );

    return {
      total,
      active,
      totalEarnings,
      totalPaid,
      remaining: totalEarnings - totalPaid,
    };
  }, [drivers]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background:
            "linear-gradient(135deg,#0f172a,#111827)",
        }}
      >
        <CircularProgress sx={{ color: "#60a5fa" }} />
      </Box>
    );
  }

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
        {t("driversDashboard")}
      </Typography>

      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: "14px",
          px: 3,
          py: 1.2,
          fontWeight: 900,
          textTransform: "none",
          color: "#000",
          background: "linear-gradient(135deg,#facc15,#f59e0b)",
          boxShadow: "0 10px 30px rgba(250,204,21,0.25)",
          "&:hover": {
            background: "linear-gradient(135deg,#fde047,#facc15)",
            transform: "scale(1.03)",
          },
        }}
      >
       + {t("addDriver")}
      </Button>
    </Box>

    {/* STATS */}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "repeat(4,1fr)",
        },
        gap: 2,
        mb: 3,
      }}
    >
      {[
       [t("totalDrivers"), stats.total],
  [t("activeDrivers"), stats.active],
  [t("totalEarnings"), stats.totalEarnings.toFixed(2)],
  [t("remaining"), stats.remaining.toFixed(2)],
].map(([title, value]) => (
        <Card
          key={title}
          sx={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(250,204,21,0.12)",
            borderRadius: "20px",
            color: "#fff",
            transition: "0.3s",
            "&:hover": {
              transform: "translateY(-4px)",
              borderColor: "rgba(250,204,21,0.3)",
            },
          }}
        >
          <CardContent>
            <Typography sx={{ color: "#a1a1aa" }}>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={900}>
              {value}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>

    {/* SEARCH */}
    <TextField
      fullWidth
      placeholder={t("searchDriver")}
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      sx={{
        mb: 2,
        "& .MuiOutlinedInput-root": {
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(15px)",
          color: "#fff",
          borderRadius: "16px",

          "& fieldset": {
            borderColor: "rgba(250,204,21,0.15)",
          },

          "&:hover fieldset": {
            borderColor: "#facc15",
          },

          "&.Mui-focused fieldset": {
            borderColor: "#f59e0b",
          },
        },

        "& input::placeholder": {
          color: "#a1a1aa",
        },
      }}
    />

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
  t("vehicle"),
  t("earnings"),
  t("paid"),
  t("remaining"),
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
          {filteredDrivers.map((d) => {
            const remaining =
              Number(d.totalEarnings || 0) -
              Number(d.paidAmount || 0);

            return (
              <TableRow
                key={d.id}
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
                  {d.fullName}
                </TableCell>

                <TableCell>{d.phone}</TableCell>
                <TableCell>{d.vehicleType}</TableCell>
                <TableCell>{d.totalEarnings}</TableCell>
                <TableCell>{d.paidAmount}</TableCell>

                <TableCell>
                  {remaining.toFixed(2)}
                </TableCell>

                <TableCell>
                  <Chip
                    label={d.active ? t("active") : t("inactive")}
                    size="small"
                    sx={{
                      background: d.active
                        ? "rgba(250,204,21,0.15)"
                        : "rgba(255,255,255,0.08)",
                      color: d.active ? "#facc15" : "#a1a1aa",
                      fontWeight: 700,
                    }}
                  />
                </TableCell>

                <TableCell>
                  <Button
                    size="small"
                    onClick={() =>
                      navigate(`/drivers/${d.id}/statement`)
                    }
                    sx={{ color: "#facc15", fontWeight: 700 }}
                  >
                    {t("statement")}
                  </Button>

                  <Button
                    size="small"
                    color="error"
                    onClick={() => handleDelete(d.id)}
                  >
                      {t("delete")}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>

    {/* DIALOG */}
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
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
      <DialogTitle sx={{ fontWeight: 800 }}>
        {t("addDriver")}
      </DialogTitle>

      <DialogContent>
        {["fullName", "phone", "vehicleType"].map((f) => (
          <TextField
            key={f}
            fullWidth
            margin="dense"
            placeholder={
  f === "fullName"
    ? t("fullName")
    : f === "phone"
    ? t("phone")
    : t("vehicleType")
}
            value={form[f]}
            onChange={(e) =>
              setForm({ ...form, [f]: e.target.value })
            }
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
            }}
          />
        ))}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={() => setOpen(false)}
          sx={{ color: "#a1a1aa" }}
        >
           {t("cancel")}
        </Button>

        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{
            background:
              "linear-gradient(135deg,#facc15,#f59e0b)",
            color: "#000",
            fontWeight: 900,
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

export default Drivers;