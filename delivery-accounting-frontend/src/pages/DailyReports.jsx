import {useEffect,useState} from "react";
import API from "../api/axios";
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
CircularProgress,
TextField,
InputAdornment,
Pagination
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from "react-i18next";
import StatCard from "../components/StatCard";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import SavingsIcon from "@mui/icons-material/Savings";
const DailyReports=()=>{
const { t, i18n } = useTranslation();
const [reports,setReports]=useState([]);
const [loading,setLoading]=useState(true);
const [search,setSearch]=useState("");
const [summary,setSummary]=useState(null);
const [page,setPage]=useState(1);
const [searchInput,setSearchInput]=useState("");
const fetchReports=async()=>{

try{

const reports =
await API.get("/daily-reports");

setReports(reports.data||[]);


const summary =
await API.get("/daily-reports/summary");

setSummary(summary.data);


}catch(error){

console.log(error);

}
finally{

setLoading(false);

}

};

useEffect(()=>{
fetchReports();
},[]);
useEffect(()=>{

 const timer=setTimeout(()=>{

   setSearch(searchInput);
   setPage(1);

 },300);


 return ()=>clearTimeout(timer);

},[searchInput]);

const filteredReports = reports.filter((report) => {
  if (!report.importDate) return false;

  const date = new Date(report.importDate);

  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  return formattedDate.includes(search.trim());
});
const formatDate = (value) => {
  const date = new Date(value);
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
};

const limit = 50;

const dailyReports = filteredReports.slice(
(page - 1) * limit,
page * limit
);

const pages = Math.ceil(filteredReports.length / limit);


if(loading){
return(
<Box height="60vh" display="flex" justifyContent="center" alignItems="center">
<CircularProgress sx={{color:"#facc15"}}/>
</Box>
);
}


return(
<Box sx={{
p:3,
minHeight:"100vh",
background:"radial-gradient(circle at top left,#0a0a0a,#000)",
direction:"ltr",
color:"#fff"
}}>

<Typography variant="h4" sx={{
mb:3,
fontWeight:900,
color:"#fff",
display:"flex",
gap:1,
alignItems:"center"
}}>
<AssessmentIcon sx={{color:"#facc15"}}/>
{t("dailyReports")}
</Typography>
<Box
sx={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
gap:3,
mb:4
}}
>


<StatCard
title={t("orders")}
value={summary?.totalOrders || 0}
icon={<ShoppingCartIcon/>}
/>


<StatCard
title={t("drivers")}
value={summary?.totalDrivers || 0}
icon={<PeopleIcon/>}
/>


<StatCard
title={t("restaurants")}
value={summary?.totalRestaurants || 0}
icon={<RestaurantIcon/>}
/>


<StatCard
title={t("tariff")}
value={`${Number(summary?.totalTariff||0).toFixed(2)} JD`}
icon={<LocalAtmIcon/>}
/>


<StatCard
title={t("AccountingDepartment")}
value={`${Number(summary?.totalAccounting||0).toFixed(2)} JD`}
icon={<SavingsIcon/>}
/>


</Box>

<Paper sx={{
mb:3,
p:3,
borderRadius:"24px",
background:"rgba(255,255,255,.03)",
border:"1px solid rgba(250,204,21,.15)",
backdropFilter:"blur(20px)"
}}>
<TextField
fullWidth
placeholder={t("searchByDate")}
value={searchInput}
onChange={(e)=>{
 setSearchInput(e.target.value);
 setPage(1);
}}
InputProps={{
startAdornment:(
<InputAdornment position="start">
<SearchIcon sx={{color:"#facc15"}}/>
</InputAdornment>
)
}}
sx={{
"& input":{
color:"#fff"
},
"& .MuiOutlinedInput-root":{
borderRadius:"16px",
background:"rgba(255,255,255,.03)",
"& fieldset":{
borderColor:"rgba(250,204,21,.3)"
},
"&:hover fieldset":{
borderColor:"#facc15"
},
"&.Mui-focused fieldset":{
borderColor:"#facc15"
}
}
}}
/>
</Paper>

<Paper sx={{
p:3,
borderRadius:"24px",
background:"rgba(255,255,255,.03)",
border:"1px solid rgba(250,204,21,.15)",
overflowX:"auto"
}}>

<Table>

<TableHead>
<TableRow sx={{
background:"linear-gradient(90deg,#111,#000)"
}}>
{[
"date",
"orders",
"restaurants",
"drivers",
"tariff",
"AccountingDepartment"
].map((x)=>(
<TableCell key={x} sx={{
color:"#fff",
fontWeight:900,
whiteSpace:"nowrap"
}}>
{t(x)}
</TableCell>
))}
</TableRow>
</TableHead>


<TableBody>{dailyReports.map((report)=>(
<TableRow
key={report.id}
sx={{
"& td":{
color:"#fff",
borderBottom:"1px solid rgba(255,255,255,.08)",
fontWeight:700
},
"&:hover":{
background:"rgba(250,204,21,.05)"
}
}}
>
<TableCell
  sx={{
    fontWeight: 900,
    color: "#facc15 !important",
    whiteSpace: "nowrap",
  }}
>
  {formatDate(report.importDate)}
</TableCell>

<TableCell>
{report.totalOrders || 0}
</TableCell>

<TableCell>
{report.restaurants?.length || 0}
</TableCell>

<TableCell>
{report.drivers?.length || 0}
</TableCell>

<TableCell sx={{

fontWeight:900
}}>
{Number(report.totalTariff || 0).toFixed(2)} JD
</TableCell>

<TableCell sx={{

fontWeight:900
}}>
{Number(report.totalAccounting || 0).toFixed(2)} JD
</TableCell>

</TableRow>
))}

</TableBody>

</Table>

</Paper>
<Box
dir={isArabic ? "rtl" : "ltr"}
sx={{
mt:3,
display:"flex",
justifyContent:"center",

"& .MuiPaginationItem-root":{
color:"#fff"
},

"& .Mui-selected":{
background:"#facc15 !important",
color:"#000",
fontWeight:900
}
}}
>
<Pagination
page={page}
count={pages || 1}
onChange={(e,value)=>setPage(value)}
/>
</Box>
</Box>
);

};

export default DailyReports;