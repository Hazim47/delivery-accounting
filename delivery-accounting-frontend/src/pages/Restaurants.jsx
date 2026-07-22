import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/axios";
import { useTranslation } from "react-i18next";
import { Pagination, PaginationItem } from "@mui/material";
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
  CircularProgress,
} from "@mui/material";


import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";

function Restaurants() {

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [restaurants, setRestaurants] = useState([]);
const [totalPages,setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
const [searchParams] = useSearchParams();

const initialPage = Number(searchParams.get("page")) || 1;
const initialSearch = searchParams.get("search") || "";

const [page,setPage] = useState(initialPage);
const [search,setSearch] = useState(initialSearch);
const [searchInput,setSearchInput] = useState(initialSearch);
  /* ============================
      LOAD RESTAURANTS
  ============================ */

const fetchRestaurants = async () => {

 try {

 setLoading(true);

 const res = await API.get(
 `/restaurants?page=${page}&search=${search}`
 );

 setRestaurants(res.data.restaurants || []);
 setTotalPages(res.data.pages || 1);
console.log(res.data.restaurants);

 } catch(err){

 console.log(err);

 } finally {

 setLoading(false);

 }

};

useEffect(()=>{
 fetchRestaurants();
},[page, search]);


useEffect(()=>{

 const timer=setTimeout(()=>{

   if(search !== searchInput){
     setSearch(searchInput);
     setPage(1);
   }

 },500);

 return ()=>clearTimeout(timer);

},[searchInput, search]);
const filteredRestaurants = restaurants;
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
      {loading && (
  <Box
    sx={{
      textAlign:"center",
      p:3
    }}
  >
    <CircularProgress color="warning" />
  </Box>
)}
      <TextField
        fullWidth
        label={t("namerestaurants")}
 value={searchInput}

onChange={(e)=>{
 setSearchInput(e.target.value);
}}

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
          t("lastOrder"),
          t("status"),
          t("actions"),
        ].map((item) => (
          <TableCell
            key={item}
            align="center"
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
          <TableCell align="center">

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
                margin: "auto",
                boxShadow:
                  "0 8px 18px rgba(250,204,21,.25)",
              }}
            >
              {(page - 1) * 50 + index + 1}
            </Box>

          </TableCell>



          {/* NAME */}
          <TableCell
            align="center"
            sx={{
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {r.name}
          </TableCell>



          {/* LAST ORDER */}
          <TableCell
  align="center"
  sx={{
    color: "#d1d5db",
    fontWeight: 600,
    fontSize: 16,
  }}
>
{r.lastOrderDate
  ? new Date(
      String(r.lastOrderDate).substring(0,10) + "T12:00:00"
    ).toLocaleDateString(
      i18n.language === "ar"
        ? "ar-EG"
        : "en-US",
      {
        year:"numeric",
        month:"long",
        day:"numeric",
      }
    )
  : "-"
}
</TableCell>



          {/* STATUS */}
          <TableCell align="center">

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



          {/* ACTIONS */}
          <TableCell
            align="center"
            sx={{
              verticalAlign: "middle",
              textAlign: "center",
            }}
          >

            <Button
              startIcon={<VisibilityIcon />}
onClick={() =>
  navigate(
    `/restaurants/${r.id}?page=${page}&search=${search}`
  )
}
              sx={{
                px: 3,
                py: 1,
                borderRadius: "14px",
                textTransform: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
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
              {t("RestaurantDetails")}
            </Button>

          </TableCell>


        </TableRow>

      ))}

    </TableBody>

  </Table>
</TableContainer>
<Box
 sx={{
   mt:4,
   display:"flex",
   justifyContent:"center"
 }}
>
<Box
 sx={{
   mt:4,
   display:"flex",
   justifyContent:"center"
 }}
>
<Pagination
  count={totalPages}
  page={page}
  siblingCount={0}
  boundaryCount={0}
  renderItem={(item) => {
    if (
      item.type === "page" &&
      item.page !== page
    ) {
      return null;
    }

    return <PaginationItem {...item} />;
  }}
  onChange={(e,value)=>{

    setPage(value);

    const params = new URLSearchParams();

    if(search){
      params.set("search", search);
    }

    params.set("page", value);

    window.history.replaceState(
      null,
      "",
      `/restaurants?${params.toString()}`
    );

  }}
  color="primary"
  size="large"
  sx={{
    "& .PaginationItem-root":{
      color:"#fff",
    },

    "& .MuiPaginationItem-root":{
      color:"#fff",
    },

    "& .Mui-selected":{
      background:"#facc15 !important",
      color:"#000"
    }
  }}
/>
</Box>
</Box>
  </Box>
);
}

export default Restaurants;