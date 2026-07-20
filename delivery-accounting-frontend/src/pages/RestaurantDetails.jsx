import { useEffect, useState, useCallback,useMemo  } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";
import enGB from "date-fns/locale/en-GB";
import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
 DialogTitle,
 DialogContent,
 DialogActions,
  Checkbox,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

function RestaurantDetails() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [restaurant, setRestaurant] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders,setSelectedOrders]=useState(new Set());
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState(null);
const [toDate, setToDate] = useState(null);
const [printDialog,setPrintDialog] = useState(false);
const [printAll,setPrintAll] = useState(false);
const [totalPages,setTotalPages]=useState(1);
const [selectedColumns, setSelectedColumns] = useState([
  "orderDate",
  "customerName",
  "captainName",
  "customerAddress",
  "branchName",
  "tariff",
  "AccountingDepartment",
]);
const columns = useMemo(()=>[
  {key:"orderDate", label:t("date")},
  {key:"customerName", label:t("customer")},
  {key:"captainName", label:t("captain")},
  {key:"customerAddress", label:t("customerAddress")},
  {key:"branchName", label:t("branchName")},
  {key:"tariff", label:t("tariff")},
  {key:"AccountingDepartment", label:t("AccountingDepartment")},
],[t]);
const fetchRestaurant = useCallback(async () => {
  try {
    const params = new URLSearchParams();

    if (fromDate) {
      params.append("from", format(fromDate, "yyyy-MM-dd"));
    }

    if (toDate) {
      params.append("to", format(toDate, "yyyy-MM-dd"));
    }

   params.append("page", page);

const url = `/restaurants/${id}/details?${params.toString()}`;

    const res = await API.get(url);

    setRestaurant(res.data.restaurant);
    setStats(res.data.stats);
    setOrders(res.data.orders);
    setTotalPages(res.data.totalPages || 1);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}, [id, fromDate, toDate, page]);

useEffect(() => {
  fetchRestaurant();
}, [fetchRestaurant]);

const handleSearch = () => {
  if (fromDate && toDate && fromDate > toDate) {
    alert(t("invalidDateRange"));
    return;
  }

  setLoading(true);
  setPage(1);
  fetchRestaurant();
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
const toggleOrder = (order)=>{

setSelectedOrders(prev=>{

const next = new Set(prev);

if(next.has(order.id)){
next.delete(order.id);
}else{
next.add(order.id);
}

return next;

});

};

const toggleAllOrders = ()=>{

setSelectedOrders(prev=>{

const next = new Set(prev);

const allSelected = orders.every(
(order)=>next.has(order.id)
);


orders.forEach(order=>{

if(allSelected){
next.delete(order.id);
}
else{
next.add(order.id);
}

});


return next;

});

};

const toggleColumn = (key)=>{

setSelectedColumns(prev=>{

if(prev.includes(key)){
return prev.filter(c=>c!==key);
}

return [...prev,key];

});

};
const handlePrint = (printAll = false) => {

  const ordersToPrint = printAll 
? orders 
: orders.filter(order=>selectedOrders.has(order.id));


  if(ordersToPrint.length === 0){
    alert(t("noOrdersToPrint"));
    return;
  }


  const printWindow = window.open("", "_blank");


const columnLabels = {
    orderDate:t("date"),
    customerName:t("customer"),
    captainName:t("captain"),
    customerAddress:t("customerAddress"),
    branchName:t("branchName"),
    tariff:t("tariff"),
    AccountingDepartment:t("AccountingDepartment"),
   
};


  printWindow.document.write(`

<html dir="rtl">

<head>

<title>Orders Print</title>

<style>

body{
font-family: Arial;
padding:30px;
}


h2{
text-align:center;
}


table{
width:100%;
border-collapse:collapse;
margin-top:20px;
}


th{
background:#eee;
}


td,th{
border:1px solid #333;
padding:8px;
text-align:center;
}


</style>

</head>


<body>


<h2>
${restaurant.name}
</h2>


<table>

<thead>

<tr>

${
selectedColumns
.map(col=>`
<th>${columnLabels[col]}</th>
`)
.join("")
}

</tr>

</thead>


<tbody>


${ordersToPrint.map(order=>`

<tr>

${
selectedColumns.map(col=>{

let value = order[col] ?? "";


if(col === "tariff" || col === "AccountingDepartment"){
 value = Number(value || 0).toFixed(2) + " JD";
}


return `<td>${String(value)
.replace(/</g,"&lt;")
.replace(/>/g,"&gt;")
}</td>`;

}).join("")
}


</tr>


`).join("")}


</tbody>

</table>


<script>

window.onload=function(){
window.print();
}

</script>


</body>

</html>

`);


printWindow.document.close();

};
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
           {t("restaurantDetailsSubtitle")}
          </Typography>
        </Box>

      </Box>
    </Paper>

    {/* ================= FILTER CARD ================= */}

   <Paper
  elevation={0}
  sx={{
    p: 4,
    mb: 4,
    borderRadius: "30px",
    background:
      "linear-gradient(145deg,rgba(255,255,255,.05),rgba(255,255,255,.02))",
    backdropFilter: "blur(30px)",
    border: "1px solid rgba(250,204,21,.15)",
    boxShadow: "0 25px 60px rgba(0,0,0,.45)",
  }}
>
  <Typography
    variant="h6"
    sx={{
      mb: 4,
      color: "#fde047",
      fontWeight: 900,
      display: "flex",
      alignItems: "center",
      gap: 1,
      letterSpacing: ".5px",
    }}
  >
    <SearchIcon />
    {t("searchByDate")}
  </Typography>

  <Grid
    container
    spacing={3}
    alignItems="stretch"
  >
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
          {t("fromDate")}
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
                  height: 58,
                  borderRadius: "18px",
                  background: "rgba(255,255,255,.04)",

                  "& fieldset": {
                    borderColor: "rgba(250,204,21,.25)",
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
          {t("toDate")}
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
                  height: 58,
                  borderRadius: "18px",
                  background: "rgba(255,255,255,.04)",

                  "& fieldset": {
                    borderColor: "rgba(250,204,21,.25)",
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
      <Paper
        elevation={0}
        sx={{
          height: "100%",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          background: "rgba(255,255,255,.03)",
          border: "1px solid rgba(250,204,21,.12)",
          borderRadius: "20px",
          p: 2,
        }}
      >
        <Button
          fullWidth
          startIcon={<SearchIcon sx={{ fontSize: 28 }} />}
          onClick={handleSearch}
          sx={{
            height: 58,
            borderRadius: "18px",

            fontWeight: 900,
            fontSize: 17,
            letterSpacing: ".4px",

            color: "#000",

            background:
              "linear-gradient(135deg,#fde047,#facc15,#f59e0b)",

            boxShadow:
              "0 15px 35px rgba(250,204,21,.35)",

            transition: ".35s",

            "&:hover": {
              transform: "translateY(-4px) scale(1.03)",
              boxShadow:
                "0 25px 55px rgba(250,204,21,.45)",
            },

            "&:active": {
              transform: "scale(.98)",
            },
          }}
        >
          {t("search")}
        </Button>
      </Paper>
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
            📦 {t("totalOrders")}
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
           {t("ordersDuringPeriod")}
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
            💰 {t("totalSales")}
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
           {t("deliveredOrdersValue")}
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
             🏪 {t("tariff")}
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
           {t("companyTariffTotal")}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
<Paper
 elevation={0}
 sx={{
   p:3,
   height:"100%",
   borderRadius:"24px",

   background:
    "linear-gradient(145deg,rgba(168,85,247,.15),rgba(255,255,255,.04))",

   border:
    "1px solid rgba(168,85,247,.25)",

   backdropFilter:
    "blur(18px)",

   transition:".35s",

   boxShadow:
    "0 20px 50px rgba(168,85,247,.12)",

   "&:hover":{
      transform:"translateY(-6px)",
      boxShadow:
       "0 25px 60px rgba(168,85,247,.3)",
   },
 }}
>
    <Typography
      sx={{
        color: "#d8b4fe",
        fontWeight: 700,
        mb: 1,
      }}
    >
     💵 {t("AccountingDepartment")}
    </Typography>

    <Typography
      sx={{
        fontSize: 34,
        fontWeight: 900,
        color: "#fff",
      }}
    >
      {Number(stats.totalAccountingDepartment || 0).toFixed(2)} JD
    </Typography>

    <Typography
      sx={{
        mt: 1,
        color: "#9ca3af",
      }}
    >
     {t("totalAccountingDepartment")}
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
      
<Box
sx={{
display:"flex",
justifyContent:"flex-end",
p:3,
pb:1
}}
>

<Box
sx={{
display:"flex",
gap:2
}}
>

<Box sx={{display:"flex",gap:2,flexWrap:"wrap"}}>

<Button
variant="contained"
onClick={()=>setPrintDialog(true)}
sx={{
background:"linear-gradient(135deg,#fde047,#f59e0b)",
color:"#000",
fontWeight:900
}}
>
🖨️ {t("printOptions")}
</Button>


</Box>



</Box>

</Box>


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
               {t("date")}
              </TableCell>

              <TableCell
                sx={{
                  color: "#fde047",
                  fontWeight: 900,
                }}
              >
               {t("customer")}
              </TableCell>

              <TableCell
                sx={{
                  color: "#fde047",
                  fontWeight: 900,
                }}
              >
               {t("captain")}
              </TableCell>

             <TableCell
 sx={{
  color: "#fde047",
  fontWeight: 900,
 }}
>
{t("customerAddress")}
</TableCell>

<TableCell
 sx={{
  color: "#fde047",
  fontWeight: 900,
 }}
>
{t("branchName")}
</TableCell>

              <TableCell
                sx={{
                  color: "#fde047",
                  fontWeight: 900,
                }}
              >
               {t("tariff")}
              </TableCell>
             <TableCell
sx={{
color:"#fde047",
fontWeight:900,
}}
>
{t("AccountingDepartment")}
</TableCell>
<TableCell
sx={{
color:"#fde047",
fontWeight:900,
textAlign:"center",
width:70
}}
>

<Checkbox
checked={
orders.length > 0 &&
orders.every(order=>selectedOrders.has(order.id))
}
indeterminate={
orders.some(order=>selectedOrders.has(order.id)) &&
!orders.every(order=>selectedOrders.has(order.id))
}

onChange={toggleAllOrders}

sx={{
color:"#facc15",
"&.Mui-checked":{
color:"#facc15"
}
}}
/>

</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

                    {orders.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                align="center"
                sx={{
                  py: 8,
                  color: "#9ca3af",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
               {t("noOrdersDuringPeriod")}
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
  fontWeight:700,
  color:"#60a5fa",
 }}
>
 {order.customerAddress || "-"}
</TableCell>


<TableCell
 sx={{
  fontWeight:700,
  color:"#34d399",
 }}
>
{order.branchName || "-"}
</TableCell>

                <TableCell
                  sx={{
                    fontWeight: 800,
                    color: "#facc15",
                  }}
                >
                  {Number(order.tariff || 0).toFixed(2)} JD
                </TableCell>
  <TableCell
sx={{
fontWeight:800,
color:"#c084fc",
}}
>
{Number(order.AccountingDepartment || 0).toFixed(2)} JD
</TableCell>


<TableCell
sx={{
textAlign:"center"
}}
>

<Checkbox
checked={
selectedOrders.has(order.id)
}

onChange={()=>{
toggleOrder(order)
}}

sx={{
color:"#facc15",
"&.Mui-checked":{
color:"#facc15"
}
}}
/>

</TableCell>
    
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
   <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 3,
    p: 3,
    mt: 2,
  }}
>

<Button
  variant="contained"
  disabled={page === 1}
  onClick={() => setPage(page - 1)}
  sx={{
    minWidth: 120,
    height: 45,
    borderRadius: "14px",
    fontWeight: 800,
    color: page === 1 ? "#6b7280" : "#000",

    background:
      page === 1
        ? "rgba(255,255,255,.08)"
        : "linear-gradient(135deg,#fde047,#facc15,#f59e0b)",

    boxShadow:
      page === 1
        ? "none"
        : "0 10px 30px rgba(250,204,21,.25)",

    transition: ".3s",

    "&:hover": {
      transform: page === 1 ? "none" : "translateY(-3px)",
      boxShadow:
        page === 1
          ? "none"
          : "0 15px 40px rgba(250,204,21,.35)",
    },
  }}
>
 {t("previous")} 
</Button>


<Box
  sx={{
    minWidth: 45,
    height: 45,
    borderRadius: "14px",
    display: "flex",
    justifyContent:"center",
    alignItems:"center",

    background:
      "rgba(255,255,255,.06)",

    border:
      "1px solid rgba(250,204,21,.2)",

    color:"#fde047",

    fontWeight:900,
    fontSize:18,

    boxShadow:
      "0 10px 30px rgba(0,0,0,.3)",
  }}
>
 {page}
</Box>


<Button
  variant="contained"
  disabled={page >= totalPages}
 onClick={() => setPage(page + 1)}
  sx={{
    minWidth: 120,
    height:45,
    borderRadius:"14px",

    fontWeight:800,
    color:"#000",

    background:
      "linear-gradient(135deg,#fde047,#facc15,#f59e0b)",

    boxShadow:
      "0 10px 30px rgba(250,204,21,.25)",

    transition:".3s",

    "&:hover":{
      transform:"translateY(-3px)",
      boxShadow:
       "0 15px 40px rgba(250,204,21,.4)",
    }
  }}
>
{t("next")}
</Button>


</Box>
  </Paper>
<Dialog
open={printDialog}
onClose={()=>setPrintDialog(false)}
fullWidth
maxWidth="sm"

sx={{
 "& .MuiBackdrop-root":{
   backgroundColor:"rgba(0,0,0,.85)"
 },

 "& .MuiDialog-paper":{
   background:"#050505 !important"
 }
}}

PaperProps={{
 sx:{
  background:"#050505 !important",
  borderRadius:"28px",
  border:"1px solid rgba(250,204,21,.25)",
  boxShadow:"0 30px 80px rgba(0,0,0,.9) !important",
  overflow:"hidden",

  "&::before":{
    display:"none"
  }
 }
}}
>


<DialogTitle
sx={{
  background:"#050505 !important",
  color:"#fde047",
  fontWeight:900,
  fontSize:24,
  textAlign:"center"
}}
>
🖨️ {t("printSettings")}
</DialogTitle>



<DialogContent
sx={{
  mt:2,

  background:"#050505",

  color:"#fff",

  px:4,

  py:3
}}
>


<Typography
sx={{
  color:"#facc15",

  fontWeight:900,

  mb:3,

  fontSize:18
}}
>
{t("selectColumns")}
</Typography>



<Box
sx={{
display:"grid",

gridTemplateColumns:{
  xs:"1fr",
  sm:"1fr 1fr"
},

gap:2
}}
>


{
columns.map(col=>(

<Box
key={col.key}
sx={{
display:"flex",

alignItems:"center",

p:1.5,

borderRadius:"18px",

background:
"rgba(255,255,255,.04)",

border:
"1px solid rgba(250,204,21,.15)",

transition:".3s",

"&:hover":{
background:
"rgba(250,204,21,.10)",

transform:
"translateY(-3px)",

boxShadow:
"0 10px 25px rgba(250,204,21,.15)"
}

}}
>


<Checkbox

checked={selectedColumns.includes(col.key)}

onChange={()=>toggleColumn(col.key)}

sx={{

color:"#facc15",

"&.Mui-checked":{
color:"#facc15"
}

}}

/>


<Typography
sx={{
fontWeight:800,

color:"#fff",

fontSize:15
}}
>
{col.label}
</Typography>


</Box>

))
}


</Box>


</DialogContent>





<DialogActions
sx={{

p:3,

gap:2,

background:"#050505",

borderTop:
"1px solid rgba(250,204,21,.15)",

justifyContent:"center"

}}
>



<Button
onClick={()=>setPrintDialog(false)}

sx={{

height:45,

px:4,

borderRadius:"14px",

fontWeight:900,

color:"#fde047",

background:
"rgba(255,255,255,.06)",

border:
"1px solid rgba(250,204,21,.35)",

transition:".3s",

"&:hover":{

background:
"rgba(250,204,21,.15)",

transform:
"translateY(-3px)"

}

}}

>
✖ إلغاء
</Button>





<Button

variant="contained"

disabled={!printAll && selectedOrders.size === 0}

onClick={()=>{

handlePrint(printAll);

setPrintDialog(false);

}}

sx={{

height:45,

px:5,

borderRadius:"14px",

fontWeight:900,

color:"#0f0101",

background:
"linear-gradient(135deg,#fde047,#facc15,#f59e0b)",

boxShadow:
"0 10px 30px rgba(250,204,21,.35)",

transition:".3s",

"&:hover":{

background:
"linear-gradient(135deg,#fef08a,#fde047,#facc15)",

transform:
"translateY(-3px)",

boxShadow:
"0 15px 40px rgba(250,204,21,.5)"

}

}}

>
🖨️ طباعة
</Button>



</DialogActions>


</Dialog>
</Box>
);
}



export default RestaurantDetails;