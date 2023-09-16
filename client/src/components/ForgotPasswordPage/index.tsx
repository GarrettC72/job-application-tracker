import { Link } from 'react-router-dom';
import { useState } from 'react';

import ForgotPasswordForm from './ForgotPasswordForm';

const ForgotPasswordPage = () => {
  const [message, setMessage] = useState('');

  return (
    <div>
      <h2>Forgot your password?</h2>
      <p>Enter your email to receive a link to reset your password.</p>
      {message && <p>{message}</p>}
      <ForgotPasswordForm setMessage={setMessage} />
      <Link to="/">Return to login</Link>
    </div>
  );
};

export default ForgotPasswordPage;
