import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';

import { LOGIN } from '../../queries';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login ? result.data.login.value : '';
      console.log(token);
    }
  }, [result.data]);

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log(email, password);

    login({ variables: { email, password } });

    setEmail('');
    setPassword('');
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        Email{' '}
        <input
          value={email}
          onChange={({ target }) => setEmail(target.value)}
        />
      </div>
      <div>
        Password{' '}
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
