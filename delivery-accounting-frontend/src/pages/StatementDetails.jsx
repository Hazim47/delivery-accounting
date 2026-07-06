import { useEffect, useState, useMemo, useRef,useCallback } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { useTranslation } from "react-i18next";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import "./excel-grid.css";
import QRCode from "qrcode";
import {
  Box,
  Paper,
  TextField,
  Button,
} from "@mui/material";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const EDITABLE_FIELDS = [
  "restaurantName",
  "branchName",
  "captainName",
  "captainPhone",
  "tariff",
  "customerName",
  "customerPhone",
  "customerAddress",
  "customerAreaInput",
  "deliveryFee",
  "orderAmount",
  "vehicleType",
  "distance",
  "invoiceNumber",
  "companyCommission",
  "commissionDescription",
  "cancelReason",
  "status",
  "employeeNote",
  "accountantNote",
  "externalOrderId",
"orderDate",
"startTime",
"endTime",
"accountingCompensation",
];

function StatementDetails() {
  const { id } = useParams();
  const updateTimeouts = useRef({});
  const { t } = useTranslation();
  const searchTimeout = useRef(null);
const gridRef = useRef();
const [totalRows, setTotalRows] = useState(0);
const [isLocked, setIsLocked] = useState(false);
  const [auditOpen, setAuditOpen] = useState(false);
const [auditLogs, setAuditLogs] = useState([]);
const [selectedOrderId, setSelectedOrderId] = useState(null);
 const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user"));
}, []);
const role = user?.role;
const permissions = user?.permissions || {};
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
const isReadOnly = isLocked && role !== "ADMIN";
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(1000);

  const [search, setSearch] = useState("");
const addRow = async () => {
  try {
    await API.post(`/statements/${id}/orders`);
    loadOrders();
  } catch (err) {
    console.log(err);
  }
};
const loadOrders = useCallback(async () => {
  try {
    setLoading(true);

    const res = await API.get(`/statements/${id}/orders`, {
      params: {
        page: page + 1,
        limit: pageSize,
        search,
      },
    });

    setOrders(res.data.data || []);
    setTotalRows(res.data.total || 0);
    setIsLocked(res.data.isLocked || false);
  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
}, [id, page, pageSize, search]);
const canEdit = (field) => {
  if (role === "ADMIN") return true;

  if (isLocked) return false;

  return permissions[field] === true;
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
}, [loadOrders]);

