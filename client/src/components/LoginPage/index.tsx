import { Typography, Link, Stack } from "@mui/material";
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
      <Stack>
        <Link
          component={RouterLink}
          to="/signup"
          sx={{ my: 1, mx: "auto" }}
          variant="body1"
        >
          Sign up
        </Link>
        <Link
          component={RouterLink}
          sx={{ mb: 1, mx: "auto" }}
          to="/forgot"
          variant="body1"
        >
          Forgot your password?
        </Link>
      </Stack>
    </div>
  );
};

export default LoginPage;
