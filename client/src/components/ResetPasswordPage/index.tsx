import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { Link, useSearchParams } from "react-router";
import { useState } from "react";

import { VERIFY_PASSWORD_RESET } from "../../graphql/queries";
import ResetPasswordForm from "./ResetPasswordForm";
import Loading from "../Loading";
import ServerResponse from "../ServerResponse";

interface ResetResponseProps {
  title: string;
  message: string;
  callToAction: React.ReactNode;
}

const getResetResponseProps = (status: string): ResetResponseProps | null => {
  switch (status) {
    case "UPDATED_PASSWORD":
      return {
        title: "Password Successfully Changed",
        message: "Your new password is now saved.",
        callToAction: (
          <>
            Please click <Link to="/">here</Link> to login.
          </>
        ),
      };
    case "EXPIRED_TOKEN":
      return {
        title: "Expired Password Reset Link",
        message: "This password reset link is expired.",
        callToAction: (
          <>
            Please click <Link to="/forgot">here</Link> to request a new
            password reset link.
          </>
        ),
      };
    case "UNVERIFIED_EMAIL":
      return {
        title: "Email Not Verified",
        message: "Unverified accounts can not set a new password.",
        callToAction:
          "Please verify your account using the link sent to your email.",
      };
    case "EARLY_PASSWORD_RESET":
      return {
        title: "Password Changed Recently",
        message: "Your password has been changed recently.",
        callToAction:
          "Please wait for at least 24 hours after your latest password was set before creating a new password.",
      };
    case "INVALID_TOKEN":
    case "USER_NOT_FOUND":
      return {
        title: "Invalid Password Reset Link",
        message: "This password reset link is invalid.",
        callToAction: (
          <>
            Please make sure the URL is correct or click{" "}
            <Link to="/forgot">here</Link> to request a new link.
          </>
        ),
      };
    default:
      return null;
  }
};

const ResetPasswordPage = () => {
  const [status, setStatus] = useState("LOADING");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { data, loading } = useQuery(VERIFY_PASSWORD_RESET, {
    skip: !token,
    variables: { token },
    onError: (error) => {
      const verifyError = error.graphQLErrors[0];
      if (
        verifyError.extensions &&
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
      <ServerResponse
        title="Invalid Password Reset Link"
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

  if (loading) {
    return <Loading />;
  }

  const isVerified = data
    ? data.getPasswordReset !== null && data.getPasswordReset !== undefined
    : false;

  if (isVerified || status === "BAD_USER_INPUT") {
    return (
      <div style={{ textAlign: "center" }}>
        <Typography variant="h4" gutterBottom sx={{ mt: 1.5 }}>
          Create A New Password
        </Typography>
        <ResetPasswordForm token={token} setStatus={setStatus} />
      </div>
    );
  }

  const responseProps = getResetResponseProps(status);

  return responseProps === null ? (
    <ServerResponse />
  ) : (
    <ServerResponse {...responseProps} />
  );
};

export default ResetPasswordPage;
