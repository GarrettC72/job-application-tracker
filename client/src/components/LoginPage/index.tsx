import { Link } from 'react-router-dom';

import LoginForm from './LoginForm';

const LoginPage = () => {
  return (
    <div>
      <h2>Login</h2>
      <LoginForm />
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
