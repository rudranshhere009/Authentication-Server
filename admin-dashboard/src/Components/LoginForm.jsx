import { useState } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
  InputAdornment,IconButton
} from "@mui/material";
import Logo from "../Assets/logo.png";
import '../index.css';
import {VisibilityOff , Visibility} from "@mui/icons-material";


function LoginForm({ handleLogin, error, isLoading }) {
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [showPassword , setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(adminUser, adminPass);
  };
  
  const handletoggle= ()=>{ 
  setShowPassword((prev) => !prev);
  }

  return (
    // This container centers the form on the page
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Paper
        elevation={6} // Gives it a nice lift
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: '400px',
        }}
      >
      <Box className = "loginContainer">
     
      <Box className = "loginImgContainer">
      
<img src={Logo} alt="myimage" className="logoimg"/>
</Box>

        <Typography variant="h4" gutterBottom align="center">
          Admin Portal Login
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center" mb={3}>
          Please enter your credentials to proceed.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Admin Username"
            variant="outlined"
            value={adminUser}
            onChange={(e) => setAdminUser(e.target.value)}
            required
            disabled={isLoading}
          />
          <TextField
            label="Admin Password"
            type={showPassword?"text":"password"}
            variant="outlined"
            value={adminPass}
            onChange={(e) => setAdminPass(e.target.value)}
            required
            disabled={isLoading}
            InputProps = {{
            endAdornment : (
            <InputAdornment position = "end">
            <IconButton
            onClick = {handletoggle}
            edge = "end"
            aria-label = "toggle password visibility"
            >   
            {showPassword ? <VisibilityOff/> : <Visibility/>}
             </IconButton>
             </InputAdornment>
             )
             }
             }
             />
             
             
             
      
          
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isLoading}
            sx={{ mt: 2, py: 1.5 }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
       
        </Box>
       
       
      </Paper>
    </Box>
  );
}

export default LoginForm;
