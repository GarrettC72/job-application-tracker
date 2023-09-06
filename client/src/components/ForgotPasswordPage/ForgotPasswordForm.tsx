import { useField } from '../../hooks';

const ForgotPasswordForm = () => {
  const { reset: resetEmail, ...email } = useField('email');

  const onSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    console.log(email.value);
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
