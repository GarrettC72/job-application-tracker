import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useField } from '../../hooks';
import { SEND_PASSWORD_RESET } from '../../queries';

const ForgotPasswordForm = () => {
  const { reset: resetEmail, ...email } = useField('email');

  const [sendPasswordReset, result] = useMutation(SEND_PASSWORD_RESET, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message);
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (result.data) {
      const user = result.data.createPasswordReset;
      console.log(user);
      navigate('/');
    }
  }, [result.data, navigate]);

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log(email.value);

    sendPasswordReset({
      variables: {
        email: email.value,
      },
    });
    resetEmail();
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        Email <input {...email} required />
      </div>
      <button type="submit">Send reset email</button>
    </form>
  );
};

export default ForgotPasswordForm;
