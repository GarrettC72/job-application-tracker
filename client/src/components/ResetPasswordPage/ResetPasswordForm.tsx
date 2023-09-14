import { useMutation } from '@apollo/client';
import { useEffect } from 'react';

import { useField } from '../../hooks';
import { EDIT_PASSWORD } from '../../queries';

interface Props {
  token: string;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
}

const ResetPasswordForm = ({ token, setStatus }: Props) => {
  const { reset: resetPassword, ...password } = useField('password');
  const { reset: resetConfirmPassword, ...confirmPassword } =
    useField('password');
  const [updatePassword, result] = useMutation(EDIT_PASSWORD, {
    onError: (error) => {
      console.log(error);
      console.log(error.graphQLErrors[0].message);
      const verifyError = error.graphQLErrors[0];
      if (
        verifyError.extensions.code &&
        typeof verifyError.extensions.code === 'string'
      ) {
        setStatus(verifyError.extensions.code);
      }
    },
  });

  useEffect(() => {
    if (result.data) {
      const user = result.data.updateUser;
      console.log(user);
      setStatus('UPDATED_PASSWORD');
    }
  }, [result.data, setStatus]);

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log(password.value, confirmPassword.value);

    updatePassword({
      variables: {
        token,
        password: password.value,
        confirmPassword: confirmPassword.value,
      },
    });

    resetPassword();
    resetConfirmPassword();
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        Password <input {...password} minLength={8} required />
      </div>
      <div>
        Confirm Password
        <input {...confirmPassword} minLength={8} required />
      </div>
      <button type="submit">Set new password</button>
    </form>
  );
};

export default ResetPasswordForm;
