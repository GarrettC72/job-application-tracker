import { useMutation } from '@apollo/client';
import { useEffect } from 'react';

import { LOGIN } from '../../queries';
import { useField } from '../../hooks';

const LoginForm = () => {
  const { reset: resetEmail, ...email } = useField('email');
  const { reset: resetPassword, ...password } = useField('password');

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

    login({
      variables: {
        email: email.value,
        password: password.value,
      },
    });

    resetEmail();
    resetPassword();
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        Email <input {...email} required />
      </div>
      <div>
        Password <input {...password} required />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
