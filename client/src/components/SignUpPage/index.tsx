import { Link } from "react-router-dom";

import SignUpForm from "./SignUpForm";

const SignUpPage = () => {
  return (
    <div>
      <h2>Sign up for an account</h2>
      <SignUpForm />
      <Link to="/">Log in</Link>
    </div>
  );
};

export default SignUpPage;
