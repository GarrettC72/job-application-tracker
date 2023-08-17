import { Link } from 'react-router-dom';

import LoginForm from './LoginForm';

const LoginPage = () => {
  return (
    <div>
      <h2>Login</h2>
      <LoginForm />
      <Link to="/signup">Sign up</Link>
    </div>
  );
};

export default LoginPage;
