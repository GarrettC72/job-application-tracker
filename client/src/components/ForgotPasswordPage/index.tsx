import { Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router";

import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mt: 1.5 }}>
        Forgot your password?
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter your email to receive a link to reset your password.
      </Typography>
      <ForgotPasswordForm />
      <Link
        component={RouterLink}
        to="/"
        variant="body1"
        sx={{ display: "inline-block", mt: 1 }}
      >
        Return to login
      </Link>
    </div>
  );
};

export default ForgotPasswordPage;
