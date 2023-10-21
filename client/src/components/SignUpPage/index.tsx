import { Link as RouterLink } from "react-router-dom";
import { Typography, Link } from "@mui/material";

import SignUpForm from "./SignUpForm";

const SignUpPage = () => {
  return (
    <div
      style={{
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ mt: 1.5 }}>
        Sign up for an account
      </Typography>
      <SignUpForm />
      <Link
        component={RouterLink}
        to="/"
        variant="body1"
        sx={{ display: "inline-block", mt: 1 }}
      >
        Log in
      </Link>
    </div>
  );
};

export default SignUpPage;
