import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useTranslation } from "react-i18next";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Pagination,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";

function Statements() {
  const navigate = useNavigate();
const { t } = useTranslation();
  const [loading, setLoading] =
    useState(false);
const user = JSON.parse(localStorage.getItem("user"));
const role = user?.role;
  const [statements, setStatements] =
    useState([]);

  const [page, setPage] =
    useState(1);

  const [pages, setPages] =
    useState(1);
const [search, setSearch] = useState("");
  const loadStatements =
    async () => {
      try {
        setLoading(true);

       const res = await API.get("/statements", {
  params: {
    page,
    limit: 20,
    search,
  },
});

        setStatements(
          res.data.data || []
        );

        setPages(
          res.data.pages || 1
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
  const timer = setTimeout(() => {
    loadStatements();
  }, 300);

  return () => clearTimeout(timer);
}, [page, search]);
const toggleLock = async (statementId) => {
  if (role !== "ADMIN") return;

  const statement = statements.find(s => s.id === statementId);

  if (statement?.isLocked && role !== "ADMIN") {
    return;
  }

  try {
    await API.put(`/statements/${statementId}/toggle-lock`);
    loadStatements();
  } catch (err) {
    console.log(err);
  }
};

return (
  <Box
    sx={{
      p: 3,
      minHeight: "100vh",
      background:
        "radial-gradient(circle at top left,#0a0a0a 0%,#050505 50%,#000 100%)",
      color: "#fff",
    }}
  >

    {/* HEADER */}
    <Typography
      variant="h4"
      sx={{
        mb: 3,
        fontWeight: 900,
        background:
          "linear-gradient(90deg,#facc15,#f59e0b,#fde047)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {t("statementsTitle")}
    </Typography>
<Paper
  sx={{
    mb: 3,
    p: 3,
    borderRadius: "24px",
    background: "rgba(255,255,255,.03)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(250,204,21,.12)",
    boxShadow: "0 20px 50px rgba(0,0,0,.35)",
  }}
>
  <TextField
    fullWidth
    label="بحث باسم الملف أو التاريخ"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon
            sx={{
              color: "#facc15",
              mr: 1,
            }}
          />
        </InputAdornment>
      ),
    }}
    sx={{
      "& input": {
        color: "#fff",
      },

      "& label": {
        color: "#bdbdbd",
      },

      "& label.Mui-focused": {
        color: "#facc15",
      },

      "& .MuiOutlinedInput-root": {
        borderRadius: "16px",
        background: "rgba(255,255,255,.02)",
        transition: ".25s",

        "& fieldset": {
          borderColor: "rgba(250,204,21,.25)",
        },

        "&:hover fieldset": {
          borderColor: "#facc15",
        },

        "&.Mui-focused": {
          background: "rgba(255,255,255,.04)",
          boxShadow: "0 0 20px rgba(250,204,21,.18)",
        },

        "&.Mui-focused fieldset": {
          borderColor: "#facc15",
          borderWidth: "2px",
        },
      },
    }}
  />
</Paper>
    {/* TABLE CARD */}
    <Paper
      sx={{
        p: 3,
        borderRadius: "24px",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(22px)",
        border: "1px solid rgba(250,204,21,0.12)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
      }}
    >
      {loading ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
          }}
        >
          <CircularProgress sx={{ color: "#facc15" }} />
        </Box>
      ) : (
        <Table>
          <TableHead>
            <TableRow
              sx={{
                background:
                  "linear-gradient(90deg,#0a0a0a,#111)",
              }}
            >
              {[
  t("fileName"),
  t("total"),
  t("imported"),
  t("skipped"),
  t("restaurants"),
  t("drivers"),
  t("date"),
  t("action"),
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
            {statements.map((statement) => (
              <TableRow
                key={statement.id}
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
<TableCell sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}>
  
  {/* Status Dot */}
  <Box
    sx={{
      width: 10,
      height: 10,
      borderRadius: "50%",
      backgroundColor: statement.isLocked ? "#ef4444" : "#22c55e",
      boxShadow: statement.isLocked
        ? "0 0 8px rgba(239,68,68,0.8)"
        : "0 0 8px rgba(34,197,94,0.8)",
    }}
  />

  {statement.fileName}
</TableCell>

                <TableCell>
                  {statement.totalRows}
                </TableCell>

                <TableCell sx={{ color: "#22c55e", fontWeight: 800 }}>
                  {statement.importedOrders}
                </TableCell>

                <TableCell sx={{ color: "#facc15", fontWeight: 800 }}>
                  {statement.skippedOrders}
                </TableCell>

                <TableCell>
                  {statement.restaurantsCreated}
                </TableCell>

                <TableCell>
                  {statement.driversCreated}
                </TableCell>

                <TableCell>
                  {new Date(statement.createdAt).toLocaleString()}
                </TableCell>

                <TableCell>
                  <Button
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={() =>
                      navigate(`/statements/${statement.id}`)
                    }
                    sx={{
                      textTransform: "none",
                      fontWeight: 900,
                      borderRadius: "10px",
                      color: "#000",
                      background:
                        "linear-gradient(135deg,#facc15,#f59e0b)",
                      "&:hover": {
                        transform: "scale(1.03)",
                      },
                    }}
                  >
                    {t("view")}
                  </Button>
                  {role === "ADMIN" && (
  <Button
    variant="contained"
    color={
      statement.isLocked
        ? "success"
        : "error"
    }
    onClick={() =>
      toggleLock(statement.id)
    }
    sx={{ ml: 1 }}
  >
    {statement.isLocked
      ? "فتح"
      : "إغلاق"}
  </Button>
)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Paper>

    {/* PAGINATION */}
    <Box
      sx={{
        mt: 3,
        display: "flex",
        justifyContent: "center",
        "& .MuiPaginationItem-root": {
          color: "#a1a1aa",
        },
        "& .Mui-selected": {
          background: "#facc15 !important",
          color: "#000",
          fontWeight: 900,
        },
      }}
    >
      <Pagination
        page={page}
        count={pages}
        onChange={(e, value) => setPage(value)}
      />
    </Box>
  </Box>
);
}

export default Statements;