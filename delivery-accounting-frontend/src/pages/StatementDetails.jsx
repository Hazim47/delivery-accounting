import { useEffect, useState, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useTranslation } from "react-i18next";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";


import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);
function StatementDetails() {
  const { id } = useParams();
  const updateTimeout = useRef(null);
  const [exporting, setExporting] = useState(false);
  const { t } = useTranslation();
  const searchTimeout = useRef(null);
const gridRef = useRef();
  const [auditOpen, setAuditOpen] = useState(false);
const [auditLogs, setAuditLogs] = useState([]);
const [selectedOrderId, setSelectedOrderId] = useState(null);
 const user = JSON.parse(localStorage.getItem("user"));
const role = user?.role;
const [totalRows, setTotalRows] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(1000);

  const [search, setSearch] = useState("");

  const loadOrders = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/statements/${id}/orders`,
        {
          params: {
            page: page + 1,
            limit: pageSize,
            search,
          },
        }
      );

      setOrders(res.data.data || []);
      setTotalRows(res.data.total || 0);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
const openAudit = async (orderId) => {
  try {
    setSelectedOrderId(orderId);

    const res = await API.get(`/orders/${orderId}/audit`);

    console.log("AUDIT RESPONSE:", res.data); // 👈 مهم

    setAuditLogs(res.data || []);
    setAuditOpen(true);
  } catch (err) {
    console.log(err);
  }
};
useEffect(() => {
  loadOrders();
}, [id, page, pageSize]);

useEffect(() => {
  if (searchTimeout.current) {
    clearTimeout(searchTimeout.current);
  }

  searchTimeout.current = setTimeout(() => {
    setPage(0);
    loadOrders();
  }, 500);

  return () => clearTimeout(searchTimeout.current);
}, [search]);
   const columnDefs = useMemo(() => [
  {
    field: "externalOrderId",
    headerName: t("orderNumber"),
    width: 160,
    pinned: "left",
  },

  {
    field: "orderDate",
    headerName: t("date"),
    width: 140,
  },

  {
    field: "startTime",
    headerName: t("startTime"),
    width: 140,
  },

  {
    field: "endTime",
    headerName: t("endTime"),
    width: 140,
  },

  {
    field: "restaurantName",
    headerName: t("restaurant"),
    width: 220,
    valueGetter: (p) =>
      p.data?.restaurantName || p.data?.Restaurant?.name || "-",
  },

  {
    field: "branchName",
    headerName: t("branch"),
    width: 180,
  },

  {
    field: "captainName",
    headerName: t("captain"),
    width: 200,
    valueGetter: (p) =>
      p.data?.captainName || p.data?.Driver?.fullName || "-",
  },

  {
    field: "captainPhone",
    headerName: t("captainPhone"),
    width: 180,
  },

  {
    field: "tariff",
    headerName: t("tariff"),
    width: 120,
  },

  {
    field: "customerName",
    headerName: t("customerName"),
    width: 220,
  },

  {
    field: "customerPhone",
    headerName: t("customerPhone"),
    width: 180,
  },

  {
    field: "customerAddress",
    headerName: t("customerAddress"),
    width: 280,
  },

  {
    field: "customerAreaInput",
    headerName: t("customerArea"),
    width: 180,
  },

  {
    field: "orderAmount",
    headerName: t("orderAmount"),
    width: 130,
  },

  {
    field: "deliveryFee",
    headerName: t("deliveryFee"),
    width: 130,
  },

  {
    field: "vehicleType",
    headerName: t("vehicleType"),
    width: 140,
  },

  {
    field: "distance",
    headerName: t("distance"),
    width: 120,
  },

  {
    field: "invoiceNumber",
    headerName: t("invoiceNumber"),
    width: 180,
  },

  {
    field: "companyCommission",
    headerName: t("commission"),
    width: 140,
  },

  {
    field: "commissionDescription",
    headerName: t("commissionDescription"),
    width: 250,
  },

  {
    field: "cancelReason",
    headerName: t("cancelReason"),
    width: 220,
  },

  {
    field: "status",
    headerName: t("status"),
    width: 170,
    cellRenderer: (params) => {
      const status = params.value;

      const colors = {
        PENDING: "#f59e0b",
        PREPARING: "#06b6d4",
        ON_THE_WAY: "#6366f1",
        DELIVERED: "#22c55e",
        CANCELLED: "#ef4444",
      };

      const translatedStatus =
        status === "PENDING"
          ? t("pending")
          : status === "PREPARING"
          ? t("preparing")
          : status === "ON_THE_WAY"
          ? t("onTheWay")
          : status === "DELIVERED"
          ? t("delivered")
          : status === "CANCELLED"
          ? t("cancelled")
          : status;

      return (
        <span
          style={{
            padding: "6px 12px",
            borderRadius: "20px",
            color: "#fff",
            fontWeight: "bold",
            background: colors[status] || "#64748b",
          }}
        >
          {translatedStatus}
        </span>
      );
    },
  },

{
  field: "employeeNote",
  headerName: t("employeeNote"),
  width: 300,
  editable: () => role === "EMPLOYEE" || role === "ADMIN",

  cellEditor: "agLargeTextCellEditor",
  cellEditorPopup: true,
  cellEditorParams: {
    maxLength: 5000,
    rows: 6,
    cols: 40,
  },
},

 {
  field: "accountantNote",
  headerName: t("accountantNote"),
  width: 300,
  editable: () =>
    role === "ACCOUNTANT_1" ||
    role === "ACCOUNTANT_2" ||
    role === "ADMIN",

  cellEditor: "agLargeTextCellEditor",
  cellEditorPopup: true,
  cellEditorParams: {
    rows: 6,
  },
},

  ...(role === "ADMIN"
    ? [
        {
          headerName: t("auditLog"),
          width: 140,
          pinned: "right",

          cellRenderer: (params) => (
            <button
              style={{
                padding: "6px 10px",
                borderRadius: "8px",
                background: "#6366f1",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={() => openAudit(params.data.id)}
            >
              {t("viewAuditLog")}
            </button>
          ),
        },
      ]
    : []),
], [role, t]);

const printSelectedRows = () => {
  const api = gridRef.current?.api;
  const selectedRows = api.getSelectedRows();

  if (!selectedRows.length) {
    alert("اختار صفوف أولاً");
    return;
  }

  const columns = columnDefs.filter(col => col.field);

  const printWindow = window.open("", "_blank");

  // 👇 بدل تقسيم صفحات → تقسيم مجموعات عرض
  const chunkSize = 10;
  const chunks = [];

  for (let i = 0; i < columns.length; i += chunkSize) {
    chunks.push(columns.slice(i, i + chunkSize));
  }

  const tablesHtml = chunks.map((chunkCols, index) => {

    const headers = chunkCols.map(col => `
      <th>${col.headerName}</th>
    `).join("");

    const rows = selectedRows.map(row => `
      <tr>
        ${chunkCols.map(col => `
          <td>${row[col.field] ?? "-"}</td>
        `).join("")}
      </tr>
    `).join("");

    return `
      <div class="table-block">
        <h3>جزء ${index + 1}</h3>

        <table>
          <thead>
            <tr>${headers}</tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>
    `;
  }).join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>Print</title>

        <style>
          body {
            font-family: Arial;
            direction: rtl;
            padding: 20px;
          }

          .table-block {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }

          h3 {
            text-align: center;
            margin: 10px 0;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }

          th, td {
            border: 1px solid #000;
            padding: 5px;
            text-align: center;
          }

          th {
            background: #f2f2f2;
          }

          @media print {
            .table-block {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>

      <body>
        ${tablesHtml}
      </body>
    </html>
  `);

  printWindow.document.close();
};

