import { Link, useSearchParams } from "react-router-dom";
import ResetPasswordForm from "./ResetPasswordForm";
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { VERIFY_PASSWORD_RESET } from "../../graphql/queries";

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
      <div>
        This password reset link is invalid. Make sure the link is correct or
        request a new link <Link to="/forgot">here</Link>.
      </div>
    );
  }

  if (passwordResetResult.loading) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {(status === "VERIFIED" || status === "BAD_USER_INPUT") && (
        <>
          <h2>Create a new password</h2>
          <ResetPasswordForm token={token} setStatus={setStatus} />
        </>
      )}
      {status === "UPDATED_PASSWORD" && (
        <div>
          Your password has been updated. Click <Link to="/">here</Link> to
          login.
        </div>
      )}
      {(status === "INVALID_TOKEN" || status === "USER_NOT_FOUND") && (
        <div>
          This password reset link is invalid. Make sure the link is correct or
          request a new link <Link to="/forgot">here</Link>.
        </div>
      )}
      {status === "EXPIRED_TOKEN" && (
        <div>
          This password reset link is expired. Please click{" "}
          <Link to="/forgot">here</Link> to request a new password reset link.
        </div>
      )}
      {status === "UNVERIFIED_EMAIL" && (
        <div>
          Unverified accounts can not set a new password. Please verify your
          account using the link sent to your email.
        </div>
      )}
      {status === "EARLY_PASSWORD_RESET" && (
        <div>
          Your password has been changed recently. You can not set a new
          password for 24 hours after when your latest password was set.
        </div>
      )}
    </div>
  );
};

export default ResetPasswordPage;
