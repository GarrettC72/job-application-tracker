import { useMutation } from '@apollo/client';

import { useField } from '../../hooks';
import { SEND_PASSWORD_RESET } from '../../queries';

interface Props {
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}

const ForgotPasswordForm = ({ setMessage }: Props) => {
  const { reset: resetEmail, ...email } = useField('email');

  const [sendPasswordReset] = useMutation(SEND_PASSWORD_RESET, {
    onError: (error) => {
      setMessage(error.graphQLErrors[0].message);
    },
    onCompleted: () => {
      setMessage('Please check your email for a link to set a new password.');
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