return (
  <Box
    sx={{
      p: 3,
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      background:
        "radial-gradient(circle at top left,#0a0a0a 0%,#050505 55%,#000 100%)",
      color: "#fff",
    }}
  >
    {/* SEARCH */}
    <Paper
      sx={{
        p: 2,
        mb: 2,
        borderRadius: "18px",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(250,204,21,0.1)",
        flexShrink: 0,
      }}
    >
      
      <Box sx={{ display: "flex", gap: 2 }}>
        <TextField
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPlaceholder")}
          sx={{
            input: {
              color: "#fff",
              fontWeight: 500,
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "14px",
              background: "rgba(255,255,255,0.03)",
              "& fieldset": {
                borderColor: "rgba(255,255,255,0.08)",
              },
              "&:hover fieldset": {
                borderColor: "#facc15",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#facc15",
              },
            },
          }}
        />

        <Button
          variant="contained"
          onClick={() => setPage(0)}
          sx={{
            px: 4,
            borderRadius: "14px",
            fontWeight: 900,
            textTransform: "none",
            color: "#000",
            background: "linear-gradient(135deg,#facc15,#f59e0b)",
            boxShadow: "0 10px 25px rgba(250,204,21,.2)",
            "&:hover": {
              transform: "scale(1.03)",
            },
          }}
        >
          {t("searchButton")}
        </Button>
<Button
  variant="contained"
  onClick={printSelectedRows}
>
  Print
</Button>
      </Box>
    </Paper>

    {/* GRID (FULL HEIGHT MAGIC 🔥) */}
    <Paper
      sx={{
        flex: 1,
        minHeight: 0,
        borderRadius: "22px",
        overflow: "hidden",
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(22px)",
        border: "1px solid rgba(250,204,21,0.1)",
        boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
      }}
    >
      <div
        className="ag-theme-alpine custom-dark-grid"
        style={{
          height: "100%",
          width: "100%",
          padding: "8px",
        }}
      >
        <AgGridReact
          theme="legacy"
          rowData={orders}
           ref={gridRef}
          columnDefs={columnDefs}
          loading={loading}
          pagination={true}
          paginationPageSize={pageSize}
          domLayout="normal"
          rowSelection="multiple"
rowMultiSelectWithClick={true}
          enableCellTextSelection={true}
          animateRows={false}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            floatingFilter: true,
            minWidth: 150,
            wrapText: true,
          }}
          onCellValueChanged={async (params) => {
            if (updateTimeout.current)
              clearTimeout(updateTimeout.current);

            updateTimeout.current = setTimeout(async () => {
              try {
                const payload = {};

                if (params.colDef.field === "employeeNote") {
                  payload.employeeNote = params.newValue;
                }

                if (params.colDef.field === "accountantNote") {
                  payload.accountantNote = params.newValue;
                }

                await API.put(`/orders/${params.data.id}/notes`, payload);
              } catch (err) {
                console.log(err);
              }
            }, 400);
          }}
        />
      </div>
    </Paper>

    {/* AUDIT DIALOG */}
    <Dialog
      open={auditOpen}
      onClose={() => setAuditOpen(false)}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "22px",
          background: "rgba(10,10,10,0.95)",
          border: "1px solid rgba(250,204,21,0.1)",
          color: "#fff",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 900, color: "#facc15" }}>
        📜 {t("auditLogs")}
      </DialogTitle>

      <DialogContent>
        {auditLogs.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center", color: "#94a3b8" }}>
            {t("noAuditLogsFound")}
          </Box>
        ) : (
          auditLogs.map((log, i) => (
            <Box
              key={i}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: "12px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <b style={{ color: "#fff" }}>{log.userName}</b>{" "}
              <span style={{ color: "#94a3b8" }}>({log.role})</span>

              <div>🧾 {log.action}</div>
              <div>📌 {t("field")}: {log.field}</div>
              <div>⬅️ {t("oldValue")}: {log.oldValue}</div>
              <div>➡️ {log.newValue}: {log.newValue}</div>

              <div style={{ fontSize: 12, color: "#64748b" }}>
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </Box>
          ))
        )}
      </DialogContent>
    </Dialog>
  </Box>
);
}

export default StatementDetails;

