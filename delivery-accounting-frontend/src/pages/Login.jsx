import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import offerat from "../assets/offerat.png";
import { useTranslation } from "react-i18next";
import { InputAdornment, IconButton } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

function Login() {
  const navigate = useNavigate();
const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
  username,
  password,
});

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (remember) {
        localStorage.setItem("remember", "true");
      }

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <Box
    sx={{
      height: "100vh",
      display: "flex",
      overflow: "hidden",
      background:
        "radial-gradient(circle at top left, #1a1a1a 0%, #0b0b0b 45%, #000 100%)",
    }}
  >
    {/* LEFT PANEL */}
    <Box
      sx={{
        flex: 1,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        p: 5,
        position: "relative",
      }}
    >
      <Box
        component="img"
        src={offerat}
        alt="Logo"
        sx={{
          width: 150,
          height: 150,
          borderRadius: "28px",
          objectFit: "cover",
          mb: 3,
          animation: "float 5s ease-in-out infinite",
          boxShadow: "0 25px 70px rgba(255, 193, 7, 0.25)",
        }}
      />

      <Typography
        variant="h3"
        sx={{
          fontWeight: 900,
          textAlign: "center",
          background: "linear-gradient(90deg,#facc15,#f59e0b,#fde047)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        
        {t("offeratdashboard")}
      </Typography>

      <Typography
        sx={{
          mt: 2,
          color: "#a1a1aa",
          textAlign: "center",
          maxWidth: 300,
        }}
      >
        {t("manageordersdriversreportsinonecleansystem")}
      </Typography>

      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-12px); }
            100% { transform: translateY(0px); }
          }
        `}
      </style>
    </Box>

    {/* RIGHT PANEL */}
    <Box
      sx={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <Paper
        sx={{
          width: 420,
          p: 4,
          borderRadius: "24px",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(22px)",
          border: "1px solid rgba(255, 193, 7, 0.15)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          color: "#fff",
          animation: "fadeIn 0.6s ease",
        }}
      >
        <style>
          {`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(15px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}
        </style>

        {/* TITLE */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            textAlign: "center",
            mb: 1,
            background: "linear-gradient(90deg,#facc15,#f59e0b,#fde047)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
         {t("welcomeBack")}
        </Typography>

        <Typography
          sx={{
            textAlign: "center",
            color: "#a1a1aa",
            mb: 3,
            fontSize: 14,
          }}
        >
          {t("signIn")}
        </Typography>

        {/* ERROR */}
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              background: "rgba(239,68,68,0.1)",
              color: "#fca5a5",
              border: "1px solid rgba(239,68,68,0.2)",
            }}
          >
            {error}
          </Alert>
        )}

        {/* FORM */}
        <form onSubmit={handleLogin}>
<TextField
  fullWidth
  label={t("username")}
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  sx={{
    mb: 2,

    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      color: "#fff",
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(14px)",
      transition: "all 0.25s ease",

      "& fieldset": {
        borderColor: "rgba(250, 204, 21, 0.15)",
        transition: "0.3s",
      },

      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 12px 30px rgba(250,204,21,0.10)",
        background: "rgba(255,255,255,0.07)",
      },

      "&:hover fieldset": {
        borderColor: "#facc15",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#facc15",
        boxShadow: "0 0 0 2px rgba(250,204,21,0.25)",
      },
    },

    "& .MuiInputLabel-root": {
      color: "#a1a1aa",
      letterSpacing: "0.3px",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#facc15",
    },
  }}
/>
<TextField
  fullWidth
  type={showPassword ? "text" : "password"}
  label={t("password")}
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  autoComplete="current-password"
  InputLabelProps={{ shrink: true }}
  slotProps={{
    input: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowPassword((p) => !p)}
            sx={{
              color: "#facc15",
              borderRadius: "10px",
              transition: "0.25s",

              "&:hover": {
                background: "rgba(250,204,21,0.15)",
                transform: "scale(1.1) rotate(3deg)",
              },
            }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    },
  }}
  sx={{
    mb: 2,

    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      color: "#fff",
      background: "rgba(255,255,255,0.05)",
      backdropFilter: "blur(14px)",
      transition: "all 0.25s ease",

      "& fieldset": {
        borderColor: "rgba(250, 204, 21, 0.15)",
      },

      "&:hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 14px 35px rgba(250,204,21,0.12)",
        background: "rgba(255,255,255,0.07)",
      },

      "&:hover fieldset": {
        borderColor: "#facc15",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#facc15",
        boxShadow: "0 0 0 3px rgba(250,204,21,0.2)",
      },
    },

    "& .MuiInputLabel-root": {
      color: "#a1a1aa",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#facc15",
    },
  }}
/>
          {/* OPTIONS */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            


          </Box>

          {/* BUTTON */}
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.6,
              borderRadius: "14px",
              fontWeight: 900,
              textTransform: "none",
              color: "#000",
              background: "linear-gradient(135deg,#facc15,#f59e0b)",
              boxShadow: "0 15px 40px rgba(250,204,21,0.25)",
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0 18px 50px rgba(250,204,21,0.35)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "#000" }} />
            ) : (
               t("login")
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  </Box>
);
}

export default Login;