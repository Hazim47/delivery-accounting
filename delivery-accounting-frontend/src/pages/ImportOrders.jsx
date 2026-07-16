import { useEffect, useState } from "react";
import API from "../api/axios";

import { useTranslation } from "react-i18next";
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";

function ImportOrders() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { t } = useTranslation();


  

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await API.post("/import/orders", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult({
  ...res.data,
  fileName: file.name,
});

setFile(null);
    } catch (err) {
      console.log(err);
      alert(t("importFailed"));
    } finally {
      setLoading(false);
    }
  };


const user = JSON.parse(localStorage.getItem("user"));
const isAdmin = user?.role === "ADMIN";
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
        mb: 1,
        background:
          "linear-gradient(90deg,#facc15,#f59e0b,#fde047)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {t("excelImportCenter")}
    </Typography>

    <Typography sx={{ color: "#a1a1aa", mb: 4 }}>
     {t("uploadExcelDescription")}
    </Typography>

    {/* UPLOAD CARD */}
    <Paper
      sx={{
        p: 4,
        mb: 4,
        borderRadius: "24px",
        background: "rgba(255,255,255,0.03)",
        backdropFilter: "blur(22px)",
        border: "1px solid rgba(250,204,21,0.12)",
        boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
      }}
    >
      {/* DROP AREA */}
      <Box
        sx={{
          border: "2px dashed rgba(250,204,21,0.4)",
          borderRadius: "24px",
          p: 6,
          textAlign: "center",
          background: "rgba(255,255,255,0.02)",
          transition: ".3s",

          "&:hover": {
            background: "rgba(250,204,21,0.05)",
            borderColor: "#facc15",
          },
        }}
      >
        <CloudUploadIcon
          sx={{
            fontSize: 80,
            color: "#facc15",
          }}
        />

        <Typography sx={{ color: "#a1a1aa", mb: 3 }}
        variant="h5" fontWeight={900}  mt={2}>
          {t("uploadExcelFile")}
        </Typography>

        <Typography sx={{ color: "#a1a1aa", mb: 3 }}>
          {t("supportedFormats")}
        </Typography>

        <Button
          variant="contained"
          component="label"
          sx={{
            borderRadius: "14px",
            px: 4,
            py: 1.3,
            fontWeight: 900,
            textTransform: "none",
            color: "#000",
            background:
              "linear-gradient(135deg,#facc15,#f59e0b)",
            boxShadow: "0 15px 35px rgba(250,204,21,0.25)",

            "&:hover": {
              transform: "scale(1.03)",
            },
          }}
        >
          {t("chooseFile")}

          <input
            hidden
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </Button>
      </Box>

      {/* FILE INFO */}
      {file && (
        <Paper
          sx={{
            mt: 3,
            p: 2,
            borderRadius: "18px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(250,204,21,0.12)",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <DescriptionIcon sx={{ color: "#facc15", fontSize: 40 }} />

          <Box>
            <Typography fontWeight={800}>
              {file.name}
            </Typography>

            <Typography variant="body2" sx={{ color: "#a1a1aa" }}>
              {(file.size / 1024).toFixed(2)} KB
            </Typography>
          </Box>
        </Paper>
      )}

      {/* IMPORT BUTTON */}
      <Box mt={3}>
        <Button
          fullWidth
          size="large"
          
          disabled={!file || loading}
          onClick={handleUpload}
          sx={{
            py: 1.8,
            borderRadius: "14px",
            fontWeight: 900,
            fontSize: "15px",
            textTransform: "none",
            color: "#000",
            background:
              "linear-gradient(135deg,#facc15,#f59e0b)",
            boxShadow: "0 15px 40px rgba(250,204,21,0.25)",

            "&:hover": {
              background:
                "linear-gradient(135deg,#fde047,#facc15)",
              transform: "scale(1.02)",
            },
              "&.Mui-disabled": {
    color: "#000 !important",
    opacity: 0.6, // أو 1 إذا بدك شكله ما يخف
  },
          }}
        >
          {loading ? (
            <CircularProgress size={24} sx={{ color: "#000" }} />
          ) : (
           t("importOrders")
          )}
        </Button>
      </Box>

     {result && (
<Alert
severity="success"
sx={{
 mt:3,
 borderRadius:"16px",
 background:"rgba(34,197,94,0.1)",
 color:"#22c55e",
 fontWeight:700
}}
>

تم استيراد الملف بنجاح ✅

<br/>

الملف:
{result.fileName}

<br/>

{t("imported")}: {result.imported}

<br/>

{t("skipped")}: {result.skipped}

<br/>

{t("restaurants")}: {result.restaurantsCreated}

<br/>

{t("drivers")}: {result.driversCreated}

</Alert>
)}
    </Paper>

  
  </Box>
);
}

export default ImportOrders;