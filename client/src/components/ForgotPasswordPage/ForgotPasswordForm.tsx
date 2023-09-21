import { useMutation } from '@apollo/client';

import { useField, useNotification } from '../../hooks';
import { SEND_PASSWORD_RESET } from '../../queries';

const ForgotPasswordForm = () => {
  const { reset: resetEmail, ...email } = useField('email');

  const notifyWith = useNotification();

  const [sendPasswordReset] = useMutation(SEND_PASSWORD_RESET, {
    onError: (error) => {
      notifyWith(error.graphQLErrors[0].message, 'error');
    },
    onCompleted: () => {
      notifyWith(
        'Please check your email for a link to set a new password.',
        'success'
      );
    },
  });

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

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
