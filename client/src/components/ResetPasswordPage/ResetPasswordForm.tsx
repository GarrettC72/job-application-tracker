import { useField } from '../../hooks';

const ResetPasswordForm = () => {
  const { reset: resetPassword, ...password } = useField('password');
  const { reset: resetConfirmPassword, ...confirmPassword } =
    useField('password');

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log(password.value, confirmPassword.value);

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
