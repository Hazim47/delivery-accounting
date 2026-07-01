import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  TextField,
  Chip,
} from "@mui/material";


import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";

function Restaurants() {

  const navigate = useNavigate();
  const { t } = useTranslation();

  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);

  const [loading, setLoading] = useState(true);


  /* Search only */
  const [search, setSearch] = useState("");

  /* ============================
      LOAD RESTAURANTS
  ============================ */

  const fetchRestaurants = async () => {
    try {
      const res = await API.get("/restaurants");
      const data = res.data.restaurants || [];

      setRestaurants(data);
      setFilteredRestaurants(data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  /* ============================
      SEARCH ONLY (NAME)
  ============================ */

  useEffect(() => {

    let data = [...restaurants];

    if (search.trim()) {
      data = data.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredRestaurants(data);

  }, [search, restaurants]);
    if (loading)
    return <h2>{t("loading")}</h2>;

  return (
  <Box
    sx={{
      p: 4,
      minHeight: "100vh",
      background:
        "radial-gradient(circle at top left,#141414 0%,#070707 45%,#000 100%)",
      color: "#fff",
    }}
  >
    {/* HEADER */}
    <Paper
      sx={{
        mb: 4,
        p: 4,
        borderRadius: "28px",
        background: "rgba(255,255,255,.03)",
        backdropFilter: "blur(25px)",
        border: "1px solid rgba(250,204,21,.12)",
        boxShadow: "0 25px 60px rgba(0,0,0,.65)",
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={3}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              background:
                "linear-gradient(90deg,#fde047,#facc15,#f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {t("restaurantsTitle")}
          </Typography>

          <Typography
            sx={{
              color: "#9ca3af",
              mt: 1,
              fontSize: 15,
            }}
          >
           {t("manageRestaurants")}
          </Typography>
        </Box>

       
      </Box>
    </Paper>

    {/* SEARCH */}
    <Paper
      sx={{
        mb: 4,
        p: 3,
        borderRadius: "24px",
        background: "rgba(255,255,255,.03)",
        backdropFilter: "blur(18px)",
        border: "1px solid rgba(250,204,21,.12)",
      }}
    >
      <TextField
        fullWidth
        label={t("namerestaurants")}
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        InputProps={{
          startAdornment: (
            <SearchIcon
              sx={{
                mr: 1,
                color: "#facc15",
              }}
            />
          ),
        }}
        sx={{
          input: {
            color: "#fff",
          },

          label: {
            color: "#bdbdbd",
          },

          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            background:
              "rgba(255,255,255,.02)",

            "& fieldset": {
              borderColor:
                "rgba(250,204,21,.25)",
            },

            "&:hover fieldset": {
              borderColor: "#facc15",
            },

            "&.Mui-focused fieldset": {
              borderWidth: 2,
              borderColor: "#facc15",
            },
          },
        }}
      />
    </Paper>

    {/* TABLE */}
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: "28px",
        overflow: "hidden",
        background: "rgba(255,255,255,.03)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(250,204,21,.12)",
        boxShadow:
          "0 30px 70px rgba(0,0,0,.6)",
      }}
    >
      <Table>

        <TableHead>
          <TableRow
            sx={{
              background:
                "linear-gradient(90deg,#181818,#111,#181818)",
            }}
          >
            {[
              "#",
              t("name"),
              t("phone"),
              t("status"),
              t("actions"),
            ].map((item) => (
              <TableCell
                key={item}
                sx={{
                  color: "#facc15",
                  fontWeight: 900,
                  fontSize: 15,
                  borderBottom:
                    "1px solid rgba(250,204,21,.15)",
                }}
              >
                {item}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>

          {filteredRestaurants.map((r, index) => (

            <TableRow
              key={r.id}
              hover
              sx={{
                transition: ".25s",

                "& td": {
                  borderBottom:
                    "1px solid rgba(255,255,255,.05)",
                },

                "&:hover": {
                  background:
                    "rgba(250,204,21,.05)",
                  transform:
                    "scale(1.003)",
                },
              }}
            >

              {/* NUMBER */}

              <TableCell>

                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg,#facc15,#f59e0b)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#000",
                    fontWeight: 900,
                    boxShadow:
                      "0 8px 18px rgba(250,204,21,.25)",
                  }}
                >
                  {index + 1}
                </Box>

              </TableCell>

              {/* NAME */}

              <TableCell
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                {r.name}
              </TableCell>

              {/* PHONE */}

              <TableCell
                sx={{
                  color: "#d1d5db",
                }}
              >
                {r.phone || "-"}
              </TableCell>

              {/* STATUS */}

              <TableCell>

                {r.active ? (
                  <Chip
                    label="ACTIVE"
                    sx={{
                      color: "#22c55e",
                      background:
                        "rgba(34,197,94,.12)",
                      fontWeight: 800,
                    }}
                  />
                ) : (
                  <Chip
                    label="INACTIVE"
                    sx={{
                      color: "#ef4444",
                      background:
                        "rgba(239,68,68,.12)",
                      fontWeight: 800,
                    }}
                  />
                )}

              </TableCell>

              {/* ACTION */}

              <TableCell align="center">

                <Button
                  startIcon={<VisibilityIcon />}
                  onClick={() =>
                    navigate(
                      `/restaurants/${r.id}`
                    )
                  }
                  sx={{
                    px: 3,
                    py: 1,
                    borderRadius: "14px",
                    textTransform: "none",
                    fontWeight: 900,
                    color: "#000",
                    background:
                      "linear-gradient(135deg,#facc15,#f59e0b)",

                    boxShadow:
                      "0 15px 30px rgba(250,204,21,.2)",

                    "&:hover": {
                      transform:
                        "translateY(-2px)",
                      background:
                        "linear-gradient(135deg,#fde047,#facc15)",
                    },
                  }}
                >
                  بيانات المطعم
                </Button>

              </TableCell>

            </TableRow>

          ))}

        </TableBody>

      </Table>
    </TableContainer>
  </Box>
);
}

export default Restaurants;