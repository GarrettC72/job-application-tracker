import { Link } from 'react-router-dom';
import { useState } from 'react';

import LoginForm from './LoginForm';

const LoginPage = () => {
  const [message, setMessage] = useState('');

  return (
    <div>
      <h2>Login</h2>
      {message && <p>{message}</p>}
      <LoginForm setMessage={setMessage} />
      <div>
        <Link to="/signup">Sign up</Link>
      </div>
      <div>
        <Link to="/forgot">Forgot your password?</Link>
      </div>
    </div>
  );
};

export default LoginPage;
