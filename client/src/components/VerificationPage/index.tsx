import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";

import { RESEND_VERIFICATION, VERIFY_USER } from "../../graphql/mutations";
import Loading from "../Loading";
import ServerResponse from "../ServerResponse";

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

  if (!token || status === "INVALID_TOKEN" || status === "USER_NOT_FOUND") {
    return (
      <ServerResponse
        title="Invalid Verification Link"
        message="This verification link is invalid."
        callToAction={
          <>
            Please make sure the URL is correct or click{" "}
            <Link to="/signup">here</Link> to create a new account.
          </>
        }
      />
    );
  }

  if (status === "LOADING") {
    return <Loading />;
  }

  return status === "VERIFIED" ? (
    <ServerResponse
      title="Email Successfully Verified"
      message="Your email is now verified."
      callToAction={
        <>
          Please click <Link to="/">here</Link> to login.
        </>
      }
    />
  ) : status === "SENT_NEW_VERIFICATION" ? (
    <ServerResponse
      title="Expired Verification Link"
      message="A new verification link has been sent."
      callToAction="Please check your email."
    />
  ) : status === "ALREADY_VERIFIED" ? (
    <ServerResponse
      title="Email Already Verified"
      message="Your email has already been verified."
      callToAction={
        <>
          Please click <Link to="/">here</Link> to login.
        </>
      }
    />
  ) : status === "EXPIRED_TOKEN" ? (
    <ServerResponse
      title="Expired Verification Link"
      message="This verification link is expired."
      callToAction="Please click the button below to receive a new verification link."
    >
      <Button variant="contained" onClick={sendNewVerification} sx={{ mt: 2 }}>
        Resend verification email
      </Button>
    </ServerResponse>
  ) : (
    <ServerResponse
      title="Server Issues"
      message="There is currently an issue with the server."
      callToAction="Please try again later."
    />
  );
};

export default VerificationPage;
