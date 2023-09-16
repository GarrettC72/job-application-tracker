import { Link } from 'react-router-dom';
import { useState } from 'react';

import SignUpForm from './SignUpForm';

const SignUpPage = () => {
  const [message, setMessage] = useState('');

  return (
    <div>
      <h2>Sign up for an account</h2>
      {message && <p>{message}</p>}
      <SignUpForm setMessage={setMessage} />
      <Link to="/">Log in</Link>
    </div>
  );
};

export default SignUpPage;
