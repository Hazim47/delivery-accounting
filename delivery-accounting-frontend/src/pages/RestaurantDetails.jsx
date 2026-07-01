import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import enGB from "date-fns/locale/en-GB";

import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

function RestaurantDetails() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState(null);
const [toDate, setToDate] = useState(null);

const fetchRestaurant = useCallback(async () => {
  try {
    const params = new URLSearchParams();

    if (fromDate) {
      params.append("from", format(fromDate, "yyyy-MM-dd"));
    }

    if (toDate) {
      params.append("to", format(toDate, "yyyy-MM-dd"));
    }

    const url = `/restaurants/${id}/details${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const res = await API.get(url);

    setRestaurant(res.data.restaurant);
    setStats(res.data.stats);
    setOrders(res.data.orders);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}, [id, fromDate, toDate]);

useEffect(() => {
  fetchRestaurant();
}, [fetchRestaurant]);

const handleSearch = async () => {
  if (fromDate && toDate && fromDate > toDate) {
    alert("تاريخ البداية يجب أن يكون قبل تاريخ النهاية");
    return;
  }

  setLoading(true);
  await fetchRestaurant();
};
  if (loading) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#000",
      }}
    >
      <CircularProgress color="warning" />
    </Box>
  );
}
return (
  <Box
    sx={{
      minHeight: "100vh",
      p: { xs: 2, md: 4 },
      background:
        "radial-gradient(circle at top left,#18181b 0%,#09090b 45%,#000 100%)",
      color: "#fff",
    }}
  >
    {/* ================= HERO ================= */}

    <Paper
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        p: { xs: 3, md: 5 },
        mb: 4,
        borderRadius: "32px",
        background:
          "linear-gradient(145deg,rgba(255,255,255,.05),rgba(255,255,255,.02))",
        backdropFilter: "blur(30px)",
        border: "1px solid rgba(250,204,21,.15)",
        boxShadow:
          "0 30px 80px rgba(0,0,0,.6),0 0 40px rgba(250,204,21,.05)",
      }}
    >
      {/* Glow */}

      <Box
        sx={{
          position: "absolute",
          width: 350,
          height: 350,
          borderRadius: "50%",
          background: "rgba(250,204,21,.08)",
          filter: "blur(90px)",
          top: -120,
          right: -120,
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 4,
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 1,
              background:
                "linear-gradient(90deg,#fde047,#facc15,#f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {restaurant.name}
          </Typography>

          <Typography
            sx={{
              color: "#9ca3af",
              fontSize: 16,
            }}
          >
            متابعة الطلبات والإحصائيات الخاصة بالمطعم
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            px: 4,
            py: 2,
            borderRadius: "22px",
            background:
              "linear-gradient(135deg,#facc15,#f59e0b)",
            color: "#000",
            minWidth: 220,
            textAlign: "center",
            boxShadow:
              "0 20px 40px rgba(250,204,21,.25)",
          }}
        >
          <Typography fontWeight={700}>
            Restaurant Dashboard
          </Typography>

          <Typography
            fontWeight={900}
            fontSize={34}
          >
            🏪
          </Typography>
        </Paper>
      </Box>
    </Paper>

    {/* ================= FILTER CARD ================= */}

    <Paper
      elevation={0}
      sx={{
        p: 4,
        mb: 4,
        borderRadius: "28px",
        background:
          "linear-gradient(145deg,rgba(255,255,255,.04),rgba(255,255,255,.02))",
        backdropFilter: "blur(25px)",
        border: "1px solid rgba(250,204,21,.12)",
        boxShadow:
          "0 25px 50px rgba(0,0,0,.45)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          color: "#fde047",
          fontWeight: 900,
        }}
      >
        🔍 البحث حسب التاريخ
      </Typography>

      <Grid container spacing={3} alignItems="end">

        <LocalizationProvider
          dateAdapter={AdapterDateFns}
          adapterLocale={enGB}
        >
          {/* FROM */}

          <Grid item xs={12} md={4}>

            <Typography
              sx={{
                mb: 1,
                color: "#facc15",
                fontWeight: 700,
              }}
            >
              من تاريخ
            </Typography>

            <DatePicker
              format="dd/MM/yyyy"
              value={fromDate}
              onChange={(date) => setFromDate(date)}
              slotProps={{
                textField: {
                  fullWidth: true,

                  sx: {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      background:
                        "rgba(255,255,255,.03)",

                      "& fieldset": {
                        borderColor:
                          "rgba(250,204,21,.3)",
                      },

                      "&:hover fieldset": {
                        borderColor: "#facc15",
                      },

                      "&.Mui-focused fieldset": {
                        borderColor: "#facc15",
                        borderWidth: 2,
                      },
                    },

                    "& .MuiInputBase-input": {
                      color: "#fff",
                    },

                    "& .MuiSvgIcon-root": {
                      color: "#facc15",
                    },

                    "& .MuiPickersSectionList-root": {
                      color: "#fff",
                    },
                  },
                },
              }}
            />

          </Grid>

          {/* TO */}

          <Grid item xs={12} md={4}>

            <Typography
              sx={{
                mb: 1,
                color: "#facc15",
                fontWeight: 700,
              }}
            >
              إلى تاريخ
            </Typography>

            <DatePicker
              format="dd/MM/yyyy"
              value={toDate}
              onChange={(date) => setToDate(date)}
              slotProps={{
                textField: {
                  fullWidth: true,

                  sx: {
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "16px",
                      background:
                        "rgba(255,255,255,.03)",

                      "& fieldset": {
                        borderColor:
                          "rgba(250,204,21,.3)",
                      },

                      "&:hover fieldset": {
                        borderColor: "#facc15",
                      },

                      "&.Mui-focused fieldset": {
                        borderColor: "#facc15",
                        borderWidth: 2,
                      },
                    },

                    "& .MuiInputBase-input": {
                      color: "#fff",
                    },

                    "& .MuiSvgIcon-root": {
                      color: "#facc15",
                    },

                    "& .MuiPickersSectionList-root": {
                      color: "#fff",
                    },
                  },
                },
              }}
            />

          </Grid>

        </LocalizationProvider>

        {/* SEARCH */}

        <Grid item xs={12} md={4}>

          <Button
            fullWidth
            size="large"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            sx={{
              height: 56,
              borderRadius: "16px",
              fontWeight: 900,
              fontSize: 15,
              textTransform: "none",
              color: "#000",

              background:
                "linear-gradient(135deg,#fde047,#facc15,#f59e0b)",

              boxShadow:
                "0 15px 35px rgba(250,204,21,.25)",

              transition: ".3s",

              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow:
                  "0 25px 50px rgba(250,204,21,.35)",
              },
            }}
          >
            بحث
          </Button>

        </Grid>

      </Grid>
    </Paper>
        {/* ================= PREMIUM STATS ================= */}

    <Grid container spacing={3} sx={{ mb: 5 }}>
      <Grid item xs={12} md={4}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            height: "100%",
            borderRadius: "24px",
            background:
              "linear-gradient(145deg,rgba(250,204,21,.14),rgba(255,255,255,.04))",
            border: "1px solid rgba(250,204,21,.25)",
            backdropFilter: "blur(18px)",
            transition: ".35s",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: "0 20px 50px rgba(250,204,21,.15)",
            },
          }}
        >
          <Typography
            sx={{
              color: "#fde68a",
              fontWeight: 700,
              fontSize: 15,
              mb: 1,
            }}
          >
            📦 عدد الطلبات
          </Typography>

          <Typography
            sx={{
              fontSize: 40,
              fontWeight: 900,
              color: "#fff",
            }}
          >
            {stats.totalOrders}
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#9ca3af",
            }}
          >
            مجموع الطلبات خلال الفترة المحددة
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            height: "100%",
            borderRadius: "24px",
            background:
              "linear-gradient(145deg,rgba(16,185,129,.15),rgba(255,255,255,.04))",
            border: "1px solid rgba(16,185,129,.25)",
            backdropFilter: "blur(18px)",
            transition: ".35s",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: "0 20px 50px rgba(16,185,129,.2)",
            },
          }}
        >
          <Typography
            sx={{
              color: "#6ee7b7",
              fontWeight: 700,
              fontSize: 15,
              mb: 1,
            }}
          >
            💰 إجمالي المبيعات
          </Typography>

          <Typography
            sx={{
              fontSize: 34,
              fontWeight: 900,
              color: "#fff",
            }}
          >
           {Number(stats.totalSales || 0).toFixed(2)} JD
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#9ca3af",
            }}
          >
            قيمة جميع الطلبات المسلمة
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            height: "100%",
            borderRadius: "24px",
            background:
              "linear-gradient(145deg,rgba(59,130,246,.15),rgba(255,255,255,.04))",
            border: "1px solid rgba(59,130,246,.25)",
            backdropFilter: "blur(18px)",
            transition: ".35s",
            "&:hover": {
              transform: "translateY(-6px)",
              boxShadow: "0 20px 50px rgba(59,130,246,.25)",
            },
          }}
        >
          <Typography
            sx={{
              color: "#93c5fd",
              fontWeight: 700,
              fontSize: 15,
              mb: 1,
            }}
          >
            🏪 التعرفة
          </Typography>

          <Typography
            sx={{
              fontSize: 34,
              fontWeight: 900,
              color: "#fff",
            }}
          >
            {Number(stats.totalTariff || 0).toFixed(2)} JD
          </Typography>

          <Typography
            sx={{
              mt: 1,
              color: "#9ca3af",
            }}
          >
            مجموع تعرفة الشركة
          </Typography>
        </Paper>
      </Grid>
    </Grid>

    {/* ================= ORDERS TABLE ================= */}

    <Paper
      elevation={0}
      sx={{
        overflow: "hidden",
        borderRadius: "28px",
        backdropFilter: "blur(20px)",
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.08)",
        boxShadow: "0 25px 60px rgba(0,0,0,.45)",
      }}
    >
      <TableContainer>
        <Table>

          <TableHead>
            <TableRow
              sx={{
                background:
                  "linear-gradient(90deg,#1f2937,#09090b)",
              }}
            >
              <TableCell
                sx={{
                  color: "#fde047",
                  fontWeight: 900,
                  py: 2.5,
                }}
              >
                التاريخ
              </TableCell>

              <TableCell
                sx={{
                  color: "#fde047",
                  fontWeight: 900,
                }}
              >
                الزبون
              </TableCell>

              <TableCell
                sx={{
                  color: "#fde047",
                  fontWeight: 900,
                }}
              >
                الكابتن
              </TableCell>

              <TableCell
                sx={{
                  color: "#fde047",
                  fontWeight: 900,
                }}
              >
                قيمة الطلب
              </TableCell>

              <TableCell
                sx={{
                  color: "#fde047",
                  fontWeight: 900,
                }}
              >
                التعرفة
              </TableCell>

              <TableCell
                sx={{
                  color: "#fde047",
                  fontWeight: 900,
                }}
              >
                الحالة
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

                    {orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                align="center"
                sx={{
                  py: 8,
                  color: "#9ca3af",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                لا توجد طلبات خلال الفترة المحددة
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order, index) => (
              <TableRow
                key={order.id}
                hover
                sx={{
                  transition: ".3s",

                  "& td": {
                    color: "#fff",
                    borderColor: "rgba(255,255,255,.06)",
                    py: 2,
                  },

                  "&:nth-of-type(even)": {
                    background: "rgba(255,255,255,.015)",
                  },

                  "&:hover": {
                    background:
                      "linear-gradient(90deg,rgba(250,204,21,.08),rgba(255,255,255,.02))",
                    transform: "scale(1.003)",
                  },
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 700,
                    color: "#fde68a",
                  }}
                >
                  {order.orderDate}
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {order.customerName}
                </TableCell>

                <TableCell>
                  {order.captainName}
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#4ade80",
                  }}
                >
                  {Number(order.orderAmount || 0).toFixed(2)} JD
                </TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#facc15",
                  }}
                >
                  {Number(order.tariff || 0).toFixed(2)} JD
                </TableCell>

                <TableCell>
                  <Chip
                    label={order.status}
                    size="small"
                    sx={{
                      minWidth: 110,
                      fontWeight: 800,
                      letterSpacing: ".5px",

                      ...(order.status === "DELIVERED" && {
                        background:
                          "linear-gradient(135deg,#22c55e,#16a34a)",
                        color: "#fff",
                      }),

                      ...(order.status === "PENDING" && {
                        background:
                          "linear-gradient(135deg,#facc15,#f59e0b)",
                        color: "#000",
                      }),

                      ...(order.status === "CANCELLED" && {
                        background:
                          "linear-gradient(135deg,#ef4444,#b91c1c)",
                        color: "#fff",
                      }),

                      ...(order.status !== "DELIVERED" &&
                        order.status !== "PENDING" &&
                        order.status !== "CANCELLED" && {
                          background: "#374151",
                          color: "#fff",
                        }),
                    }}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>

</Box>
);
}



export default RestaurantDetails;