import { useMutation } from '@apollo/client';

import { LOGIN } from '../../queries';
import { useField, useNotification } from '../../hooks';
import { useAppDispatch } from '../../app/hooks';
import { loginUser } from '../../features/user/userSlice';

const LoginForm = () => {
  const { reset: resetEmail, ...email } = useField('email');
  const { reset: resetPassword, ...password } = useField('password');

  const dispatch = useAppDispatch();
  const notifyWith = useNotification();

  const [login] = useMutation(LOGIN, {
    onError: (error) => {
      notifyWith(error.graphQLErrors[0].message, 'error');
    },
    onCompleted: (data) => {
      const user = data.login;
      if (user) {
        dispatch(loginUser(user));
        notifyWith('Successfully logged in!', 'success');
      }
    },
  });

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

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