useEffect(() => {
  if (searchTimeout.current) {
    clearTimeout(searchTimeout.current);
  }

  searchTimeout.current = setTimeout(() => {
    setPage(0);
  }, 500);

  return () => clearTimeout(searchTimeout.current);
}, [search]);
   const columnDefs = useMemo(() => [
  {
    field: "externalOrderId",
    headerName: t("orderNumber"),
    width: 160,
    pinned: "left",
    editable: () => canEdit("externalOrderId"),
  },

  {
    field: "orderDate",
    headerName: t("date"),
    width: 140,
    sort: "asc",
    editable: () => canEdit("orderDate"),
  },

  {
    field: "startTime",
    headerName: t("startTime"),
    width: 140,
    sort: "asc",
    editable: () => canEdit("startTime"),
  },

  {
    field: "endTime",
    headerName: t("endTime"),
    width: 140,
    sort: "asc",
    editable: () => canEdit("endTime"),
  },

 {
  field: "restaurantName",
  headerName: t("restaurant"),
  width: 220,
  editable: () => canEdit("restaurantName"),
  valueGetter: (p) =>
    p.data?.restaurantName || p.data?.Restaurant?.name || "-",
},

{
  field: "branchName",
  headerName: t("branch"),
  width: 180,
  editable: () => canEdit("branchName"),
},

{
  field: "captainName",
  headerName: t("captain"),
  width: 200,
  editable: () => canEdit("captainName"),
  valueGetter: (p) =>
    p.data?.captainName || p.data?.Driver?.fullName || "-",
},

{
  field: "captainPhone",
  headerName: t("captainPhone"),
  width: 180,
  editable: () =>  canEdit("captainPhone"),
},

{
  field: "tariff",
  headerName: t("tariff"),
  width: 120,
  editable: () =>canEdit("tariff"),
},

{
  field: "customerName",
  headerName: t("customerName"),
  width: 200,
  editable: () =>canEdit("customerName"),
},

{
  field: "customerPhone",
  headerName: t("customerPhone"),
  width: 180,
  editable: () => canEdit("customerPhone"),
},

{
  field: "customerAddress",
  headerName: t("customerAddress"),
  width: 280,
  editable: () => canEdit("customerAddress"),

  cellClassRules: {
    "bg-red-cell": (params) => {
      return (
        params.data?.customerAddress &&
        params.data?.customerAreaInput &&
        params.data.customerAddress.trim() !==
          params.data.customerAreaInput.trim()
      );
    },
  },

  valueFormatter: (params) => {
    const addr = params.value;
    const area = params.data?.customerAreaInput;

    if (addr && area && addr.trim() !== area.trim()) {
      return `⚠ ${addr}`;
    }

    return addr || "-";
  },
},

{
  field: "customerAreaInput",
  headerName: t("customerArea"),
  width: 180,
  editable: () => canEdit("customerAreaInput"),
},

{
  field: "orderAmount",
  headerName: t("orderAmount"),
  width: 130,
  editable: () => canEdit("orderAmount"),
},

{
  field: "deliveryFee",
  headerName: t("deliveryFee"),
  width: 130,
  editable: () =>  canEdit("deliveryFee"),
},

{
  field: "vehicleType",
  headerName: t("vehicleType"),
  width: 140,
  editable: () =>canEdit("vehicleType"),
},

{
  field: "distance",
  headerName: t("distance"),
  width: 120,
  editable: () =>  canEdit("distance"),
},

{
  field: "invoiceNumber",
  headerName: t("invoiceNumber"),
  width: 180,
  editable: () =>  canEdit("invoiceNumber"),
},

{
  field: "companyCommission",
  headerName: t("commission"),
  width: 140,
  editable: () => canEdit("companyCommission"),
},

{
  field: "commissionDescription",
  headerName: t("commissionDescription"),
  width: 250,
  editable: () => canEdit("commissionDescription"),
},

{
  field: "cancelReason",
  headerName: t("cancelReason"),
  width: 220,
  editable: () =>  canEdit("cancelReason"),
},

{
  field: "status",
  headerName: t("status"),
  width: 170,
  editable: () => canEdit("status"),
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
  editable: () => canEdit("employeeNote"),
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
  editable: () =>canEdit("accountantNote"),
  cellEditor: "agLargeTextCellEditor",
  cellEditorPopup: true,
  cellEditorParams: {
    rows: 6,
  },
},
{
  field: "accountingCompensation",
  headerName: t("accountingCompensation"),
  width: 170,
  editable: () => canEdit("accountingCompensation"),
  valueFormatter: (params) =>
    Number(params.value || 0).toFixed(2),
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
],[role, t, permissions, isLocked]);
useEffect(() => {
  document.body.style.overflow = "hidden";

  return () => {
    document.body.style.overflow = "auto";
  };
}, []);

const printSelectedRows = async () => {
  const api = gridRef.current?.api;
  const selectedRows = api.getSelectedRows();

  if (!selectedRows.length) {
    alert("اختار صفوف أولاً");
    return;
  }

  const printWindow = window.open("", "_blank");

  const htmlCards = await Promise.all(
    selectedRows.map(async (row, index) => {
      const qr = await QRCode.toDataURL(
        `ORDER:${row.externalOrderId || "-"}`
      );

      return `
        <div class="page">

          <!-- HEADER ERP -->
          <div class="header">
            <div>
              <div class="system"> OFFERATS SYSTEM</div>
              <div class="meta">Statement Report</div>
            </div>

            <div class="order-box">
              <div>Order #</div>
              <div class="order-id">${row.externalOrderId || "-"}</div>
            </div>
          </div>

          <div class="line"></div>

          <!-- BODY -->
          <div class="content">

            <div class="grid">

              ${columnDefs
                .filter(col => col.field)
                .map(col => {
                  const value = row[col.field];

                  return `
                    <div class="item">
                      <div class="label">${col.headerName}</div>
                      <div class="value">${value ?? "-"}</div>
                    </div>
                  `;
                })
                .join("")}

            </div>

            <!-- QR + STATUS -->
            <div class="bottom">
              <img class="qr" src="${qr}" />

            </div>

          </div>
        </div>
      `;
    })
  );

  printWindow.document.write(`
    <html>
      <head>
        <title>Offerat Order Print</title>

        <style>

          body {
            margin: 0;
            padding: 0;
            font-family: Arial;
            background: #eee;
            direction: rtl;
          }

          /* PAGE (A4 STYLE) */
          .page {
            width: 210mm;
            min-height: 297mm;
            margin: auto;
            background: white;
            padding: 20px;
            box-sizing: border-box;
            page-break-after: always;
          }

          /* HEADER */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }

          .system {
            font-size: 18px;
            font-weight: 900;
            color: #111;
            letter-spacing: 1px;
          }

          .meta {
            font-size: 12px;
            color: #777;
          }

          .order-box {
            text-align: left;
            border: 1px solid #ddd;
            padding: 8px 12px;
            border-radius: 8px;
          }

          .order-id {
            font-weight: 900;
            font-size: 16px;
            color: #000;
          }

          .line {
            height: 2px;
            background: linear-gradient(to right, #facc15, #f59e0b);
            margin: 15px 0;
          }

          /* GRID */
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }

          .item {
            background: #fafafa;
            border: 1px solid #eee;
            padding: 10px;
            border-radius: 10px;
          }

          .label {
            font-size: 11px;
            color: #777;
          }

          .value {
            font-size: 13px;
            font-weight: 700;
            margin-top: 4px;
          }

          /* BOTTOM */
          .bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
          }

          .qr {
            width: 90px;
            height: 90px;
          }

          /* STATUS */
          .status {
            padding: 8px 14px;
            border-radius: 20px;
            font-weight: bold;
            color: white;
            font-size: 12px;
          }

          .status-PENDING { background: #f59e0b; }
          .status-PREPARING { background: #06b6d4; }
          .status-ON_THE_WAY { background: #6366f1; }
          .status-DELIVERED { background: #22c55e; }
          .status-CANCELLED { background: #ef4444; }

          /* FOOTER */
          .footer {
            position: absolute;
            bottom: 15px;
            left: 20px;
            right: 20px;
            display: flex;
            justify-content: space-between;
            font-size: 10px;
            color: #999;
          }

          @media print {
            body {
              background: white;
            }
          }

        </style>
      </head>

      <body>
        ${htmlCards.join("")}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.print();
};

return (
  <Box
    sx={{
       px: 3,
    pt: 1,   // ⬆️ نرفع المحتوى لفوق
    pb: 2,
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
  p: 1.2,
  mb: 1,
  borderRadius: "14px",
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
          onClick={loadOrders}
       sx={btnStyle}
        >
          {t("searchButton")}
        </Button>
        {role === "ADMIN" && (
  <Button
    variant="contained"
    onClick={addRow}
       sx={btnStyle}
  >
   {t("addRow")}
  </Button>
)}
<Button
  variant="contained"
  onClick={printSelectedRows}
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
  {t("print")}
</Button>
      </Box>
    </Paper>

    {/* GRID (FULL HEIGHT MAGIC 🔥) */}
    <Paper
      sx={{
       
       
        
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(22px)",
        border: "1px solid rgba(250,204,21,0.1)",
        boxShadow: "0 30px 90px rgba(0,0,0,0.6)",
            flex: 1,
    minHeight: 0,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    borderRadius: "22px",
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
  ref={gridRef}
  rowData={orders}
  columnDefs={columnDefs}
  loading={loading}
  pagination={true}
  paginationPageSize={pageSize}
  domLayout="normal"
enterMovesDown={false}
enterMovesRight={false}
  rowSelection="multiple"
  rowMultiSelectWithClick={true}
  enableCellTextSelection={true}
  animateRows={false}
  readOnlyEdit={isReadOnly}
  singleClickEdit={!isReadOnly}
  suppressClickEdit={isReadOnly}
  suppressCellSelection={isReadOnly}
  className="excel-grid ag-theme-alpine"   // 🔥 هذا أهم سطر

defaultColDef={{
  sortable: true,
  filter: true,
  resizable: true,
  floatingFilter: true,
  minWidth: 140,
  autoHeight: false,
  wrapText: false,

  headerClass: (params) => {
    const editable =
      typeof params.colDef.editable === "function"
        ? params.colDef.editable(params)
        : params.colDef.editable;

    return editable ? "editable-header" : "";
  },

  cellClass: (params) => {
    const editable =
      typeof params.colDef.editable === "function"
        ? params.colDef.editable(params)
        : params.colDef.editable;

    return editable ? "editable-cell" : "";
  },
}}
onCellKeyDown={(params) => {
    if (isReadOnly) {
      params.api.stopEditing(true);
    }
  }}

  onCellDoubleClicked={(params) => {
   if (isReadOnly) {
      params.api.stopEditing(true);
    }
  }}
suppressKeyboardEvent={() => {
  return isReadOnly;
}}

onPasteStart={(params) => {
  if (isReadOnly) return false;
}}

onCellValueChanged={async (params) => {
   if (isReadOnly) return;
const orderId = params.data.id;

if (updateTimeouts.current[orderId]) {
  clearTimeout(updateTimeouts.current[orderId]);
}

updateTimeouts.current[orderId] = setTimeout(async () => {
    try {
      const field = params.colDef.field;

      if (!EDITABLE_FIELDS.includes(field)) return;

      const payload = {
        [field]: params.newValue,
      };

      await API.put(`/orders/${params.data.id}/notes`, payload);
    } catch (err) {
      console.log(err);
    }
    finally {
  delete updateTimeouts.current[orderId];
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
const btnStyle = {
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
};
export default StatementDetails;

