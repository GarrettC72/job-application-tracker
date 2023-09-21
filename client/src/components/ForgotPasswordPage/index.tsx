import { Link } from "react-router-dom";

import ForgotPasswordForm from "./ForgotPasswordForm";

const ForgotPasswordPage = () => {
  return (
    <div>
      <h2>Forgot your password?</h2>
      <p>Enter your email to receive a link to reset your password.</p>
      <ForgotPasswordForm />
      <Link to="/">Return to login</Link>
    </div>
  );
};

export default ForgotPasswordPage;
