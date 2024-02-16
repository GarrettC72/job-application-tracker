import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";

import { VERIFY_PASSWORD_RESET } from "../../graphql/queries";
import ResetPasswordForm from "./ResetPasswordForm";
import Loading from "../Loading";

const ResetPasswordPage = () => {
  const [status, setStatus] = useState("LOADING");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const passwordResetResult = useQuery(VERIFY_PASSWORD_RESET, {
    skip: !token,
    variables: { token },
    onError: (error) => {
      const verifyError = error.graphQLErrors[0];
      if (
        verifyError.extensions.code &&
        typeof verifyError.extensions.code === "string"
      ) {
        setStatus(verifyError.extensions.code);
      }
    },
    onCompleted: () => {
      setStatus("VERIFIED");
    },
  });

  if (!token) {
    return (
      <div style={{ textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Invalid Reset Password Link
        </Typography>
        <Typography variant="body1">
          This password reset link is invalid.
          <br />
          Make sure the link is correct or request a new link{" "}
          <Link to="/forgot">here</Link>.
        </Typography>
      </div>
    );
  }

  if (passwordResetResult.loading) {
    return <Loading />;
  }

  return (
    <div style={{ textAlign: "center" }}>
      {(status === "VERIFIED" || status === "BAD_USER_INPUT") && (
        <>
          <Typography variant="h4" gutterBottom sx={{ mt: 1.5 }}>
            Create A New Password
          </Typography>
          <ResetPasswordForm token={token} setStatus={setStatus} />
        </>
      )}
      {status === "UPDATED_PASSWORD" && (
        <>
          <Typography variant="h4" gutterBottom>
            Password Successfully Changed
          </Typography>
          <Typography variant="body1">
            Your password has been updated.
            <br />
            Click <Link to="/">here</Link> to login.
          </Typography>
        </>
      )}
      {(status === "INVALID_TOKEN" || status === "USER_NOT_FOUND") && (
        <>
          <Typography variant="h4" gutterBottom>
            Invalid Reset Password Link
          </Typography>
          <Typography variant="body1">
            This password reset link is invalid.
            <br />
            Make sure the link is correct or request a new link{" "}
            <Link to="/forgot">here</Link>.
          </Typography>
        </>
      )}
      {status === "EXPIRED_TOKEN" && (
        <>
          <Typography variant="h4" gutterBottom>
            Expired Password Reset Link
          </Typography>
          <Typography variant="body1">
            This password reset link is expired.
            <br />
            Please click <Link to="/forgot">here</Link> to request a new
            password reset link.
          </Typography>
        </>
      )}
      {status === "UNVERIFIED_EMAIL" && (
        <>
          <Typography variant="h4" gutterBottom>
            Email Not Verified
          </Typography>
          <Typography variant="body1">
            Unverified accounts can not set a new password.
            <br />
            Please verify your account using the link sent to your email.
          </Typography>
        </>
      )}
      {status === "EARLY_PASSWORD_RESET" && (
        <>
          <Typography variant="h4" gutterBottom>
            Password Changed Recently
          </Typography>
          <Typography variant="body1">
            Your password has been changed recently.
            <br />
            You can not create a new password for 24 hours after your latest
            password was set.
          </Typography>
        </>
      )}
    </div>
  );
};

export default ResetPasswordPage;
