import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

function DriverStatement() {
  const { id } = useParams();
 const { t } = useTranslation();
  const [statement, setStatement] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ---------------- LOAD DATA ----------------
  const loadData = async () => {
    try {
      setLoading(true);

      const [statementRes, paymentsRes] = await Promise.all([
        API.get(`/drivers/${id}/statement`),
        API.get(`/driver-payments/${id}`),
      ]);

      setStatement(statementRes?.data || null);

      const sorted = (paymentsRes?.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setPayments(sorted);
    } catch (err) {
      console.error("LOAD ERROR:", err);

      setSnack({
        open: true,
        message:t("errorLoadData"),
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  // ---------------- SAFE VALUES ----------------
  const totalEarnings = Number(statement?.totalEarnings ?? 0);
  const paidAmount = Number(statement?.paidAmount ?? 0);

  const remaining = useMemo(
    () => totalEarnings - paidAmount,
    [totalEarnings, paidAmount]
  );

  const lastPayment =
    payments?.length > 0 ? payments[0]?.createdAt : null;

  // ---------------- ADD PAYMENT ----------------
  const handleAddPayment = async () => {
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      setSnack({
        open: true,
        message: t("invalidAmount"),
        severity: "error",
      });
      return;
    }

    if (numAmount > remaining) {
      setSnack({
        open: true,
        message: `${t("maxAllowed")}: ${remaining.toFixed(2)}`,
        severity: "error",
      });
      return;
    }

    try {
      await API.post(`/driver-payments`, {
        driverId: id,
        amount: numAmount,
        note,
      });

      setOpen(false);
      setAmount("");
      setNote("");

      setSnack({
        open: true,
        message: t("paymentAdded"),
        severity: "success",
      });

      await loadData();
    } catch (err) {
      console.error(err);

      setSnack({
        open: true,
        message: t("errorAddPayment"),
        severity: "error",
      });
    }
  };

  // ---------------- EXPORT PDF ----------------
  const exportPDF = () => {
    if (!statement) return;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Driver Statement", 14, 15);

    doc.setFontSize(12);
    doc.text(`Driver: ${statement?.fullName ?? "-"}`, 14, 30);
    doc.text(`Total Earnings: ${totalEarnings}`, 14, 40);
    doc.text(`Paid: ${paidAmount}`, 14, 50);
    doc.text(`Remaining: ${remaining.toFixed(2)}`, 14, 60);

    autoTable(doc, {
      startY: 75,
      head: [[t("amount"), t("note"), t("date")]],
      body: payments.map((p) => [
        p.amount ?? 0,
        p.note ?? "-",
        p.createdAt
          ? new Date(p.createdAt).toLocaleDateString()
          : "-",
      ]),
    });

    doc.save(`driver-statement-${statement?.fullName || "driver"}.pdf`);
  };

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg,#0f172a,#111827)",
          color: "#fff",
        }}
      >
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  // ---------------- EMPTY ----------------
  if (!statement) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg,#0f172a,#111827)",
          color: "#fff",
        }}
      >
        <Typography sx={{ color: "#fff", fontWeight: 600 }}>
          {t("noDataFound")}
        </Typography>
      </Box>
    );
  }

  // ---------------- UI ----------------
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
    <Typography
      variant="h4"
      sx={{
        fontWeight: 900,
        mb: 3,
        background:
          "linear-gradient(90deg,#facc15,#f59e0b,#fde047)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {t("driverStatement")}
    </Typography>

    {/* STATS */}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(4,1fr)",
        },
        gap: 2,
        mb: 3,
      }}
    >
      {[
        [t("totalEarnings"), totalEarnings],
        [t("paidAmount"), paidAmount],
        [t("remaining"), remaining.toFixed(2)],
        [
          t("lastPayment"),
          lastPayment
            ? new Date(lastPayment).toLocaleDateString()
            : "-",
        ],
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

            <Typography sx={{ fontWeight: 900, fontSize: 22 }}>
              {value}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>

    {/* ACTIONS */}
    <Box display="flex" gap={2} mb={2}>
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          background: "linear-gradient(135deg,#facc15,#f59e0b)",
          color: "#000",
          fontWeight: 900,
          borderRadius: "12px",
          px: 3,
          "&:hover": {
            transform: "scale(1.03)",
          },
        }}
      >
       + {t("addPayment")}
      </Button>

      <Button
        variant="outlined"
        onClick={exportPDF}
        sx={{
          borderColor: "rgba(250,204,21,0.3)",
          color: "#facc15",
          fontWeight: 800,
          borderRadius: "12px",
        }}
      >
        {t("exportPdf")}
      </Button>
    </Box>

    {/* TABLE */}
    <Paper
      sx={{
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(22px)",
        border: "1px solid rgba(250,204,21,0.12)",
        borderRadius: "20px",
        overflow: "hidden",
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
            {["Amount", "Note", "Date"].map((h) => (
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
          {payments.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                align="center"
                sx={{ color: "#a1a1aa" }}
              >
                {t("noPayments")}
              </TableCell>
            </TableRow>
          ) : (
            payments.map((p) => (
              <TableRow
                key={p.id}
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
                  {p.amount}
                </TableCell>

                <TableCell>
                  {p.note || "-"}
                </TableCell>

                <TableCell>
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString()
                    : "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Paper>

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
      <DialogTitle sx={{ fontWeight: 900 }}>
        + {t("addPayment")}
      </DialogTitle>

      <DialogContent>
        <TextField
          fullWidth
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{
            mt: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
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

        <TextField
          fullWidth
          label="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          sx={{
            mt: 2,
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
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
          onClick={handleAddPayment}
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

    {/* SNACKBAR */}
    <Snackbar
      open={snack.open}
      autoHideDuration={3000}
      onClose={() =>
        setSnack((p) => ({ ...p, open: false }))
      }
    >
      <Alert
        severity={snack.severity}
        sx={{
          background: "rgba(255,255,255,0.05)",
          color: "#fff",
        }}
      >
        {snack.message}
      </Alert>
    </Snackbar>
  </Box>
);
}

export default DriverStatement;