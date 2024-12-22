import { Typography, Link, Grid2 } from "@mui/material";
import { Link as RouterLink } from "react-router";

import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mt: 1.5 }}>
        Login
      </Typography>
      <LoginForm />
      <Grid2 container direction="column">
        <Link
          component={RouterLink}
          to="/signup"
          sx={{ my: 1 }}
          variant="body1"
        >
          Sign up
        </Link>
        <Link component={RouterLink} to="/forgot" variant="body1">
          Forgot your password?
        </Link>
      </Grid2>
    </div>
  );
};

export default LoginPage;
