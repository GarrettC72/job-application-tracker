import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";

import { VERIFY_USER } from "../../graphql/mutations";
import Loading from "../Loading";
import ServerResponse from "../ServerResponse";
import ResendVerificationButton from "./ResendVerificationButton";

interface VerificationResponseProps {
  title: string;
  message: string;
  callToAction: React.ReactNode;
}

const getVerificationResponseProps = (
  status: string
): VerificationResponseProps | null => {
  switch (status) {
    case "VERIFIED":
      return {
        title: "Email Successfully Verified",
        message: "Your email is now verified.",
        callToAction: (
          <>
            Please click <Link to="/">here</Link> to login.
          </>
        ),
      };
    case "SENT_NEW_VERIFICATION":
      return {
        title: "Expired Verification Link",
        message: "A new verification link has been sent.",
        callToAction: "Please check your email.",
      };
    case "ALREADY_VERIFIED":
      return {
        title: "Email Already Verified",
        message: "Your email has already been verified.",
        callToAction: (
          <>
            Please click <Link to="/">here</Link> to login.
          </>
        ),
      };
    case "EXPIRED_TOKEN":
      return {
        title: "Expired Verification Link",
        message: "This verification link is expired.",
        callToAction:
          "Please click the button below to receive a new verification link.",
      };
    case "INVALID_TOKEN":
    case "USER_NOT_FOUND":
      return {
        title: "Invalid Verification Link",
        message: "This verification link is invalid.",
        callToAction: (
          <>
            Please make sure the URL is correct or click{" "}
            <Link to="/signup">here</Link> to create a new account.
          </>
        ),
      };
    default:
      return null;
  }
};

const VerificationPage = () => {
  const [status, setStatus] = useState("LOADING");
  const [searchParams] = useSearchParams();
  const [verify] = useMutation(VERIFY_USER, {
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
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verify({ variables: { token } });
    }
  }, [token, verify]);

  if (!token) {
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

  const responseProps = getVerificationResponseProps(status);

  return responseProps === null ? (
    <ServerResponse />
  ) : (
    <ServerResponse {...responseProps}>
      {status === "EXPIRED_TOKEN" && (
        <ResendVerificationButton token={token} setStatus={setStatus} />
      )}
    </ServerResponse>
  );
};

export default VerificationPage;
