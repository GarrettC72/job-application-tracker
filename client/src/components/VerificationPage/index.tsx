import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button, Typography } from "@mui/material";

import { RESEND_VERIFICATION, VERIFY_USER } from "../../graphql/mutations";
import Loading from "../Loading";

const VerificationPage = () => {
  const [status, setStatus] = useState("LOADING");
  const [searchParams] = useSearchParams();
  const [verify] = useMutation(VERIFY_USER, {
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
  const [resend] = useMutation(RESEND_VERIFICATION, {
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
      setStatus("SENT_NEW_VERIFICATION");
    },
  });
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verify({ variables: { token } });
    }
  }, [token, verify]);

  const sendNewVerification = () => {
    if (token) {
      resend({ variables: { token } });
    }
  };

  if (!token) {
    return (
      <div style={{ textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Invalid Verification Link
        </Typography>
        <Typography variant="body1">
          This verification link is invalid.
          <br />
          Make sure the verification link is correct or create a new account{" "}
          <Link to="/signup">here</Link>.
        </Typography>
      </div>
    );
  }

  if (status === "LOADING") {
    return <Loading />;
  }

  return (
    <div style={{ textAlign: "center" }}>
      {status === "VERIFIED" && (
        <>
          <Typography variant="h4" gutterBottom>
            Email Successfully Verified
          </Typography>
          <Typography variant="body1">
            Your email is now verified.
            <br />
            Click <Link to="/">here</Link> to login.
          </Typography>
        </>
      )}
      {status === "SENT_NEW_VERIFICATION" && (
        <>
          <Typography variant="h4" gutterBottom>
            Expired Verification Link
          </Typography>
          <Typography variant="body1">
            A new verification link has been sent.
            <br />
            Please check your email.
          </Typography>
        </>
      )}
      {status === "ALREADY_VERIFIED" && (
        <>
          <Typography variant="h4" gutterBottom>
            Email Already Verified
          </Typography>
          <Typography variant="body1">
            Your email has already been verified.
            <br />
            Click <Link to="/">here</Link> to login.
          </Typography>
        </>
      )}
      {(status === "INVALID_TOKEN" || status === "USER_NOT_FOUND") && (
        <>
          <Typography variant="h4" gutterBottom>
            Invalid Verification Link
          </Typography>
          <Typography variant="body1">
            This verification link is invalid.
            <br />
            Make sure the verification link is correct or create a new account{" "}
            <Link to="/signup">here</Link>.
          </Typography>
        </>
      )}
      {status === "EXPIRED_TOKEN" && (
        <>
          <Typography variant="h4" gutterBottom>
            Expired Verification Link
          </Typography>
          <Typography variant="body1">
            This verification link is expired.
            <br />
            Please click the button below to receive a new verification link.
          </Typography>
          <Button
            variant="contained"
            onClick={sendNewVerification}
            sx={{ mt: 2 }}
          >
            Resend verification email
          </Button>
        </>
      )}
    </div>
  );
};

export default VerificationPage;
