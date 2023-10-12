import { Link as RouterLink } from "react-router-dom";
import { Typography, Link } from "@mui/material";

import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "fit-content",
        margin: "0 auto",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mt: 1.5 }}>
        Login
      </Typography>
      <LoginForm />
      <hr style={{ width: "100%" }} />
      <Link
        component={RouterLink}
        to="/signup"
        style={{ margin: "8px 0" }}
        variant="body1"
      >
        Sign up
      </Link>
      <Link component={RouterLink} to="/forgot" variant="body1">
        Forgot your password?
      </Link>
    </div>
  );
};

export default LoginPage;
