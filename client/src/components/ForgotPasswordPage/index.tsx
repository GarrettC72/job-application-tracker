import { Link as RouterLink } from "react-router-dom";
import { Typography, Link } from "@mui/material";

import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPasswordPage = () => {
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
        Forgot your password?
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter your email to receive a link to reset your password.
      </Typography>
      <ForgotPasswordForm />
      <hr style={{ width: "100%" }} />
      <Link component={RouterLink} to="/" variant="body1">
        Return to login
      </Link>
    </div>
  );
};

export default ForgotPasswordPage;
