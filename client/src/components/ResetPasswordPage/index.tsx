import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";

import { VERIFY_PASSWORD_RESET } from "../../graphql/queries";
import ResetPasswordForm from "./ResetPasswordForm";
import Loading from "../Loading";
import ServerResponse from "../ServerResponse";

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

  if (!token || status === "INVALID_TOKEN" || status === "USER_NOT_FOUND") {
    return (
      <ServerResponse
        title="Invalid Reset Password Link"
        message="This password reset link is invalid."
        callToAction={
          <>
            Please make sure the URL is correct or click{" "}
            <Link to="/forgot">here</Link> to request a new link.
          </>
        }
      />
    );
  }

  if (passwordResetResult.loading) {
    return <Loading />;
  }

  return status === "VERIFIED" || status === "BAD_USER_INPUT" ? (
    <div style={{ textAlign: "center" }}>
      <Typography variant="h4" gutterBottom sx={{ mt: 1.5 }}>
        Create A New Password
      </Typography>
      <ResetPasswordForm token={token} setStatus={setStatus} />
    </div>
  ) : status === "UPDATED_PASSWORD" ? (
    <ServerResponse
      title="Password Successfully Changed"
      message="Your new password is now saved."
      callToAction={
        <>
          Please click <Link to="/">here</Link> to login.
        </>
      }
    />
  ) : status === "EXPIRED_TOKEN" ? (
    <ServerResponse
      title="Expired Password Reset Link"
      message="This password reset link is expired."
      callToAction={
        <>
          Please click <Link to="/forgot">here</Link> to request a new password
          reset link.
        </>
      }
    />
  ) : status === "UNVERIFIED_EMAIL" ? (
    <ServerResponse
      title="Email Not Verified"
      message="Unverified accounts can not set a new password."
      callToAction="Please verify your account using the link sent to your email."
    />
  ) : status === "EARLY_PASSWORD_RESET" ? (
    <ServerResponse
      title="Password Changed Recently"
      message="Your password has been changed recently."
      callToAction="Please wait for at least 24 hours after your latest password was set
      before creating a new password."
    />
  ) : (
    <ServerResponse
      title="Server Issues"
      message="There is currently an issue with the server."
      callToAction="Please try again later."
    />
  );
};

export default ResetPasswordPage;
