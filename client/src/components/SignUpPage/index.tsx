import { Link as RouterLink } from "react-router-dom";
import { Typography, Link } from "@mui/material";

import SignUpForm from "./SignUpForm";

const SignUpPage = () => {
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
        Sign up for an account
      </Typography>
      <SignUpForm />
      <hr style={{ width: "100%" }} />
      <Link component={RouterLink} to="/" variant="body1">
        Log in
      </Link>
    </div>
  );
};

export default SignUpPage;
